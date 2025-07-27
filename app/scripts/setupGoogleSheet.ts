import { createGoogleSheet } from '../lib/googleSheets';

async function setupSheet() {
  try {
    const sheetId = await createGoogleSheet('IEC Quiz Submissions');
  } catch (error) {
    console.error('Failed to create sheet:', error);
  }
}

// Uncomment the line below to run this script
// setupSheet();
