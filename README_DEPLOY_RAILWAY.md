# Deploy to Railway (super simple)

1. Create a GitHub account (if you don't have one): https://github.com
2. Create a new repository on GitHub (name it `fahad-webmail` or similar).
3. Upload this project to the repo:
   - Open the repo on GitHub, click "Add file" -> "Upload files", then drag-and-drop all files from this folder.
   - Commit the changes.
4. Create a free Railway account: https://railway.app
5. In Railway dashboard click **New Project** → **Deploy from GitHub** → select your repository.
6. Railway will detect Node and run `npm install` and `node server.js`. If asked, set Start Command to `node server.js`.
7. After deploy completes, Railway provides a public URL. Open it and you'll see the webmail UI.
8. Use "Connect Account" on the site to connect an IMAP/SMTP account (e.g., Gmail with App Password).

Notes:
- For Gmail, generate an App Password (Google Account → Security → App Passwords) and use it as the IMAP/SMTP password.
- Do not use this in production without adding proper authentication, HTTPS, and OAuth2 for Gmail.
