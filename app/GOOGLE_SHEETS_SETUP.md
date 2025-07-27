# Google Sheets Setup Instructions

## Quick Setup Guide:

### 1. Create Google Cloud Project
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create new project: "IEC Quiz Logger"

### 2. Enable APIs
- Enable "Google Sheets API"
- Enable "Google Drive API" (optional, for better permissions)

### 3. Create Service Account
- Go to IAM & Admin → Service Accounts
- Create service account: "iec-quiz-sheets"
- Download JSON key file

### 4. Create Google Sheet
- Go to [Google Sheets](https://sheets.google.com)
- Create new sheet: "IEC Quiz Submissions"
- Add headers: Timestamp | Name | Email | Phone | Department | Description
- Share with service account email (from JSON) with Editor access
- Copy Sheet ID from URL

### 5. Environment Variables for Vercel
```
GOOGLE_SHEET_ID=1abc123def456ghi789jkl...
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project",...}
```

### 6. Deploy and Test
- Push changes to GitHub
- Vercel will auto-deploy
- Submit a test quiz to verify logging

## Troubleshooting:
- Check Vercel function logs for errors
- Verify service account has sheet access
- Ensure JSON key is properly formatted
- Test with a simple submission first
