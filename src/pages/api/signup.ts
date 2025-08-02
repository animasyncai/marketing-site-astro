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

// Mailjet integration
async function addToMailjetList(email: string, _source: string): Promise<{ success: boolean; message?: string }> {
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

    console.log('Mailjet credentials found, attempting to add contact...')

    // Initialize Mailjet client
    const mailjet = new Mailjet({
      apiKey,
      apiSecret,
    })

    // Add contact directly to the list
    const response = await mailjet
      .post('contactslist', { version: 'v3' })
      .id(contactListId)
      .action('managecontact')
      .request({
        Email: email,
        Action: 'addnoforce',
      })

    if (response.body && Array.isArray(response.body) && response.body.length > 0) {
      console.log(`Successfully added ${email} to Mailjet list`)
      return {
        success: true,
        message: 'Successfully added to early access list',
      }
    } else {
      // Log the actual response for debugging
      console.log('Mailjet response:', response.body)
      console.log('Response type:', typeof response.body)
      console.log('Is array:', Array.isArray(response.body))

      // Check if it's a different success format
      if (response.body && typeof response.body === 'object') {
        console.log(`Successfully added ${email} to Mailjet list (alternative format)`)
        return {
          success: true,
          message: 'Successfully added to early access list',
        }
      }

      throw new Error('Unexpected response from Mailjet')
    }
  } catch (error: unknown) {
    console.error('Mailjet API error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      statusCode: error && typeof error === 'object' && 'statusCode' in error ? error.statusCode : 'N/A',
      errorMessage: error && typeof error === 'object' && 'ErrorMessage' in error ? error.ErrorMessage : 'N/A',
    })

    // Handle specific Mailjet errors
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 400) {
      const errorMessage = (error as { ErrorMessage?: string }).ErrorMessage
      if (errorMessage?.includes('already exists')) {
        return {
          success: true,
          message: 'You are already on our list!',
        }
      }
    }

    return {
      success: false,
      message: 'Failed to add to email list',
    }
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Get client IP for rate limiting (handle both server and static modes)
    const clientIP = clientAddress || 'unknown'

    // Check rate limit
    const rateCheck = checkRateLimit(clientIP)
    if (!rateCheck.allowed) {
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
            'Retry-After': Math.ceil((rateCheck.resetTime! - Date.now()) / 1000).toString(),
          },
        },
      )
    }

    // Parse request body
    let body: { email?: string; source?: string; timestamp?: number }
    try {
      body = await request.json()
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'INVALID_JSON',
          message: 'Invalid request format',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Validate required fields
    const { email, source = 'website' } = body

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'MISSING_EMAIL',
          message: 'Email address is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'INVALID_EMAIL',
          message: 'Please enter a valid email address',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Check for common disposable email domains (basic protection)
    const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com']

    const emailDomain = email.split('@')[1]?.toLowerCase()
    if (disposableDomains.includes(emailDomain)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'DISPOSABLE_EMAIL',
          message: 'Please use a permanent email address',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Add to email list (Mailjet integration)
    try {
      const result = await addToMailjetList(email, source)

      if (!result.success) {
        throw new Error(result.message || 'Failed to add to email list')
      }

      // Success response
      return new Response(
        JSON.stringify({
          success: true,
          message: result.message || "Welcome! We'll be in touch soon with your early access.",
          data: {
            email,
            timestamp: Date.now(),
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    } catch {
      console.error('Mailjet integration error')

      return new Response(
        JSON.stringify({
          success: false,
          error: 'EMAIL_SERVICE_ERROR',
          message: 'Unable to process signup at this time. Please try again later.',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  } catch (error) {
    console.error('Signup API error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
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
      headers: { 'Content-Type': 'application/json' },
    },
  )
}
