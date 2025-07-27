import { google } from 'googleapis';

// Google Sheets configuration
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const RANGE = 'Sheet1!A:F'; // Columns A through F

// Initialize Google Sheets API
function getGoogleSheetsInstance() {
  try {
    // Parse the service account key from environment variable
    const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');
    
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    throw new Error('Failed to initialize Google Sheets API');
  }
}

// Function to log submission to Google Sheets
export async function logToGoogleSheets(data: {
  name: string;
  email: string;
  phone: string;
  department: string;
  description: string;
}) {
  try {
    if (!SHEET_ID) {
      console.error('GOOGLE_SHEET_ID not configured');
      return false;
    }

    const sheets = getGoogleSheetsInstance();
    
    // Prepare the row data
    const timestamp = new Date().toISOString();
    const rowData = [
      timestamp,
      data.name,
      data.email,
      data.phone,
      data.department,
      data.description.substring(0, 1000) // Limit description length
    ];

    // Check if sheet has headers, if not add them
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Sheet1!A1:F1',
      });

      // If no data or headers don't match, add headers
      if (!response.data.values || response.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: 'Sheet1!A1:F1',
          valueInputOption: 'RAW',
          requestBody: {
            values: [['Timestamp', 'Name', 'Email', 'Phone', 'Department', 'Description']]
          },
        });
      }
    } catch (headerError) {
      console.error('Error checking/adding headers:', headerError);
    }

    // Append the new row
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });

    console.log('Successfully logged to Google Sheets:', result.data.updates?.updatedRows, 'row(s) added');
    return true;
  } catch (error) {
    console.error('Error logging to Google Sheets:', error);
    return false;
  }
}

// Function to create a new Google Sheet (optional helper)
export async function createGoogleSheet(title: string = 'IEC Quiz Submissions') {
  try {
    const sheets = getGoogleSheetsInstance();
    
    const response = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title,
        },
        sheets: [{
          properties: {
            title: 'Sheet1',
          },
        }],
      },
    });

    const spreadsheetId = response.data.spreadsheetId;
    console.log('Created new Google Sheet with ID:', spreadsheetId);
    
    // Add headers
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1:F1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [['Timestamp', 'Name', 'Email', 'Phone', 'Department', 'Description']]
      },
    });

    return spreadsheetId;
  } catch (error) {
    console.error('Error creating Google Sheet:', error);
    throw error;
  }
}
