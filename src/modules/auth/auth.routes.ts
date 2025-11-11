import express from "express";
import axios from "axios";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";

const router = express.Router();

// 카카오 토큰 발급
router.post("/kakao/login", async (req, res) => {
  try {
    const { code } = req.body;

    // 카카오 access token 발급
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_uri: process.env.KAKAO_REDIRECT_URI,
          code: code,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // 카카오 사용자 정보 조회
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const kakaoUser = userResponse.data;
    const kakaoId = kakaoUser.id.toString();
    const email = kakaoUser.kakao_account?.email || null;
    const nickname = kakaoUser.kakao_account?.profile?.nickname || "익명";

    // fire store에 사용자 정보 저장/업데이트
    const db = admin.firestore();
    const userRef = db.collection("users").doc(kakaoId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        // 뉴 사용자일 경우 정보 저장
        kakaoId,
        email,
        nickname,
        provider: "kakao",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await userRef.update({
        // 기존 사용자일 경우 정보 업데이트
        email,
        nickname,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // JWT 토큰 발급
    const jwtToken = jwt.sign(
      {
        userId: kakaoId,
        email,
        provider: "kakao",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: kakaoId,
        email,
        nickname,
      },
    });
  } catch (error) {
    console.error("카카오 로그인 에러:", error);
    res.status(500).json({
      success: false,
      message: "카카오 로그인 실패",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
