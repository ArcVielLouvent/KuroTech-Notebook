import express from "express";
import dotenv from  "dotenv";
import cors from "cors";
import path from "path";
import {fileURLToPath} from "url";
import authRoutes from "./routes/auth.js";
import notebookRoutes from "./routes/notebook.js";
import execRoutes from "./routes/exec.js";
import rateLimiter from "./middleware/rateLimit.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api/admin", adminRoutes);
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/auth", authRoutes);
app.use("/api/notebook", notebookRoutes);
app.use("/api/exec", execRoutes);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => 
    console.log(`Server is running on port http://localhost:${PORT}`)
);
