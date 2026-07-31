'use strict';
const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app      = express();
const DATA_DIR = path.join(__dirname, 'data');
const PORT     = process.env.PORT || 3000;

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(express.json({ limit: '25mb' }));

// Nur die Manifest-HTML ausliefern (keine server.js / data/ exponieren)
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'character_manifest.html'));
});

// ---- Hilfsfunktionen ----

function sanitizeId(raw) {
  const clean = String(raw || '').replace(/[^a-z0-9]/gi, '');
  return clean.length ? clean : null;
}

function dataFilePath(id) {
  const resolved = path.resolve(path.join(DATA_DIR, id + '.json'));
  const base     = path.resolve(DATA_DIR);
  if (!resolved.startsWith(base + path.sep)) return null;
  return resolved;
}

const LIST_FILE = path.join(DATA_DIR, '_list.json');

function readList() {
  try { return JSON.parse(fs.readFileSync(LIST_FILE, 'utf8')); } catch { return []; }
}
function writeList(list) {
  fs.writeFileSync(LIST_FILE, JSON.stringify(list));
}

// ---- REST-API ----

// GET /api/chars — geordnete Liste aller Charakter-IDs
app.get('/api/chars', (_req, res) => {
  res.json(readList());
});

// PUT /api/chars — Reihenfolge speichern
app.put('/api/chars', (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'expected array' });
  writeList(req.body.filter(id => typeof id === 'string'));
  res.json({ ok: true });
});

// GET /api/chars/:id — einen Charakter laden
app.get('/api/chars/:id', (req, res) => {
  const id   = sanitizeId(req.params.id);
  if (!id) return res.status(400).json(null);
  const file = dataFilePath(id);
  if (!file || !fs.existsSync(file)) return res.status(404).json(null);
  res.sendFile(file);
});

// POST /api/chars/:id — Charakter speichern / anlegen
app.post('/api/chars/:id', (req, res) => {
  const id   = sanitizeId(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid id' });
  const file = dataFilePath(id);
  if (!file) return res.status(400).json({ error: 'invalid id' });
  fs.writeFileSync(file, JSON.stringify(req.body));
  res.json({ ok: true });
});

// DELETE /api/chars/:id — Charakter löschen
app.delete('/api/chars/:id', (req, res) => {
  const id   = sanitizeId(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid id' });
  const file = dataFilePath(id);
  if (file && fs.existsSync(file)) fs.unlinkSync(file);
  writeList(readList().filter(x => x !== id));
  res.json({ ok: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`D&D Manifest läuft → http://0.0.0.0:${PORT}`);
});
