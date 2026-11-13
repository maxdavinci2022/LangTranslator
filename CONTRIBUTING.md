# Contributing

## Rules

1. **English-only code.** Identifiers, comments and logic in English. Translated strings live
   between `/* i18n:start */` and `/* i18n:end */`. CI fails on Cyrillic or CJK outside that block
   and the metadata header.
2. **No dependencies.** One file, no bundler, no CDN, no `innerHTML`.
3. **Locale parity.** Every locale exposes exactly the keys of `en`, in the order
   `en, ru, zh, de, fr, es`.
4. **SVG icons only.** Add paths to `ICON_PATHS` and render them with `ico()`.
   Emoji code points are forbidden — they render as missing-glyph boxes on systems
   without an emoji font.
5. **Opacity rule.** Only the round button (`.wrap`) may be translucent.
   `.card`, `.box` and `.toast` stay opaque.
6. **Speech is user-triggered.** Never start playback automatically.

## Adding an interface language

1. Copy the `en` block inside `LOCALES`, translate values, keep keys.
2. Add the code to `UI_LOCALES` and a native name to `UI_NAMES`.
3. Add `@name:<code>` and `@description:<code>` to both `.user.js` and `.meta.js`.
4. Run `npm test`.

## Adding an icon

```js
ICON_PATHS.myIcon = ['M4 12h16', 'M12 4v16'];   // 24x24 grid, stroke based
// solid shapes go into SOLID_ICONS as well
```

## Local checks

```bash
npm test
```

## Manual smoke test

- [ ] Tap translates the page, second tap restores it.
- [ ] Hold ~0.5 s opens the menu; the `⋯` badge and right-click open it too.
- [ ] Drag moves the button and the position survives a reload.
- [ ] Result window resizes by the corner, never exceeds the viewport, double-click resets.
- [ ] Opacity slider changes the button only; the menu stays fully opaque.
- [ ] Theme switch toggles dark and light in menu, dialog, result window and toast.
- [ ] All icons render as shapes, not boxes, on a system without an emoji font.
- [ ] Voice list fills, Test speaks, sliders restart playback with new values, Stop halts it.
- [ ] With speech unavailable the buttons disappear and the notice is shown.
- [ ] Interface language matches the browser; unknown browser language falls back to English.
- [ ] `Alt+X` replaces text inside a field; undo restores it.
- [ ] Export → Reset all → Import restores the configuration.
- [ ] Phone width: menu and dialog become bottom sheets.
- [ ] A domain in the disable list produces no button and no requests.

## Pull requests

One concern per PR, update `CHANGELOG.md`, state the browser, manager and site used for verification.