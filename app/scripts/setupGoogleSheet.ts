import { createGoogleSheet } from '../lib/googleSheets';

async function setupSheet() {
  try {
    const sheetId = await createGoogleSheet('IEC Quiz Submissions');
    console.log('Google Sheet created with ID:', sheetId);
    console.log('Add this to your Vercel environment variables:');
    console.log('GOOGLE_SHEET_ID=' + sheetId);
  } catch (error) {
    console.error('Failed to create sheet:', error);
  }
}

// Uncomment the line below to run this script
// setupSheet();
