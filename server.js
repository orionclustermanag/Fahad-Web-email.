// Simple webmail starter (Node.js + Express)
// WARNING: This is a starter app. For production you must secure credentials, use OAuth2, HTTPS, proper session/auth and rate limits.
const express = require('express');
const bodyParser = require('body-parser');
const Imap = require('node-imap');
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const util = require('util');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Helper to connect IMAP and fetch headers for a mailbox
function fetchMailbox(creds, mailbox, limit = 30) {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: creds.imap.user,
      password: creds.imap.password,
      host: creds.imap.host,
      port: creds.imap.port,
      tls: creds.imap.tls
    });

    function openInbox(cb) {
      imap.openBox(mailbox, true, cb);
    }

    imap.once('ready', function() {
      openInbox(function(err, box) {
        if (err) { imap.end(); return reject(err); }
        const fetchCount = Math.min(limit, box.messages.total || limit);
        const start = box.messages.total - fetchCount + 1;
        if (start <= 0) {
          imap.end();
          return resolve([]);
        }
        const f = imap.seq.fetch(start + ':' + box.messages.total, { bodies: '', struct: true });
        const results = [];
        f.on('message', function(msg, seqno) {
          const item = { seqno };
          msg.on('body', function(stream, info) {
            simpleParser(stream, (err, parsed) => {
              if (!err) {
                item.from = parsed.from && parsed.from.text;
                item.to = parsed.to && parsed.to.text;
                item.subject = parsed.subject;
                item.date = parsed.date;
                item.text = parsed.text && parsed.text.slice(0, 800);
                item.html = parsed.html;
                results.push(item);
              }
            });
          });
        });
        f.once('error', function(err) { imap.end(); reject(err); });
        f.once('end', function() { imap.end(); resolve(results.reverse()); });
      });
    });

    imap.once('error', function(err) { reject(err); });
    imap.once('end', function() { /* closed */ });
    imap.connect();
  });
}

// Endpoint: test connection
app.post('/api/test', async (req, res) => {
  const creds = req.body;
  try {
    // try a short fetch from INBOX
    const msgs = await fetchMailbox(creds, 'INBOX', 3);
    res.json({ ok: true, sample: msgs.slice(0,3) });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e) });
  }
});

// Endpoint: fetch mailbox (inbox, sent, spam, trash)
app.post('/api/mailbox', async (req, res) => {
  const { creds, mailbox } = req.body;
  if (!creds || !mailbox) return res.status(400).json({ ok:false, error: 'missing creds or mailbox' });
  try {
    const msgs = await fetchMailbox(creds, mailbox, 50);
    res.json({ ok: true, messages: msgs });
  } catch (e) {
    res.status(400).json({ ok:false, error: String(e) });
  }
});

// Endpoint: send email via SMTP
app.post('/api/send', async (req, res) => {
  const { smtp, mail } = req.body;
  if (!smtp || !mail) return res.status(400).json({ ok:false, error: 'missing smtp or mail' });
  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.password
      }
    });
    const info = await transporter.sendMail(mail);
    res.json({ ok: true, info });
  } catch (e) {
    res.status(400).json({ ok:false, error: String(e) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server listening on', PORT));
