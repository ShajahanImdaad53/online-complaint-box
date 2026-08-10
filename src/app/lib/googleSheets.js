import { google } from 'googleapis';

/**
 * Appends a row to a Google Sheet.
 * 
 * @param {Array} values Array of values to append (one row)
 */
export async function appendToSheet(values) {
  try {
    const target = ['https://www.googleapis.com/auth/spreadsheets'];
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      target
    );

    const sheets = google.sheets({ version: 'v4', auth: jwt });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Usually 'Sheet1' is the default name, or we can use generic range like 'A1' 
    // which Google Sheets auto-expands based on data. Let's use 'Sheet1!A1'
    const range = 'Sheet1!A1'; 

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [values],
      },
    });

    console.log('Appended to Google Sheet:', response.data.updates.updatedRange);
    return true;
  } catch (error) {
    console.error('Error appending to Google Sheet:', error);
    // Don't throw, we just fail silently for the end user if sheets logging fails
    return false;
  }
}
