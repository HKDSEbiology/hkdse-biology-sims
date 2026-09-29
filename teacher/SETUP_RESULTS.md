# Live results on the teacher page

Open only this page during a lesson (no Google Sheet, no sign-in):

https://hkdsebiology.github.io/hkdse-biology-sims/teacher/

Names appear when a student **starts** the web quiz. Scores appear when they **submit**.

If the table stays empty, students must use the web quiz (not the Word paper). Then check Realtime Database → Rules and Publish:

```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
