import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { firebaseApp } from "./firebaseApp";

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
export const auth = getAuth(firebaseApp);

let confirmationResult: ConfirmationResult | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Init or reuse invisible recaptcha
 */
function getRecaptcha() {
  if (!recaptchaVerifier) {
    try {
      recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response: string) => {
          console.log("reCAPTCHA solved:", response);
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
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
    const verifier = getRecaptcha();
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
