# Mailjet Integration Setup

This project uses Mailjet for email signup functionality. Follow these steps to set up the integration:

## 1. Create a Mailjet Account

1. Go to [Mailjet.com](https://www.mailjet.com/) and create an account
2. Verify your email address

## 2. Get API Credentials

1. Log into your Mailjet dashboard
2. Go to **Account Settings** → **API Keys**
3. Create a new API key or use the default one
4. Note down your **API Key** and **Secret Key**

## 3. Create a Contact List

1. Go to **Contacts** → **Contact Lists**
2. Click **Create a new list**
3. Name it something like "Withinly Early Access"
4. Note down the **List ID** (you'll need this)

## 4. Set Environment Variables

The variables, and which are required, are listed in [`.env.example`](.env.example) — that file mirrors the schema in
`astro.config.mjs` (`env.schema`), which is the source of truth. Copy it to `.env` for local development and fill in
the values. A missing required variable fails `npm run build`.

Sign-up is double opt-in: `POST /api/signup` only emails a confirmation link (from `accounts@withinly.app`, which
must be a validated sender). The address joins the list when its owner presses **Confirm** on `/waitlist/confirm`;
only then is the consent recorded (contact properties `waitlist_consent_at`, `waitlist_consent_source`,
`waitlist_consent_notice` — create them once under **Contacts → Contact properties**) and the api's
confirmation webhook called, once per address that joins.

## 5. Test the Integration

1. Start your development server: `npm run dev`
2. Sign up with an address you can read; you get a confirmation email (nothing is on the list yet)
3. Open its link and press **Confirm**; the contact now appears on the list with the three consent properties
4. Use the email's leave link (or `/waitlist/leave`) and press **Leave**; the contact is unsubscribed

## 6. Production Deployment

When deploying to production, make sure to set these environment variables in your hosting platform:

- **Vercel**: Add them in the project settings under Environment Variables
- **Netlify**: Add them in Site settings → Environment variables
- **Other platforms**: Check your hosting provider's documentation

## Troubleshooting

### Common Issues

1. **`npm run build` fails with `EnvInvalidVariables`**: a required variable from `.env.example` is missing or empty
2. **The form says "Something went wrong"**: the confirmation email could not be sent — check the function log for
   `[mailjet] send confirmation failed` (status and Mailjet's per-message error codes, e.g. an unvalidated sender)
3. **Every sign-up answers 403 `FORBIDDEN_ORIGIN`**: the page's origin is not in `SIGNUP_ALLOWED_ORIGINS`
4. **Limits** (best-effort, in memory, per server instance — empty after a cold start, not shared between Vercel
   instances, so not hard caps): 5 sign-up or leave requests per IP per 15 minutes, shared by both forms; at most 3
   waitlist emails per address per hour (further requests get the normal answer and no email)

### Testing

You can test the API endpoint directly:

```bash
curl -X POST http://localhost:4321/api/signup \
  -H "Content-Type: application/json" -H "Origin: http://localhost:4321" \
  -d '{"email":"test@example.com"}'
```

## Security Notes

- Never commit your `.env` file to version control, and never put a real value in `.env.example`
  (`npm run check:secrets` runs on every push and pull request)
- The `.env` file is already in `.gitignore`
- Use different API keys for development and production
- Consider using Mailjet's sandbox mode for testing
