import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source and destination paths
const publicDir = path.join(__dirname, "public");
const distDir = path.join(__dirname, "dist");

// Function to copy directory recursively
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDir(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

console.log("📦 Copying public assets to dist...");
console.log(`Source: ${publicDir}`);
console.log(`Destination: ${distDir}`);

try {
  // Copy entire public directory to dist/public
  const publicDestDir = path.join(distDir, "public");
  copyDir(publicDir, publicDestDir);

  console.log("✅ Public assets copied successfully!");
} catch (error) {
  console.error("❌ Error copying public assets:", error);
  process.exit(1);
}
