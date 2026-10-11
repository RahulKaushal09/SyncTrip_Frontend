import { APP_LINKS } from "@/constants";
import { appStoreUrl, playStoreUrl, type StoreTrack } from "@/lib/storeLinks";

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

const isTrack = (t: unknown): t is StoreTrack => !!t && typeof t === "object" && "campaign" in t;

/**
 * Opens the right store for this device, with UTM tags so the install is attributed
 * to the page and button that sent it (see src/lib/storeLinks.ts). Safe to pass
 * straight to onClick: the click event is ignored and a default tag is used.
 */
export const redirectToStore = (track?: StoreTrack | unknown) => {
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    const t: StoreTrack = isTrack(track)
        ? track
        : { campaign: "site_button", term: path || "home", content: "store_redirect" };

    const userAgent = navigator.userAgent || navigator.vendor;
    const isIOS =
        /iPhone|iPad|iPod/i.test(userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    // Android and desktop both go to Play (desktop visitors can install from the web).
    window.open(isIOS ? appStoreUrl(t) : playStoreUrl(t), "_blank");
};
