import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  uploadedAt: Date;
}

const fileSchema = new Schema<IFile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true }, // stored filename
  originalName: { type: String, required: true }, // original filename
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IFile>("File", fileSchema);
