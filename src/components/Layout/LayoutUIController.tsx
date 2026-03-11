"use client";

import { usePathname } from "next/navigation";
import NavbarClient from "@/components/Navbar/NavbarClient";
import { useRouter } from "next/navigation";

export default function LayoutUIController({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const hideUI =
    (pathname.includes("userTrip/") && pathname.includes("/planner")) ||
    (pathname.includes("userTrip/") && pathname.includes("/matching")) ||
    pathname.includes("/chats") || 
    pathname.includes("/careers/linkedin/march-2026/assessment");

  return (
    <>
      {!hideUI && <NavbarClient />}

      {!hideUI && (
        <div onClick={() => window.open("https://play.google.com/store/apps/details?id=com.synctrip", "_blank")} className="announcement-bar cursor-pointer" style={{ height: 25 }}>
          <div className="announcement-track">
            <div className="announcement-content">
              <span className="uppercase">Stop planning, start packing. SyncTrip App is now live!</span>
            </div>
          </div>
        </div>
      )}
      <div style={{ height: "25px" }}></div>
      {children}
    </>
  );
}
