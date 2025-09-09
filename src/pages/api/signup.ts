/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Email Signup API Endpoint
 *
 * @description Handles email signups for Withinly early access
 * Includes validation, rate limiting, and Mailjet integration
 */

// Ensure this route is not prerendered
export const prerender = false

import type { APIRoute } from 'astro'
import Mailjet from 'node-mailjet'

// Simple in-memory rate limiting (replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5 // Max 5 signups per IP per window

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Rate limiting check
function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const userLimit = rateLimitMap.get(ip)

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new rate limit entry
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return { allowed: true }
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      resetTime: userLimit.resetTime,
    }
  }

  // Increment count
  userLimit.count++
  return { allowed: true }
}

// Enhanced Mailjet integration
async function addToMailjetList(
  email: string,
  source: string,
): Promise<{ success: boolean; message?: string; isExisting?: boolean }> {
  try {
    // Get Mailjet credentials from environment variables
    const apiKey = import.meta.env.MAILJET_API_KEY
    const apiSecret = import.meta.env.MAILJET_API_SECRET
    const contactListId = import.meta.env.MAILJET_LIST_ID

    if (!apiKey || !apiSecret || !contactListId) {
      console.error('Missing Mailjet environment variables:', {
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
        hasContactListId: !!contactListId,
      })
      return {
        success: false,
        message: 'Email service configuration error',
      }
    }

    console.log(`Adding contact ${email.substring(0, 3)}*** to Mailjet list...`)

    // Initialize Mailjet client
    const mailjet = new Mailjet({
      apiKey,
      apiSecret,
    })

    // First, try to check if contact already exists
    try {
      const existingContact = await mailjet.get('contact', { version: 'v3' }).id(email).request()

      if (existingContact.body) {
        console.log(`Contact ${email.substring(0, 3)}*** already exists`)

        // Check if already in our list
        try {
          const listMembership = await mailjet.get('listrecipient', { version: 'v3' }).request({
            Contact: email,
            List: contactListId,
          })

          if (listMembership.body && Array.isArray(listMembership.body) && listMembership.body.length > 0) {
            return {
              success: true,
              message: 'You are already on our early access list!',
              isExisting: true,
            }
          }
        } catch (listError) {
          console.log('Could not check list membership, proceeding to add...')
        }
      }
    } catch (contactError) {
      console.log('Contact does not exist yet, proceeding to add...')
    }

    // Add contact to the list
    const response = await mailjet
      .post('contactslist', { version: 'v3' })
      .id(contactListId)
      .action('managecontact')
      .request({
        Email: email,
        Action: 'addforce', // Use addforce to handle existing contacts gracefully
        Properties: {
          source: source,
          signup_date: new Date().toISOString(),
        },
      })

    console.log('Mailjet response status:', response.response?.status)
    console.log('Mailjet response body type:', typeof response.body)

    if (response.body) {
      console.log(`Successfully processed ${email.substring(0, 3)}*** with Mailjet`)
      return {
        success: true,
        message: "Welcome to our early access list! We'll be in touch soon.",
      }
    } else {
      throw new Error('No response body from Mailjet')
    }
  } catch (error: unknown) {
    console.error('Mailjet API error:', error)

    // Extract error details
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      statusCode: error && typeof error === 'object' && 'statusCode' in error ? error.statusCode : 'N/A',
      errorMessage: error && typeof error === 'object' && 'ErrorMessage' in error ? error.ErrorMessage : 'N/A',
    }

    console.error('Error details:', errorDetails)

    // Handle specific Mailjet errors
    if (error && typeof error === 'object' && 'statusCode' in error) {
      const statusCode = error.statusCode as number
      const errorMessage = (error as { ErrorMessage?: string }).ErrorMessage || ''

      if (statusCode === 400) {
        if (errorMessage.toLowerCase().includes('already exists') || errorMessage.toLowerCase().includes('duplicate')) {
          return {
            success: true,
            message: 'You are already on our early access list!',
            isExisting: true,
          }
        }

        if (errorMessage.toLowerCase().includes('invalid') && errorMessage.toLowerCase().includes('email')) {
          return {
            success: false,
            message: 'Please enter a valid email address',
          }
        }
      }

      if (statusCode === 429) {
        return {
          success: false,
          message: 'Service temporarily busy. Please try again in a moment.',
        }
      }
    }

    return {
      success: false,
      message: 'Unable to process your signup right now. Please try again later.',
    }
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const startTime = Date.now()

  try {
    // Get client IP for rate limiting (handle both server and static modes)
    const clientIP =
      clientAddress || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    console.log(`Signup request from IP: ${clientIP}`)

    // Check rate limit
    const rateCheck = checkRateLimit(clientIP)
    if (!rateCheck.allowed) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`)

      const retryAfter = Math.ceil((rateCheck.resetTime! - Date.now()) / 1000)

      return new Response(
        JSON.stringify({
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many signup attempts. Please try again later.',
          resetTime: rateCheck.resetTime,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        },
      )
    }

    // Parse request body
    let body: { email?: string; source?: string; timestamp?: number }
    try {
      const rawBody = await request.text()
      console.log('Raw request body length:', rawBody.length)

      if (!rawBody.trim()) {
        throw new Error('Empty request body')
      }

      body = JSON.parse(rawBody)
      console.log('Parsed body keys:', Object.keys(body))
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'INVALID_JSON',
          message: 'Invalid request format',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
    }

    // Validate required fields
    const { email, source = 'website', timestamp } = body

    console.log('Email provided:', email ? email.substring(0, 3) + '***' : 'none')
    console.log('Source:', source)
    console.log('Timestamp:', timestamp)

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'MISSING_EMAIL',
          message: 'Email address is required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
    }

    const trimmedEmail = email.trim()

    // Validate email format
    if (!isValidEmail(trimmedEmail)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'INVALID_EMAIL',
          message: 'Please enter a valid email address',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
    }

    // Check for common disposable email domains (basic protection)
    const disposableDomains = [
      '10minutemail.com',
      'tempmail.org',
      'guerrillamail.com',
      'mailinator.com',
      'temp-mail.org',
      'throwaway.email',
      'getnada.com',
      'maildrop.cc',
    ]

    const emailDomain = trimmedEmail.split('@')[1]?.toLowerCase()
    if (disposableDomains.includes(emailDomain)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'DISPOSABLE_EMAIL',
          message: 'Please use a permanent email address',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
    }

    // Add to email list (Mailjet integration)
    try {
      const result = await addToMailjetList(trimmedEmail, source)

      if (!result.success) {
        throw new Error(result.message || 'Failed to add to email list')
      }

      const processingTime = Date.now() - startTime
      console.log(`Signup processed successfully in ${processingTime}ms`)

      // Success response
      return new Response(
        JSON.stringify({
          success: true,
          message: result.message || "Welcome! We'll be in touch soon with your early access.",
          data: {
            email: trimmedEmail,
            timestamp: Date.now(),
            isExisting: result.isExisting || false,
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
    } catch (mailjetError) {
      console.error('Mailjet integration error:', mailjetError)

      return new Response(
        JSON.stringify({
          success: false,
          error: 'EMAIL_SERVICE_ERROR',
          message: 'Unable to process signup at this time. Please try again later.',
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
    }
  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(`Signup API error after ${processingTime}ms:`, error)

    return new Response(
      JSON.stringify({
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  }
}

// Handle preflight requests
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}

// Handle other HTTP methods
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'METHOD_NOT_ALLOWED',
      message: 'Only POST requests are allowed',
    }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    },
  )
}
