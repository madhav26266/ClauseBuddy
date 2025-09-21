import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  messages: {
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
    files?: {
      fileName: string;
      fileType: string;
      fileSize: number;
      filePath: string;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    files: [{
      fileName: { type: String, required: true },
      fileType: { type: String, required: true },
      fileSize: { type: Number, required: true },
      filePath: { type: String, required: true }
    }]
  }]
}, {
  timestamps: true
});

export default mongoose.model<IChat>("Chat", chatSchema);
