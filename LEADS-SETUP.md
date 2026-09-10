# Lead capture — setup

Every **submitted** enquiry on the landing page writes to the Google Sheet and
emails `sales@ashlarspaces.com`. Two pieces: a script that lives in the sheet,
and one URL pasted into the site.

Nothing is recorded until the visitor presses submit — half-typed forms are not
captured.

**Sheet:** <https://docs.google.com/spreadsheets/d/17XOlTBM5gvR7N2DHAWsf8TJOUPuoqgsfjF5kxZsnV3Q/edit>

I can't deploy the script for you — it runs under your Google account and sends
mail as you, so it has to be created from an account with access to the sheet.
It's about five minutes.

---

## 1. Add the script

1. Open the sheet → **Extensions → Apps Script**.
2. Delete whatever is in `Code.gs`.
3. Paste the entire contents of **`apps-script/Code.gs`** from this repo.
4. **Save** (⌘S). Name the project *Ashlar Tattva Leads*.

## 2. Check it works before deploying

1. In the toolbar, choose the function **`testSetup`** and press **Run**.
2. Google asks for permission the first time — *Review permissions* → pick your
   account → *Advanced* → *Go to Ashlar Tattva Leads (unsafe)* → **Allow**.
   That warning is normal for a script you wrote yourself.
3. A **Leads** tab appears with a header row and one test row, and a test email
   arrives at `sales@ashlarspaces.com`. Delete the test row afterwards.

If the email doesn't arrive, check spam, then confirm the account you authorised
is allowed to send as itself.

## 3. Deploy it as a web app

1. **Deploy → New deployment** → gear icon → **Web app**.
2. Set:
   - **Description:** `Lead capture v1`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**  ← must be *Anyone*, not *Anyone with Google account*
3. **Deploy**, authorise if prompted, then **copy the Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfy……/exec`

## 4. Point the site at it

In `assets/js/main.js`, top of the file:

```js
FORM_ENDPOINT: 'https://script.google.com/macros/s/AKfy……/exec',
```

Commit and push. That's it — leads start flowing.

---

## What lands in the sheet

One **row per submitted enquiry**. The same visitor enquiring twice — brochure
now, floor plan later — is two leads and two rows, because sales needs to see
both. The hidden `Lead ID` only stops a single submission being recorded twice
if the browser retries it.

| Column | Notes |
|---|---|
| Received / Last updated | When the enquiry came in |
| **Status** | Always `complete` — only submitted enquiries are recorded |
| **Intent** | Which button they came from — `Brochure request`, `Floor plan — 2 BHK`, `Auto popup`, `Site visit`, `Cost sheet`… |
| Name, Phone, Email, City, Configuration | As entered |
| Consent | Whether the updates box was ticked |
| Project, Lead ID, Page, Referrer, Device | Context for attribution |
| Notified | When sales was emailed |

## When email goes out

One email per submitted enquiry, sent immediately, subject
`[New Lead] Ashlar Tattva — Name · Intent`. It replies straight to the visitor
when they left an email address. A repeated POST of the same submission does not
send a second email.

---

## One thing to be aware of

**Gmail send limits.** A free Gmail account can send ~100 emails/day from Apps
Script; Google Workspace allows ~1,500. If the campaign is expected to exceed
that, the sheet still records everything — only the emails would stop. Worth
watching in the first week.

## If leads stop arriving

1. Open the Web app URL in a browser — it should return
   `{"ok":true,"service":"Ashlar Tattva lead capture"}`.
2. In Apps Script → **Executions**, look for failures.
3. **After editing `Code.gs` you must redeploy** — *Deploy → Manage deployments*
   → pencil → *Version: New version* → **Deploy**. Editing alone changes nothing
   on the live URL. This is the single most common cause.
