import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notesPath = path.join(__dirname, "../data/notes.json");
const usersPath = path.join(__dirname, "../data/users.json");

router.get("/all-notes", auth, isAdmin, (req, res) => {
  if (!fs.existsSync(notesPath)) return res.json([]);
  const notes = JSON.parse(fs.readFileSync(notesPath));
  res.json(notes);
});

router.get("/users", auth, isAdmin, (req, res) => {
  if (!fs.existsSync(usersPath)) return res.json([]);
  const users = JSON.parse(fs.readFileSync(usersPath));
  res.json(users.map(({ password, ...u }) => u)); // sembunyikan password
});

export default router;
