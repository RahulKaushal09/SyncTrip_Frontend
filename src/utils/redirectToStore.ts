import { APP_LINKS } from "@/constants";

/**
 * Returns the correct store URL for the current platform without navigating.
 * Use this for `<a href>` CTAs (a real anchor works even if JS fails and gets
 * correct OS-level long-press / share behavior). Desktop / unknown falls back
 * to the marketing home so the visitor isn't dumped into a store on a device
 * that can't install the app.
 */
export const getStoreUrl = (): string => {
    if (typeof navigator === "undefined") return APP_LINKS.WEB_HOME;

    const ua = navigator.userAgent || navigator.vendor || "";

    // iOS detection — iPhone/iPad/iPod plus iPadOS (which masquerades as Mac).
    const isIOS =
        /iPhone|iPad|iPod/i.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /android/i.test(ua);

    if (isIOS) return APP_LINKS.APP_STORE;
    if (isAndroid) return APP_LINKS.PLAY_STORE;
    return APP_LINKS.WEB_HOME;
};

export const redirectToStore = () => {
    const playStoreUrl = APP_LINKS.PLAY_STORE;
    const appStoreUrl = APP_LINKS.APP_STORE;

    const userAgent = navigator.userAgent || navigator.vendor;

    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    if (isAndroid) {
        window.open(playStoreUrl, "_blank");
    } else if (isIOS) {
        window.open(appStoreUrl, "_blank");
    } else {
        // Desktop fallback (usually Play Store)
        window.open(playStoreUrl, "_blank");
    }
};