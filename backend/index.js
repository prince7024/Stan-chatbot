import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
import chatRoutes from "./routes/chat.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running 🚀" });
});

// Gemini Test API
app.get("/test-gemini", async (req, res) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: "Reply with: Gemini API working fine" }]
          }
        ]
      }
    );

    res.json({
      success: true,
      reply: response.data.candidates[0].content.parts[0].text
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Gemini API failed" });
  }
});

app.use("/chat", chatRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
