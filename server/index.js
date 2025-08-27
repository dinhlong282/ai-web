import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";

dotenv.config();

const app = express();

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173", // frontend local
  "https://ai-web-jkqe.onrender.com", // thay bằng URL frontend Render thật
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // cho Postman, curl
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("Not allowed by CORS"), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// xử lý preflight request
app.options("*", cors());

// ================= Body parser =================
app.use(express.json({ limit: "50mb" }));

// ================= Routes =================
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello from DALL.E!" });
});

// ================= Start server =================
const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    const PORT = process.env.PORT || 8080; // dùng port từ Render nếu có
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
