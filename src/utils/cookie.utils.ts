import { cookies } from "next/headers";

export class CookieUtils {
    static async get(name: string): Promise<string | null> {
        // CLIENT SIDE
        if (typeof window !== "undefined") {
            const match = document.cookie
                .split("; ")
                .find((row) => row.startsWith(name + "="));

            return match
                ? decodeURIComponent(match.substring(name.length + 1))
                : null;
        }

        // SERVER SIDE
        try {
            const cookieStore = await cookies();
            return cookieStore.get(name)?.value ?? null;
        } catch {
            return null;
        }
    }

    static async getDecoded(name: string): Promise<string | null> {
        const value = await this.get(name);
        return value ? decodeURIComponent(value) : null;
    }

    // Server Side Login Check
    static async isUserLoggedIn(): Promise<boolean> {
        const token = await this.get("userToken");
        return !!token;
    }
}
