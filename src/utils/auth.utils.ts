import { cookies } from "next/headers";
import { User } from "@/types";
import { UserField } from "@/constants";
import apiClient from "./apiClient";

export class AuthServices {
    static async verifyPhone(firebaseToken: string, phone: string): Promise<User | null> {

        try {
            const res = apiClient.post("/auth/verifyAndAddPhone", {
                firebaseToken,
                phone,
            });
            const user: User = (await res).data.user;
            return user;
        } catch (err) {
            console.error("Auth verifyOtp error:", err);
            return null;
        }
    }
    static async verifyPhoneAndUpdateName(firebaseToken: string, phone: string, name: string): Promise<User | null> {

        try {
            const res = apiClient.post("/auth/verifyAndAddPhone", {
                firebaseToken,
                phone,
                name,
            });
            const user: User = (await res).data.user;
            return user;
        } catch (err) {
            console.error("Auth verifyOtp error:", err);
            return null;
        }
    }
    // static async getServerUser(fields: UserField[]): Promise<User | null> {
    //     const cookiesList = await cookies(); // no need for await
    //     const token = cookiesList.get("userToken")?.value;

    //     if (!token) return null;

    //     try {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/users/getUserWithSpecificFields`, {
    //             method: "POST",
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //                 "Content-Type": "application/json",
    //             },
    //             cache: "no-store",
    //             body: JSON.stringify({ fields }),
    //         });
    //         if (!res.ok) return null;

    //         const user: User = await res.json();
    //         return user;
    //     } catch (err) {
    //         console.error("Auth fetch error:", err);
    //         return null;
    //     }
    // }

    // msg91 otp
    static async sendOTPViaMsg91(phone: string): Promise<{ success: boolean; message: string }> {
        try {
            const res = await apiClient.post("/auth/send-otp-for-signup", { phone });
            return res.data;
        }
        catch (err) {
            console.error("Error sending OTP via Msg91:", err);
            return { success: false, message: "Failed to send OTP. Please try again." };
        }
    }

    static async verifyOTPViaMsg91AndSignIn(phone: string, otp: string): Promise<{ success: boolean; message: string; user?: User, token?: string, anyTripCreatedByUser?: boolean }> {
        try {
            const res = await apiClient.post("/auth/verify-otp", { phone, otp });
            return res.data;
        }
        catch (err) {
            console.error("Error verifying OTP via Msg91:", err);
            return { success: false, message: "Failed to verify OTP. Please try again." };
        }
    }

    static async verifyOtpViaMsg91AndUpdateNumber(phone: string, otp: string): Promise<{ success: boolean; message: string; user?: User }> {
        try {
            const res = await apiClient.post("/auth/verify-Otp-Update-Phone", { phone, otp });
            return res.data;
        }
        catch (err) {
            console.error("Error verifying OTP via Msg91 for update phone:", err);
            return { success: false, message: "Failed to verify OTP. Please try again." };
        }
    }
}