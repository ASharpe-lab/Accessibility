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
- The browser agent in step 7 reported two problems that were not real
  (4 bags "not clickable", "not a dialog"). Its report had to be checked
  against the code.

## Step 7 – An agent uses the page

### B (normal save button) – 2026-11-09
Agent: a fresh Claude session with the built-in browser.
Message:

```
Open http://127.0.0.1:5500/b/ in your browser. Do this task using only the page, not the source code: search for Birkin, open its details, close them, save Birkin and sign up. Tell me every step you took, what you clicked or typed, and any problem you had.
```

**Result: finished the whole task. Nothing stopped it.**

Steps it took:
1. Opened the page: saw the nav (Search, Details, Sign up), the search box and "8 results".
2. Clicked Search and typed "Birkin" → "1 result", only the Birkin card left.
3. Clicked the Birkin name → the details dialog opened (photo, Hermès, 1984, France, Togo leather, story, Close).
4. Pressed Escape → the dialog closed and focus went back to the Birkin button.
5. Clicked the heart ("Save Birkin") → filled heart on a pink circle.
6. Clicked "Sign up" in the menu → jumped to "Sign up for handbag news".
7. Sent the empty form on purpose → four "Error: …" messages, red borders, focus on Name.
8. Filled in Name, Email, chose "Top handle", ticked the consent box.
9. Clicked Sign up → "Thanks! You are signed up." and the form cleared.

Problems the agent reported, checked against the code:

| Agent said | True? | What I found |
|---|---|---|
| Lady Dior, Jackie, Baguette and Cabat have no clickable name | ❌ No | All 8 cards have a "card-open" button. The agent probably only saw the cards on screen. |
| The details panel is not marked as a dialog, and its empty labels are read when it is closed | ❌ No | It is a native `<dialog>` with `aria-labelledby`, opened with `showModal()`. A closed `<dialog>` is hidden from screen readers. |
| Errors stay on screen after the field is fixed | ✅ Yes | The errors only update on submit. Typing a name leaves "Error: Enter your name." visible. → fix in B / check in step 8 |
| Could not check if the saved state is read out | – | The button has `aria-pressed="true"` after saving, so a screen reader says "pressed". The agent's tools could not see it. |
| After "Sign up" in the nav, the end of the Details text is cut off above the heading | ✅ Small | Only how it looks after the jump. It still works. |

![Agent on B](images/agent-b.png)

### b-div (save button turned into a div) – 2026-11-09
Copy of B in `b-div/`. The only change, in `b-div/script.js` line 51:
`document.createElement('button')` → `document.createElement('div')`.
Same message to a fresh agent session, with the URL `/b-div/`.

**Result: did NOT finish the task with the keyboard.** It could only save
Birkin with the mouse, and it stopped before sending the form.

Steps it took:
1. Opened the page: same look as B, 8 cards with hearts.
2. Searched "Birkin" → "1 result".
3. Clicked "Birkin" → details opened. (Its first click failed because typing
   had rebuilt the list. Clicking the name again worked.)
4. Pressed Escape → dialog closed, focus back on "Birkin".
5. **Save Birkin:**
   - Tab from "Birkin" skipped the heart and went straight to the Name field.
     A keyboard user cannot save a bag.
   - Clicked the heart with the mouse → it looked saved (filled pink heart).
   - To assistive technology the heart is plain text "Save Birkin", not a
     button, and after clicking there is no "saved" state.
6. Sign-up with the keyboard: Name, Email, arrow keys in "Favourite style",
   Tab to the consent box. Then it stopped and asked me before ticking
   the box and sending the form.

Problems the agent reported, checked:

| Agent said | True? |
|---|---|
| The heart cannot be reached with Tab | ✅ Yes – a `<div>` is not focusable |
| The heart is not announced as a button | ✅ Yes – a `<div>` has no role |
| After saving there is no saved state | ✅ Yes – `aria-pressed` does nothing without a button role |
| The details popup is not announced as a dialog | ❌ No – the same `<dialog>` as in B (it said the same about B) |

### Tests on b-div (same tests, extra run)

**4 failed, 5 passed** (B: 0 failed).

| Test | B | b-div | Why |
|---|---|---|---|
| keyboard › main task | ✓ | ✘ | Tab never reaches "Save Birkin" |
| axe › page load | ✓ | ✘ | critical `aria-allowed-attr` + serious `aria-prohibited-attr`: `aria-label` and `aria-pressed` on a `<div>` (8 elements) |
| axe › form errors shown | ✓ | ✘ | the same axe problems |
| focus-visible › every element reached with Tab | ✓ | ✘ | Side effect: with 8 fewer tab stops, 20 Tabs run past the end of the page (focus on `body`). Not a real focus-ring problem. |
| the other 5 | ✓ | ✓ | |

### What changed (B → b-div)
- **The agent could do the whole task on B, but on b-div it could not save
  with the keyboard.** It had to fall back to the mouse.
- The page looks exactly the same, so a sighted mouse user notices nothing.
  The difference only shows up for keyboard users, screen readers and agents:
  they all read the accessibility tree, and in it the heart stopped being a button.
- One changed word (`button` → `div`) made 4 tests fail.
