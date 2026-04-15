import { APP_LINKS } from "@/constants";

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