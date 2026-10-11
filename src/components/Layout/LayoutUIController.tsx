"use client";

import { usePathname } from "next/navigation";
import NavbarClient from "@/components/Navbar/NavbarClient";
import { redirectToStore } from "@/utils/redirectToStore";
import { useRouter } from "next/navigation";
import path from "path";

export default function LayoutUIController({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // The club portal runs inside the app's WebView, which supplies its own close and
  // reload — no navbar, announcement bar or spacer belongs on top of it.
  const isClubPortal = pathname === "/club" || pathname.startsWith("/club/");

  const hideUI =
    (pathname.includes("userTrip/") && pathname.includes("/planner")) ||
    (pathname.includes("userTrip/") && pathname.includes("/matching")) ||
    pathname.includes("/chats") ||
    pathname.includes("/checkout") ||
    isClubPortal ||
    pathname.includes("/careers/linkedin/march-2026/assessment") || /^\/blogs\/.+/.test(pathname);

  return (
    <>
      {!hideUI && <NavbarClient />}

      {!hideUI && (
        <div onClick={() => redirectToStore({ campaign: "site_announcement", term: pathname || "home", content: "bar" })} className="announcement-bar cursor-pointer" style={{ height: 25 }}>
          <div className="announcement-track">
            <div className="announcement-content">
              {/* Wallet credit, not cash: it can't be withdrawn and only pays for club events and SyncTrip Plus. */}
              <span className="uppercase">Meet new people, earn up to ₹150 a month in SyncTrip credit · Spend it on club events near you</span>
            </div>
          </div>
        </div>
      )}
      <div style={{ height: "25px" }}></div>
      {children}
    </>
  );
}
