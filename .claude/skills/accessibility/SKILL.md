---
name: accessibility
description: Use whenever you build or change UI.
---

# Accessibility rules

Follow these rules for every page, component and change.

## Follow the spec
- Read `spec.md` before you start and follow it exactly: heading outline,
  landmarks, focus order, alt text and colour pairs.
- Use only the colour pairs listed in spec.md. Do not invent new colours
  or take colours from screenshots.
- Never change files in `tests/`. Fix the page, not the tests.

## Native elements
- Use `<button>` for actions and `<a href>` for links. Never put click
  handlers on `<div>` or `<span>`.
- Use `<label>`, `<nav>`, `<header>`, `<main>`, `<footer>`, `<fieldset>`
  with `<legend>`, and `<dialog>`.

## Every control has a name
- Every input has a visible `<label for>`.
- Icon-only buttons get `aria-label`, e.g. `aria-label="Save Birkin"`.
  The icon inside gets `aria-hidden="true"`.
- Toggle buttons use `aria-pressed="true|false"`.

## Visible focus
- Every focusable element shows a focus outline on the element itself:
  `:focus-visible { outline: 3px solid; outline-offset: 2px; }`.
- The outline has at least 3:1 contrast with the background.
- Never use `outline: none` without a visible replacement.

## Dialogs
- Use `<dialog>` with `showModal()`.
- On open, move focus into the dialog (to the Close button).
- Escape and a "Close" button close it.
- On close, return focus to the element that opened it.

## Form errors
- Show errors only after the user tries to submit.
- Each error is text next to its field, starts with "Error:", and is
  linked with `aria-describedby`. Set `aria-invalid="true"` on the field.
- Move focus to the first field with an error.
- Success and result-count messages go in a `role="status"` region.

## Images
- Informative images get alt text that describes what is in the image.
- Decorative images get `alt=""`. Decorative icons get `aria-hidden="true"`.

## Touch targets
- Every button, link and form control is at least 24 × 24 px.

## Language and labels
- Identify the primary language of the page. Specifying the language of the page helps screen readers and other assistive technologies to read the content correctly. Use the `lang` attribute on the `<html>` tag to set the primary language, e.g., `<html lang="en">` for English.

- Create form field labels: They should tell us what information to enter or what checkbox to select. Use the `<label>` element and associate it with the corresponding form control using the `for` attribute.

When you are done, run the tests and fix what fails.