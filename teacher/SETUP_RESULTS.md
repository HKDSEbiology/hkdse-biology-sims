# Live results on the teacher page

You do **not** sign in to a Sheet to check the class. You open the teacher webpage; names and scores appear there.

That works like Gemini web apps: they also store answers in a small online database (Firebase), then the page displays them.

## Once

1. [Firebase console](https://console.firebase.google.com/) → Add project `hkdse-mc` (skip Analytics).
2. Build → Realtime Database → Create → **test mode**.
3. Gear → Project settings → Your apps → Web → copy `firebaseConfig`.
4. Paste that config in chat so it can be published.

After that, students only use the quiz. You only open:

https://hkdsebiology.github.io/hkdse-biology-sims/teacher/
