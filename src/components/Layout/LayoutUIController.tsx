"use client";

import { usePathname } from "next/navigation";
import NavbarClient from "@/components/Navbar/NavbarClient";

export default function LayoutUIController({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideUI =
    (pathname.includes("userTrip/") && pathname.includes("/planner")) ||
    (pathname.includes("userTrip/") && pathname.includes("/matching")) ||
    pathname.includes("/chats");

  return (
    <>
      {!hideUI && <NavbarClient />}

      {!hideUI && (
        <div className="announcement-bar" style={{ height: 25 }}>
          <div className="announcement-track">
            <div className="announcement-content">
              <span>SYNCTRIP APP IS LAUNCHING THIS MARCH!</span>
            </div>
          </div>
        </div>
      )}
              <div style={{ height: "25px" }}></div>


      {children}
    </>
  );
}
