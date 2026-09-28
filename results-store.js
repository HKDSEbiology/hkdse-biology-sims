/**
 * Live class results (Firebase Realtime Database).
 * Students write here; the teacher page listens and shows names/scores with no sign-in.
 */
(function (global) {
  function cfg() {
    const c = global.HKDSE_FIREBASE || {};
    return c.apiKey && c.databaseURL ? c : null;
  }

  function db() {
    const c = cfg();
    if (!c || typeof global.firebase === "undefined") return null;
    if (!global.__hkdseFb) {
      if (!global.firebase.apps.length) global.firebase.initializeApp(c);
      global.__hkdseFb = global.firebase.database();
    }
    return global.__hkdseFb;
  }

  function ready() {
    return !!(cfg() && typeof global.firebase !== "undefined");
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
      token: payload.token || "",
      answers: answers
    };
  }

  function pushAttempt(payload) {
    const ref = db();
    if (!ref) return Promise.resolve(false);
    const rec = compact(payload);
    const key = sanitizeKey(rec.attempt_id);
    return ref.child("attempts/" + key).set(rec).then(function () { return true; }).catch(function () { return false; });
  }

  function listen(onList) {
    const ref = db();
    if (!ref) return function () {};
    const node = ref.child("attempts");
    const handler = function (snap) {
      const val = snap.val() || {};
      const list = Object.keys(val).map(function (k) { return val[k]; });
      onList(list);
    };
    node.on("value", handler);
    return function () { node.off("value", handler); };
  }

  global.HKDSEResults = { ready: ready, pushAttempt: pushAttempt, listen: listen };
})(window);
