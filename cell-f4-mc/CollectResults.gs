/**
 * Cellular organisation F.4 MC — collect student answers
 *
 * Setup (once, signed in as the teacher):
 * 1. New Google Sheet. Name it "Cellular organisation F.4 MC results".
 * 2. Extensions → Apps Script. Delete the stub. Paste THIS whole file.
 * 3. Save. Run setup. Grant permission when asked.
 * 4. Deploy → New deployment → Type: Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 5. Copy the web app URL (ends in /exec).
 * 6. Put that URL into SUBMIT_URL in index.html, then republish the page.
 *
 * Later: File → Download → Microsoft Excel (.xlsx)
 * Optional: run rebuildItemStats after a class to refresh the Item_stats sheet.
 */

var TOKEN = "cell-f4-2026";

var ATTEMPT_HEADERS = [
  "attempt_id", "when_iso", "name", "class", "class_no", "division", "practice_id",
  "practice_title", "score", "total", "percent", "answers"
];

var ANSWER_HEADERS = [
  "attempt_id", "when_iso", "name", "class", "class_no", "division", "practice_id",
  "practice_title", "qn", "topic", "chosen", "correct", "trap",
  "right", "chose_trap", "option_A", "option_B", "option_C", "option_D",
  "stem"
];

var STAT_HEADERS = [
  "practice_id", "practice_title", "qn", "topic", "n",
  "n_wrong", "pct_wrong", "n_chose_trap", "pct_chose_trap",
  "n_A", "n_B", "n_C", "n_D", "correct", "trap", "stem"
];

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function setup() {
  var ss = SpreadsheetApp.getActive();
  ensureSheet_(ss, "Attempts", ATTEMPT_HEADERS);
  ensureSheet_(ss, "Answers", ANSWER_HEADERS);
  ensureSheet_(ss, "Item_stats", STAT_HEADERS);
}

function doGet() {
  return jsonOut({ ok: true, service: "cell-f4-mc" });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut({ ok: false, error: "empty" });
    }
    var data = JSON.parse(e.postData.contents);
    if (data.token !== TOKEN) {
      return jsonOut({ ok: false, error: "token" });
    }
    if (!data.name || !data.cls || !data.class_no || !data.division || !data.practice_id || !data.answers) {
      return jsonOut({ ok: false, error: "fields" });
    }
    var ss = SpreadsheetApp.getActive();
    var attempts = ensureSheet_(ss, "Attempts", ATTEMPT_HEADERS);
    var answers = ensureSheet_(ss, "Answers", ANSWER_HEADERS);
    var when = data.when_iso || new Date().toISOString();
    var attemptId = data.attempt_id || Utilities.getUuid();
    var score = Number(data.score) || 0;
    var total = Number(data.total) || data.answers.length;
    var compact = data.answers.map(function (a) {
      return String(a.qn) + "=" + String(a.chosen);
    }).join(";");
    attempts.appendRow([
      attemptId, when, String(data.name), String(data.cls), String(data.class_no || ""),
      String(data.division || ""),
      String(data.practice_id), String(data.practice_title || ""),
      score, total, total ? Math.round(1000 * score / total) / 10 : 0,
      compact
    ]);
    var rows = data.answers.map(function (a) {
      var right = a.chosen === a.correct;
      return [
        attemptId, when, String(data.name), String(data.cls), String(data.class_no || ""),
        String(data.division || ""),
        String(data.practice_id), String(data.practice_title || ""),
        a.qn, a.topic || "", a.chosen || "", a.correct || "", a.trap || "",
        right, a.chosen === a.trap,
        a.option_A || "", a.option_B || "", a.option_C || "", a.option_D || "",
        a.stem || ""
      ];
    });
    if (rows.length) {
      answers.getRange(answers.getLastRow() + 1, 1, rows.length, ANSWER_HEADERS.length)
        .setValues(rows);
    }
    return jsonOut({ ok: true, attempt_id: attemptId, n: rows.length });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function rebuildItemStats() {
  var ss = SpreadsheetApp.getActive();
  var answers = ensureSheet_(ss, "Answers", ANSWER_HEADERS);
  var stats = ensureSheet_(ss, "Item_stats", STAT_HEADERS);
  var values = answers.getDataRange().getValues();
  if (values.length < 2) {
    stats.clearContents();
    stats.getRange(1, 1, 1, STAT_HEADERS.length).setValues([STAT_HEADERS]);
    return;
  }
  var h = {};
  values[0].forEach(function (name, i) { h[String(name)] = i; });
  var map = {};
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var key = String(row[h.practice_id]) + "|" + String(row[h.qn]);
    if (!map[key]) {
      map[key] = {
        practice_id: row[h.practice_id],
        practice_title: row[h.practice_title],
        qn: row[h.qn],
        topic: row[h.topic],
        n: 0, n_wrong: 0, n_trap: 0,
        n_A: 0, n_B: 0, n_C: 0, n_D: 0,
        correct: row[h.correct],
        trap: row[h.trap],
        stem: row[h.stem]
      };
    }
    var rec = map[key];
    rec.n++;
    var chosen = String(row[h.chosen]);
    if (chosen === "A") rec.n_A++;
    if (chosen === "B") rec.n_B++;
    if (chosen === "C") rec.n_C++;
    if (chosen === "D") rec.n_D++;
    if (String(row[h.right]) !== "true" && String(row[h.right]) !== "TRUE" && row[h.right] !== true) {
      rec.n_wrong++;
    }
    if (String(row[h.chose_trap]) === "true" || String(row[h.chose_trap]) === "TRUE" || row[h.chose_trap] === true) {
      rec.n_trap++;
    }
  }
  var out = [STAT_HEADERS];
  Object.keys(map).sort().forEach(function (key) {
    var rec = map[key];
    out.push([
      rec.practice_id, rec.practice_title, rec.qn, rec.topic, rec.n,
      rec.n_wrong, rec.n ? Math.round(1000 * rec.n_wrong / rec.n) / 10 : 0,
      rec.n_trap, rec.n ? Math.round(1000 * rec.n_trap / rec.n) / 10 : 0,
      rec.n_A, rec.n_B, rec.n_C, rec.n_D, rec.correct, rec.trap, rec.stem
    ]);
  });
  stats.clearContents();
  stats.getRange(1, 1, out.length, STAT_HEADERS.length).setValues(out);
}

function ensureSheet_(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  var first = sh.getRange(1, 1, 1, headers.length).getValues()[0];
  var empty = first.every(function (c) { return String(c).trim() === ""; });
  if (empty) sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  return sh;
}
