# Live results on the teacher page

Firebase project `hkdse-mc` is linked. You do **not** sign in to a Sheet to check the class.

Daily use:

- Students only finish the web quiz.
- You only open https://hkdsebiology.github.io/hkdse-biology-sims/teacher/

Names and scores appear there by themselves.

If the database later asks you to update rules (test mode can expire), Realtime Database → Rules, set:

```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Then Publish.
