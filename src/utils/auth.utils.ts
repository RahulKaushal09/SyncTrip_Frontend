import { cookies } from "next/headers";
import { User } from "@/types";
import { UserField } from "@/constants";

export class AuthServices {
    static async getServerUser(fields: UserField[]): Promise<User | null> {
        const cookiesList = await cookies(); // no need for await
        const token = cookiesList.get("userToken")?.value;

        if (!token) return null;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/users/getUserWithSpecificFields`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                cache: "no-store",
                body: JSON.stringify({ fields }),
            });
            if (!res.ok) return null;

            const user: User = await res.json();
            return user;
        } catch (err) {
            console.error("Auth fetch error:", err);
            return null;
        }
    }


}