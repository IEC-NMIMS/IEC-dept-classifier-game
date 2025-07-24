# Email Setup Instructions

## Setting up Gmail SMTP for Email Functionality

To enable the email functionality in the IEC Department Classifier Game, you need to set up Gmail SMTP with an App Password.

### Step 1: Enable 2-Factor Authentication

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to "Security" 
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" as the app
3. Select "Other (custom name)" as the device
4. Enter "IEC Department Classifier" as the name
5. Click "Generate"
6. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Configure Environment Variables

1. Open `.env.local` in your project root
2. Update the following variables:

```env
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop
GEMINI_API_KEY=your-existing-gemini-key
```

### Step 4: Test the Setup

1. Run your Next.js application: `npm run dev`
2. Complete the quiz
3. Click "Get Detailed Reason via Email"
4. Fill in the contact form
5. Check your email inbox

## Features Included

- ✅ Contact form modal after quiz completion
- ✅ Email sending with personalized department analysis
- ✅ CSV export of user data (stored in `/data/quiz_results.csv`)
- ✅ Responsive design for mobile and desktop
- ✅ Form validation and error handling
- ✅ Loading states and success notifications

## CSV Export

User data is automatically exported to `data/quiz_results.csv` with the following columns:
- Timestamp
- Name
- Email
- Phone
- Department
- Description

## Security Notes

- Never commit your `.env.local` file to version control
- Use App Passwords instead of your regular Gmail password
- The app password can be revoked anytime from your Google Account settings
- User data is stored locally in CSV format - ensure you have proper backup procedures

## Troubleshooting

### Email not sending
1. Verify your Gmail credentials in `.env.local`
2. Make sure 2FA is enabled on your Google account
3. Check that you're using an App Password, not your regular password
4. Verify the email address format is correct

### CSV not being created
1. Check that the `data` directory exists in your project root
2. Verify write permissions on the data directory
3. Check the server logs for any file system errors

### Form validation errors
1. All fields (name, email, phone) are required
2. Email must be in valid format
3. Phone number accepts any format but is required
