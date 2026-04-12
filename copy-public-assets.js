import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

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

// Update users.json with correct password hash for MasterCookie
console.log("\n🔐 Updating MasterCookie password hash...");

const MASTER_PASSWORD = "020266140297";
const usersJsonPath = path.join(__dirname, "data", "users.json");

try {
  // Read users.json
  const usersData = JSON.parse(fs.readFileSync(usersJsonPath, "utf8"));

  // Find MasterCookie user
  const masterCookieIndex = usersData.users.findIndex(
    (user) => user.username === "MasterCookie"
  );

  if (masterCookieIndex === -1) {
    console.log("⚠️  MasterCookie user not found in users.json");
  } else {
    // Generate new hash for the password
    const newHash = bcrypt.hashSync(MASTER_PASSWORD, 10);

    // Update the password hash
    usersData.users[masterCookieIndex].passwordHash = newHash;

    // Write back to file
    fs.writeFileSync(usersJsonPath, JSON.stringify(usersData, null, 2), "utf8");

    console.log("✅ MasterCookie password hash updated successfully!");
    console.log(`   Username: MasterCookie`);
    console.log(`   Password: ${MASTER_PASSWORD}`);
  }
} catch (error) {
  console.error("❌ Error updating password hash:", error);
  process.exit(1);
}
