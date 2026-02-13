export {};

declare global {
  interface Window {
    clarity?: (
      command: "identify" | "set" | "event" | "upgrade" | "consent",
      customId?: string,
      sessionId?: string,
      pageId?: string,
      friendlyName?: string
    ) => void;
  }
}