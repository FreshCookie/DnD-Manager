// Generate bcrypt hash for password
const bcrypt = require("bcryptjs");

// ÄNDERE HIER DEIN PASSWORT:
const password = "MasterCookie123"; // <-- Hier dein gewünschtes Passwort eintragen

const hash = bcrypt.hashSync(password, 10);

console.log("\n=================================");
console.log("Dein neuer bcrypt Hash:");
console.log("=================================");
console.log(hash);
console.log("=================================\n");
console.log(
  "Kopiere diesen Hash und ersetze den passwordHash in data/users.json",
);
console.log("\n");
