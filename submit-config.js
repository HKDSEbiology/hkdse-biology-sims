/**
 * Live results for the teacher webpage (no Google Sheet, no Classroom).
 *
 * After you create a free Firebase Realtime Database once, paste the config
 * below and we republish. Then:
 *   - students just finish the web quiz
 *   - you open the teacher page — names and scores appear, no sign-in
 *
 * If HKDSE_FIREBASE.apiKey is empty, live submit is off.
 */
window.HKDSE_FIREBASE = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

window.HKDSE_MC_SUBMIT_URL = "";
window.HKDSE_MC_RESULTS_URL = "";
window.HKDSE_MC_TEACHER_TOKEN = "teacher-hkdse-2026";
