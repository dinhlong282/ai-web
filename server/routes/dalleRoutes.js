import express from "express";
import * as dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const router = express.Router();

// Khởi tạo Gemini với API key từ .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model text → image của Gemini
// Hiện tại Gemini chỉ có model "gemini-1.5-flash" (text), muốn sinh ảnh thì dùng "imagen-3" hoặc "imagen-2" (trong Image Generation API).
// Tạm thời mình viết logic text để bạn test API chạy trước.

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from Gemini!" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // Gọi model text trước (sinh văn bản từ prompt)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ output: text });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error?.message || "Something went wrong with Gemini API");
  }
});

export default router;
