// app/verify/page.tsx  ← SERVER COMPONENT (SSR)

import FaceVerificationClient from "./FaceVerificationClient";
import AlreadyVerified from "./AlreadyVerified";
import InvalidToken from "./InvalidToken";
import { UserApiService } from "@/utils/user.api.utils";

interface PageProps {
    searchParams: Promise<{ token?: string }>;
}

function decodeJwtPayload(token: string): { id?: string; name?: string; exp?: number } | null {
    try {
        const base64Url = token.split(".")[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const json = Buffer.from(base64, "base64").toString("utf-8");
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function isTokenExpired(exp?: number): boolean {
    if (!exp) return false; // if no exp claim, treat as non-expiring
    return Date.now() / 1000 > exp; // exp is in seconds
}

export default async function FaceVerificationPage({ searchParams }: PageProps) {
    const { token } = await searchParams;

    // 1. No token in query string
    if (!token) {
        return <InvalidToken />;
    }

    // 2. Decode token — invalid structure
    const payload = decodeJwtPayload(token);
    if (!payload) {
        return <InvalidToken />;
    }

    // 3. Token expired
    if (isTokenExpired(payload.exp)) {
        return <InvalidToken expired />;
    }

    // 4. No valid user id inside token
    if (!payload.id) {
        return <InvalidToken />;
    }

    const userName = payload.name ?? null;

    // 5. Check whether face is already verified
    const { success, isVerified } = await UserApiService.checkFaceVerified(token);

    // 6a. Already verified → show static screen
    if (success && isVerified) {
        return <AlreadyVerified userName={userName} />;
    }

    // 6b. Not yet verified → interactive client component
    return <FaceVerificationClient token={token} userName={userName} invalidToken={false} />;
}