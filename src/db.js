// Tiny JSON-file "database". Good enough for a mock site; no setup needed.
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');
const SEED_PATH = path.join(__dirname, '..', 'data', 'seed.json');

function reset() {
  fs.copyFileSync(SEED_PATH, DB_PATH);
}

function read() {
  if (!fs.existsSync(DB_PATH)) reset();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function write(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function update(fn) {
  const data = read();
  const result = fn(data);
  write(data);
  return result;
}

module.exports = { read, update, reset, SEED_PATH };
