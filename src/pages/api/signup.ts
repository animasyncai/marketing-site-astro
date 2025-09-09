/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Simplified and fixed Mailjet integration
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
      console.error('Missing Mailjet environment variables')
      return {
        success: false,
        message: 'Email service configuration error',
      }
    }

    // Initialize Mailjet client
    const mailjet = new Mailjet({
      apiKey,
      apiSecret,
    })

    // Use the simplified approach: directly add contact to list
    // Mailjet handles duplicates gracefully with 'addforce'
    try {
      const response = await mailjet
        .post('contactslist', { version: 'v3' })
        .id(contactListId)
        .action('managecontact')
        .request({
          Email: email,
          Action: 'addforce', // This handles existing contacts gracefully
          Properties: {
            source: source || 'website',
            signup_date: new Date().toISOString(),
          },
        })

      // Check response
      if (response.response?.status === 200 || response.response?.status === 201) {
        // Check if contact was already in list
        const responseData = response.body as any

        // Mailjet returns ContactsCount for the operation
        // If it's 0, the contact was already in the list
        if (responseData?.Data?.[0]?.ContactsCount === 0) {
          return {
            success: true,
            message: 'You are already on our early access list!',
            isExisting: true,
          }
        }

        return {
          success: true,
          message: "Welcome to our early access list! We'll be in touch soon.",
          isExisting: false,
        }
      }

      // Handle unexpected response
      console.error('Unexpected Mailjet response:', response.response?.status)
      return {
        success: false,
        message: 'Unable to process your signup. Please try again.',
      }
    } catch (mailjetError: any) {
      console.error('Mailjet API error:', mailjetError)

      // Handle specific Mailjet errors
      if (mailjetError.statusCode === 400) {
        // Bad request - likely invalid email
        if (mailjetError.ErrorMessage?.toLowerCase().includes('invalid')) {
          return {
            success: false,
            message: 'Please enter a valid email address',
          }
        }
      }

      if (mailjetError.statusCode === 401) {
        // Authentication error
        console.error('Mailjet authentication failed - check API credentials')
        return {
          success: false,
          message: 'Email service configuration error. Please contact support.',
        }
      }

      if (mailjetError.statusCode === 404) {
        // List not found
        console.error('Mailjet list not found - check MAILJET_LIST_ID')
        return {
          success: false,
          message: 'Email service configuration error. Please contact support.',
        }
      }

      if (mailjetError.statusCode === 429) {
        // Rate limit
        return {
          success: false,
          message: 'Service temporarily busy. Please try again in a moment.',
        }
      }

      // Generic error
      return {
        success: false,
        message: 'Unable to process your signup right now. Please try again later.',
      }
    }
  } catch (error: unknown) {
    console.error('Unexpected error in addToMailjetList:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    }
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const startTime = Date.now()

  try {
    // Get client IP for rate limiting
    const clientIP =
      clientAddress ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

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

      if (!rawBody.trim()) {
        throw new Error('Empty request body')
      }

      body = JSON.parse(rawBody)
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

    const trimmedEmail = email.trim().toLowerCase()

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

    // Check for common disposable email domains
    const disposableDomains = [
      '10minutemail.com',
      'tempmail.org',
      'guerrillamail.com',
      'mailinator.com',
      'temp-mail.org',
      'throwaway.email',
      'getnada.com',
      'maildrop.cc',
      'yopmail.com',
      'trashmail.com',
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

    // Add to Mailjet list
    const result = await addToMailjetList(trimmedEmail, source)

    const processingTime = Date.now() - startTime
    console.log(`Signup processed in ${processingTime}ms - Success: ${result.success}`)

    if (!result.success) {
      // Return error response
      return new Response(
        JSON.stringify({
          success: false,
          error: 'EMAIL_SERVICE_ERROR',
          message: result.message || 'Unable to process signup at this time.',
          isExisting: result.isExisting || false,
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
