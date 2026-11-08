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

### What the B session did (2026-11-08)
- It loaded the accessibility skill straight away.
- It looked at the screenshots and copied items.json and Json-images/ into b/.
- It did **not** open spec.md. The fence "Use only prompt.md, items.json,
  Json-images/ and Screenshots/" was stronger than the skill's
  "Read spec.md before you start".
- It did **not** run the tests on its own. The skill's last line
  ("run the tests and fix what fails") was not enough: I had to ask
  "run the tests against b/".
- It did not change anything in b/ or tests/ after running the tests.

### Test results

Command: `npm run test:b`, same tests as A (nothing in tests/ changed).

**First run (by the B agent): 1 failed, 8 passed.**
- ✘ keyboard › main task with the keyboard only – at the Shift+Tab step
  (from "Save Birkin" back to "Birkin") focus did not move back.
  The agent could not make it fail again in 45+ runs.

**My runs (3 times): 0 failed, 9 passed.**

| Test | A | B |
|---|---|---|
| keyboard › main task | ✘ | ✓ (✘ once on the first run) |
| focus-visible › every element reached with Tab | ✘ | ✓ |
| focus-visible › Close button | ✓ | ✓ |
| focus-return › Escape | ✓ | ✓ |
| focus-return › Close button | ✓ | ✓ |
| focus-return › click + Close | ✓ | ✓ |
| axe › page load | ✓ | ✓ |
| axe › dialog open | ✓ | ✓ |
| axe › form errors shown | ✘ | ✓ |
| **Failures** | **3** | **0** (1 on first run) |

### Rules from the skill that made a difference
- **"Each error … starts with 'Error:'"** – A's errors did not, so the
  axe form-errors test never got to scan. B's errors do, so it passes.
- **"Focus outline on the element itself"** – A drew the focus ring of
  the result buttons on `::after`; B puts `:focus-visible { outline: 3px }`
  on the elements, so the focus-visible test passes.

### Rules from the skill that did NOT work
- **"Use only the colour pairs in spec.md … do not take colours from
  screenshots"** – B still uses #1E1E1E (the Figma canvas grey) as the
  page background, like A. B never read spec.md (see the fence above).

### Work on B after the first build (2026-11-08)
- Changed only `b/styles.css` so the colours follow spec.md section 5:
  Light brown page with black text, Fucsia h1/h2, Dark blue links,
  Dark brown header and footer, Light blue cards with Dark pink borders,
  Fucsia heart icon, Fucsia "Sign up" button, Dark blue "Close" button,
  Fucsia "Error:" text, 3 px black focus outline.
- Removed the Figma grey (#1E1E1E) and #2A2A2A, which are not in the palette.
- Tests after the change: **9 passed, 0 failed** (2 runs). axe found no
  serious or critical problems, including colour contrast.

## What the AI got wrong
- In the first A session, the agent read spec.md without being asked.
  The comparison would not have been fair, so A had to be rebuilt with a fence.
- In B the agent followed the fence and ignored the skill's "read spec.md",
  and it did not run the tests until asked.
- Both A and B took the page background (#1E1E1E) from the Figma
  screenshot instead of the palette.
- The keyboard test finds "Search" by label, and the section with the
  heading "Search" has the same name. Fix it (and explain it) while working on B.
- Mid-way, the AI changed the tests after seeing A. That breaks the
  "tests first" order, so the change was undone and A was measured
  with the original tests.
