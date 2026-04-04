// start-production.js
// Dieses Skript startet den Server im Production-Mode
import { spawn } from "child_process";

console.log("🚀 Starte DnD Session Manager im Production-Mode...\n");

const server = spawn("node", ["server.js"], {
  env: { ...process.env, NODE_ENV: "production" },
  stdio: "inherit",
  shell: true,
});

server.on("close", (code) => {
  console.log(`\n❌ Server beendet mit Code ${code}`);
  process.exit(code);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutdown Signal empfangen...");
  server.kill("SIGINT");
});
