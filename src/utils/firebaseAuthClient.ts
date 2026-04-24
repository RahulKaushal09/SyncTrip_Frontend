import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth
} from "firebase/auth";
import { getFirebaseApp } from "./firebaseApp";
// import { firebaseApp } from "./firebaseApp";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY!,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APPID!,
// };

// function getFirebaseApp() {
//   if (!getApps().length) return initializeApp(firebaseConfig);
//   return getApps()[0];
// }

// export const auth = getAuth(getFirebaseApp());
// const firebaseApp = getFirebaseApp();
// export const auth = getAuth(firebaseApp);


let confirmationResult: ConfirmationResult | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;
let authInstance: Auth | null = null;

/**
 * Dynamically load Firebase only when needed
 */
async function getAuthInstance() {
  if (!authInstance) {
    const { getAuth, RecaptchaVerifier } = await import("firebase/auth");
    const { getFirebaseApp } = await import("./firebaseApp");

    const app = getFirebaseApp();
    authInstance = getAuth(app);
  }
  return authInstance;
}

// let confirmationResult: ConfirmationResult | null = null;
// let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Init or reuse invisible recaptcha
 */
async function getRecaptcha() {
  const auth = await getAuthInstance();
  if (!recaptchaVerifier) {
    try {
      recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response: string) => {
          // console.log("reCAPTCHA solved:", response);
        },
        "expired-callback": () => {
          // console.log("reCAPTCHA expired");
          recaptchaVerifier?.clear(); // Reset on expire
        },
      });
    } catch (err) {
      console.error("Failed to create RecaptchaVerifier:", err);
      throw err;
    }
  }
  return recaptchaVerifier;
}

/**
 * Send OTP
 */
// export async function sendOtp(phone: string) {
//   const verifier = getRecaptcha();
//   confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
// }
export async function sendOtp(phone: string) {
  try {
    const auth = await getAuthInstance();
    const verifier = await getRecaptcha();
    // Clear any previous result
    confirmationResult = null;
    confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
    return confirmationResult;
  }
  //  eslint-disable-next-line 
  catch (error: any) {
    console.error('Send OTP error:', error);
    // Re-throw for component handling
    throw new Error(error.code === 'auth/invalid-app-credential'
      ? 'App configuration issue—check Firebase console domains.'
      : 'Failed to send OTP. Please try again.');
  }
}

/**
 * Verify OTP and return Firebase ID token
 */
export async function verifyOtp(code: string): Promise<string> {
  if (!confirmationResult) {
    throw new Error("OTP not sent");
  }
  const result = await confirmationResult.confirm(code);
  return result.user.getIdToken();
}
