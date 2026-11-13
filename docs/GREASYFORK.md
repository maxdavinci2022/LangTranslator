# Greasy Fork listing

**Name:** LangTranslator — Page & Selection Translator
**Additional name (ru):** LangTranslator — перевод страницы и выделенного текста
**License:** MIT
**Source:** https://github.com/maxdavinci2022/langtranslator

## Description (English)

Tap the circle — the page is translated. Hold it — the menu opens.

Select any text and the translation appears by itself in a resizable window. The target
language defaults to your browser language, the source is detected automatically. Inside
input fields the hotkey replaces the selected sentence in place, undo still works.

- Tap = translate page, hold or the `⋯` badge = menu, drag = move the button
- Resizable result window: drag the corner, double-click to reset
- Read aloud: system voice / engine, speed 0.5x–2x, pitch, volume, Test and Stop, applied live
- Vector SVG icons — no emoji fonts, no missing-glyph boxes
- Opacity affects the button only; the menu is always fully opaque
- Menu theme: Dark or Light, neutral graphite and white
- Interface follows the browser language: English, Русский, 中文, Deutsch, Français, Español
- 82 target languages, auto-detection of the source
- Settings export and import as JSON
- Hotkeys Alt+Z / Alt+X / Alt+C, all rebindable
- Per-domain auto-translate and disable lists
- Three endpoints with fallback, batching and caching, plus diagnostics

No accounts, no analytics. Only the text you translate leaves the device. Speech uses the
browser engine; voices marked `cloud` are processed by your OS vendor.

## Description (Russian)

Тап по кружку — страница переведена. Удержание — открылось меню.

Выделите текст — перевод сам появится в окне с изменяемым размером. Язык перевода по
умолчанию берётся из браузера, исходный определяется автоматически. В полях ввода горячая
клавиша заменяет выделенное предложение на месте, отмена работает.

- Тап = перевод страницы, удержание или значок `⋯` = меню, перетаскивание = перемещение
- Окно результата тянется за уголок, двойной клик — сброс
- Озвучивание: голос / движок системы, скорость 0,5×–2×, тон, громкость, «Проверить» и «Остановить», применяются сразу
- Векторные SVG-иконки — без эмодзи-шрифтов и «квадратиков»
- Прозрачность только у кнопки; меню всегда непрозрачное
- Тема меню: тёмная или светлая, нейтральный графит и белый
- Интерфейс по языку браузера: English, Русский, 中文, Deutsch, Français, Español
- 82 языка перевода, автоопределение исходного
- Экспорт и импорт настроек в JSON
- Хоткеи Alt+Z / Alt+X / Alt+C с переназначением
- Списки автоперевода и отключения по доменам
- Три сервиса с резервом, пакетами и кэшем, диагностика

Без регистрации и аналитики. Наружу уходит только переводимый текст. Озвучивание идёт через
движок браузера; голоса с пометкой `cloud` обрабатываются поставщиком ОС.

## Notes

Publish readable, unminified code. Keep `@version` identical in the script and the meta file.
