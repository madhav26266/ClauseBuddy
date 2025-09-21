import express, { Request, Response } from "express";
import multer, { Multer } from "multer";
import { extractTextFromPDF } from "../ai/utils/pdfExtractor";
import { summarizeText } from "../ai/services/gemini";

const router = express.Router();
const upload: Multer = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const extractedText: string = await extractTextFromPDF(req.file.path);
    const summary: string = await summarizeText(extractedText);

    res.json({ summary });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

export default router;