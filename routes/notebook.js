import express from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const notesPath = path.join(__dirname, "../data/notes.json");

// Load/save notes
function loadNotes() {
    if (!fs.existsSync(notesPath)) return [];
    return JSON.parse(fs.readFileSync(notesPath));
}

function saveNotes(notes) {
    fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2));
}

// Auth middleware
function authMiddleware(req, res, next) {
    const header = req.headers["authorization"];
    if (!header) return res.status(401).json({ message: "No token provided" });

    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
}

// Get notes
router.get("/", authMiddleware, (req, res) => {
    const notes = loadNotes();
    if (req.user.role === "admin") return res.json(notes);
    res.json(notes.filter(n => n.owner === req.user.username));
});

// Add note
router.post("/", authMiddleware, (req, res) => {
    const { title, content } = req.body;
    const notes = loadNotes();
    const newNote = {
        id: notes.length + 1,
        title,
        content,
        owner: req.user.username,
        createdAt: new Date().toISOString()
    };
    notes.push(newNote);
    saveNotes(notes);
    res.status(201).json(newNote);
});

// Update note
router.put("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const notes = loadNotes();
    const note = notes.find(n => n.id === parseInt(id));
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (req.user.role !== "admin" && note.owner !== req.user.username)
        return res.status(403).json({ message: "Not allowed" });

    const { title, content } = req.body;
    if (title) note.title = title;
    if (content) note.content = content;
    saveNotes(notes);
    res.json(note);
});

// Delete note
router.delete("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    let notes = loadNotes();
    const note = notes.find(n => n.id === parseInt(id));
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (req.user.role !== "admin" && note.owner !== req.user.username)
        return res.status(403).json({ message: "Not allowed" });

    notes = notes.filter(n => n.id !== parseInt(id));
    saveNotes(notes);
    res.json({ message: "Note deleted" });
});

export default router;
