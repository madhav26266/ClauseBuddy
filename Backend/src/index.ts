import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "passport";
import connectDB from "./config/db";
import "./config/passport";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";

// New imports for file upload
import multer from "multer";
import fs from "fs";
import pdf from "pdf-parse";
import fetch from "node-fetch";

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(passport.initialize());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// -------------------
// Routes
// -------------------
app.get("/", (req, res) => {
  res.send("Hello, Backend is running 🚀");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// -------------------
// File Upload Route
// -------------------

// Configure Multer to store files in uploads folder
const upload = multer({ dest: "uploads/" });

// Route for uploading up to 2 files
app.post("/api/upload", upload.array("files", 2), async (req, res) => {
  try {
    const files = Array.isArray(req.files) ? req.files : [];
    if (!files.length) return res.status(400).json({ error: "No files uploaded" });

    const summaries: { filename: string; summary: string }[] = [];

    for (const file of files) {
      let text = "";
      
      // 1. Read file and extract text based on file type
      if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
        // Handle PDF files
        const fileBuffer = fs.readFileSync(file.path);
        const data = await pdf(fileBuffer);
        text = data.text || "";
      } else if (file.mimetype === 'text/plain' || file.originalname.toLowerCase().endsWith('.txt')) {
        // Handle text files
        text = fs.readFileSync(file.path, 'utf8');
      } else {
        // For other file types, try to read as text
        try {
          text = fs.readFileSync(file.path, 'utf8');
        } catch (err) {
          console.error(`Cannot read file ${file.originalname}:`, err);
          continue;
        }
      }

      // 2. Send text to Python microservice
      const pyRes = await fetch("http://localhost:8000/process-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, filename: file.originalname }),
      });

      // 3. Parse JSON safely
      let result: any;
      try {
        result = await pyRes.json();
        if (!result.summary) {
          console.error("Python service did not return summary:", result);
          return res.status(500).json({ error: "Python service returned invalid data", details: result });
        }
      } catch (err) {
        const raw = await pyRes.text();
        console.error("Invalid JSON from Python service:", raw);
        return res.status(500).json({ error: "Invalid JSON from Python service", details: raw });
      }

      summaries.push({ filename: file.originalname, summary: result.summary || "No Summary Return" });

      // 4. Delete uploaded file
      fs.unlinkSync(file.path);
    }

    res.json({ summaries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
});


// Start Server
export default app;


