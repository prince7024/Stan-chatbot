import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  interests: [String],
  tone: { type: String, default: "friendly" }
});

export default mongoose.model("User", userSchema);
