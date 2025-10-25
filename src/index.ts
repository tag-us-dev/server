// ----- 보안 미들웨어 설정
// Helmet 사용 -> 보안 HTTP 헤더 추가
// express-rate-limit 사용 -> 브루트 포스 공격 방지
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// ----- 기본 express 애플리케이션 설정
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // IP당 요청 제한
  })
);

app.get("/", (req, res) => {
  res.send("Hello Wooooorld!");
});

app.listen(PORT, () => {
  console.log(`서버는 http://localhost:${PORT}에서 실행 중`);
});
