import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId: String,
  role: String, // "user" | "assistant"
  content: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Message", messageSchema);
