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

The api's confirmation webhook is called once for each address that is newly added to the list.

## 5. Test the Integration

1. Start your development server: `npm run dev`
2. Go to your website and try signing up with an email
3. Check your Mailjet dashboard to see if the contact was added to your list

## 6. Production Deployment

When deploying to production, make sure to set these environment variables in your hosting platform:

- **Vercel**: Add them in the project settings under Environment Variables
- **Netlify**: Add them in Site settings → Environment variables
- **Other platforms**: Check your hosting provider's documentation

## Troubleshooting

### Common Issues

1. **"Email service configuration error"**: Check that all environment variables are set correctly
2. **"Failed to add to email list"**: Verify your API credentials and contact list ID
3. **Rate limiting**: best-effort only — at most 5 sign-ups per IP per 15 minutes *per server instance*. The
   counter lives in memory: it is empty after a cold start and is not shared between Vercel instances, so it is not a
   hard cap.

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
