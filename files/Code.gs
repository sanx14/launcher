/**
 * Visitor location tracker — Google Apps Script backend.
 *
 * SETUP:
 *   1. Create a new Google Sheet, open Extensions > Apps Script, paste this file.
 *   2. Deploy > New deployment > Web app
 *        - Execute as:  Me
 *        - Who has access:  Anyone  (or "Anyone with Google account")
 *   3. Copy the Web App URL into the HTML snippet (YOUR_WEB_APP_URL).
 *   4. The Apps Script is bound to the Spreadsheet it was created from, and rows are
 *      appended to whichever sheet is active — for a stable target, use
 *      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1').
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  try {
    // e.postData.contents holds the raw JSON string sent by fetch()
    var d = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(), /* timestamp — column A */
      d.ip,
      d.city,
      d.state,
      d.pincode,
      d.isp,
      d.latitude,
      d.longitude,
      d.maps_url
    ]);
    

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({'Access-Control-Allow-Origin': '*'});
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}