import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import admin from "firebase-admin";
import serviceAccount from "./config/serviceAccountKey.json" with { type: "json" };
import authRouter from "./modules/auth/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Firebase Admin 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

// 보안 미들웨어
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
