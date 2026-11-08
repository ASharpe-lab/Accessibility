# Report notes (rough draft)

Notes to turn into the final report (report/index.html) at the end.

## Project A – no skill (tested 2026-11-08)

### How A was built (2 sessions)

**Session 1 (2026-11-07, thrown away).** Message:

```
Read prompt.md and build the page it describes. Work only in the a/ folder.
```

The agent opened spec.md on its own, although the message did not ask
for it. The page passed every test, so it was not a fair "no skill" build.
a/ was cleared and A was built again in a fresh session.

**Session 2 (2026-11-07, the real Project A).** Message, with a fence:

```
Read prompt.md and build the page it describes. Work only in the a/ folder.
Use only prompt.md, items.json, Json-images/ and Screenshots/.
Do not open spec.md, tests/, b/, playwright.config.js, or run any tests.
```

### Test results

Command: `npm run test:a`
Tests: the version committed in "failing tests", before A was built.

**Result: 3 failed, 6 passed** (same result in 3 runs).

| Test | Result | Why it failed |
|---|---|---|
| keyboard › main task with the keyboard only | ✘ | `getByLabel('Search')` found two elements: the search field and the `<section>` labelled by the h2 "Search". This is a bug in the test, not in A. |
| focus-visible › every element reached with Tab | ✘ | The 8 result buttons (Birkin, Kelly…) have no outline on the button itself. A draws the focus ring on `::after`. spec.md asks for a 3 px outline on the element. |
| axe › form errors shown | ✘ | No error text starts with "Error:", as spec.md asks. The axe scan never ran. |
| focus-return › Escape | ✓ | |
| focus-return › Close button | ✓ | |
| focus-return › click + Close | ✓ | |
| focus-visible › Close button in dialog | ✓ | |
| axe › page load | ✓ | |
| axe › dialog open | ✓ | |

Other things seen in A's code (for the report, not tested):
- The page background is #1E1E1E (dark grey). That colour is not in the
  palette: it is the Figma canvas colour from the style guide screenshot.
  spec.md says the page background is Light brown (#FAF6DB) with black text,
  but prompt.md does not say it, so A could not know.

## Project B – with skill

### Message for B

```
Read prompt.md and build the page it describes. Work only in the b/ folder.
Use only prompt.md, items.json, Json-images/ and Screenshots/.
Do not open a/.
```

Why it is not word for word the same as A:
- A's fence said "Do not open spec.md … or run any tests". The skill says
  "follow spec.md" and "run the tests and fix what fails". With the same
  fence the two would contradict each other and the skill could not work.
- So in B the skill is what gives the agent spec.md and the tests.
  That is exactly the effect being measured.
- "Do not open a/" stops B from copying Project A.

### Test results
(to do)

## What the AI got wrong
- In the first A session, the agent read spec.md without being asked.
  The comparison would not have been fair, so A had to be rebuilt with a fence.
- The keyboard test finds "Search" by label, and the section with the
  heading "Search" has the same name. Fix it (and explain it) while working on B.
- Mid-way, the AI changed the tests after seeing A. That breaks the
  "tests first" order, so the change was undone and A was measured
  with the original tests.
