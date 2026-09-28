# One-time setup: live student results

Use **one** Google Sheet for Cellular organisation, Cell cycle & division, and Photosynthesis.

## Steps

1. Open [sheets.google.com/create](https://sheets.google.com/create) (school Google account).
2. Name the file `HKDSE MC results`.
3. **Extensions → Apps Script**. Delete any stub.
4. Paste the contents of [`teacher/CollectAllResults.gs`](teacher/CollectAllResults.gs) (or use **Copy Apps Script** on the teacher desk).
5. Save. Run function `setup`. Approve permissions.
6. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Copy the URL ending in `/exec`.
8. On [Teacher desk](https://hkdsebiology.github.io/hkdse-biology-sims/teacher/), paste the URL and click **Save** (works immediately for *reading* results).
9. Put the **same URL** into `submit-config.js`:

```js
window.HKDSE_MC_SUBMIT_URL = "https://script.google.com/macros/s/XXXX/exec";
window.HKDSE_MC_RESULTS_URL = "https://script.google.com/macros/s/XXXX/exec";
```

10. Push to GitHub Pages so students submit online.

## After that

- Open the teacher desk → **Refresh from Sheet**.
- Topic teacher pages also have **Refresh from Sheet**.
- The Sheet tabs `Attempts`, `Answers`, and `Item_stats` hold the raw data (run `rebuildItemStats` in Apps Script after a class if you want the stats tab updated).
