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

Create a `.env` file in your project root with the following variables:

```env
# Mailjet API Configuration
MAILJET_API_KEY=your_mailjet_api_key_here
MAILJET_API_SECRET=your_mailjet_api_secret_here
MAILJET_CONTACT_LIST_ID=your_contact_list_id_here
```

Replace the placeholder values with your actual Mailjet credentials.

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
3. **Rate limiting**: The API limits signups to 5 per IP per 15 minutes

### Testing

You can test the API endpoint directly:

```bash
curl -X POST http://localhost:4321/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"test"}'
```

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Use different API keys for development and production
- Consider using Mailjet's sandbox mode for testing 