# Blockverse — server + Android instructions

## A. Update the server (adds the shared Avatar shop, friends, voice, pay, Google sign-in)

The server is one file: `server.js` in the **blockverse-server** repo. Render redeploys when that repo changes.

### From an Android phone
1. Download `server.js` from the chat (if the phone blocks `.js`, download the zip and unzip it in the Files app).
2. Open **github.com/kalyan-alt/blockverse-server** in Chrome. If you don't see "Add file", tap ⋮ → **Desktop site**.
3. **Add file → Upload files** → choose `server.js` → **Commit changes**. It replaces the old one.
4. Open **dashboard.render.com** → your service → **Logs**. Wait for `Blockverse server on :PORT`.
   If nothing happens: **Manual Deploy → Deploy latest commit**.
5. Check it worked: open `https://blockverse-server-8enf.onrender.com/health` → `{"ok":true,"ready":true}`
   and `https://blockverse-server-8enf.onrender.com/items` → `{"items":[...]}`.

### From the PC (GitHub Desktop)
Copy `server.js` into `C:\Users\kalya\blockverse-server`, open GitHub Desktop, pick the blockverse-server repo,
type a summary, **Commit to main**, **Push origin**.

### Render environment variables (Render → service → Environment)
| Key | Value |
| --- | --- |
| `GOOGLE_CLIENT_ID` | `1002683973771-r4fo5r82bdj80kk0ndauq9pu4gaq8u2e.apps.googleusercontent.com` |
| `OWNER` | your Blockverse username (gives you the Owner panel) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | (optional, recommended) free Upstash Redis — without it, accounts, friends and shop items are wiped whenever Render restarts the free instance |

### What the new server stores
- `bv:users` — accounts, Blockbux, friends, pending earnings
- `bv:mod` — bans, mutes, MOTD
- `bv:items` — community avatar items (new)

## B. Update the game site
Upload to **blockverse-game** (same Add file → Upload files): `index.html`, `studio.html`, `avatar.html`, `sw.js`.
For the installers also: `package.json`, `copy-app.js`, `main-avatar.js`, `electron-builder-avatar.json`,
and the workflow at `.github/workflows/studio-release.yml`.

## C. Build the Android apps (APK)
1. Make sure the files in section B are in the repo.
2. **Releases → Draft a new release → Choose a tag** → type a new tag such as `v1.1.0` → **Create new tag** → **Publish release**.
3. **Actions** tab → "Build Blockverse apps". The `android` job takes ~5 minutes.
4. When it's green, the release has `Blockverse-Studio.apk` and `Blockverse-Avatar-Creator.apk`
   (plus the Windows/Mac/Linux installers).

## D. Install an APK on an Android phone
1. On the phone, open the Blockverse site and tap **🤖 Android .apk** (or open the release page and tap the `.apk`).
2. Chrome warns "File might be harmful" → **Download anyway**.
3. Tap the downloaded file. Android says "your phone isn't allowed to install unknown apps from this source" →
   **Settings** → turn on **Allow from this source** → back → **Install**.
4. If Play Protect asks, choose **Install anyway** (the app is debug-signed, not from the Play Store).
5. To update later: download the new APK and install it over the old one. If Android refuses with
   "App not installed", uninstall the old version first (your `.bvw` / `.bvi` files saved to Downloads are kept).

## E. Publishing an avatar item from the Android app
The APK can't see your Blockverse login, so:
1. In Avatar Creator: **🚀 Publish** → enter your **Blockverse username** as Creator name → **Publish**.
2. Tap **▶ Open Blockverse** (or copy the link and open it in Chrome).
3. Blockverse adds the item and, if you're signed in, uploads it to the shared shop automatically —
   you'll see "✨ Published to the shop". From then on everyone finds it under **Avatar → ✨ Community**.

On the website version (`/avatar.html`) this is one step: Publish sends it to the shop directly when you're signed in.
