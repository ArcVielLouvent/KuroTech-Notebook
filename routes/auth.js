import express from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.join(__dirname, "../data/users.json");

// Load users
function loadUsers() {
  if (!fs.existsSync(usersPath)) return [];
  return JSON.parse(fs.readFileSync(usersPath));
}

// Save users
function saveUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

// REGISTER
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  if (users.find(u => u.username === username))
    return res.status(400).json({ message: "Username already exists" });

  // hash password baru
  const hashed = await bcrypt.hash(password, 10);

  // role otomatis admin jika username Arc, user lainnya user
  const role = username.toLowerCase() === "arc" ? "admin" : "user";

  users.push({ username, password: hashed, role });
  saveUsers(users);

  res.json({ message: "Registered successfully", role });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username);

  if (!user) return res.status(404).json({ message: "User not found" });

  let valid = false;

  if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
    // password hash bcrypt
    valid = await bcrypt.compare(password, user.password);
  } else {
    // plaintext lama
    valid = user.password === password;
  }

  if (!valid) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, role: user.role });
});

export default router;
