/**
 * Ashlar Tattva — lead capture
 * ────────────────────────────────────────────────────────────────
 * Receives submitted enquiries from the landing page, records each one in the
 * spreadsheet, and emails the sales inbox.
 *
 * One row per submission. The same visitor enquiring twice — brochure now,
 * floor plan later — is two leads and two rows, because sales needs to see
 * both. lead_id only guards against the same submission arriving twice.
 *
 * Setup lives in LEADS-SETUP.md in the repo.
 */

// ── settings ────────────────────────────────────────────────────
var SHEET_ID   = '17XOlTBM5gvR7N2DHAWsf8TJOUPuoqgsfjF5kxZsnV3Q';
var TAB_NAME   = 'Leads';
var MAIL_TO    = 'sales@ashlarspaces.com';
var MAIL_CC    = '';              // optional second recipient
var PROJECT    = 'Ashlar Tattva';

// Email the sales inbox on every submitted enquiry.
var MAIL_ON_COMPLETE = true;

var HEADERS = [
  'Received', 'Last updated', 'Status', 'Intent', 'Name', 'Phone', 'Email',
  'City', 'Configuration', 'Consent', 'Project', 'Lead ID', 'Page', 'Referrer',
  'Device', 'Notified'
];

// ── entry points ────────────────────────────────────────────────
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Two browsers submitting at once must not claim the same row.
    lock.waitLock(20000);
    var data = parseBody(e);
    if (!data) return reply({ ok: false, error: 'empty body' });

    var result = upsert(data);

    if (MAIL_ON_COMPLETE && result.justCompleted) {
      notify(result.row);
      markNotified(result.sheet, result.rowIndex);
    }
    return reply({ ok: true, lead_id: result.row.lead_id, status: result.row.status });
  } catch (err) {
    // Never fail the visitor's submit because of a logging problem.
    console.error(err);
    return reply({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function doGet() {
  return reply({ ok: true, service: 'Ashlar Tattva lead capture' });
}

// ── core ────────────────────────────────────────────────────────
function upsert(data) {
  var sheet = getSheet();
  var now   = new Date();

  var row = {
    lead_id:       String(data.lead_id || 'L' + now.getTime()),
    status:        data.status === 'complete' ? 'complete' : 'partial',
    intent:        clean(data.intent),
    name:          clean(data.name),
    phone:         clean(data.phone),
    email:         clean(data.email),
    city:          clean(data.city),
    configuration: clean(data.configuration),
    consent:       data.consent ? 'Yes' : 'No',
    project:       clean(data.project) || PROJECT,
    page:          clean(data.page),
    referrer:      clean(data.referrer),
    device:        clean(data.device)
  };

  var found = findRow(sheet, row.lead_id);
  var justCompleted = false;

  if (found) {
    var existing = sheet.getRange(found, 1, 1, HEADERS.length).getValues()[0];
    var wasComplete = existing[2] === 'complete';
    justCompleted = !wasComplete && row.status === 'complete';

    // A later partial must never blank a field the visitor already filled.
    var merged = [
      existing[0] || now,                       // received
      now,                                      // last updated
      row.status === 'complete' ? 'complete' : existing[2] || 'partial',
      row.intent        || existing[3],
      row.name          || existing[4],
      row.phone         || existing[5],
      row.email         || existing[6],
      row.city          || existing[7],
      row.configuration || existing[8],
      row.status === 'complete' ? row.consent : (existing[9] || row.consent),
      row.project       || existing[10],
      row.lead_id,
      row.page          || existing[12],
      row.referrer      || existing[13],
      row.device        || existing[14],
      existing[15] || ''                        // notified
    ];
    sheet.getRange(found, 1, 1, HEADERS.length).setValues([merged]);
    return { sheet: sheet, rowIndex: found, row: toObj(merged), justCompleted: justCompleted };
  }

  var fresh = [
    now, now, row.status, row.intent, row.name, row.phone, row.email, row.city,
    row.configuration, row.consent, row.project, row.lead_id, row.page,
    row.referrer, row.device, ''
  ];
  sheet.appendRow(fresh);
  return {
    sheet: sheet,
    rowIndex: sheet.getLastRow(),
    row: toObj(fresh),
    justCompleted: row.status === 'complete'
  };
}

// ── email ───────────────────────────────────────────────────────
function notify(r) {
  var subject = '[New Lead] ' + PROJECT + ' — ' +
                (r.name || r.phone || r.email || 'unnamed') +
                (r.intent ? ' · ' + r.intent : '');

  var intro = 'A new enquiry has come in from the Ashlar Tattva landing page.';

  var rows = [
    ['Name',          r.name],
    ['Phone',         r.phone],
    ['Email',         r.email],
    ['City',          r.city],
    ['Configuration', r.configuration],
    ['Came from',     r.intent],
    ['Consent',       r.consent],
    ['Received',      fmt(r.received)],
    ['Page',          r.page]
  ];

  var text = intro + '\n\n' +
    rows.map(function (p) { return p[0] + ': ' + (p[1] || '—'); }).join('\n') +
    '\n\nSheet: https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit\n';

  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;color:#333">' +
      '<p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;' +
        'text-transform:uppercase;color:#16494d">New lead</p>' +
      '<h2 style="margin:0 0 12px;color:#16494d;font-size:20px">' + esc(PROJECT) + '</h2>' +
      '<p style="margin:0 0 16px;font-size:14px;line-height:1.6">' + esc(intro) + '</p>' +
      '<table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;border-collapse:collapse">' +
        rows.map(function (p) {
          return '<tr>' +
            '<td style="padding:8px 12px 8px 0;color:#6b7b7c;border-bottom:1px solid #eee;white-space:nowrap">' +
              esc(p[0]) + '</td>' +
            '<td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">' +
              esc(p[1] || '—') + '</td></tr>';
        }).join('') +
      '</table>' +
      '<p style="margin:20px 0 0;font-size:13px">' +
        '<a href="https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit" ' +
           'style="color:#f28021">Open the leads sheet</a></p>' +
    '</div>';

  var opts = { name: PROJECT + ' Website', htmlBody: html };
  if (r.email) opts.replyTo = r.email;
  if (MAIL_CC) opts.cc = MAIL_CC;

  MailApp.sendEmail(MAIL_TO, subject, text, opts);
}

// ── helpers ─────────────────────────────────────────────────────
function getSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(TAB_NAME);
  if (!sheet) sheet = ss.insertSheet(TAB_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    var head = sheet.getRange(1, 1, 1, HEADERS.length);
    head.setFontWeight('bold').setBackground('#16494d').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 150).setColumnWidth(2, 150).setColumnWidth(13, 260);
  }
  return sheet;
}

function findRow(sheet, leadId) {
  var last = sheet.getLastRow();
  if (last < 2) return null;
  var ids = sheet.getRange(2, 12, last - 1, 1).getValues();   // column L = Lead ID
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === leadId) return i + 2;
  }
  return null;
}

function markNotified(sheet, rowIndex) {
  sheet.getRange(rowIndex, 16).setValue(new Date());          // column P = Notified
}

function toObj(a) {
  return {
    received: a[0], last_updated: a[1], status: a[2], intent: a[3], name: a[4],
    phone: a[5], email: a[6], city: a[7], configuration: a[8], consent: a[9],
    project: a[10], lead_id: a[11], page: a[12], referrer: a[13], device: a[14],
    notified: a[15]
  };
}

function parseBody(e) {
  if (!e) return null;
  try {
    if (e.postData && e.postData.contents) return JSON.parse(e.postData.contents);
  } catch (err) { /* fall through to form-encoded */ }
  if (e.parameter && Object.keys(e.parameter).length) return e.parameter;
  return null;
}

function clean(v) {
  return v === undefined || v === null ? '' : String(v).trim().slice(0, 500);
}

function fmt(d) {
  if (!(d instanceof Date)) return String(d || '');
  return Utilities.formatDate(d, 'Asia/Kolkata', 'd MMM yyyy, h:mm a');
}

function esc(s) {
  return String(s === undefined || s === null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to check the sheet and email both work. */
function testSetup() {
  getSheet();
  upsert({
    lead_id: 'TEST-' + Date.now(), status: 'complete', intent: 'Setup test',
    name: 'Test Lead', phone: '9876543210', email: 'test@example.com',
    city: 'Mumbai', configuration: '2 BHK', consent: true,
    page: 'https://example.com/', device: 'Setup test'
  });
  Logger.log('Row written. Check the Leads tab, then check ' + MAIL_TO);
}
