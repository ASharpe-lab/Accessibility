# Accessibility spec: Luxury Bag Finder
## 1. Heading outline

- h1: Luxury Bag Finder
  - h2: Search
    - h3: [handbag name] (one per result card, e.g. "Birkin")
  - h2: Details
    - (dialog) h2: [handbag name]
  - h2: Sign up for handbag news

No heading levels are skipped. There is only one h1.

## 2. Landmarks

| Landmark | Element | Contains |
|---|---|---|
| Banner | `<header>` | Skip link, site name, nav |
| Navigation | `<nav aria-label="Main">` | Links to Search, Details, Sign up |
| Main | `<main id="main">` | The three sections |
| Content info | `<footer>` | "Luxury Bag Finder – Student project" |

The skip link "Skip to main content" is the first focusable element
and goes to `#main`.

## 3. Focus order of the main task

Main task: search for Birkin, open its details, close them,
save Birkin and sign up.

1. Tab → "Skip to main content" link. Enter → focus moves to main.
2. Tab → "Search" field. Type "Birkin".
   The result count changes to "1 result" and is read out (aria-live="polite").
3. Tab → "Birkin" result (a button inside the h3 of the card).
4. Enter → the details dialog opens. Focus moves to the "Close" button.
5. Escape (or Enter on "Close") → the dialog closes.
   Focus goes back to the "Birkin" result button.
6. Tab → "Save Birkin" button. Space → the item is saved
   (the button shows a filled heart and has aria-pressed="true").
7. Tab (until) → "Name" field. Type a name.
8. Tab → "Email" field. Type an email.
9. Tab → "Favourite style" radio group. Arrow keys choose an option.
10. Tab → "I agree to receive emails" checkbox. Space checks it.
11. Tab → "Sign up" button. Enter sends the form.
12. The success message "Thanks! You are signed up." appears and is read out.

Shift+Tab moves back through the same order.
If the form has errors, focus moves to the first field with an error.

## 4. Alt text

| Image | Alt text | Decorative? |
|---|---|---|
| Handbag photo on a result card | Describes the bag, e.g. "Orange leather Hermès Birkin bag with a gold padlock" (from `alt` in items.json) | No |
| Handbag photo in the dialog | Same alt as on the card | No |
| Heart icon in the save button | `aria-hidden="true"` – the button has the name "Save [handbag name]" | Yes |
| Other icons (search, close, arrows) | `aria-hidden="true"` – the control has a text name | Yes |
| Background patterns or ornaments | `alt=""` | Yes |

## 5. Colour pairs and contrast

AA requires 4.5:1 for text and 3:1 for icons and borders.

Palette:
- Dark brown: #95865F
- Light brown: #FAF6DB
- White: #FFFFFF
- Dark blue: #1571B3
- Light blue: #C7F7EF
- Fucsia: #B31545
- Pink: #FFCCD5
- Dark pink: #856A75
- Text black: #000000 (only for text)

| Use | Foreground | Background | Ratio | Passes |
|---|---|---|---|---|
| Body text | Dark brown: #95865F | Light brown #FAF6DB (page) | 19.27:1 | ✅ |
| Headings h1, h2 | Dark brown: #95865F | Light brown #FAF6DB | 6.20:1 | ✅ |
| Links (underlined) | Text black: #000000 | Light brown #FAF6DB | 4.76:1 | ✅ |
| Header and footer text, nav links | Black #000000 | Dark brown #95865F | 5.85:1 | ✅ |
| Card|Light brown: #FAF6DB|White: #FFFFFF(card)|---|---|
| Card heading  | Dark brown: #95865F bold text| White: #FFFFFF(card) |---|---|
| Card text | Dark brown: #95865F Regular text | White: #FFFFFF(card) |---|---|
| Heart icon on card | Fucsia #B31545 | Pink: #FFCCD5| 5.78:1 | ✅ (3:1) |
| Card border | Dark brown: #95865F| Light brown #FAF6DB |---|---|
| Dialog text | Black #000000 | Light brown #FAF6DB | 19.27:1 | ✅ |
| Close button text | Light brown #FAF6DB |Dark brown: #95865F |---|---|
| Sign up button text | Light brown #FAF6DB | Dark brown: #95865F | 6.20:1 | ✅ |
| Input border | Dark pink #856A75 | Light brown #FAF6DB | 4.46:1 | ✅ (3:1) |
| Error text (starts with "Error:") | Fucsia #B31545 | Light brown #FAF6DB | 6.20:1 | ✅ |
| Success message | Dark brown: #95865F| Light brown: #FAF6DB| 17.98:1 | ✅ |
| Focus outline (3 px, 2 px offset) | Black #000000 | Light brown / Dark brown / Light blue | 19.27 / 5.85 / 17.98 :1 | ✅ (3:1) |

