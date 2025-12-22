// utils/firebaseAuthClient.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID!,
};

function getFirebaseApp() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0];
}

export const auth = getAuth(getFirebaseApp());

let confirmationResult: any = null;

export async function sendOtp(phone: string) {
  if (typeof window === "undefined") return;

  const verifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    { size: "invisible" }
  );

  confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
}

export async function verifyOtp(code: string) {
  if (!confirmationResult) {
    throw new Error("OTP not sent");
  }

  const result = await confirmationResult.confirm(code);
  return await result.user.getIdToken(); // 🔥 Firebase ID token
}
