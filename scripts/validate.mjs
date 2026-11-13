import { readFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
const fail = m => { console.error('FAIL ' + m); process.exitCode = 1; };
const ok = m => console.log('OK   ' + m);

const script = read('langtranslator.user.js');
const meta = read('langtranslator.meta.js');
const pkg = JSON.parse(read('package.json'));

/* --- version parity --- */
const ver = s => (s.match(/@version\s+(\S+)/) || [])[1];
const constVer = (script.match(/const VERSION = '([^']+)'/) || [])[1];
if (!ver(script)) fail('no @version in langtranslator.user.js');
else if (ver(script) !== ver(meta)) fail('version mismatch: script vs meta');
else if (ver(script) !== pkg.version) fail('version mismatch: script vs package.json');
else if (constVer && constVer !== ver(script)) fail('version mismatch: @version vs const VERSION');
else ok('version ' + ver(script) + ' consistent');

/* --- extract the LOCALES object literal --- */
function objectLiteral(src, marker) {
    const start = src.indexOf(marker);
    if (start < 0) return null;
    let i = src.indexOf('{', start);
    if (i < 0) return null;
    const from = i;
    let depth = 0, quote = null;
    for (; i < src.length; i++) {
        const c = src[i];
        if (quote) {
            if (c === '\\') { i++; continue; }
            if (c === quote) quote = null;
            continue;
        }
        if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
        if (c === '{') depth++;
        else if (c === '}') { depth--; if (!depth) return src.slice(from, i + 1); }
    }
    return null;
}

const body = objectLiteral(script, 'const LOCALES =');
let locales = null;
if (!body) fail('LOCALES object not found');
else {
    try { locales = new Function('return ' + body)(); }
    catch (e) { fail('LOCALES is not parseable: ' + e.message); }
}

if (locales) {
    const expected = ['en', 'ru', 'zh', 'de', 'fr', 'es'];
    const actual = Object.keys(locales);
    if (actual.join(',') !== expected.join(',')) fail('locale order must be ' + expected.join(','));
    else ok('locale order ' + actual.join(','));
    const keys = Object.keys(locales.en).sort();
    expected.forEach(code => {
        if (!locales[code]) return;
        const k = Object.keys(locales[code]).sort();
        const missing = keys.filter(x => k.indexOf(x) < 0);
        const extra = k.filter(x => keys.indexOf(x) < 0);
        if (missing.length || extra.length) fail(code + ': missing [' + missing + '] extra [' + extra + ']');
        else ok(code + ': ' + k.length + ' keys');
    });
    ['voice', 'engine', 'rate', 'pitch', 'volume', 'test', 'stop', 'ttsUnavailable']
        .forEach(k => { if (!(k in locales.en)) fail('speech key missing: ' + k); });
}

/* --- English-only code outside the i18n block --- */
const noMeta = script.split('\n').filter(l => !/^\/\/\s*@/.test(l)).join('\n');
const a = noMeta.indexOf('/* i18n:start */');
const b = noMeta.indexOf('/* i18n:end */');
if (a < 0 || b < 0) fail('i18n markers not found');
else {
    const outside = noMeta.slice(0, a) + noMeta.slice(b);
    const bad = outside.match(/[\u0400-\u04FF\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/);
    if (bad) fail('non-ASCII character outside the i18n block: ' + JSON.stringify(bad[0]));
    else ok('code outside i18n is English-only');
}

/* --- icons must be SVG, not emoji glyphs --- */
if (!/const ICON_PATHS = \{/.test(script)) fail('ICON_PATHS is missing');
else ok('vector icon set present');
if (/fromCharCode\((128266|128265|9881|9788|9789)\)/.test(script)) fail('emoji glyph icon found; use ico() instead');
else ok('no emoji glyph icons');

/* --- opacity may only affect the round button --- */
const block = name => {
    const m = script.match(new RegExp('\\.' + name + '\\s*\\{([^}]*)\\}'));
    return m ? m[1] : '';
};
if (/opacity\s*:/.test(block('card'))) fail('.card must stay opaque');
else if (/opacity\s*:/.test(block('box'))) fail('.box must stay opaque');
else if (/opacity\s*:/.test(block('toast'))) fail('.toast must stay opaque');
else if (!/opacity\s*:/.test(block('wrap'))) fail('.wrap must carry the opacity control');
else ok('opacity applies to the round button only');

/* --- required files --- */
['README.md', 'README.ru.md', 'LICENSE', 'PRIVACY.md', 'CHANGELOG.md', 'CONTRIBUTING.md',
 'docs/SETTINGS.md', 'docs/GREASYFORK.md', 'docs/PUBLISH-WEB.md', 'assets/icon.svg']
    .forEach(p => { try { read(p); ok(p); } catch (e) { fail('missing ' + p); } });

if (!process.exitCode) console.log('\nAll checks passed.');
