# Privacy

LangTranslator has no analytics, no telemetry, no accounts and no server of its own.

## Stored on your device

Everything under `langtranslator.settings.v1`: interface language, translation languages,
toggles, button size and opacity, theme, button position, result-window size, hotkeys,
domain lists, translation provider and speech settings (voice, speed, pitch, volume).

Storage: the userscript manager, or `localStorage` when unavailable.
The translation cache lives in memory and disappears with the tab.

## Sent over the network — translation

Only the text being translated, to the first endpoint that answers:

| Endpoint | Payload |
| --- | --- |
| `https://translate.googleapis.com/translate_a/single` | text, source code, target code |
| `https://translate.google.com/translate_a/single` | text, source code, target code |
| `https://api.mymemory.translated.net/get` | text, language pair |

Requests use `anonymous: true`, so cookies are not attached. No page URL, no history,
no identifiers.

Auto-translate on selection sends only the selected fragment. Page translation sends
visible text nodes plus `placeholder`, `title`, `alt`, `aria-label`. Password fields are never read.

## Read aloud

Speech uses the browser's own `speechSynthesis`. The script opens no network connections
for speech and sends nothing to its own endpoints.

The voice list marks each voice as `local` or `cloud`:

- **local** — synthesis happens on the device, the text does not leave it;
- **cloud** — the operating system or browser vendor may process the text on its servers,
  under that vendor's own privacy policy.

Choose a `local` voice, or leave speech switched off, if the text must stay on the device.

## Control

- Turn off **Auto-translate selection** to send nothing without an explicit action.
- Add domains to **Disabled on these domains** — the script does not start there at all.
- **Reset all** clears the stored configuration.

The translation endpoints are public and unofficial. Do not translate confidential material.