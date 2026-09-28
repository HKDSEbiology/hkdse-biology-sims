/**
 * HKDSE Biology MC — ONE Google Sheet for all live practices
 * (Cellular organisation, Cell cycle & division, Photosynthesis)
 *
 * Setup (once, signed in as the teacher Google account):
 * 1. New Google Sheet. Name it "HKDSE MC results".
 * 2. Extensions → Apps Script. Delete any stub. Paste THIS whole file.
 * 3. Save (Ctrl+S). Select function "setup" → Run. Grant permission when asked.
 * 4. Deploy → New deployment → Type: Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 5. Copy the web app URL (ends in /exec).
 * 6. Paste that URL into submit-config.js on the website
 *    (HKDSE_MC_SUBMIT_URL and HKDSE_MC_RESULTS_URL), then push / republish.
 *
 * Students: POST JSON with token matching their paper.
 * Teacher desk: GET ?action=list&token=TEACHER_TOKEN  → live attempts + answers.
 */

var TEACHER_TOKEN = "teacher-hkdse-2026";

var STUDENT_TOKENS = {
  "cell-f4-2026": "Cellular organisation F.4 MC",
  "cell-div-2026": "Cell cycle and division MC",
  "photo-mc-32-2026": "Photosynthesis MC"
};

var ATTEMPT_HEADERS = [
  "attempt_id", "when_iso", "paper", "name", "class", "class_no", "division",
  "practice_id", "practice_title", "score", "total", "percent", "answers"
];

var ANSWER_HEADERS = [
  "attempt_id", "when_iso", "paper", "name", "class", "class_no", "division",
  "practice_id", "practice_title", "qn", "topic", "chosen", "correct", "trap",
  "right", "chose_trap", "option_A", "option_B", "option_C", "option_D",
  "stem"
];

var STAT_HEADERS = [
  "paper", "practice_id", "practice_title", "qn", "topic", "n",
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

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (String(p.action || "") === "list") {
    if (String(p.token || "") !== TEACHER_TOKEN) {
      return jsonOut({ ok: false, error: "token" });
    }
    try {
      return jsonOut({
        ok: true,
        service: "hkdse-mc-collector",
        when_iso: new Date().toISOString(),
        attempts: listAttempts_(String(p.paper || ""))
      });
    } catch (err) {
      return jsonOut({ ok: false, error: String(err) });
    }
  }
  if (String(p.action || "") === "ping") {
    return jsonOut({ ok: true, service: "hkdse-mc-collector", sheets: true });
  }
  return jsonOut({ ok: true, service: "hkdse-mc-collector" });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut({ ok: false, error: "empty" });
    }
    var data = JSON.parse(e.postData.contents);
    var paper = STUDENT_TOKENS[data.token];
    if (!paper) {
      return jsonOut({ ok: false, error: "token" });
    }
    if (!data.name || !data.cls || !data.class_no || !data.division || !data.practice_id || !data.answers) {
      return jsonOut({ ok: false, error: "fields" });
    }
    paper = String(data.paper || paper);
    var ss = SpreadsheetApp.getActive();
    var attempts = ensureSheet_(ss, "Attempts", ATTEMPT_HEADERS);
    var answers = ensureSheet_(ss, "Answers", ANSWER_HEADERS);
    var when = data.when_iso || new Date().toISOString();
    var attemptId = data.attempt_id || Utilities.getUuid();

    // Idempotent: skip if this attempt_id is already stored
    var existing = attempts.getDataRange().getValues();
    if (existing.length > 1) {
      var idCol = existing[0].indexOf("attempt_id");
      for (var i = 1; i < existing.length; i++) {
        if (String(existing[i][idCol]) === String(attemptId)) {
          return jsonOut({ ok: true, attempt_id: attemptId, duplicate: true });
        }
      }
    }

    var score = Number(data.score) || 0;
    var total = Number(data.total) || data.answers.length;
    var compact = data.answers.map(function (a) {
      return String(a.qn) + "=" + String(a.chosen);
    }).join(";");
    attempts.appendRow([
      attemptId, when, paper, String(data.name), String(data.cls), String(data.class_no || ""),
      String(data.division || ""),
      String(data.practice_id), String(data.practice_title || ""),
      score, total, total ? Math.round(1000 * score / total) / 10 : 0,
      compact
    ]);
    var rows = data.answers.map(function (a) {
      var right = a.chosen === a.correct;
      return [
        attemptId, when, paper, String(data.name), String(data.cls), String(data.class_no || ""),
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

function listAttempts_(paperFilter) {
  var ss = SpreadsheetApp.getActive();
  var attemptsSh = ensureSheet_(ss, "Attempts", ATTEMPT_HEADERS);
  var answersSh = ensureSheet_(ss, "Answers", ANSWER_HEADERS);
  var aVals = attemptsSh.getDataRange().getValues();
  var bVals = answersSh.getDataRange().getValues();
  if (aVals.length < 2) return [];

  var ah = {};
  aVals[0].forEach(function (name, i) { ah[String(name)] = i; });
  var bh = {};
  if (bVals.length) bVals[0].forEach(function (name, i) { bh[String(name)] = i; });

  var byId = {};
  for (var r = 1; r < aVals.length; r++) {
    var row = aVals[r];
    var paper = String(row[ah.paper] || "");
    if (paperFilter && paper.indexOf(paperFilter) === -1 && paperFilter.indexOf(paper) === -1) {
      // allow partial match by keyword
      var pf = paperFilter.toLowerCase();
      if (paper.toLowerCase().indexOf(pf) === -1 && pf.indexOf(paper.toLowerCase()) === -1) {
        continue;
      }
    }
    var id = String(row[ah.attempt_id]);
    byId[id] = {
      attempt_id: id,
      when_iso: String(row[ah.when_iso] || ""),
      paper: paper,
      name: String(row[ah.name] || ""),
      cls: String(row[ah["class"]] || ""),
      class_no: String(row[ah.class_no] || ""),
      division: String(row[ah.division] || ""),
      practice_id: String(row[ah.practice_id] || ""),
      practice_title: String(row[ah.practice_title] || ""),
      score: Number(row[ah.score]) || 0,
      total: Number(row[ah.total]) || 0,
      percent: Number(row[ah.percent]) || 0,
      answers: []
    };
  }

  if (bVals.length > 1) {
    for (var j = 1; j < bVals.length; j++) {
      var br = bVals[j];
      var aid = String(br[bh.attempt_id]);
      if (!byId[aid]) continue;
      byId[aid].answers.push({
        qn: br[bh.qn],
        topic: br[bh.topic] || "",
        chosen: br[bh.chosen] || "",
        correct: br[bh.correct] || "",
        trap: br[bh.trap] || "",
        stem: br[bh.stem] || "",
        option_A: br[bh.option_A] || "",
        option_B: br[bh.option_B] || "",
        option_C: br[bh.option_C] || "",
        option_D: br[bh.option_D] || ""
      });
    }
  }

  return Object.keys(byId).map(function (k) { return byId[k]; }).sort(function (a, b) {
    return String(b.when_iso).localeCompare(String(a.when_iso));
  });
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
    var key = String(row[h.paper]) + "|" + String(row[h.practice_id]) + "|" + String(row[h.qn]);
    if (!map[key]) {
      map[key] = {
        paper: row[h.paper],
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
      rec.paper, rec.practice_id, rec.practice_title, rec.qn, rec.topic, rec.n,
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
