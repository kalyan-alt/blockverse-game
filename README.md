# Blockverse Studio — desktop builds

The desktop app is the same `studio.html` as the website, wrapped in Electron with
three.js vendored so it runs offline, plus native Open/Save dialogs and `.bvw`
file association.

## Build locally
```
cd studio-desktop
npm install
npm run dist:win     # -> dist/Blockverse-Studio-Setup.exe   (run on Windows)
npm run dist:linux   # -> dist/Blockverse-Studio.AppImage   (run on Linux or WSL)
npm run dist:mac     # -> dist/Blockverse-Studio.dmg        (must run on a Mac)
```
Electron-builder can't cross-compile a .dmg from Windows; use the GitHub Actions
workflow below to get all three at once.

## Build all three with GitHub Actions
Push a tag and the workflow in `.github/workflows/studio-release.yml` builds on
Windows, macOS and Ubuntu runners and attaches the installers to a GitHub Release:
```
git tag studio-v1.0.0
git push origin studio-v1.0.0
```
The website's download buttons point at `releases/latest/download/<file>`, so once
the release is published the links on the home page just work.

Notes
- The macOS build is unsigned; users will need to right-click → Open the first time.
- The Windows build is unsigned; SmartScreen will show a "More info → Run anyway" prompt.
