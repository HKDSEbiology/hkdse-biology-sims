# Live web results (not Google Classroom)

Students only open the quiz in the browser. No files, no Classroom turn-in.

GitHub Pages cannot store marks, so **one Google Sheet in your Drive** holds them. The teacher desk reads that Sheet and refreshes every 20 seconds.

## Once

1. [New Google Sheet](https://sheets.google.com/create) named `HKDSE MC results`.
2. Extensions → Apps Script. Paste `CollectAllResults.gs`. Run `setup`.
3. Deploy → Web app → Execute as Me → Anyone. Copy the `/exec` URL.
4. Paste it on the teacher desk and click Save.
5. Send the same URL here so student pages can post results automatically.

Until step 5, this page can still *read* the Sheet if you saved the URL, but students cannot *send* unless `submit-config.js` has the URL.
