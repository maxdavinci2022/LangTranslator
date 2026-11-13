# Publishing through the GitHub website only

No terminal, no Git client. Everything is done in the browser.

## 1. Create the repository

github.com → `+` (top right) → **New repository**
- Owner: `maxdavinci2022`
- Name: `langtranslator`
- Public, check **Add a README file**, license **None** (the LICENSE file is pasted below)
- **Create repository**

A GitHub *Project* board is a different thing and cannot hold files. If one was created
by mistake, close it under Project settings → Danger zone → Close this project.

## 2. Create files by pasting

Repository → **Add file** → **Create new file**.
Type the full path in the name field; typing `/` creates a folder automatically.

| Name field | Content source |
| --- | --- |
| `langtranslator.user.js` | the userscript, version 1.0.0 |
| `langtranslator.meta.js` | section 1 |
| `assets/icon.svg` | section 2 |
| `README.md` (edit the existing one) | section 3 |
| `README.ru.md` | section 4 |
| `LICENSE` | section 5 |
| `PRIVACY.md` | section 6 |
| `CHANGELOG.md` | section 7 |
| `CONTRIBUTING.md` | section 8 |
| `docs/SETTINGS.md` | section 9 |
| `docs/GREASYFORK.md` | section 10 |
| `docs/PUBLISH-WEB.md` | this file |
| `scripts/validate.mjs` | section 12 |
| `package.json` | section 13 |
| `.github/workflows/ci.yml` | section 14, add last |
| `.github/ISSUE_TEMPLATE/bug_report.yml` | section 15 |
| `.github/ISSUE_TEMPLATE/feature_request.yml` | section 16 |
| `.github/ISSUE_TEMPLATE/config.yml` | section 17 |
| `.gitignore` | section 18 |
| `.editorconfig` | section 19 |

For each file: paste → **Commit changes** → commit directly to `main`.
Empty folders cannot be created on the website; a folder appears once a file path contains it.

## 3. Uploading instead of pasting

**Add file** → **Upload files** works for `assets/icon.svg` and any binary asset.
To place a file inside a folder, create it once via **Create new file** with the full path.

## 4. Check the build

Repository → **Actions**. A green check means versions match, locales are complete and all
required files exist. A red cross opens the log with a `FAIL ...` line explaining the cause.

## 5. Release

Repository → **Releases** → **Draft a new release**
- Tag: `v1.0.0` (create new tag on publish)
- Title: `LangTranslator 1.0.0`
- Description: the `1.0.0` block from `CHANGELOG.md`
- **Publish release**

## 6. Install link

    https://raw.githubusercontent.com/maxdavinci2022/langtranslator/main/langtranslator.user.js

Open it with Tampermonkey installed — the installation screen appears. If plain text is
shown instead, the repository is private: Settings → Change visibility → Public.

## 7. Greasy Fork

greasyfork.org → sign in → **Post a script** → paste `langtranslator.user.js` →
fill the listing from `docs/GREASYFORK.md` → publish.

## 8. Every next version

1. `langtranslator.user.js`: bump `@version` and `const VERSION`.
2. `langtranslator.meta.js`: same `@version`.
3. `package.json`: same `version`.
4. Add a block to `CHANGELOG.md`.
5. Draft a release with the new tag.

Users receive the update through `@updateURL`.
