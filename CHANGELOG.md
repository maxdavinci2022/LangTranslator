# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: [SemVer](https://semver.org/).

## [1.0.0] - 2026-11-13

First public release.

### Added
- Round button: tap translates the page, hold (~0.5 s) opens the menu, the `⋯` badge and right-click open it too, drag moves the button.
- Auto-translate on selection with a resizable result window: drag the bottom-right corner, double-click to reset. Limits 240x120 up to the viewport minus margins, capped at 900x760; the size is remembered.
- Read aloud: voice / engine selector fed by the system voice list, speed 0.5x-2x, pitch 0-2, volume 0-100 %, Test, Stop and Reset. Settings apply live and restart current playback. Long texts are chunked; a stop control appears in the menu header while speaking.
- Automatic removal of the speech buttons when the browser has no speech engine, with a notice in the menu.
- In-place replacement of selected text in inputs, textareas and contenteditable, undo preserved.
- Whole-page translation with one-click restore, attributes and tab title, dynamic content observer.
- Interface follows the browser language, including the Firefox UI locale via `Intl`, with English fallback. Six locales: en, ru, zh, de, fr, es.
- Target `Auto` resolves to the browser language, source auto-detected, 82 target languages.
- Opacity affects the round button only; menu, dialogs, result window and toasts stay fully opaque.
- Menu theme switch: Dark / Light, neutral graphite and white.
- Settings persistence with JSON export and import, validation on import.
- Adjacent hotkeys Alt+Z / Alt+X / Alt+C, all rebindable.
- Per-domain auto-translate and disable lists.
- Three translation endpoints with fallback, batching, caching and retry; diagnostics reporting locales, voice, speech parameters and endpoint latency.
- Adaptive layout: bottom sheets on phones, safe-area and on-screen keyboard aware.

### Changed
- Every icon is inline SVG instead of emoji glyphs, so nothing depends on an emoji font and no missing-glyph boxes appear.
- Margins halved: viewport gaps 5 px, card paddings 5/6 px, button offset 8/48 px.

[1.0.0]: https://github.com/maxdavinci2022/langtranslator/releases/tag/v1.0.0