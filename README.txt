Fahad Webmail Starter

What this is:
- A starter webmail UI and simple Node backend that can connect to IMAP/SMTP accounts.
- It provides Inbox, Sent, Spam, Trash views (reads mailboxes from IMAP) and a Compose/send using SMTP.

Important setup notes:
- For Gmail accounts you must either use an App Password (if your account has 2FA and App Passwords enabled)
  or implement OAuth2. Supplying your full Gmail password is not recommended.
- This starter does not include OAuth flows or persistent user sessions. It's for local testing and learning.
- Secure this app (HTTPS, login, encrypted secrets, rate limits) before deploying publicly.

Run locally:
1) Install Node.js (v16+). In the project folder run:
   npm install
2) Start the server:
   npm start
3) Open http://localhost:3000 in your browser.
4) Click Connect Account and enter IMAP/SMTP details.

Security & privacy:
- This app will require storing your mail credentials to use IMAP/SMTP. Do not run this on an insecure public host without proper protections.
- Consider adding OAuth2 for Gmail, and store credentials encrypted.

If you want, I can:
- Add OAuth2 (Google) support so users can sign in with Google securely.
- Add account management and persistent storage (users, sessions).
- Improve the UI to exactly match Gmail features.
