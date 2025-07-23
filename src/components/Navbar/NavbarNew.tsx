"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Dropdown } from "react-bootstrap";
import Image from "next/image";
import SyncTripLogo from "../../assets/images/logoWeb.png";
import { PageTypeEnum } from "@/constants";
import { useLogin } from "../providers/LoginProvider";
import "../../../styles/navbar/navbar.css";

interface NavbarProps {
  ctaAction?: () => void; // Make optional
}

const Navbar = ({ ctaAction }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, openLogin, logout } = useLogin();
  const [isClient, setIsClient] = useState(false);


  const [showDropdown, setShowDropdown] = useState(false);
  const [pageType, setPageType] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeDrawer = () => setMobileNavOpen(false);

  // Default CTA action if none provided
  const handleCtaAction = ctaAction || (() => {
    console.log('CTA clicked - default action');
    router.push('/trips/create');
  });
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (pathname === `/${PageTypeEnum.TRIP}`) {
      setPageType(PageTypeEnum.TRIP);
    } else if (pathname === `/${PageTypeEnum.LOCATION}`) {
      setPageType(PageTypeEnum.LOCATION);
    } else {
      setPageType(PageTypeEnum.HOME);
    }
  }, [pathname]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLoginClick = () => {
    openLogin((user) => {
      // Optional: Handle successful login
      console.log('User logged in:', user);
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand" style={{ color: "#65CAD3", fontSize: "30px", fontWeight: "700", width: "100px" }}>
          <Image src={SyncTripLogo} alt="SyncTrip" style={{ width: "100%", marginLeft: "10px" }} />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav" style={{ alignItems: "center" }}>
            {pageType === PageTypeEnum.TRIP ? (
              <li className="nav-item" style={{ cursor: "pointer" }} onClick={handleCtaAction}>
                <span className="nav-link">Create Trip</span>
              </li>
            ) : (
              <li className="nav-item" style={{ cursor: "pointer" }} onClick={() => router.push("/trips")}>
                <span className="nav-link">Trips</span>
              </li>
            )}

            <li className="nav-item dropdown" style={{ cursor: "pointer" }}>
              {isClient && user ? (
                <Dropdown show={showDropdown} onToggle={setShowDropdown}>
                  <div style={{ display: "flex", alignItems: "center", color: "black" }}>
                    <Dropdown.Toggle
                      variant="link"
                      style={{
                        padding: 0,
                        border: "none",
                        background: "transparent",
                        boxShadow: "none",
                        display: "flex",
                        alignItems: "center",
                        color: "black",
                        gap: "10px"
                      }}
                      onClick={toggleDropdown}
                    >

                      <div style={{ display: "flex", alignItems: "center", color: "black" }}>


                        <Image
                          src={user?.profile_picture?.[0] || "https://via.placeholder.com/40"}
                          alt="Profile"
                          width={40}
                          height={40}
                          style={{ borderRadius: "50%", objectFit: "cover" }}
                        />
                        <span className="ms-2" style={{ color: "black", fontSize: "16px", fontWeight: "500" }}>
                          {user?.name || "User"}
                        </span>
                      </div>

                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                      <Dropdown.Item as={Link} href={`/user/${user.id}`}>Profile</Dropdown.Item>
                      <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </div>
                </Dropdown>
              ) : (
                <button className="btn btn-black ms-2" onClick={handleLoginClick}>
                  Login / Register
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>

      {mobileNavOpen && <div className="mobile-overlay" onClick={closeDrawer}></div>}

      <div className={`mobile-drawer ${mobileNavOpen ? "open" : ""}`}>
        <div className="d-flex justify-content-between align-items-center p-3">
          {isClient && user ? (
            <div className="d-flex align-items-center">
              <Image
                src={user?.profile_picture?.[0] || "https://via.placeholder.com/40"}
                alt="Profile"
                width={40}
                height={40}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
              <span className="ms-2">{user?.name || "User"}</span>
            </div>
          ) : (
            <Link href="/" className="navbar-brand" style={{ color: '#65CAD3', fontSize: "30px", fontWeight: "700", width: "100px" }}>
              <Image src={SyncTripLogo} alt="SyncTrip" style={{ width: "100%" }} />
            </Link>
          )}

          <div className="drawer-header">
            <span className="drawer-close" onClick={closeDrawer}>&times;</span>
          </div>
        </div>

        <ul className="navbar-nav px-3">
          {pageType === PageTypeEnum.TRIP ? (
            <li className="nav-item" onClick={() => { handleCtaAction(); closeDrawer(); }}>
              <span className="nav-link">Create Trip</span>
            </li>
          ) : (
            <li className="nav-item" onClick={() => { router.push("/trips"); closeDrawer(); }}>
              <span className="nav-link">Trips</span>
            </li>
          )}

          {isClient && user ? (
            <li className="nav-item" onClick={() => { logout(); closeDrawer(); }}>
              <span className="nav-link">Logout</span>
            </li>
          ) : (
            <li className="nav-item" onClick={() => { handleLoginClick(); closeDrawer(); }}>
              <button className="btn btn-black mt-2 w-100">
                Login / Register
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav >
  );
};

export default Navbar;
