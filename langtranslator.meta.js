// ==UserScript==
// @name         LangTranslator — Page & Selection Translator
// @name:ru      LangTranslator — перевод страницы и выделенного текста
// @name:zh      LangTranslator — 网页与划词翻译
// @name:de      LangTranslator — Seiten- und Auswahlübersetzer
// @name:fr      LangTranslator — traducteur de page et de sélection
// @name:es      LangTranslator — traductor de página y selección
// @namespace    https://github.com/maxdavinci2022/langtranslator
// @version      1.0.0
// @description  Tap the round button to translate the page, hold it to open the menu. Auto-translate selection in a resizable window, replace text inside input fields, read aloud with voice, speed, pitch and volume control.
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