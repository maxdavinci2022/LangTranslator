# Settings reference

Storage key: `langtranslator.settings.v1`
Location: userscript manager storage, `localStorage` as a fallback.

## Export format

```json
{
  "app": "langtranslator",
  "version": "1.0.0",
  "settings": { }
}
```

Import accepts this wrapper or a bare settings object. Unknown keys are dropped,
values are validated and clamped, so a damaged file cannot break the script.

## Fields

| Key | Type | Default | Range / values |
| --- | --- | --- | --- |
| `v` | number | `1` | schema version |
| `ui` | string | `auto` | `auto`, `en`, `ru`, `zh`, `de`, `fr`, `es` |
| `source` | string | `auto` | `auto` or a language code |
| `target` | string | `auto` | `auto` (browser language) or a language code |
| `reverse` | string | `en` | language used when the text is already in the target language |
| `autoSel` | boolean | `true` | auto-translate the selection |
| `bubble` | boolean | `true` | show the result window |
| `dynamic` | boolean | `true` | translate newly added content |
| `size` | number | `46` | 34 – 64, round button diameter in px |
| `opacity` | number | `90` | 30 – 100, round button only |
| `theme` | string | `dark` | `dark`, `light` |
| `pos` | object \| null | `null` | `{ x, y }` button position |
| `bubSize` | object \| null | `null` | `{ w, h }`, 240–900 × 120–760, also limited by the viewport |
| `autoSites` | string[] | `[]` | domains translated on load |
| `blocked` | string[] | `[]` | domains where the script does not start |
| `provider` | string | `auto` | `auto`, `g1`, `g2`, `mm` |
| `tts.voice` | string | `""` | `voiceURI`, empty = auto by text language |
| `tts.rate` | number | `1` | 0.5 – 2 |
| `tts.pitch` | number | `1` | 0 – 2 |
| `tts.volume` | number | `1` | 0 – 1 |
| `hk.page` | object | Alt+Z | `{ code, alt, ctrl, shift }` |
| `hk.sel` | object | Alt+X | `{ code, alt, ctrl, shift }` |
| `hk.menu` | object | Alt+C | `{ code, alt, ctrl, shift }` |

## Providers

| Id | Endpoint |
| --- | --- |
| `g1` | `https://translate.googleapis.com/translate_a/single` |
| `g2` | `https://translate.google.com/translate_a/single` |
| `mm` | `https://api.mymemory.translated.net/get` |

`auto` tries them in order, remembers the one that answered and retries on 429 / 5xx.

## Example

```json
{
  "app": "langtranslator",
  "version": "1.0.0",
  "settings": {
    "ui": "ru",
    "target": "ru",
    "source": "auto",
    "theme": "dark",
    "size": 46,
    "opacity": 90,
    "autoSel": true,
    "bubSize": { "w": 520, "h": 260 },
    "tts": { "voice": "", "rate": 1.15, "pitch": 1, "volume": 0.9 },
    "autoSites": ["developer.mozilla.org"],
    "blocked": ["mail.google.com"],
    "hk": {
      "page": { "code": "KeyZ", "alt": true, "ctrl": false, "shift": false },
      "sel": { "code": "KeyX", "alt": true, "ctrl": false, "shift": false },
      "menu": { "code": "KeyC", "alt": true, "ctrl": false, "shift": false }
    }
  }
}
```
