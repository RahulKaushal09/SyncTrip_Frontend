import type { ReactNode } from "react";
import "./landing.css";
import "./extras.css";

/**
 * Shared shell for the category subdomains. Each page wraps itself in
 * <div className="stl p-...">; landing.css hides the main site's navbar,
 * announcement bar and footer whenever a .stl root is on the page.
 */
export default function HangoutsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="preload" href="/hangouts/fonts/ClashDisplay-Semibold.ttf" as="font" type="font/ttf" crossOrigin="" />
      <link rel="preload" href="/hangouts/fonts/Satoshi-Medium.ttf" as="font" type="font/ttf" crossOrigin="" />
      {children}
    </>
  );
}
