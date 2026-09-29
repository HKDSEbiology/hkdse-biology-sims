/**
 * Live class results via Firebase REST (no SDK, no Google Sheet).
 * Students write; the teacher page polls and shows names/scores.
 */
(function (global) {
  function base() {
    const c = global.HKDSE_FIREBASE || {};
    const url = String(c.databaseURL || "").replace(/\/$/, "");
    return url.indexOf("http") === 0 ? url : "";
  }

  function ready() {
    return !!base();
  }

  function sanitizeKey(id) {
    return String(id || "").replace(/[.#$[\]]/g, "_").slice(0, 80) || ("id_" + Date.now());
  }

  function compact(payload) {
    const answers = (payload.answers || []).map(function (a) {
      return {
        qn: a.qn,
        chosen: a.chosen || "",
        correct: a.correct || "",
        trap: a.trap || "",
        topic: a.topic || "",
        stem: (a.stem || "").slice(0, 240)
      };
    });
    return {
      attempt_id: payload.attempt_id,
      when_iso: payload.when_iso,
      paper: payload.paper || "",
      name: payload.name || "",
      cls: payload.cls || payload.class || "",
      class_no: payload.class_no || "",
      division: payload.division || "",
      practice_id: payload.practice_id || "",
      practice_title: payload.practice_title || "",
      score: payload.score,
      total: payload.total,
      percent: payload.percent,
      status: payload.status || (answers.length ? "done" : "doing"),
      progress: payload.progress || 0,
      token: payload.token || "",
      answers: answers
    };
  }

  function pushAttempt(payload) {
    const root = base();
    if (!root) return Promise.resolve(false);
    const rec = compact(payload);
    const url = root + "/attempts/" + sanitizeKey(rec.attempt_id) + ".json";
    return fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rec)
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
  }

  function listen(onList, onErr) {
    const root = base();
    if (!root) {
      if (onErr) onErr(new Error("no database"));
      return function () {};
    }
    function pull() {
      fetch(root + "/attempts.json", { cache: "no-store" })
        .then(function (r) {
          if (!r.ok) throw new Error("Could not read class list (" + r.status + ")");
          return r.json();
        })
        .then(function (val) {
          const list = val && typeof val === "object"
            ? Object.keys(val).map(function (k) { return val[k]; })
            : [];
          onList(list);
        })
        .catch(function (err) {
          if (onErr) onErr(err);
        });
    }
    pull();
    const timer = setInterval(pull, 4000);
    return function () { clearInterval(timer); };
  }

  global.HKDSEResults = { ready: ready, pushAttempt: pushAttempt, listen: listen };
})(window);
