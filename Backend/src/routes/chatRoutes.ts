import express from 'express';
import Chat from '../models/Chat';
import File from '../models/File';
import { authenticateToken } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get user's chat history
router.get('/history', authenticateToken, async (req: any, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(50);

    res.json(chats);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

// Get user's uploaded files
router.get('/files', authenticateToken, async (req: any, res) => {
  try {
    const files = await File.find({ userId: req.user._id })
      .sort({ uploadedAt: -1 })
      .limit(100);

    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

// Delete a user's uploaded file
router.delete('/files/:fileId', authenticateToken, async (req: any, res) => {
  try {
    const file = await File.findOne({ _id: req.params.fileId, userId: req.user._id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    if (fs.existsSync(file.filePath)) fs.unlinkSync(file.filePath);

    await file.deleteOne();
    res.json({ message: 'File deleted' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

// Get specific chat
router.get('/:chatId', authenticateToken, async (req: any, res) => {
  try {
    const chatId = req.params.chatId;
    if (!/^[a-fA-F0-9]{24}$/.test(chatId)) {
      return res.status(400).json({ message: 'Invalid chat id' });
    }

    const chat = await Chat.findOne({ _id: chatId, userId: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    res.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ message: 'Error fetching chat' });
  }
});

// Create new chat or add message to existing chat
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const { message, files, chatId } = req.body;

    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId: req.user._id });
    }

    if (!chat) {
      chat = new Chat({
        userId: req.user._id,
        messages: []
      });
    }

    // Add user message ONLY if it has text or files
    if ((message && message.trim()) || (files && files.length > 0)) {
      chat.messages.push({
        role: 'user',
        content: message ? message.trim() : "[File only message]",
        timestamp: new Date(),
        files: files || []
      });

      // Add AI response (simulated)
      chat.messages.push({
        role: 'ai',
        content: "I've received your message and files. I'm analyzing them now and will provide you with insights shortly.",
        timestamp: new Date()
      });

      await chat.save();
      return res.json(chat);
    } else {
      return res.status(400).json({ message: 'Message content cannot be empty unless files are uploaded' });
    }
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Error creating chat' });
  }
});

// Upload file
router.post('/upload', authenticateToken, upload.single('file'), async (req: any, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const file = new File({
      userId: req.user._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path
    });

    await file.save();

    res.json({
      id: file._id,
      fileName: file.fileName,
      originalName: file.originalName,
      fileType: file.fileType,
      fileSize: file.fileSize,
      filePath: file.filePath
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

export default router;
