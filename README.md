# LangTranslator

**Tap the circle — the page is translated. Hold it — the menu opens.**

A single-file userscript: whole-page translation, instant translation of selected text, in-place replacement inside input fields, and read-aloud with a real voice engine.

[Install](#install) · [Controls](#controls) · [Read aloud](#read-aloud) · [Settings](docs/SETTINGS.md) · [Privacy](PRIVACY.md) · [Русский](README.ru.md)

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. Open the raw file and confirm:
   `https://raw.githubusercontent.com/maxdavinci2022/langtranslator/main/langtranslator.user.js`
3. Reload the page — a round button appears in the lower-right corner.

Updates arrive through `langtranslator.meta.js`.

## Controls

| Gesture | Result |
| --- | --- |
| Tap / click the circle | Translate the whole page; tap again to restore the original |
| Hold the circle (~0.5 s) | Open the menu |
| Tap the `⋯` badge on the circle | Open the menu |
| Right-click the circle | Open the menu |
| Drag the circle | Move it; the position is remembered |
| Select text | Translation appears automatically in the result window |
| Drag the corner of the result window | Resize it; double-click the corner to reset |
| `Alt` + `Z` | Translate page / restore |
| `Alt` + `X` | Translate selection; inside a field it replaces the text in place |
| `Alt` + `C` | Open / close the menu |
| `Esc` | Close the dialog, the result window, the menu, or stop speech |

The three hotkeys sit next to each other and are rebindable in Settings.

## Read aloud

The menu contains a full speech panel:

| Control | Range |
| --- | --- |
| Voice / engine | every voice installed in the system, or Auto by text language |
| Speed | 0.5× – 2× |
| Pitch | 0 – 2 |
| Volume | 0 – 100 % |
| Test | speaks a sample in the current target language |
| Stop | stops playback (also available in the menu header while speaking) |
| Reset | back to Auto voice, 1× speed, pitch 1, 100 % volume |

Values apply live: move a slider while speech is playing and it restarts with the new setting. Long texts are split into chunks so playback does not stall. If the browser has no speech engine, the buttons remove themselves and the menu shows a notice.

All icons are inline SVG — no emoji fonts, no missing-glyph boxes, identical on Windows, Linux, macOS and Android.

## Languages

The interface follows your browser language, including the Firefox UI locale read through `Intl`. Available: **English, Русский, 中文, Deutsch, Français, Español**. Unknown languages fall back to English.

The target language defaults to `Auto · browser language`; the source is auto-detected. 82 target languages are available.

## Appearance

- **Opacity affects the round button only.** The menu, dialogs, result window and toasts are always fully opaque.
- **Menu theme: Dark or Light**, switched by the sun/moon button in the menu header or in Settings. Neutral graphite and white.
- Button size 34–64 px, draggable position, safe-area aware, bottom-sheet layout on phones.

## Settings

Everything is stored under `langtranslator.settings.v1` and can be exported and imported as JSON — see [docs/SETTINGS.md](docs/SETTINGS.md).

Move a configuration between devices: **Download JSON → Load file → Apply**.

## Diagnostics

Menu → Diagnostics prints the detected locales, the chosen voice, the speech parameters and the latency or failure reason of every translation endpoint. All `FAIL` means the network blocks the services.

## Compatibility

Chrome, Edge, Brave, Opera, Firefox — desktop and Android. Frames are skipped (`@noframes`). Text inside images is not recognised.

## Development

```bash
npm test
```

`node --check` parses the userscript; `scripts/validate.mjs` verifies version parity, locale parity, the English-only code rule, the SVG-icon rule and the opacity rule. No bundler, no dependencies. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

## Credits

Developed with reference to [Search & Translate Panel](https://github.com/DimasioLab/Search-Translate-Panel)
by DimasioLab (MIT). LangTranslator is an independent implementation with a
different interface and feature set; see [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

MIT © maxdavinci
