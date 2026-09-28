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
  apiKey: "AIzaSyALNZm3sWsbmmu6SL84IGEH4tB0p2620rc",
  authDomain: "hkdse-mc.firebaseapp.com",
  databaseURL: "https://hkdse-mc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hkdse-mc",
  storageBucket: "hkdse-mc.firebasestorage.app",
  messagingSenderId: "885635793954",
  appId: "1:885635793954:web:ab80bb1f53eb848bfd367b"
};

window.HKDSE_MC_SUBMIT_URL = "";
window.HKDSE_MC_RESULTS_URL = "";
window.HKDSE_MC_TEACHER_TOKEN = "teacher-hkdse-2026";
