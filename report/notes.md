# Report notes (rough draft)

Notes to turn into the final report (report/index.html) at the end.

## Project A – no skill (tested 2026-11-08)

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
(to do)

## What the AI got wrong
- The keyboard test finds "Search" by label, and the section with the
  heading "Search" has the same name. Fix it (and explain it) while working on B.
- Mid-way, the AI changed the tests after seeing A. That breaks the
  "tests first" order, so the change was undone and A was measured
  with the original tests.
