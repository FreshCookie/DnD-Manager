// start-all.js
import { spawn } from "child_process";
import path from "path";

function run(name, command, args = []) {
  console.log(`\n🚀 Starte ${name} ...`);
  const proc = spawn(command, args, {
    cwd: path.resolve(), // aktuelles Projektverzeichnis
    shell: true,
    stdio: "inherit", // zeigt Output direkt an
  });

  proc.on("close", (code) => {
    console.log(`❌ ${name} beendet mit Code ${code}`);
  });
}

// --- Reihenfolge deiner Tools ---
run("Backend", "node", ["server.js"]); // passe an deinen Backend-Start an
run("Ngrok", "npx", ["ngrok", "http", "5173"]);
run("Vite Dev Server", "npm", ["run", "dev"]);
