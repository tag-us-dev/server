// Admin SDK init + emulators
import * as admin from "firebase-admin";
// firebase의 "서비스 계정"에서 발급 받은 비밀 키 파일 사용
import serviceAccount from "./serviceAccountKey.json";

// firebase 초기화
const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });

    console.log("firebase admin 초기화 됐따!");

    // 개발 환경에서 에뮬레이터 연결
    // if (config.nodeEnv === "development") {
    //   const db = admin.firestore();
    //   db.settings({
    //     host: "localhost:8080",
    //     ssl: false,
    //   });

    //   console.log("fireStore Emulator 연결 완");
    // }
  }
  return admin;
};

export const firebase = initializeFirebase();
export const db = firebase.firestore();
// export const auth = firebase.auth();
// export const storage = firebase.storage();
