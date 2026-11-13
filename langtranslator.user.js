// ==UserScript==
// @name         LangTranslator — Page & Selection Translator
// @name:ru      LangTranslator — перевод страницы и выделенного текста
// @name:zh      LangTranslator — 网页与划词翻译
// @name:de      LangTranslator — Seiten- und Auswahlübersetzer
// @name:fr      LangTranslator — traducteur de page et de sélection
// @name:es      LangTranslator — traductor de página y selección
// @namespace    https://github.com/maxdavinci2022/langtranslator
// @version      1.0.0
// @description  Tap the round button to translate the page, hold it to open the menu. Auto-translate selection in a resizable window, replace text inside input fields, read aloud with voice, speed, pitch and volume control. Six interface languages, dark and light menu, import and export of settings.
// @description:ru Тап по круглой кнопке переводит страницу, удержание открывает меню. Автоперевод выделения в окне с изменяемым размером, замена текста в полях ввода, озвучивание с выбором голоса, скорости, тона и громкости. Шесть языков интерфейса, тёмное и светлое меню, импорт и экспорт настроек.
// @description:zh 点击圆钮翻译整页，长按打开菜单。划词自动翻译窗口可调整大小，替换输入框文字，朗读可选择语音、语速、音调和音量。六种界面语言，深浅色菜单，设置导入导出。
// @description:de Tippen übersetzt die Seite, Halten öffnet das Menü. Auswahlübersetzung in einem größenveränderbaren Fenster, Text in Eingabefeldern ersetzen, Vorlesen mit Stimme, Geschwindigkeit, Tonhöhe und Lautstärke. Sechs Oberflächensprachen, dunkles und helles Menü, Import und Export.
// @description:fr Un appui traduit la page, un appui long ouvre le menu. Traduction de la sélection dans une fenêtre redimensionnable, remplacement dans les champs, lecture vocale avec voix, vitesse, tonalité et volume. Six langues d’interface, menu sombre ou clair, import et export.
// @description:es Un toque traduce la página, mantenerlo abre el menú. Traducción de la selección en una ventana redimensionable, reemplazo en campos, lectura en voz alta con voz, velocidad, tono y volumen. Seis idiomas de interfaz, menú oscuro o claro, importación y exportación.
// @author       maxdavinci
// @license      MIT
// @homepageURL  https://github.com/maxdavinci2022/langtranslator
// @supportURL   https://github.com/maxdavinci2022/langtranslator/issues
// @downloadURL  https://raw.githubusercontent.com/maxdavinci2022/langtranslator/main/langtranslator.user.js
// @updateURL    https://raw.githubusercontent.com/maxdavinci2022/langtranslator/main/langtranslator.meta.js
// @icon         https://raw.githubusercontent.com/maxdavinci2022/langtranslator/main/assets/icon.svg
// @match        *://*/*
// @run-at       document-idle
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      translate.googleapis.com
// @connect      translate.google.com
// @connect      api.mymemory.translated.net
// ==/UserScript==

(function () {
    'use strict';
    if (window.top !== window.self) return;
    if (window.__langTranslatorLoaded) return;
    window.__langTranslatorLoaded = true;

    const VERSION = '1.0.0';
    const KEY = 'langtranslator.settings.v1';
    const NL = String.fromCharCode(10);
    const NS = 'http://www.w3.org/2000/svg';
    const HOLD_MS = 480;
    const UI_LOCALES = ['en', 'ru', 'zh', 'de', 'fr', 'es'];

    const EDGE = 5;
    const FAB_RIGHT = 8;
    const FAB_BOTTOM = 48;
    const NARROW = 640;
    const BUB_MIN_W = 240, BUB_MIN_H = 120;
    const BUB_MAX_W = 900, BUB_MAX_H = 760;
    const BUB_DEF_W = 360, BUB_DEF_H = 200;

    const LANGS = [
        'en', 'ru', 'zh-CN', 'zh-TW', 'de', 'fr', 'es', 'pt', 'it', 'ja', 'ko', 'ar', 'hi', 'tr',
        'uk', 'pl', 'nl', 'sv', 'da', 'fi', 'no', 'is', 'et', 'lv', 'lt', 'cs', 'sk', 'sl', 'hr',
        'sr', 'bs', 'mk', 'bg', 'ro', 'hu', 'el', 'he', 'fa', 'ur', 'bn', 'pa', 'ta', 'te', 'ml',
        'kn', 'mr', 'gu', 'si', 'ne', 'th', 'vi', 'id', 'ms', 'fil', 'jv', 'my', 'km', 'lo',
        'kk', 'ky', 'uz', 'tg', 'az', 'hy', 'ka', 'be', 'sq', 'eu', 'ca', 'gl', 'mt', 'cy', 'ga',
        'sw', 'af', 'am', 'ha', 'yo', 'zu', 'la', 'eo'
    ];

    /* i18n:start */
    const UI_NAMES = { en: 'English', ru: 'Русский', zh: '中文', de: 'Deutsch', fr: 'Français', es: 'Español' };

    const LOCALES = {
        en: {
            tagline: 'Tap: page · Hold: menu', menu: 'Menu', page: 'Translate page', restore: 'Original',
            selection: 'Selection', settings: 'Settings', from: 'From', to: 'To',
            autoBrowser: 'Auto · browser language', autoDetect: 'Auto-detect', swap: 'Swap languages',
            autoSel: 'Auto-translate selection', dynamic: 'Translate new content', bubble: 'Result window',
            size: 'Button size', opacity: 'Button opacity', theme: 'Menu theme', themeDark: 'Dark', themeLight: 'Light',
            copy: 'Copy', copied: 'Copied', speak: 'Read aloud', stop: 'Stop', replace: 'Replace in field',
            voice: 'Read aloud', engine: 'Voice / engine', voiceAuto: 'Auto · by text language',
            noVoices: 'No voices installed in the system', refreshVoices: 'Refresh the voice list',
            rate: 'Speed', pitch: 'Pitch', volume: 'Volume', test: 'Test', resetVoice: 'Reset voice settings',
            ttsSample: 'This is how the translation will sound.',
            ttsUnavailable: 'Read aloud is unavailable in this browser. The button was removed.',
            close: 'Close', save: 'Save', cancel: 'Cancel', reset: 'Reset all', resetAsk: 'Reset every setting to defaults?',
            exportS: 'Export', importS: 'Import', download: 'Download JSON', upload: 'Load file', copyJson: 'Copy JSON',
            pasteJson: 'Paste settings JSON here', apply: 'Apply', imported: 'Settings saved', importBad: 'Invalid settings data',
            exported: 'Settings exported', resetDone: 'Settings reset',
            hotkeys: 'Hotkeys', hkPage: 'Page', hkSel: 'Selection / field', hkMenu: 'Menu', press: 'Press keys…',
            autoSites: 'Auto-translate these domains', blocked: 'Disabled on these domains',
            addSite: '+ Current domain', perLine: 'One domain per line',
            service: 'Service', serviceAuto: 'Auto (with fallback)', diag: 'Diagnostics',
            busy: 'Translating…', pageDone: 'Page translated', restored: 'Original restored',
            noText: 'Select text or focus an input field', failed: 'Translation failed',
            uiLang: 'Interface language', srcPh: 'Type or select text…', resPh: 'Translation appears here',
            help: 'Select text to translate instantly. In input fields the hotkey replaces it in place.',
            menuToggle: 'Show / hide button',
            resize: 'Drag to resize · double-click to reset', detected: 'Detected'
        },
        ru: {
            tagline: 'Тап: страница · Удержание: меню', menu: 'Меню', page: 'Перевести страницу', restore: 'Оригинал',
            selection: 'Выделенное', settings: 'Настройки', from: 'С языка', to: 'На язык',
            autoBrowser: 'Авто · язык браузера', autoDetect: 'Автоопределение', swap: 'Поменять языки',
            autoSel: 'Автоперевод выделения', dynamic: 'Переводить новый контент', bubble: 'Окно результата',
            size: 'Размер кнопки', opacity: 'Прозрачность кнопки', theme: 'Тема меню', themeDark: 'Тёмная', themeLight: 'Светлая',
            copy: 'Копировать', copied: 'Скопировано', speak: 'Прочитать вслух', stop: 'Остановить', replace: 'Заменить в поле',
            voice: 'Озвучивание', engine: 'Голос / движок', voiceAuto: 'Авто · по языку текста',
            noVoices: 'В системе не установлено ни одного голоса', refreshVoices: 'Обновить список голосов',
            rate: 'Скорость', pitch: 'Тон', volume: 'Громкость', test: 'Проверить', resetVoice: 'Сбросить настройки озвучивания',
            ttsSample: 'Так будет звучать перевод.',
            ttsUnavailable: 'Озвучивание недоступно в этом браузере. Кнопка удалена.',
            close: 'Закрыть', save: 'Сохранить', cancel: 'Отмена', reset: 'Сбросить всё', resetAsk: 'Вернуть все настройки по умолчанию?',
            exportS: 'Экспорт', importS: 'Импорт', download: 'Скачать JSON', upload: 'Загрузить файл', copyJson: 'Копировать JSON',
            pasteJson: 'Вставьте JSON настроек сюда', apply: 'Применить', imported: 'Настройки сохранены', importBad: 'Некорректные данные настроек',
            exported: 'Настройки экспортированы', resetDone: 'Настройки сброшены',
            hotkeys: 'Горячие клавиши', hkPage: 'Страница', hkSel: 'Выделение / поле', hkMenu: 'Меню', press: 'Нажмите клавиши…',
            autoSites: 'Автоперевод этих доменов', blocked: 'Отключено на этих доменах',
            addSite: '+ Текущий домен', perLine: 'Один домен в строке',
            service: 'Сервис', serviceAuto: 'Авто (с резервом)', diag: 'Диагностика',
            busy: 'Перевожу…', pageDone: 'Страница переведена', restored: 'Оригинал возвращён',
            noText: 'Выделите текст или поставьте курсор в поле ввода', failed: 'Не удалось перевести',
            uiLang: 'Язык интерфейса', srcPh: 'Введите или выделите текст…', resPh: 'Здесь появится перевод',
            help: 'Выделите текст — перевод появится сразу. В полях ввода горячая клавиша заменяет его на месте.',
            menuToggle: 'Показать / скрыть кнопку',
            resize: 'Тяните за уголок · двойной клик — сброс', detected: 'Определён'
        },
        zh: {
            tagline: '点击：整页 · 长按：菜单', menu: '菜单', page: '翻译整页', restore: '原文',
            selection: '划词', settings: '设置', from: '源语言', to: '目标语言',
            autoBrowser: '自动 · 浏览器语言', autoDetect: '自动检测', swap: '交换语言',
            autoSel: '划词自动翻译', dynamic: '翻译新增内容', bubble: '结果窗口',
            size: '按钮大小', opacity: '按钮透明度', theme: '菜单主题', themeDark: '深色', themeLight: '浅色',
            copy: '复制', copied: '已复制', speak: '朗读', stop: '停止', replace: '替换输入框',
            voice: '朗读', engine: '语音 / 引擎', voiceAuto: '自动 · 按文本语言',
            noVoices: '系统中未安装语音', refreshVoices: '刷新语音列表',
            rate: '语速', pitch: '音调', volume: '音量', test: '试听', resetVoice: '重置朗读设置',
            ttsSample: '译文将这样朗读。',
            ttsUnavailable: '此浏览器不支持朗读，按钮已移除。',
            close: '关闭', save: '保存', cancel: '取消', reset: '全部重置', resetAsk: '将所有设置恢复默认？',
            exportS: '导出', importS: '导入', download: '下载 JSON', upload: '选择文件', copyJson: '复制 JSON',
            pasteJson: '在此粘贴设置 JSON', apply: '应用', imported: '设置已保存', importBad: '设置数据无效',
            exported: '设置已导出', resetDone: '设置已重置',
            hotkeys: '快捷键', hkPage: '整页', hkSel: '划词 / 输入框', hkMenu: '菜单', press: '请按键…',
            autoSites: '自动翻译这些域名', blocked: '在这些域名禁用',
            addSite: '+ 当前域名', perLine: '每行一个域名',
            service: '翻译服务', serviceAuto: '自动（含备用）', diag: '诊断',
            busy: '翻译中…', pageDone: '整页已翻译', restored: '已恢复原文',
            noText: '请选中文本或将光标置于输入框', failed: '翻译失败',
            uiLang: '界面语言', srcPh: '输入或选中文本…', resPh: '译文显示在此',
            help: '选中文本即刻翻译。在输入框中按快捷键可直接替换。',
            menuToggle: '显示 / 隐藏按钮',
            resize: '拖动调整大小 · 双击重置', detected: '已识别'
        },
        de: {
            tagline: 'Tippen: Seite · Halten: Menü', menu: 'Menü', page: 'Seite übersetzen', restore: 'Original',
            selection: 'Auswahl', settings: 'Einstellungen', from: 'Von', to: 'Nach',
            autoBrowser: 'Auto · Browsersprache', autoDetect: 'Automatisch erkennen', swap: 'Sprachen tauschen',
            autoSel: 'Auswahl automatisch übersetzen', dynamic: 'Neue Inhalte übersetzen', bubble: 'Ergebnisfenster',
            size: 'Knopfgröße', opacity: 'Knopf-Deckkraft', theme: 'Menüdesign', themeDark: 'Dunkel', themeLight: 'Hell',
            copy: 'Kopieren', copied: 'Kopiert', speak: 'Vorlesen', stop: 'Stopp', replace: 'Im Feld ersetzen',
            voice: 'Vorlesen', engine: 'Stimme / Engine', voiceAuto: 'Auto · nach Textsprache',
            noVoices: 'Keine Stimmen im System installiert', refreshVoices: 'Stimmenliste aktualisieren',
            rate: 'Tempo', pitch: 'Tonhöhe', volume: 'Lautstärke', test: 'Test', resetVoice: 'Vorlese-Einstellungen zurücksetzen',
            ttsSample: 'So klingt die Übersetzung.',
            ttsUnavailable: 'Vorlesen ist in diesem Browser nicht verfügbar. Die Schaltfläche wurde entfernt.',
            close: 'Schließen', save: 'Speichern', cancel: 'Abbrechen', reset: 'Alles zurücksetzen', resetAsk: 'Alle Einstellungen zurücksetzen?',
            exportS: 'Export', importS: 'Import', download: 'JSON herunterladen', upload: 'Datei laden', copyJson: 'JSON kopieren',
            pasteJson: 'Einstellungs-JSON hier einfügen', apply: 'Anwenden', imported: 'Einstellungen gespeichert', importBad: 'Ungültige Einstellungsdaten',
            exported: 'Einstellungen exportiert', resetDone: 'Einstellungen zurückgesetzt',
            hotkeys: 'Tastenkürzel', hkPage: 'Seite', hkSel: 'Auswahl / Feld', hkMenu: 'Menü', press: 'Tasten drücken…',
            autoSites: 'Diese Domains automatisch übersetzen', blocked: 'Auf diesen Domains deaktiviert',
            addSite: '+ Aktuelle Domain', perLine: 'Eine Domain pro Zeile',
            service: 'Dienst', serviceAuto: 'Auto (mit Ersatz)', diag: 'Diagnose',
            busy: 'Übersetze…', pageDone: 'Seite übersetzt', restored: 'Original wiederhergestellt',
            noText: 'Text markieren oder Eingabefeld fokussieren', failed: 'Übersetzung fehlgeschlagen',
            uiLang: 'Oberflächensprache', srcPh: 'Text eingeben oder markieren…', resPh: 'Übersetzung erscheint hier',
            help: 'Text markieren — sofortige Übersetzung. In Eingabefeldern ersetzt das Kürzel den Text direkt.',
            menuToggle: 'Knopf ein-/ausblenden',
            resize: 'Ziehen zum Skalieren · Doppelklick setzt zurück', detected: 'Erkannt'
        },
        fr: {
            tagline: 'Appui : page · Maintien : menu', menu: 'Menu', page: 'Traduire la page', restore: 'Original',
            selection: 'Sélection', settings: 'Réglages', from: 'Depuis', to: 'Vers',
            autoBrowser: 'Auto · langue du navigateur', autoDetect: 'Détection auto', swap: 'Inverser les langues',
            autoSel: 'Traduire la sélection automatiquement', dynamic: 'Traduire le nouveau contenu', bubble: 'Fenêtre de résultat',
            size: 'Taille du bouton', opacity: 'Opacité du bouton', theme: 'Thème du menu', themeDark: 'Sombre', themeLight: 'Clair',
            copy: 'Copier', copied: 'Copié', speak: 'Lire à voix haute', stop: 'Arrêter', replace: 'Remplacer dans le champ',
            voice: 'Lecture vocale', engine: 'Voix / moteur', voiceAuto: 'Auto · selon la langue du texte',
            noVoices: 'Aucune voix installée dans le système', refreshVoices: 'Actualiser la liste des voix',
            rate: 'Vitesse', pitch: 'Tonalité', volume: 'Volume', test: 'Tester', resetVoice: 'Réinitialiser la lecture vocale',
            ttsSample: 'Voici comment la traduction sera lue.',
            ttsUnavailable: 'La lecture vocale est indisponible dans ce navigateur. Le bouton a été supprimé.',
            close: 'Fermer', save: 'Enregistrer', cancel: 'Annuler', reset: 'Tout réinitialiser', resetAsk: 'Réinitialiser tous les réglages ?',
            exportS: 'Exporter', importS: 'Importer', download: 'Télécharger le JSON', upload: 'Charger un fichier', copyJson: 'Copier le JSON',
            pasteJson: 'Collez le JSON des réglages ici', apply: 'Appliquer', imported: 'Réglages enregistrés', importBad: 'Données de réglages invalides',
            exported: 'Réglages exportés', resetDone: 'Réglages réinitialisés',
            hotkeys: 'Raccourcis', hkPage: 'Page', hkSel: 'Sélection / champ', hkMenu: 'Menu', press: 'Appuyez sur les touches…',
            autoSites: 'Traduire automatiquement ces domaines', blocked: 'Désactivé sur ces domaines',
            addSite: '+ Domaine actuel', perLine: 'Un domaine par ligne',
            service: 'Service', serviceAuto: 'Auto (avec secours)', diag: 'Diagnostic',
            busy: 'Traduction…', pageDone: 'Page traduite', restored: 'Original restauré',
            noText: 'Sélectionnez du texte ou placez le curseur dans un champ', failed: 'Échec de la traduction',
            uiLang: 'Langue de l’interface', srcPh: 'Saisissez ou sélectionnez du texte…', resPh: 'La traduction apparaît ici',
            help: 'Sélectionnez du texte pour le traduire aussitôt. Dans un champ, le raccourci le remplace sur place.',
            menuToggle: 'Afficher / masquer le bouton',
            resize: 'Glissez pour redimensionner · double-clic réinitialise', detected: 'Détecté'
        },
        es: {
            tagline: 'Toque: página · Mantener: menú', menu: 'Menú', page: 'Traducir página', restore: 'Original',
            selection: 'Selección', settings: 'Ajustes', from: 'De', to: 'A',
            autoBrowser: 'Auto · idioma del navegador', autoDetect: 'Detección automática', swap: 'Intercambiar idiomas',
            autoSel: 'Traducir la selección automáticamente', dynamic: 'Traducir contenido nuevo', bubble: 'Ventana de resultado',
            size: 'Tamaño del botón', opacity: 'Opacidad del botón', theme: 'Tema del menú', themeDark: 'Oscuro', themeLight: 'Claro',
            copy: 'Copiar', copied: 'Copiado', speak: 'Leer en voz alta', stop: 'Detener', replace: 'Reemplazar en el campo',
            voice: 'Lectura en voz alta', engine: 'Voz / motor', voiceAuto: 'Auto · según el idioma del texto',
            noVoices: 'No hay voces instaladas en el sistema', refreshVoices: 'Actualizar la lista de voces',
            rate: 'Velocidad', pitch: 'Tono', volume: 'Volumen', test: 'Probar', resetVoice: 'Restablecer la lectura en voz alta',
            ttsSample: 'Así sonará la traducción.',
            ttsUnavailable: 'La lectura en voz alta no está disponible en este navegador. Se eliminó el botón.',
            close: 'Cerrar', save: 'Guardar', cancel: 'Cancelar', reset: 'Restablecer todo', resetAsk: '¿Restablecer todos los ajustes?',
            exportS: 'Exportar', importS: 'Importar', download: 'Descargar JSON', upload: 'Cargar archivo', copyJson: 'Copiar JSON',
            pasteJson: 'Pegue aquí el JSON de ajustes', apply: 'Aplicar', imported: 'Ajustes guardados', importBad: 'Datos de ajustes no válidos',
            exported: 'Ajustes exportados', resetDone: 'Ajustes restablecidos',
            hotkeys: 'Atajos', hkPage: 'Página', hkSel: 'Selección / campo', hkMenu: 'Menú', press: 'Pulse las teclas…',
            autoSites: 'Traducir automáticamente estos dominios', blocked: 'Desactivado en estos dominios',
            addSite: '+ Dominio actual', perLine: 'Un dominio por línea',
            service: 'Servicio', serviceAuto: 'Auto (con respaldo)', diag: 'Diagnóstico',
            busy: 'Traduciendo…', pageDone: 'Página traducida', restored: 'Original restaurado',
            noText: 'Seleccione texto o sitúe el cursor en un campo', failed: 'Error de traducción',
            uiLang: 'Idioma de la interfaz', srcPh: 'Escriba o seleccione texto…', resPh: 'La traducción aparece aquí',
            help: 'Seleccione texto para traducirlo al instante. En los campos, el atajo lo reemplaza en el sitio.',
            menuToggle: 'Mostrar / ocultar botón',
            resize: 'Arrastre para redimensionar · doble clic restablece', detected: 'Detectado'
        }
    };
    /* i18n:end */

    const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
    const base = c => String(c || '').toLowerCase().split('-')[0];
    const cleanDomain = s => String(s || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function norm(c) {
        const s = String(c || '');
        if (s === 'iw') return 'he';
        if (s === 'tl') return 'fil';
        if (/^zh/i.test(s)) return /TW|HK|Hant/i.test(s) ? 'zh-TW' : 'zh-CN';
        return s;
    }

    function h(tag, props) {
        const el = document.createElement(tag);
        if (props) Object.keys(props).forEach(k => {
            const v = props[k];
            if (v === null || v === undefined || v === false) return;
            if (k === 'class') el.className = v;
            else if (k === 'text') el.textContent = v;
            else if (k === 'style') el.style.cssText = v;
            else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
            else el.setAttribute(k, v === true ? '' : String(v));
        });
        for (let i = 2; i < arguments.length; i++) {
            const kid = arguments[i];
            if (kid === null || kid === undefined || kid === false) continue;
            if (Array.isArray(kid)) { kid.forEach(x => { if (x) el.appendChild(x); }); continue; }
            el.appendChild(kid.nodeType ? kid : document.createTextNode(String(kid)));
        }
        return el;
    }

    function clearEl(el) { while (el.firstChild) el.removeChild(el.firstChild); }
    function debounce(fn, ms) { let id = null; return function () { clearTimeout(id); id = setTimeout(fn, ms); }; }

    /* Vector icons: no emoji fonts required, identical on every platform */
    const ICON_PATHS = {
        speaker: ['M11 5 6 9H2v6h4l5 4V5z', 'M15.4 8.6a5 5 0 0 1 0 6.8', 'M18.4 5.6a9 9 0 0 1 0 12.8'],
        mute: ['M11 5 6 9H2v6h4l5 4V5z', 'M22 9l-6 6', 'M16 9l6 6'],
        stop: ['M6.5 6.5h11v11h-11z'],
        play: ['M8 5.2 19 12 8 18.8V5.2z'],
        close: ['M18 6 6 18', 'M6 6l12 12'],
        check: ['M20 6.5 9.2 17.3 4 12.1'],
        dots: ['M5 12h.01', 'M12 12h.01', 'M19 12h.01'],
        swap: ['M4 9h14', 'M15 6l3 3-3 3', 'M20 15H6', 'M9 12l-3 3 3 3'],
        copy: ['M8.5 8.5h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1z',
            'M4.5 15.5a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1'],
        sun: ['M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z',
            'M12 1.5v2.2', 'M12 20.3v2.2', 'M4.2 4.2l1.6 1.6', 'M18.2 18.2l1.6 1.6',
            'M1.5 12h2.2', 'M20.3 12h2.2', 'M4.2 19.8l1.6-1.6', 'M18.2 5.8l1.6-1.6'],
        moon: ['M21 12.9A9 9 0 1 1 11.1 3a7 7 0 0 0 9.9 9.9z'],
        reset: ['M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3 8.6', 'M3 3.4v5.4h5.4'],
        download: ['M12 3.5v11', 'M7.5 10l4.5 4.5 4.5-4.5', 'M4 20.5h16'],
        upload: ['M12 20.5v-11', 'M7.5 14l4.5-4.5 4.5 4.5', 'M4 3.5h16'],
        edit: ['M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z', 'M13.5 6.5l4 4']
    };
    const SOLID_ICONS = { stop: true, play: true };

    function ico(name, size) {
        const svg = document.createElementNS(NS, 'svg');
        const px = size || 15;
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', String(px));
        svg.setAttribute('height', String(px));
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('class', 'ico' + (SOLID_ICONS[name] ? ' solid' : '') + (name === 'dots' ? ' dots' : ''));
        (ICON_PATHS[name] || []).forEach(d => {
            const p = document.createElementNS(NS, 'path');
            p.setAttribute('d', d);
            svg.appendChild(p);
        });
        return svg;
    }

    function iconBtn(cls, name, label, size) {
        const b = h('button', { class: cls, type: 'button', title: label || '', 'aria-label': label || '' });
        b.appendChild(ico(name, size || 15));
        if (label && cls.indexOf('with-text') >= 0) b.appendChild(h('span', { text: label }));
        return b;
    }

    function copyText(text) {
        if (!text) return;
        const fallback = () => {
            const ta = h('textarea', { style: 'position:fixed;left:-9999px;top:0;opacity:0;' });
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch (e) { /* ignore */ }
            ta.remove();
        };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(fallback);
        else fallback();
    }

    const DEFAULTS = {
        v: 1, ui: 'auto', source: 'auto', target: 'auto', reverse: 'en',
        autoSel: true, bubble: true, dynamic: true,
        size: 46, opacity: 90, theme: 'dark', pos: null, bubSize: null,
        autoSites: [], blocked: [], provider: 'auto',
        tts: { voice: '', rate: 1, pitch: 1, volume: 1 },
        hk: {
            page: { code: 'KeyZ', alt: true, ctrl: false, shift: false },
            sel: { code: 'KeyX', alt: true, ctrl: false, shift: false },
            menu: { code: 'KeyC', alt: true, ctrl: false, shift: false }
        }
    };

    const Store = {
        read() {
            try {
                if (typeof GM_getValue === 'function') {
                    const v = GM_getValue(KEY, null);
                    return typeof v === 'string' ? JSON.parse(v) : v;
                }
            } catch (e) { /* ignore */ }
            try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
        },
        write(v) {
            try { if (typeof GM_setValue === 'function') { GM_setValue(KEY, v); return; } } catch (e) { /* ignore */ }
            try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* ignore */ }
        }
    };

    function sanitize(raw) {
        const s = JSON.parse(JSON.stringify(DEFAULTS));
        if (!raw || typeof raw !== 'object') return s;
        const pick = (k, list) => { if (typeof raw[k] === 'string' && list.indexOf(raw[k]) >= 0) s[k] = raw[k]; };
        pick('ui', ['auto'].concat(UI_LOCALES));
        pick('source', ['auto'].concat(LANGS));
        pick('target', ['auto'].concat(LANGS));
        pick('reverse', LANGS);
        pick('theme', ['dark', 'light']);
        pick('provider', ['auto', 'g1', 'g2', 'mm']);
        ['autoSel', 'bubble', 'dynamic'].forEach(k => { if (typeof raw[k] === 'boolean') s[k] = raw[k]; });
        if (typeof raw.size === 'number' && isFinite(raw.size)) s.size = clamp(Math.round(raw.size), 34, 64);
        if (typeof raw.opacity === 'number' && isFinite(raw.opacity)) s.opacity = clamp(Math.round(raw.opacity), 30, 100);
        ['autoSites', 'blocked'].forEach(k => {
            if (Array.isArray(raw[k])) s[k] = raw[k].map(cleanDomain).filter(Boolean).slice(0, 500);
        });
        if (raw.pos && typeof raw.pos.x === 'number' && typeof raw.pos.y === 'number') {
            s.pos = { x: Math.round(raw.pos.x), y: Math.round(raw.pos.y) };
        }
        if (raw.bubSize && typeof raw.bubSize.w === 'number' && typeof raw.bubSize.h === 'number') {
            s.bubSize = {
                w: clamp(Math.round(raw.bubSize.w), BUB_MIN_W, BUB_MAX_W),
                h: clamp(Math.round(raw.bubSize.h), BUB_MIN_H, BUB_MAX_H)
            };
        }
        if (raw.tts && typeof raw.tts === 'object') {
            if (typeof raw.tts.voice === 'string') s.tts.voice = raw.tts.voice.slice(0, 240);
            if (typeof raw.tts.rate === 'number' && isFinite(raw.tts.rate)) s.tts.rate = clamp(raw.tts.rate, 0.5, 2);
            if (typeof raw.tts.pitch === 'number' && isFinite(raw.tts.pitch)) s.tts.pitch = clamp(raw.tts.pitch, 0, 2);
            if (typeof raw.tts.volume === 'number' && isFinite(raw.tts.volume)) s.tts.volume = clamp(raw.tts.volume, 0, 1);
        }
        if (raw.hk && typeof raw.hk === 'object') ['page', 'sel', 'menu'].forEach(k => {
            const v = raw.hk[k];
            if (v && typeof v.code === 'string' && v.code.length < 24) {
                s.hk[k] = { code: v.code, alt: !!v.alt, ctrl: !!v.ctrl, shift: !!v.shift };
            }
        });
        return s;
    }

    let S = sanitize(Store.read());
    const save = () => Store.write(S);

    function navLocales() {
        const out = [];
        const push = v => { if (v && typeof v === 'string' && out.indexOf(v) < 0) out.push(v); };
        try { (navigator.languages || []).forEach(push); } catch (e) { /* ignore */ }
        try { push(navigator.language); } catch (e) { /* ignore */ }
        try { push(navigator.userLanguage); } catch (e) { /* ignore */ }
        return out;
    }

    function systemLocale() {
        const probes = [];
        try { probes.push(Intl.DateTimeFormat().resolvedOptions().locale); } catch (e) { /* ignore */ }
        try { probes.push(Intl.NumberFormat().resolvedOptions().locale); } catch (e) { /* ignore */ }
        try { probes.push(Intl.PluralRules().resolvedOptions().locale); } catch (e) { /* ignore */ }
        try { probes.push(Intl.Collator().resolvedOptions().locale); } catch (e) { /* ignore */ }
        for (let i = 0; i < probes.length; i++) if (probes[i]) return String(probes[i]);
        return '';
    }

    function supportedLocale(code) {
        const b = base(code);
        return UI_LOCALES.indexOf(b) >= 0 ? b : null;
    }

    function resolveUI() {
        if (S.ui !== 'auto' && UI_LOCALES.indexOf(S.ui) >= 0) return S.ui;
        const list = navLocales();
        let first = null;
        for (let i = 0; i < list.length; i++) {
            const s = supportedLocale(list[i]);
            if (s) { first = s; break; }
        }
        if (first && first !== 'en') return first;
        const sys = supportedLocale(systemLocale());
        if (sys) return sys;
        return first || 'en';
    }

    let UI = 'en';
    const t = k => (LOCALES[UI] && LOCALES[UI][k]) || LOCALES.en[k] || k;

    function langName(code) {
        try {
            const n = new Intl.DisplayNames([UI], { type: 'language' }).of(code);
            if (n && n !== code) return n.charAt(0).toUpperCase() + n.slice(1);
        } catch (e) { /* ignore */ }
        return code;
    }

    function browserTarget() {
        const list = navLocales();
        for (let i = 0; i < list.length; i++) {
            const n = norm(list[i]);
            if (LANGS.indexOf(n) >= 0) return n;
            if (LANGS.indexOf(base(n)) >= 0) return base(n);
        }
        const sys = norm(systemLocale());
        if (LANGS.indexOf(sys) >= 0) return sys;
        if (LANGS.indexOf(base(sys)) >= 0) return base(sys);
        return 'en';
    }
    const targetLang = () => (S.target === 'auto' ? browserTarget() : S.target);
    const sameLang = (a, b) => base(norm(a)) === base(norm(b));

    const hkText = k => {
        const p = [];
        if (k.ctrl) p.push('Ctrl');
        if (k.alt) p.push('Alt');
        if (k.shift) p.push('Shift');
        p.push(String(k.code).replace(/^Key/, '').replace(/^Digit/, ''));
        return p.join('+');
    };

    const SCRIPTS = [
        ['ja', /[\u3040-\u30FF]/], ['ko', /[\uAC00-\uD7AF\u1100-\u11FF]/], ['zh-CN', /[\u4E00-\u9FFF]/],
        ['he', /[\u0590-\u05FF]/], ['ar', /[\u0600-\u06FF\u0750-\u077F]/], ['el', /[\u0370-\u03FF]/],
        ['th', /[\u0E00-\u0E7F]/], ['hi', /[\u0900-\u097F]/], ['bn', /[\u0980-\u09FF]/],
        ['ta', /[\u0B80-\u0BFF]/], ['te', /[\u0C00-\u0C7F]/], ['ml', /[\u0D00-\u0D7F]/],
        ['gu', /[\u0A80-\u0AFF]/], ['pa', /[\u0A00-\u0A7F]/], ['si', /[\u0D80-\u0DFF]/],
        ['my', /[\u1000-\u109F]/], ['km', /[\u1780-\u17FF]/], ['lo', /[\u0E80-\u0EFF]/],
        ['ka', /[\u10A0-\u10FF]/], ['hy', /[\u0530-\u058F]/]
    ];

    function detectLocal(text) {
        const s = String(text).slice(0, 600);
        for (let i = 0; i < SCRIPTS.length; i++) if (SCRIPTS[i][1].test(s)) return SCRIPTS[i][0];
        if (/[\u0400-\u04FF]/.test(s)) {
            if (/[іїєґ]/i.test(s)) return 'uk';
            if (/[әғқңөұүһ]/i.test(s)) return 'kk';
            if (/[ђјљњћџ]/i.test(s)) return 'sr';
            return 'ru';
        }
        return null;
    }

    let LETTERS;
    try { LETTERS = new RegExp(String.fromCharCode(92) + 'p{L}', 'u'); LETTERS.test('a'); }
    catch (e) { LETTERS = /[A-Za-z\u00C0-\u024F\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/; }

    const GMhttp = (typeof GM_xmlhttpRequest === 'function') ? GM_xmlhttpRequest
        : (typeof GM !== 'undefined' && GM && typeof GM.xmlHttpRequest === 'function') ? GM.xmlHttpRequest : null;

    function http(o) {
        return new Promise(resolve => {
            if (GMhttp) {
                try {
                    GMhttp({
                        method: o.method || 'GET', url: o.url, data: o.data, headers: o.headers || {},
                        timeout: 15000, anonymous: true,
                        onload: r => resolve({ status: r.status, text: r.responseText || '' }),
                        onerror: () => resolve({ status: 0, err: 'network' }),
                        ontimeout: () => resolve({ status: 0, err: 'timeout' })
                    });
                    return;
                } catch (e) { /* ignore */ }
            }
            fetch(o.url, { method: o.method || 'GET', body: o.data, headers: o.headers, credentials: 'omit' })
                .then(r => r.text().then(x => resolve({ status: r.status, text: x })))
                .catch(() => resolve({ status: 0, err: 'network/CORS' }));
        });
    }

    const PROVIDERS = [
        { id: 'g1', label: 'Google', kind: 'g', url: 'https://translate.googleapis.com/translate_a/single' },
        { id: 'g2', label: 'Google (alt)', kind: 'g', url: 'https://translate.google.com/translate_a/single' },
        { id: 'mm', label: 'MyMemory', kind: 'm', url: 'https://api.mymemory.translated.net/get' }
    ];
    let preferred = null;
    const cache = new Map();

    async function callProvider(p, text, sl, tl) {
        if (p.kind === 'g') {
            const q = encodeURIComponent(text);
            const url = p.url + '?client=gtx&sl=' + sl + '&tl=' + tl + '&dt=t&ie=UTF-8&oe=UTF-8';
            const r = q.length < 1800 ? await http({ url: url + '&q=' + q })
                : await http({
                    method: 'POST', url: url, data: 'q=' + q,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
                });
            if (r.status !== 200) throw new Error('HTTP ' + (r.status || r.err));
            const d = JSON.parse(r.text);
            if (!d || !Array.isArray(d[0])) throw new Error('bad payload');
            return { text: d[0].map(x => (x && x[0]) ? x[0] : '').join(''), lang: norm(d[2]) };
        }
        const from = sl === 'auto' ? (detectLocal(text) || 'en') : sl;
        const r = await http({ url: p.url + '?q=' + encodeURIComponent(text) + '&langpair=' + base(from) + '|' + tl });
        if (r.status !== 200) throw new Error('HTTP ' + (r.status || r.err));
        const d = JSON.parse(r.text);
        const out = d && d.responseData && d.responseData.translatedText;
        if (!out || /MYMEMORY WARNING/i.test(out)) throw new Error('daily limit');
        return { text: out, lang: from };
    }

    function providerOrder() {
        if (S.provider !== 'auto') {
            return PROVIDERS.filter(p => p.id === S.provider).concat(PROVIDERS.filter(p => p.id !== S.provider));
        }
        return preferred ? [preferred].concat(PROVIDERS.filter(p => p !== preferred)) : PROVIDERS.slice();
    }

    async function translate(text, sl, tl) {
        const key = sl + '>' + tl + ':' + text;
        if (cache.has(key)) return cache.get(key);
        let last = null;
        const order = providerOrder();
        for (let i = 0; i < order.length; i++) {
            for (let attempt = 0; attempt < 2; attempt++) {
                try {
                    const res = await callProvider(order[i], text, sl, tl);
                    preferred = order[i];
                    cache.set(key, res);
                    return res;
                } catch (e) {
                    last = new Error(order[i].label + ': ' + e.message);
                    if (/HTTP (429|5\d\d)/.test(e.message)) { await sleep(700 * (attempt + 1)); continue; }
                    break;
                }
            }
        }
        throw last || new Error('no service');
    }

    async function translateList(list, sl, tl) {
        if (list.length === 1) {
            try { return [(await translate(list[0], sl, tl)).text]; } catch (e) { return [null]; }
        }
        try {
            const parts = (await translate(list.join(NL), sl, tl)).text.split(NL).map(x => x.trim());
            if (parts.length === list.length && parts.every(Boolean)) return parts;
        } catch (e) { /* ignore */ }
        const out = [];
        for (let i = 0; i < list.length; i++) {
            try { out.push((await translate(list[i], sl, tl)).text); } catch (e) { out.push(null); }
        }
        return out;
    }

    async function smartTranslate(text) {
        const primary = targetLang();
        const local = detectLocal(text);
        let tl = (local && sameLang(local, primary)) ? S.reverse : primary;
        let res = await translate(text, S.source, tl);
        if (tl === primary && res.text.trim() === text.trim() && LETTERS.test(text)) {
            tl = S.reverse;
            res = await translate(text, 'auto', tl);
        }
        return { text: res.text, tl: tl, detected: res.lang || local || 'auto' };
    }

    /* Speech engine: voice list, rate, pitch and volume are user controlled */
    const TTS = (() => {
        const synth = window.speechSynthesis;
        const Utter = window.SpeechSynthesisUtterance;
        let dead = !synth || !Utter;
        let voices = [];
        let buttons = [];
        let subs = [];
        let session = 0;
        let speaking = false;
        let startTimer = null;
        let keepAlive = null;
        let current = null;

        function emit() { subs.forEach(f => { try { f(); } catch (e) { /* ignore */ } }); }

        function refresh(force) {
            if (dead) return;
            let list = [];
            try { list = synth.getVoices() || []; } catch (e) { list = []; }
            const changed = list.length !== voices.length;
            voices = list;
            if (changed || force) emit();
        }

        if (!dead) {
            refresh();
            try {
                if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', () => refresh(true));
                else synth.onvoiceschanged = () => refresh(true);
            } catch (e) { /* ignore */ }
            setTimeout(() => refresh(true), 600);
            setTimeout(() => refresh(true), 1800);
        }

        function sortedVoices() {
            const want = base(targetLang());
            return voices.slice().sort((a, b) => {
                const am = base(a.lang) === want ? 0 : 1;
                const bm = base(b.lang) === want ? 0 : 1;
                if (am !== bm) return am - bm;
                const al = a.localService ? 0 : 1;
                const bl = b.localService ? 0 : 1;
                if (al !== bl) return al - bl;
                const ax = String(a.lang) + String(a.name);
                const bx = String(b.lang) + String(b.name);
                return ax < bx ? -1 : (ax > bx ? 1 : 0);
            });
        }

        function pickVoice(lang) {
            if (!voices.length) return null;
            if (S.tts.voice) {
                const chosen = voices.filter(v => v.voiceURI === S.tts.voice)[0];
                if (chosen) return chosen;
            }
            const want = String(lang || '').toLowerCase();
            const wantBase = base(want);
            let best = null, bestScore = -1;
            voices.forEach(v => {
                const vl = String(v.lang || '').replace(/_/g, '-').toLowerCase();
                let score = 0;
                if (vl === want) score = 4;
                else if (base(vl) === wantBase) score = 3;
                else if (vl.indexOf(wantBase + '-') === 0) score = 2;
                if (v.localService) score += 0.5;
                if (score > bestScore) { best = v; bestScore = score; }
            });
            return bestScore > 0 ? best : null;
        }

        function chunk(text, max) {
            const words = String(text || '').replace(/\s+/g, ' ').trim().split(' ');
            const out = [];
            let cur = '';
            for (const w of words) {
                if (!w) continue;
                if (w.length > max) {
                    if (cur) { out.push(cur); cur = ''; }
                    for (let i = 0; i < w.length; i += max) out.push(w.slice(i, i + max));
                    continue;
                }
                const next = cur ? cur + ' ' + w : w;
                if (next.length > max) { out.push(cur); cur = w; }
                else cur = next;
            }
            if (cur) out.push(cur);
            return out;
        }

        function paint() {
            buttons = buttons.filter(b => b && b.isConnected);
            buttons.forEach(b => {
                clearEl(b);
                b.appendChild(ico(speaking ? 'stop' : 'speaker', 15));
                b.title = speaking ? t('stop') : t('speak');
                b.setAttribute('aria-label', speaking ? t('stop') : t('speak'));
                b.classList.toggle('speaking', speaking);
            });
            emit();
        }

        function clearTimers() {
            clearTimeout(startTimer); startTimer = null;
            clearInterval(keepAlive); keepAlive = null;
        }

        function stop() {
            session++;
            speaking = false;
            clearTimers();
            if (synth) { try { synth.cancel(); } catch (e) { /* ignore */ } }
            paint();
        }

        function disable() {
            dead = true;
            stop();
            const list = buttons.slice();
            buttons = [];
            list.forEach(b => { try { b.remove(); } catch (e) { /* ignore */ } });
            emit();
        }

        function fail() {
            const wasDead = dead;
            disable();
            if (!wasDead && ui) { try { notify(t('ttsUnavailable'), true); } catch (e) { /* ignore */ } }
        }

        function finish() {
            session++;
            speaking = false;
            clearTimers();
            paint();
        }

        function start(text, lang) {
            if (dead) return;
            text = String(text || '').trim();
            if (!text) return;
            current = { text: text, lang: lang };
            refresh();
            const parts = chunk(text, 180);
            if (!parts.length) return;
            const id = ++session;
            speaking = true;
            paint();
            let i = 0;
            const next = () => {
                if (id !== session) return;
                if (i >= parts.length) { finish(); return; }
                let u;
                try { u = new Utter(parts[i++]); } catch (e) { fail(); return; }
                u.lang = norm(lang) || 'en';
                const v = pickVoice(u.lang);
                if (v) { u.voice = v; u.lang = v.lang || u.lang; }
                u.rate = clamp(Number(S.tts.rate) || 1, 0.5, 2);
                u.pitch = clamp(Number(S.tts.pitch), 0, 2);
                u.volume = clamp(Number(S.tts.volume), 0, 1);
                u.onstart = () => { if (id === session && startTimer) { clearTimeout(startTimer); startTimer = null; } };
                u.onend = () => { if (id === session) next(); };
                u.onerror = () => { if (id === session) fail(); };
                try { synth.speak(u); } catch (e) { fail(); }
            };
            startTimer = setTimeout(() => {
                if (id === session && speaking && !synth.speaking && !synth.pending) fail();
            }, 3500);
            keepAlive = setInterval(() => {
                if (id === session && speaking) { try { synth.resume(); } catch (e) { /* ignore */ } }
            }, 10000);
            try { synth.cancel(); synth.resume(); } catch (e) { /* ignore */ }
            next();
        }

        function toggle(text, lang) {
            if (dead) return;
            if (speaking) { stop(); return; }
            start(text, lang);
        }

        function applyLive() {
            if (speaking && current) {
                const c = current;
                stop();
                start(c.text, c.lang);
            }
        }

        function attach(btn, getText, getLang) {
            if (!btn) return;
            if (dead) { try { btn.remove(); } catch (e) { /* ignore */ } return; }
            buttons.push(btn);
            btn.addEventListener('click', e => { e.stopPropagation(); toggle(getText(), getLang()); });
            paint();
        }

        function reset() {
            stop();
            buttons = [];
            subs = [];
        }

        return {
            attach: attach, reset: reset, stop: stop, start: start,
            applyLive: applyLive, refresh: refresh,
            available: () => !dead,
            isSpeaking: () => speaking,
            voices: sortedVoices,
            currentVoice: lang => pickVoice(lang),
            subscribe: f => { subs.push(f); }
        };
    })();

    const CSS = `
:host { all: initial; }
* { box-sizing: border-box; }
.lt {
  --fab:46px; --alpha:.9;
  --bg:#1A1B1E; --bg2:#232529; --bg3:#2A2D33; --line:#34373D;
  --fg:#ECEDEF; --mut:#9BA0A8; --acc:#4EC9B0; --accink:#08201C;
  --warn:#E0AF68; --bad:#E06C75;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  font-size: 13px; line-height: 1.45; color: var(--fg);
}
.lt.light {
  --bg:#FFFFFF; --bg2:#F5F6F8; --bg3:#EDEFF3; --line:#DCE0E6;
  --fg:#1B1D21; --mut:#5C626B; --acc:#0F8F7E; --accink:#FFFFFF;
}
.hide { display: none !important; }
.ico { display: block; flex: none; fill: none; stroke: currentColor; stroke-width: 1.9;
  stroke-linecap: round; stroke-linejoin: round; }
.ico.solid { fill: currentColor; stroke: none; }
.ico.dots { stroke-width: 3; }
.wrap { position: fixed; z-index: 2147483646; opacity: var(--alpha); touch-action: none;
  user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
.fab { width: var(--fab); height: var(--fab); border-radius: 50%; border: none; cursor: pointer;
  background: linear-gradient(140deg, #3DDC97, #4EC9B0 55%, #E0AF68); color: #08201C;
  font: inherit; font-weight: 800; font-size: calc(var(--fab) * .3); letter-spacing: .4px;
  display: flex; align-items: center; justify-content: center; padding: 0;
  box-shadow: 0 8px 24px rgba(0,0,0,.42); transition: transform .16s ease; }
.fab:hover { transform: scale(1.06); }
.fab.held { transform: scale(.9); }
.fab.drag { transform: scale(1.04); cursor: grabbing; }
.fab.on { background: linear-gradient(140deg, #4EC9B0, #3DDC97); }
.badge { position: absolute; right: -4px; bottom: -4px; width: calc(var(--fab) * .42); height: calc(var(--fab) * .42);
  min-width: 19px; min-height: 19px; border-radius: 50%; border: 1px solid var(--line);
  background: var(--bg); color: var(--fg); cursor: pointer; padding: 0;
  display: flex; align-items: center; justify-content: center; }
.card { position: fixed; z-index: 2147483647; width: 360px; max-width: calc(100vw - 10px);
  background: var(--bg); border: 1px solid var(--line); border-radius: 12px;
  box-shadow: 0 18px 48px rgba(0,0,0,.45); overflow: hidden; }
.head { display: flex; align-items: center; gap: 6px; padding: 5px 6px; border-bottom: 1px solid var(--line); background: var(--bg2); }
.brand { font-weight: 800; letter-spacing: .2px; }
.grow { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mut { color: var(--mut); font-size: 11px; }
.body { padding: 5px 6px; display: flex; flex-direction: column; gap: 8px; max-height: 74vh; overflow-y: auto; background: var(--bg); }
.row { display: flex; gap: 6px; align-items: center; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 10px; }
.sec { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700;
  letter-spacing: .5px; text-transform: uppercase; color: var(--acc); }
.tts { display: flex; flex-direction: column; gap: 7px; padding: 7px 8px;
  border: 1px solid var(--line); border-radius: 10px; background: var(--bg3); }
.srow { display: grid; grid-template-columns: 62px 1fr 46px; align-items: center; gap: 8px;
  font-size: 11px; color: var(--mut); }
.val { text-align: right; color: var(--fg); font-variant-numeric: tabular-nums; font-size: 11px; }
select, textarea, input[type=text] { width: 100%; background: var(--bg2); color: var(--fg);
  border: 1px solid var(--line); border-radius: 8px; padding: 6px 7px; font: inherit; outline: none; }
textarea { resize: vertical; min-height: 60px; }
select:focus, textarea:focus, input:focus { border-color: var(--acc); }
button { font: inherit; cursor: pointer; border-radius: 8px; border: 1px solid var(--line);
  background: var(--bg2); color: var(--fg); padding: 6px 10px;
  display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
button:hover { border-color: var(--acc); }
button.primary { background: var(--acc); color: var(--accink); border-color: transparent; font-weight: 700; }
button.ghost { background: transparent; }
button.icon { padding: 5px 7px; }
button.speaking { color: var(--bad); border-color: var(--bad); }
button.live { color: var(--bad); border-color: var(--bad); }
label.chk { display: flex; align-items: center; gap: 7px; cursor: pointer; font-size: 12px; }
label.chk input { accent-color: var(--acc); width: 16px; height: 16px; }
label.fld { display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--mut); }
input[type=range] { accent-color: var(--acc); width: 100%; height: 18px; }
.sep { height: 1px; background: var(--line); }
.bub { display: flex; flex-direction: column; }
.bub .body { flex: 1; min-height: 0; max-height: none; }
.bub .res { flex: 1; min-height: 40px; max-height: none; }
.grip { position: absolute; right: 0; bottom: 0; width: 20px; height: 20px; cursor: nwse-resize;
  touch-action: none; z-index: 2; }
.grip::after { content: ''; position: absolute; right: 3px; bottom: 3px; width: 9px; height: 9px;
  border-right: 2px solid var(--mut); border-bottom: 2px solid var(--mut); border-radius: 0 0 3px 0; }
.grip:hover::after { border-color: var(--acc); }
.toast { position: fixed; left: 50%; transform: translateX(-50%); z-index: 2147483647; max-width: 92vw;
  bottom: calc(9px + env(safe-area-inset-bottom, 0px)); padding: 7px 12px; border-radius: 999px;
  background: var(--bg); color: var(--fg); border: 1px solid var(--line); box-shadow: 0 12px 30px rgba(0,0,0,.4); }
.toast.bad { border-color: var(--bad); color: var(--bad); }
.modal { position: fixed; inset: 0; z-index: 2147483647; background: rgba(0,0,0,.55); display: flex; align-items: center; justify-content: center; }
.box { width: 540px; max-width: calc(100vw - 8px); max-height: 92vh; display: flex; flex-direction: column;
  background: var(--bg); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
.foot { display: flex; gap: 8px; justify-content: flex-end; padding: 5px 6px; border-top: 1px solid var(--line); background: var(--bg2); flex-wrap: wrap; }
.hk { font-family: ui-monospace, Menlo, Consolas, monospace; color: var(--acc); }
.hk.rec { background: var(--warn); color: #1B1D21; border-color: var(--warn); }
.res { white-space: pre-wrap; overflow: auto; }
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: var(--bg2); border-radius: 999px; }
::-webkit-scrollbar-thumb { background: var(--line); border-radius: 999px; border: 2px solid var(--bg2); }
::-webkit-scrollbar-thumb:hover { background: var(--acc); }
* { scrollbar-width: thin; scrollbar-color: var(--line) var(--bg2); }
@media (max-width: 640px) {
  .card { left: 0 !important; right: 0 !important; top: auto !important; bottom: 0 !important;
    width: 100% !important; max-width: 100% !important; border-radius: 14px 14px 0 0;
    padding-bottom: env(safe-area-inset-bottom, 0px); }
  .body { max-height: 62vh; }
  .modal { align-items: flex-end; }
  .box { width: 100%; max-width: 100%; border-radius: 14px 14px 0 0; max-height: 94vh; }
  .grid { grid-template-columns: 1fr; }
  .grip { cursor: ns-resize; }
}
`;

    let host = null, ui = null, recording = false, translated = false;

    const view = () => {
        const v = window.visualViewport;
        return { w: (v && v.width) || window.innerWidth, h: (v && v.height) || window.innerHeight };
    };

    function fillLangs(sel, mode) {
        clearEl(sel);
        if (mode === 'target') sel.appendChild(h('option', { value: 'auto', text: t('autoBrowser') }));
        if (mode === 'source') sel.appendChild(h('option', { value: 'auto', text: t('autoDetect') }));
        LANGS.forEach(c => sel.appendChild(h('option', { value: c, text: langName(c) })));
    }

    function fillVoices() {
        const u = ui; if (!u) return;
        const list = TTS.voices();
        clearEl(u.voiceSel);
        u.voiceSel.appendChild(h('option', { value: '', text: t('voiceAuto') }));
        if (!list.length) u.voiceSel.appendChild(h('option', { value: '', disabled: true, text: t('noVoices') }));
        list.forEach(v => {
            const tag = v.localService ? 'local' : 'cloud';
            u.voiceSel.appendChild(h('option', {
                value: v.voiceURI,
                text: v.name + ' · ' + v.lang + ' · ' + tag
            }));
        });
        const exists = S.tts.voice && list.some(v => v.voiceURI === S.tts.voice);
        u.voiceSel.value = exists ? S.tts.voice : '';
        if (!exists && S.tts.voice) { S.tts.voice = ''; save(); }
    }

    function syncTtsControls() {
        const u = ui; if (!u) return;
        u.rRate.value = String(S.tts.rate);
        u.rPitch.value = String(S.tts.pitch);
        u.rVol.value = String(S.tts.volume);
        u.vRate.textContent = S.tts.rate.toFixed(2) + 'x';
        u.vPitch.textContent = S.tts.pitch.toFixed(1);
        u.vVol.textContent = Math.round(S.tts.volume * 100) + '%';
    }

    function updateTtsUi() {
        const u = ui; if (!u) return;
        const alive = TTS.available();
        const busy = TTS.isSpeaking();
        u.ttsBlock.classList.toggle('hide', !alive);
        u.ttsNote.classList.toggle('hide', alive);
        u.bMute.classList.toggle('hide', !busy);
        u.bMute.classList.toggle('live', busy);
        u.bTtsStop.disabled = !busy;
        u.bTtsStop.style.opacity = busy ? '1' : '.45';
        fillVoices();
        syncTtsControls();
    }

    function buildUI() {
        if (ui) return ui;
        UI = resolveUI();
        host = h('div', { translate: 'no', class: 'notranslate', style: 'position:absolute;top:0;left:0;width:0;height:0;' });
        const shadow = host.attachShadow({ mode: 'open' });
        const root = h('div', { class: 'lt' });

        const fab = h('button', { class: 'fab', type: 'button' });
        const badge = h('button', { class: 'badge', type: 'button', title: t('menu') }, ico('dots', 13));
        const wrap = h('div', { class: 'wrap' }, fab, badge);

        const fromSel = h('select');
        const toSel = h('select');
        const swapBtn = iconBtn('icon', 'swap', t('swap'));
        const src = h('textarea', { placeholder: t('srcPh'), rows: '3' });
        const res = h('textarea', { placeholder: t('resPh'), rows: '3', readonly: true });
        const bSel = h('button', { class: 'primary' }, ico('edit', 14), h('span', { text: t('selection') }));
        const bCopy = h('button', null, ico('copy', 14), h('span', { text: t('copy') }));
        const bSpeak = h('button', { class: 'icon', type: 'button', title: t('speak') }, ico('speaker', 15));
        const bRepl = h('button', { text: t('replace') });
        const bPage = h('button', { class: 'primary' });
        const bMute = iconBtn('icon ghost hide', 'stop', t('stop'));
        const bTheme = iconBtn('icon ghost', 'moon', t('theme'));
        const bSet = h('button', { class: 'ghost', text: t('settings') });
        const bDiag = h('button', { class: 'ghost', text: t('diag') });
        const bClose = iconBtn('icon ghost', 'close', t('close'));

        const cAuto = h('input', { type: 'checkbox' });
        const cDyn = h('input', { type: 'checkbox' });
        const cBub = h('input', { type: 'checkbox' });
        const rSize = h('input', { type: 'range', min: '34', max: '64', step: '2' });
        const rAlpha = h('input', { type: 'range', min: '30', max: '100', step: '5' });
        const selUi = h('select');
        const autoName = UI_NAMES[resolveUI()] || resolveUI();
        selUi.appendChild(h('option', { value: 'auto', text: t('autoBrowser') + ' — ' + autoName }));
        UI_LOCALES.forEach(c => selUi.appendChild(h('option', { value: c, text: UI_NAMES[c] || c })));

        const voiceSel = h('select');
        const bVoiceRefresh = iconBtn('icon', 'reset', t('refreshVoices'), 14);
        const rRate = h('input', { type: 'range', min: '0.5', max: '2', step: '0.05' });
        const rPitch = h('input', { type: 'range', min: '0', max: '2', step: '0.1' });
        const rVol = h('input', { type: 'range', min: '0', max: '1', step: '0.05' });
        const vRate = h('span', { class: 'val' });
        const vPitch = h('span', { class: 'val' });
        const vVol = h('span', { class: 'val' });
        const bTtsTest = h('button', { class: 'primary' }, ico('play', 13), h('span', { text: t('test') }));
        const bTtsStop = h('button', null, ico('stop', 13), h('span', { text: t('stop') }));
        const bTtsReset = iconBtn('icon ghost', 'reset', t('resetVoice'), 14);
        const ttsBlock = h('div', { class: 'tts' },
            h('div', { class: 'sec' }, ico('speaker', 14), h('span', { text: t('voice') })),
            h('label', { class: 'fld' }, h('span', { text: t('engine') }),
                h('div', { class: 'row' }, voiceSel, bVoiceRefresh)),
            h('div', { class: 'srow' }, h('span', { text: t('rate') }), rRate, vRate),
            h('div', { class: 'srow' }, h('span', { text: t('pitch') }), rPitch, vPitch),
            h('div', { class: 'srow' }, h('span', { text: t('volume') }), rVol, vVol),
            h('div', { class: 'row' }, bTtsTest, bTtsStop, bTtsReset));
        const ttsNote = h('div', { class: 'mut hide', text: t('ttsUnavailable') });

        const menu = h('div', { class: 'card hide' },
            h('div', { class: 'head' },
                h('span', { class: 'brand', text: 'LangTranslator' }),
                h('span', { class: 'grow mut', text: t('tagline') }),
                bMute, bTheme, bClose),
            h('div', { class: 'body' },
                h('div', { class: 'row' }, fromSel, swapBtn, toSel),
                src, res,
                h('div', { class: 'row' }, bSel, bCopy, bSpeak, bRepl),
                h('div', { class: 'row' }, bPage),
                ttsBlock, ttsNote,
                h('div', { class: 'sep' }),
                h('div', { class: 'grid' },
                    h('label', { class: 'chk' }, cAuto, h('span', { text: t('autoSel') })),
                    h('label', { class: 'chk' }, cDyn, h('span', { text: t('dynamic') })),
                    h('label', { class: 'chk' }, cBub, h('span', { text: t('bubble') })),
                    h('label', { class: 'fld' }, h('span', { text: t('uiLang') }), selUi),
                    h('label', { class: 'fld' }, h('span', { text: t('size') }), rSize),
                    h('label', { class: 'fld' }, h('span', { text: t('opacity') }), rAlpha)),
                h('div', { class: 'sep' }),
                h('div', { class: 'row' }, bSet, bDiag),
                h('div', { class: 'mut', text: t('help') })));

        const bubTitle = h('span', { class: 'grow mut' });
        const bubText = h('div', { class: 'res' });
        const bubCopy = h('button', null, ico('copy', 14), h('span', { text: t('copy') }));
        const bubSpeak = h('button', { class: 'icon', type: 'button', title: t('speak') }, ico('speaker', 15));
        const bubRepl = h('button', { text: t('replace') });
        const bubClose = iconBtn('icon ghost', 'close', t('close'));
        const grip = h('div', { class: 'grip', title: t('resize') });
        const bubble = h('div', { class: 'card bub hide' },
            h('div', { class: 'head' }, bubTitle, bubClose),
            h('div', { class: 'body' }, bubText, h('div', { class: 'row' }, bubCopy, bubSpeak, bubRepl)),
            grip);

        const toast = h('div', { class: 'toast hide' });
        root.append(wrap, menu, bubble, toast);

        try {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(CSS);
            shadow.adoptedStyleSheets = [sheet];
        } catch (e) {
            root.appendChild(h('style', { text: CSS }));
        }
        shadow.appendChild(root);
        document.documentElement.appendChild(host);

        ui = {
            root, wrap, fab, badge, menu, bubble, grip, toast, fromSel, toSel, src, res, bPage, bTheme, bMute,
            cAuto, cDyn, cBub, rSize, rAlpha, selUi, bubTitle, bubText, bubRepl,
            ttsBlock, ttsNote, voiceSel, rRate, rPitch, rVol, vRate, vPitch, vVol, bTtsStop,
            modal: null, lastField: null
        };

        fillLangs(fromSel, 'source');
        fillLangs(toSel, 'target');

        fab.addEventListener('pointerdown', onFabDown);
        fab.addEventListener('pointermove', onFabMove);
        fab.addEventListener('pointerup', onFabUp);
        fab.addEventListener('pointercancel', onFabCancel);
        fab.addEventListener('contextmenu', e => { e.preventDefault(); setMenu(true); });
        fab.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePage(); }
        });
        badge.addEventListener('pointerdown', e => e.stopPropagation());
        badge.addEventListener('click', e => { e.stopPropagation(); setMenu(ui.menu.classList.contains('hide')); });

        bClose.addEventListener('click', () => setMenu(false));
        bPage.addEventListener('click', togglePage);
        bSel.addEventListener('click', () => runSelection(true));
        bSet.addEventListener('click', openSettings);
        bDiag.addEventListener('click', runDiagnostics);
        bMute.addEventListener('click', () => TTS.stop());
        bTheme.addEventListener('click', () => { S.theme = S.theme === 'light' ? 'dark' : 'light'; save(); applyLook(); });
        bCopy.addEventListener('click', () => { copyText(res.value); notify(t('copied')); });
        bRepl.addEventListener('click', () => {
            if (ui.lastField && res.value) { replaceInField(ui.lastField, res.value); notify(t('copied')); }
            else notify(t('noText'), true);
        });
        bubCopy.addEventListener('click', () => { copyText(bubText.textContent); notify(t('copied')); });
        bubClose.addEventListener('click', hideBubble);
        bubRepl.addEventListener('click', () => { if (ui.lastField) { replaceInField(ui.lastField, bubText.textContent); hideBubble(); } });

        TTS.attach(bSpeak, () => res.value, () => targetLang());
        TTS.attach(bubSpeak, () => bubText.textContent, () => targetLang());
        TTS.subscribe(updateTtsUi);

        voiceSel.addEventListener('change', () => { S.tts.voice = voiceSel.value; save(); TTS.applyLive(); });
        bVoiceRefresh.addEventListener('click', () => { TTS.refresh(true); fillVoices(); });
        rRate.addEventListener('input', () => {
            S.tts.rate = clamp(Number(rRate.value) || 1, 0.5, 2);
            vRate.textContent = S.tts.rate.toFixed(2) + 'x'; save();
        });
        rPitch.addEventListener('input', () => {
            S.tts.pitch = clamp(Number(rPitch.value), 0, 2);
            vPitch.textContent = S.tts.pitch.toFixed(1); save();
        });
        rVol.addEventListener('input', () => {
            S.tts.volume = clamp(Number(rVol.value), 0, 1);
            vVol.textContent = Math.round(S.tts.volume * 100) + '%'; save();
        });
        [rRate, rPitch, rVol].forEach(el => el.addEventListener('change', () => TTS.applyLive()));
        bTtsTest.addEventListener('click', () => { TTS.stop(); TTS.start(t('ttsSample'), targetLang()); });
        bTtsStop.addEventListener('click', () => TTS.stop());
        bTtsReset.addEventListener('click', () => {
            S.tts = JSON.parse(JSON.stringify(DEFAULTS.tts));
            save(); fillVoices(); syncTtsControls(); TTS.applyLive();
            notify(t('resetDone'));
        });

        fromSel.addEventListener('change', () => { S.source = fromSel.value; save(); });
        toSel.addEventListener('change', () => { S.target = toSel.value; save(); syncUI(); fillVoices(); });
        swapBtn.addEventListener('click', () => {
            const a = S.source === 'auto' ? (detectLocal(src.value) || 'en') : S.source;
            S.source = targetLang(); S.target = a; save(); syncUI();
            if (res.value) { src.value = res.value; res.value = ''; }
        });
        src.addEventListener('input', debounce(() => { if (src.value.trim()) menuTranslate(); }, 550));
        cAuto.addEventListener('change', () => { S.autoSel = cAuto.checked; save(); });
        cDyn.addEventListener('change', () => { S.dynamic = cDyn.checked; save(); if (!S.dynamic) stopObserver(); });
        cBub.addEventListener('change', () => { S.bubble = cBub.checked; save(); if (!S.bubble) hideBubble(); });
        rSize.addEventListener('input', () => { S.size = Number(rSize.value); save(); applyLook(); });
        rAlpha.addEventListener('input', () => { S.opacity = Number(rAlpha.value); save(); applyLook(); });
        selUi.addEventListener('change', () => { S.ui = selUi.value; save(); rebuildUI(); });

        bindBubbleResize();
        window.addEventListener('resize', onViewport);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', onViewport);
            window.visualViewport.addEventListener('scroll', onViewport);
        }
        syncUI();
        updateTtsUi();
        return ui;
    }

    function onViewport() {
        placeFab();
        placeMenu();
        if (ui && !ui.bubble.classList.contains('hide')) { applyBubbleSize(); placeBubble(); }
    }

    function rebuildUI() {
        TTS.reset();
        const open = ui && !ui.menu.classList.contains('hide');
        if (host) host.remove();
        host = null; ui = null;
        buildUI();
        if (open) setMenu(true);
    }

    function syncUI() {
        const u = buildUI();
        u.fromSel.value = S.source;
        u.toSel.value = S.target;
        u.cAuto.checked = !!S.autoSel;
        u.cDyn.checked = !!S.dynamic;
        u.cBub.checked = !!S.bubble;
        u.rSize.value = String(S.size);
        u.rAlpha.value = String(S.opacity);
        u.selUi.value = S.ui;
        clearEl(u.bPage);
        u.bPage.appendChild(ico(translated ? 'reset' : 'edit', 14));
        u.bPage.appendChild(h('span', { text: translated ? t('restore') : t('page') }));
        syncTtsControls();
        applyLook();
    }

    function applyLook() {
        const u = ui; if (!u) return;
        u.root.style.setProperty('--fab', S.size + 'px');
        u.root.style.setProperty('--alpha', String(S.opacity / 100));
        u.root.classList.toggle('light', S.theme === 'light');
        clearEl(u.bTheme);
        u.bTheme.appendChild(ico(S.theme === 'light' ? 'sun' : 'moon', 15));
        u.bTheme.title = t('theme') + ': ' + (S.theme === 'light' ? t('themeLight') : t('themeDark'));
        const tl = targetLang();
        clearEl(u.fab);
        if (translated) u.fab.appendChild(ico('check', Math.round(S.size * 0.5)));
        else u.fab.appendChild(document.createTextNode(base(tl) === 'zh' ? (tl === 'zh-TW' ? 'TW' : 'ZH') : base(tl).toUpperCase()));
        u.fab.classList.toggle('on', translated);
        u.fab.title = (translated ? t('restore') : t('page')) + ' · ' + langName(tl) + ' · ' + t('tagline');
        u.badge.title = t('menu') + ' · ' + hkText(S.hk.menu);
        placeFab();
    }

    function placeFab(x, y) {
        const u = ui; if (!u) return;
        const v = view();
        const w = u.wrap.offsetWidth || S.size, hh = u.wrap.offsetHeight || S.size;
        let px, py;
        if (typeof x === 'number') { px = x; py = y; }
        else if (S.pos) { px = S.pos.x; py = S.pos.y; }
        else { px = v.w - w - FAB_RIGHT; py = v.h - hh - FAB_BOTTOM; }
        u.wrap.style.left = clamp(px, EDGE, Math.max(EDGE, v.w - w - EDGE)) + 'px';
        u.wrap.style.top = clamp(py, EDGE, Math.max(EDGE, v.h - hh - EDGE)) + 'px';
    }

    let press = null;
    function onFabDown(e) {
        if (e.button !== undefined && e.button !== 0) return;
        const r = ui.wrap.getBoundingClientRect();
        press = { id: e.pointerId, x: e.clientX, y: e.clientY, left: r.left, top: r.top, moved: false, long: false, timer: null };
        press.timer = setTimeout(() => {
            if (!press || press.moved) return;
            press.long = true;
            ui.fab.classList.add('held');
            if (navigator.vibrate) { try { navigator.vibrate(12); } catch (err) { /* ignore */ } }
            setMenu(true);
        }, HOLD_MS);
        try { ui.fab.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        e.preventDefault();
    }
    function onFabMove(e) {
        if (!press || e.pointerId !== press.id) return;
        const dx = e.clientX - press.x, dy = e.clientY - press.y;
        if (!press.moved && Math.abs(dx) + Math.abs(dy) < 7) return;
        if (!press.moved) { clearTimeout(press.timer); press.moved = true; ui.fab.classList.add('drag'); }
        placeFab(press.left + dx, press.top + dy);
    }
    function onFabUp(e) {
        if (!press || e.pointerId !== press.id) return;
        clearTimeout(press.timer);
        const p = press; press = null;
        ui.fab.classList.remove('held');
        ui.fab.classList.remove('drag');
        try { ui.fab.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        if (p.moved) {
            const r = ui.wrap.getBoundingClientRect();
            S.pos = { x: Math.round(r.left), y: Math.round(r.top) };
            save(); placeFab();
            return;
        }
        if (p.long) return;
        togglePage();
    }
    function onFabCancel(e) {
        if (!press || e.pointerId !== press.id) return;
        clearTimeout(press.timer);
        press = null;
        ui.fab.classList.remove('held');
        ui.fab.classList.remove('drag');
    }

    function placeMenu() {
        const u = ui;
        if (!u || u.menu.classList.contains('hide')) return;
        const v = view();
        if (v.w <= NARROW) return;
        const r = u.wrap.getBoundingClientRect();
        const w = u.menu.offsetWidth || 360, hh = u.menu.offsetHeight || 430;
        u.menu.style.left = clamp(r.left + r.width - w, EDGE, Math.max(EDGE, v.w - w - EDGE)) + 'px';
        u.menu.style.top = clamp(r.top - hh - EDGE, EDGE, Math.max(EDGE, v.h - hh - EDGE)) + 'px';
    }

    function setMenu(open) {
        const u = buildUI();
        u.menu.classList.toggle('hide', !open);
        if (!open) return;
        hideBubble();
        updateTtsUi();
        placeMenu();
    }

    function bubLimits() {
        const v = view();
        return {
            maxW: Math.max(BUB_MIN_W, Math.min(BUB_MAX_W, v.w - EDGE * 2)),
            maxH: Math.max(BUB_MIN_H, Math.min(BUB_MAX_H, v.h - EDGE * 2))
        };
    }

    function applyBubbleSize() {
        const u = ui; if (!u) return;
        const lim = bubLimits();
        const saved = S.bubSize || { w: BUB_DEF_W, h: BUB_DEF_H };
        const v = view();
        u.bubble.style.width = v.w <= NARROW ? '' : clamp(saved.w, BUB_MIN_W, lim.maxW) + 'px';
        u.bubble.style.height = clamp(saved.h, BUB_MIN_H, lim.maxH) + 'px';
    }

    function placeBubble(x, y) {
        const u = ui; if (!u) return;
        const v = view();
        if (v.w <= NARROW) return;
        const r = u.bubble.getBoundingClientRect();
        const left = typeof x === 'number' ? x : r.left;
        const top = typeof y === 'number' ? y : r.top;
        u.bubble.style.left = clamp(left, EDGE, Math.max(EDGE, v.w - r.width - EDGE)) + 'px';
        u.bubble.style.top = clamp(top, EDGE, Math.max(EDGE, v.h - r.height - EDGE)) + 'px';
    }

    function bindBubbleResize() {
        const u = ui;
        let st = null;
        u.grip.addEventListener('pointerdown', e => {
            const r = u.bubble.getBoundingClientRect();
            st = { id: e.pointerId, x: e.clientX, y: e.clientY, w: r.width, h: r.height, left: r.left, top: r.top };
            try { u.grip.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
            e.preventDefault();
            e.stopPropagation();
        });
        u.grip.addEventListener('pointermove', e => {
            if (!st || e.pointerId !== st.id) return;
            const lim = bubLimits();
            const w = clamp(st.w + (e.clientX - st.x), BUB_MIN_W, lim.maxW);
            const hh = clamp(st.h + (e.clientY - st.y), BUB_MIN_H, lim.maxH);
            u.bubble.style.width = w + 'px';
            u.bubble.style.height = hh + 'px';
            placeBubble(st.left, st.top);
        });
        const end = e => {
            if (!st || e.pointerId !== st.id) return;
            st = null;
            try { u.grip.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
            const r = u.bubble.getBoundingClientRect();
            S.bubSize = { w: Math.round(r.width), h: Math.round(r.height) };
            save();
        };
        u.grip.addEventListener('pointerup', end);
        u.grip.addEventListener('pointercancel', end);
        u.grip.addEventListener('dblclick', e => {
            e.stopPropagation();
            S.bubSize = null; save();
            applyBubbleSize(); placeBubble();
            notify(t('resetDone'));
        });
    }

    function hideBubble() { if (ui) ui.bubble.classList.add('hide'); }

    function showBubble(title, text, rect, field) {
        const u = buildUI();
        u.lastField = field || null;
        u.bubTitle.textContent = title;
        u.bubText.textContent = text;
        u.bubRepl.classList.toggle('hide', !field);
        if (!S.bubble) { u.res.value = text; return; }
        u.bubble.classList.remove('hide');
        applyBubbleSize();
        const v = view();
        if (v.w > NARROW) {
            const r = u.bubble.getBoundingClientRect();
            let left = v.w - r.width - EDGE * 2;
            let top = v.h - r.height - FAB_BOTTOM;
            if (rect && rect.width) {
                left = rect.left;
                top = rect.bottom + 6;
                if (top + r.height > v.h - EDGE) top = rect.top - r.height - 6;
            }
            placeBubble(left, top);
        }
    }

    let toastTimer = null;
    function notify(msg, bad) {
        const u = buildUI();
        u.toast.textContent = msg;
        u.toast.className = 'toast' + (bad ? ' bad' : '');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => u.toast.classList.add('hide'), bad ? 5200 : 2200);
    }

    const SKIP = /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|INPUT|SELECT|OPTION|CODE|PRE|KBD|SAMP|SVG|CANVAS|IFRAME|OBJECT|MATH)$/;
    const originals = new Map();
    const attrOriginals = new Map();
    let titleOriginal = null, pageBusy = false, runId = 0, observer = null, obsTimer = null;

    const tidy = s => String(s).replace(/\s+/g, ' ').trim();
    function worth(s) {
        if (s.length < 2 || !LETTERS.test(s)) return false;
        const loc = detectLocal(s);
        return !(loc && sameLang(loc, targetLang()));
    }

    function collectNodes() {
        const out = [];
        if (!document.body) return out;
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode(n) {
                const p = n.parentElement;
                if (!p || SKIP.test(p.tagName)) return NodeFilter.FILTER_REJECT;
                if (p.closest('[translate=no],.notranslate,[contenteditable]')) return NodeFilter.FILTER_REJECT;
                if (originals.has(n) || !worth(tidy(n.nodeValue))) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        let n; while ((n = w.nextNode())) out.push(n);
        return out;
    }

    function collectAttrs() {
        const out = [];
        if (!document.body) return out;
        const names = ['placeholder', 'title', 'alt', 'aria-label'];
        document.body.querySelectorAll('[placeholder],[title],[alt],[aria-label]').forEach(el => {
            if (/^(SCRIPT|STYLE|NOSCRIPT|CODE|PRE)$/.test(el.tagName)) return;
            if (el.closest('[translate=no],.notranslate')) return;
            const saved = attrOriginals.get(el);
            names.forEach(a => {
                if (saved && Object.prototype.hasOwnProperty.call(saved, a)) return;
                const v = el.getAttribute(a);
                if (v && worth(tidy(v))) out.push({ el: el, a: a, s: tidy(v) });
            });
        });
        return out;
    }

    async function pagePass(my) {
        const tl = targetLang();
        const items = collectNodes().map(n => ({ node: n, s: tidy(n.nodeValue) })).concat(collectAttrs());
        if (!items.length) return 0;
        const uniq = Array.from(new Set(items.map(i => i.s)));
        const batches = [];
        let cur = [], len = 0;
        uniq.forEach(s => {
            if (cur.length && (len + s.length > 1200 || cur.length >= 24)) { batches.push(cur); cur = []; len = 0; }
            cur.push(s); len += s.length + 1;
        });
        if (cur.length) batches.push(cur);
        const map = new Map();
        let idx = 0, done = 0;
        const worker = async () => {
            while (idx < batches.length && my === runId) {
                const b = batches[idx++];
                const parts = await translateList(b, S.source, tl);
                if (my !== runId) return;
                b.forEach((s, i) => { if (parts[i]) map.set(s, parts[i]); });
                done++;
                if (ui) ui.fab.textContent = Math.round(done / batches.length * 100) + '%';
            }
        };
        await Promise.all([worker(), worker(), worker()]);
        if (my !== runId) return 0;
        let applied = 0;
        items.forEach(it => {
            const tr = map.get(it.s);
            if (!tr) return;
            if (it.node) {
                if (!it.node.isConnected) return;
                const o = it.node.nodeValue;
                originals.set(it.node, o);
                it.node.nodeValue = o.match(/^\s*/)[0] + tr + o.match(/\s*$/)[0];
            } else {
                if (!it.el.isConnected) return;
                const saved = attrOriginals.get(it.el) || {};
                saved[it.a] = it.el.getAttribute(it.a);
                attrOriginals.set(it.el, saved);
                it.el.setAttribute(it.a, tr);
            }
            applied++;
        });
        if (batches.length && !applied) throw new Error(t('failed'));
        return applied;
    }

    async function translatePage() {
        if (pageBusy) return;
        pageBusy = true;
        const my = ++runId;
        translated = true;
        notify(t('busy') + ' ' + langName(targetLang()));
        try {
            if (titleOriginal === null && document.title) {
                const before = document.title;
                translate(before, S.source, targetLang()).then(r => {
                    if (r.text && my === runId) { titleOriginal = before; document.title = r.text; }
                }).catch(() => { /* ignore */ });
            }
            await pagePass(my);
            if (my !== runId) return;
            syncUI();
            notify(t('pageDone'));
            if (S.dynamic) startObserver();
        } catch (e) {
            translated = false;
            syncUI();
            notify(t('failed') + ': ' + e.message, true);
        } finally {
            if (my === runId) pageBusy = false;
        }
    }

    function restorePage() {
        runId++; pageBusy = false;
        stopObserver();
        originals.forEach((v, n) => { if (n.isConnected) n.nodeValue = v; });
        originals.clear();
        attrOriginals.forEach((o, el) => { if (el.isConnected) Object.keys(o).forEach(a => el.setAttribute(a, o[a])); });
        attrOriginals.clear();
        if (titleOriginal !== null) { document.title = titleOriginal; titleOriginal = null; }
        translated = false;
        syncUI();
        notify(t('restored'));
    }

    function togglePage() { translated ? restorePage() : translatePage(); }

    function startObserver() {
        if (observer || !document.body) return;
        observer = new MutationObserver(() => {
            if (!translated || pageBusy) return;
            clearTimeout(obsTimer);
            obsTimer = setTimeout(async () => {
                if (!translated || pageBusy) return;
                pageBusy = true;
                const my = ++runId;
                try { await pagePass(my); } catch (e) { /* ignore */ }
                finally { if (my === runId) { pageBusy = false; syncUI(); } }
            }, 900);
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
    function stopObserver() { if (observer) { observer.disconnect(); observer = null; } clearTimeout(obsTimer); }

    function activeField() {
        const el = document.activeElement;
        if (!el) return null;
        if (el.tagName === 'TEXTAREA') return el;
        if (el.tagName === 'INPUT') {
            const ty = (el.type || 'text').toLowerCase();
            return ['text', 'search', 'url', 'email', 'tel'].indexOf(ty) >= 0 ? el : null;
        }
        return el.isContentEditable ? el : null;
    }

    function readSelection() {
        const f = activeField();
        if (f && f.value !== undefined) {
            const a = f.selectionStart, b = f.selectionEnd;
            if (typeof a === 'number' && a !== b) return { text: f.value.slice(a, b), field: f, rect: f.getBoundingClientRect() };
        }
        const sel = window.getSelection();
        const text = sel ? String(sel).trim() : '';
        if (!text) return { text: '', field: f, rect: null };
        let rect = null, ce = null;
        try { rect = sel.getRangeAt(0).getBoundingClientRect(); } catch (e) { /* ignore */ }
        try {
            const node = sel.anchorNode;
            const el = node && (node.nodeType === 1 ? node : node.parentElement);
            ce = el && el.closest ? el.closest('[contenteditable]') : null;
        } catch (e) { /* ignore */ }
        return { text: text, field: ce || f, rect: rect };
    }

    function replaceInField(field, text) {
        field.focus();
        let ok = false;
        try { ok = document.execCommand('insertText', false, text); } catch (e) { ok = false; }
        if (ok) return;
        if (field.value !== undefined) {
            const proto = field.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
            const desc = Object.getOwnPropertyDescriptor(proto, 'value');
            const a = field.selectionStart, b = field.selectionEnd;
            const next = field.value.slice(0, a) + text + field.value.slice(b);
            if (desc && desc.set) desc.set.call(field, next); else field.value = next;
            try { field.setSelectionRange(a + text.length, a + text.length); } catch (e) { /* ignore */ }
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            return;
        }
        const sel = window.getSelection();
        if (sel && sel.rangeCount) {
            const r = sel.getRangeAt(0);
            r.deleteContents();
            const node = document.createTextNode(text);
            r.insertNode(node);
            r.setStartAfter(node); r.collapse(true);
            sel.removeAllRanges(); sel.addRange(r);
            field.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    async function menuTranslate() {
        const u = buildUI();
        const text = u.src.value.trim();
        if (!text) { u.res.value = ''; return; }
        try { u.res.value = (await smartTranslate(text)).text; }
        catch (e) { notify(t('failed') + ': ' + e.message, true); }
    }

    async function runSelection(manual) {
        const info = readSelection();
        const u = buildUI();
        if (!info.text) {
            if (!manual) return;
            const f = activeField();
            if (f && f.value !== undefined && f.value.trim()) {
                try {
                    const r = await smartTranslate(f.value.trim());
                    f.select();
                    replaceInField(f, r.text);
                    notify(langName(r.detected) + ' ' + String.fromCharCode(8594) + ' ' + langName(r.tl));
                } catch (e) { notify(t('failed') + ': ' + e.message, true); }
                return;
            }
            notify(t('noText'));
            return;
        }
        if (manual && info.field && info.field.value !== undefined) {
            try {
                const r = await smartTranslate(info.text.trim());
                replaceInField(info.field, r.text);
                notify(langName(r.detected) + ' ' + String.fromCharCode(8594) + ' ' + langName(r.tl));
            } catch (e) { notify(t('failed') + ': ' + e.message, true); }
            return;
        }
        try {
            const r = await smartTranslate(info.text);
            u.src.value = info.text;
            u.res.value = r.text;
            showBubble(langName(r.detected) + ' ' + String.fromCharCode(8594) + ' ' + langName(r.tl), r.text, info.rect, info.field);
        } catch (e) { if (manual) notify(t('failed') + ': ' + e.message, true); }
    }

    let autoTimer = null, lastAuto = '';
    function scheduleAuto(e) {
        if (!S.autoSel || isBlocked() || insideUI(e)) return;
        clearTimeout(autoTimer);
        autoTimer = setTimeout(() => {
            const info = readSelection();
            if (!info.text || info.text.length < 2 || !LETTERS.test(info.text)) return;
            if (info.text === lastAuto) return;
            lastAuto = info.text;
            runSelection(false);
        }, 320);
    }

    function openSettings() {
        const u = buildUI();
        if (u.modal) u.modal.remove();

        const box = h('div', { class: 'box' });
        const body = h('div', { class: 'body' });
        const closeBtn = iconBtn('icon ghost', 'close', t('close'));
        const head = h('div', { class: 'head' }, h('span', { class: 'brand grow', text: t('settings') }), closeBtn);

        const hkRow = h('div', { class: 'row' });
        [['page', t('hkPage')], ['sel', t('hkSel')], ['menu', t('hkMenu')]].forEach(pair => {
            const b = h('button', { class: 'hk', text: pair[1] + ': ' + hkText(S.hk[pair[0]]) });
            b.addEventListener('click', () => recordKey(b, pair[0], pair[1]));
            hkRow.appendChild(b);
        });

        const themeBtn = h('button', null, ico(S.theme === 'light' ? 'sun' : 'moon', 14),
            h('span', { text: t('theme') + ': ' + (S.theme === 'light' ? t('themeLight') : t('themeDark')) }));
        themeBtn.addEventListener('click', () => {
            S.theme = S.theme === 'light' ? 'dark' : 'light';
            save(); applyLook();
            clearEl(themeBtn);
            themeBtn.appendChild(ico(S.theme === 'light' ? 'sun' : 'moon', 14));
            themeBtn.appendChild(h('span', { text: t('theme') + ': ' + (S.theme === 'light' ? t('themeLight') : t('themeDark')) }));
        });

        const autoTa = h('textarea', { placeholder: t('perLine'), rows: '3' });
        autoTa.value = S.autoSites.join(NL);
        const blockTa = h('textarea', { placeholder: t('perLine'), rows: '3' });
        blockTa.value = S.blocked.join(NL);
        const addBtn = h('button', { text: t('addSite') });
        addBtn.addEventListener('click', () => {
            const list = autoTa.value.split(NL).map(cleanDomain).filter(Boolean);
            const d = location.hostname.toLowerCase();
            if (list.indexOf(d) < 0) list.push(d);
            autoTa.value = list.join(NL);
        });

        const provSel = h('select');
        provSel.appendChild(h('option', { value: 'auto', text: t('serviceAuto') }));
        PROVIDERS.forEach(p => provSel.appendChild(h('option', { value: p.id, text: p.label })));
        provSel.value = S.provider;

        const jsonTa = h('textarea', { placeholder: t('pasteJson'), rows: '5' });
        const fileIn = h('input', { type: 'file', accept: 'application/json,.json', class: 'hide' });
        const bDown = h('button', null, ico('download', 14), h('span', { text: t('download') }));
        const bCopyJ = h('button', null, ico('copy', 14), h('span', { text: t('copyJson') }));
        const bUp = h('button', null, ico('upload', 14), h('span', { text: t('upload') }));
        const bApply = h('button', { class: 'primary', text: t('apply') });
        const bReset = h('button', null, ico('reset', 14), h('span', { text: t('reset') }));

        bDown.addEventListener('click', () => { downloadJSON(); notify(t('exported')); });
        bCopyJ.addEventListener('click', () => { copyText(serialize()); notify(t('copied')); });
        bUp.addEventListener('click', () => fileIn.click());
        fileIn.addEventListener('change', () => {
            const f = fileIn.files && fileIn.files[0];
            if (!f) return;
            const reader = new FileReader();
            reader.onload = () => { jsonTa.value = String(reader.result || ''); applyImport(jsonTa.value); };
            reader.readAsText(f);
        });
        bApply.addEventListener('click', () => applyImport(jsonTa.value));
        bReset.addEventListener('click', () => {
            if (!window.confirm(t('resetAsk'))) return;
            TTS.stop();
            S = sanitize(null); save(); close(); rebuildUI(); notify(t('resetDone'));
        });

        const saveBtn = h('button', { class: 'primary', text: t('save') });
        const cancelBtn = h('button', { text: t('cancel') });
        const foot = h('div', { class: 'foot' }, cancelBtn, saveBtn);

        body.append(
            h('label', { class: 'fld' }, h('span', { text: t('hotkeys') }), hkRow),
            h('div', { class: 'row' }, themeBtn),
            h('div', { class: 'sep' }),
            h('label', { class: 'fld' }, h('span', { text: t('autoSites') }), autoTa), addBtn,
            h('label', { class: 'fld' }, h('span', { text: t('blocked') }), blockTa),
            h('label', { class: 'fld' }, h('span', { text: t('service') }), provSel),
            h('div', { class: 'sep' }),
            h('label', { class: 'fld' }, h('span', { text: t('exportS') + ' / ' + t('importS') }), jsonTa),
            h('div', { class: 'row' }, bDown, bCopyJ, bUp, bApply),
            h('div', { class: 'row' }, bReset),
            h('div', { class: 'mut', text: t('resize') }),
            fileIn);

        box.append(head, body, foot);
        const modal = h('div', { class: 'modal' }, box);
        function close() { modal.remove(); if (ui) ui.modal = null; }
        closeBtn.addEventListener('click', close);
        cancelBtn.addEventListener('click', close);
        modal.addEventListener('mousedown', e => { if (e.target === modal) close(); });
        saveBtn.addEventListener('click', () => {
            S.autoSites = autoTa.value.split(NL).map(cleanDomain).filter(Boolean);
            S.blocked = blockTa.value.split(NL).map(cleanDomain).filter(Boolean);
            S.provider = provSel.value;
            save(); close(); syncUI(); notify(t('imported'));
        });

        u.root.appendChild(modal);
        u.modal = modal;
    }

    function recordKey(btn, slot, label) {
        if (recording) return;
        recording = true;
        btn.classList.add('rec');
        btn.textContent = t('press');
        const handler = e => {
            e.preventDefault(); e.stopPropagation();
            if (/^(Control|Alt|Shift|Meta)(Left|Right)$/.test(e.code)) return;
            window.removeEventListener('keydown', handler, true);
            recording = false;
            btn.classList.remove('rec');
            if (e.code !== 'Escape') {
                S.hk[slot] = { code: e.code, alt: e.altKey, ctrl: e.ctrlKey, shift: e.shiftKey };
                save();
            }
            btn.textContent = label + ': ' + hkText(S.hk[slot]);
        };
        window.addEventListener('keydown', handler, true);
    }

    function serialize() { return JSON.stringify({ app: 'langtranslator', version: VERSION, settings: S }, null, 2); }

    function downloadJSON() {
        const blob = new Blob([serialize()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = h('a', { href: url, download: 'langtranslator-settings.json' });
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
    }

    function applyImport(raw) {
        let data;
        try { data = JSON.parse(String(raw || '')); } catch (e) { notify(t('importBad'), true); return; }
        const payload = data && data.settings ? data.settings : data;
        if (!payload || typeof payload !== 'object') { notify(t('importBad'), true); return; }
        TTS.stop();
        S = sanitize(payload);
        save();
        rebuildUI();
        notify(t('imported'));
    }

    async function runDiagnostics() {
        const v = TTS.currentVoice(targetLang());
        const lines = [
            'LangTranslator ' + VERSION,
            'nav: [' + navLocales().join(', ') + ']  intl: ' + (systemLocale() || 'n/a'),
            t('detected') + ': ' + (UI_NAMES[UI] || UI) + '  |  ' + t('to') + ': ' + targetLang() + '  |  ' + t('from') + ': ' + S.source,
            'Transport: ' + (GMhttp ? 'GM_xmlhttpRequest' : 'fetch'),
            'TTS: ' + (TTS.available() ? 'available' : 'unavailable') + '  |  voices: ' + TTS.voices().length,
            'Voice: ' + (v ? v.name + ' (' + v.lang + ')' : 'auto') +
            '  |  rate ' + S.tts.rate.toFixed(2) + '  pitch ' + S.tts.pitch.toFixed(1) + '  vol ' + Math.round(S.tts.volume * 100) + '%',
            ''
        ];
        for (let i = 0; i < PROVIDERS.length; i++) {
            const p = PROVIDERS[i], started = Date.now();
            try {
                const r = await callProvider(p, 'Hello world', 'en', targetLang());
                lines.push('OK   ' + p.label + ' (' + (Date.now() - started) + ' ms): ' + r.text);
            } catch (e) { lines.push('FAIL ' + p.label + ': ' + e.message); }
        }
        const u = buildUI();
        u.res.value = lines.join(NL);
        showBubble(t('diag'), lines.join(NL), null, null);
    }

    function insideUI(e) {
        if (!host || !e) return false;
        const path = e.composedPath ? e.composedPath() : [];
        return path.indexOf(host) >= 0;
    }

    function isBlocked() {
        const d = location.hostname.toLowerCase();
        return S.blocked.some(x => x && (d === x || d.endsWith('.' + x)));
    }

    const matchKey = (e, k) => e.code === k.code && e.altKey === !!k.alt && e.ctrlKey === !!k.ctrl && e.shiftKey === !!k.shift;

    window.addEventListener('keydown', e => {
        if (recording || isBlocked()) return;
        if (matchKey(e, S.hk.page)) { e.preventDefault(); e.stopPropagation(); togglePage(); }
        else if (matchKey(e, S.hk.sel)) { e.preventDefault(); e.stopPropagation(); runSelection(true); }
        else if (matchKey(e, S.hk.menu)) { e.preventDefault(); e.stopPropagation(); setMenu(!ui || ui.menu.classList.contains('hide')); }
        else if (e.key === 'Escape') {
            if (ui && ui.modal) { ui.modal.remove(); ui.modal = null; }
            else if (ui && !ui.bubble.classList.contains('hide')) hideBubble();
            else if (ui && !ui.menu.classList.contains('hide')) setMenu(false);
            else TTS.stop();
        }
    }, true);

    document.addEventListener('mouseup', scheduleAuto, true);
    document.addEventListener('touchend', scheduleAuto, true);
    document.addEventListener('keyup', e => { if (e.shiftKey || e.key === 'Shift' || e.ctrlKey) scheduleAuto(e); }, true);
    document.addEventListener('mousedown', e => { if (!insideUI(e)) hideBubble(); }, true);
    window.addEventListener('pagehide', () => { try { TTS.stop(); } catch (e) { /* ignore */ } });

    function registerMenu() {
        if (typeof GM_registerMenuCommand !== 'function') return;
        GM_registerMenuCommand(t('page') + ' / ' + t('restore'), togglePage);
        GM_registerMenuCommand(t('selection'), () => runSelection(true));
        GM_registerMenuCommand(t('menu'), () => setMenu(true));
        GM_registerMenuCommand(t('settings'), openSettings);
        GM_registerMenuCommand(t('stop'), () => TTS.stop());
        GM_registerMenuCommand(t('diag'), runDiagnostics);
        GM_registerMenuCommand(t('menuToggle'), () => { if (ui) ui.wrap.classList.toggle('hide'); });
    }

    function boot() {
        if (isBlocked()) return;
        buildUI();
        registerMenu();
        const d = location.hostname.toLowerCase();
        if (S.autoSites.some(x => x && (d === x || d.endsWith('.' + x)))) setTimeout(translatePage, 700);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
    else boot();
})();