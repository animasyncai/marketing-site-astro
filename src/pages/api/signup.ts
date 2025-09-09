/**
 * Fixed Email Signup API Endpoint for Mailjet
 *
 * @description Handles email signups with proper Mailjet integration
 * Includes better error handling and debugging
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

// Fixed Mailjet integration
async function addToMailjetList(
  email: string,
  source: string,
): Promise<{ success: boolean; message?: string; isExisting?: boolean }> {
  try {
    // Get Mailjet credentials from environment variables
    const apiKey = import.meta.env.MAILJET_API_KEY
    const apiSecret = import.meta.env.MAILJET_SECRET_KEY || import.meta.env.MAILJET_API_SECRET
    const contactListId = import.meta.env.MAILJET_LIST_ID

    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      hasListId: !!contactListId,
      apiKeyLength: apiKey?.length || 0,
      listId: contactListId,
    })

    if (!apiKey || !apiSecret || !contactListId) {
      console.error('Missing Mailjet environment variables:', {
        MAILJET_API_KEY: !!apiKey,
        MAILJET_SECRET_KEY: !!apiSecret,
        MAILJET_LIST_ID: !!contactListId,
      })
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

    console.log('Mailjet client initialized, attempting to add contact:', email)

    try {
      // Step 1: Try to create/update the contact first
      const contactResponse = await mailjet.post('contact', { version: 'v3' }).request({
        Email: email,
        IsExcludedFromCampaigns: false,
      })

      console.log('Contact creation response:', {
        status: contactResponse.response.status,
        statusText: contactResponse.response.statusText,
        data: contactResponse.body,
      })

      let contactExists = false
      let contactId = null

      if (contactResponse.response.status === 201) {
        // Contact created successfully
        contactId = (contactResponse.body as any)?.Data?.[0]?.ID
        console.log('Contact created with ID:', contactId)
      } else if (contactResponse.response.status === 400) {
        // Contact might already exist, try to get it
        const responseData = contactResponse.body as any
        const errorInfo = responseData?.ErrorInfo || responseData?.ErrorMessage || ''

        if (errorInfo.toLowerCase().includes('already') || errorInfo.toLowerCase().includes('exist')) {
          contactExists = true
          console.log('Contact already exists, fetching contact ID')

          try {
            const getContactResponse = await mailjet.get('contact', { version: 'v3' }).id(email).request()

            if (getContactResponse.response.status === 200) {
              contactId = (getContactResponse.body as any)?.Data?.[0]?.ID
              console.log('Retrieved existing contact ID:', contactId)
            }
          } catch (getError) {
            console.error('Error getting existing contact:', getError)
          }
        } else {
          console.error('Unexpected contact creation error:', errorInfo)
          return {
            success: false,
            message: 'Invalid email address or service error',
          }
        }
      } else {
        console.error('Unexpected contact response status:', contactResponse.response.status)
        return {
          success: false,
          message: 'Unable to process your signup. Please try again.',
        }
      }

      // Step 2: Add contact to list (whether new or existing)
      if (contactId || contactExists) {
        console.log('Adding contact to list:', contactListId)

        const listResponse = await mailjet
          .post('contactslist', { version: 'v3' })
          .id(contactListId)
          .action('managecontact')
          .request({
            Email: email,
            Action: 'addnoforce', // Use addnoforce to avoid errors if already in list
          })

        console.log('List addition response:', {
          status: listResponse.response.status,
          data: listResponse.body,
        })

        if (listResponse.response.status === 200 || listResponse.response.status === 201) {
          const responseData = listResponse.body as any

          // Check if contact was already in list
          if (responseData?.Data?.[0]?.ContactsCount === 0) {
            return {
              success: true,
              message: 'You are already on our early access list!',
              isExisting: true,
            }
          }

          return {
            success: true,
            message: contactExists
              ? "Welcome back! You're confirmed on our early access list."
              : "Welcome to our early access list! We'll be in touch soon.",
            isExisting: contactExists,
          }
        } else {
          console.error('List addition failed:', listResponse.response.status, listResponse.body)
          return {
            success: false,
            message: 'Unable to add you to our list. Please try again.',
          }
        }
      } else {
        console.error('No contact ID available for list addition')
        return {
          success: false,
          message: 'Unable to process your signup. Please try again.',
        }
      }
    } catch (mailjetError: any) {
      console.error('Mailjet API error:', {
        status: mailjetError.statusCode,
        message: mailjetError.message,
        errorInfo: mailjetError.ErrorInfo,
        errorMessage: mailjetError.ErrorMessage,
        fullError: mailjetError,
      })

      // Handle specific Mailjet errors
      if (mailjetError.statusCode === 400) {
        const errorMessage = mailjetError.ErrorMessage || mailjetError.message || ''
        if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('format')) {
          return {
            success: false,
            message: 'Please enter a valid email address',
          }
        }
        if (errorMessage.toLowerCase().includes('already') || errorMessage.toLowerCase().includes('exist')) {
          return {
            success: true,
            message: 'You are already on our early access list!',
            isExisting: true,
          }
        }
      }

      if (mailjetError.statusCode === 401) {
        console.error('Mailjet authentication failed - check API credentials')
        return {
          success: false,
          message: 'Email service configuration error. Please contact support.',
        }
      }

      if (mailjetError.statusCode === 404) {
        console.error('Mailjet resource not found - check MAILJET_LIST_ID')
        return {
          success: false,
          message: 'Email service configuration error. Please contact support.',
        }
      }

      if (mailjetError.statusCode === 429) {
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

    console.log(`Processing signup for: ${trimmedEmail}`)

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
