/**
 * Email Signup API Endpoint
 *
 * @description Handles email signups for Withinly early access
 * Includes validation, rate limiting, and Mailjet integration preparation
 */

import type { APIRoute } from 'astro'

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

// Mock Mailjet integration (replace with actual implementation)
async function addToMailjetList(email: string, source: string): Promise<{ success: boolean; message?: string }> {
  // TODO: Replace with actual Mailjet API integration
  // For now, just log the signup
  console.log(`New signup: ${email} from ${source}`)

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock success response
  return {
    success: true,
    message: 'Successfully added to early access list',
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Get client IP for rate limiting
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
    } catch (error) {
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
          message: "Welcome! We'll be in touch soon with your early access.",
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
    } catch (error) {
      console.error('Mailjet integration error:', error)

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
