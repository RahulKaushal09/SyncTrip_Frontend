// components/Navbar/NavbarClient.tsx
"use client";

import React, { useState, useEffect, use } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Dropdown } from "react-bootstrap";
import Image from "next/image";
import SyncTripLogo from "../../assets/images/logoWeb.png";
import { PageTypeEnum, UserFields } from "@/constants";
import { useLogin } from "../providers/LoginProvider";
import "../../../styles/navbar/navbar.css";
import { User } from "@/types";
import Cookies from 'js-cookie';

const NavbarClient = ({ }) => {
  const [LoadingUser, setLoadingUser] = useState(true);
  const cookie = Cookies.get('userInfo');
  const [user, setUser] = useState<User | null>(() => {
    try {

      return cookie ? JSON.parse(cookie) : null;
    } catch {

      return null;
    }
  });
  useEffect(() => {
    setLoadingUser(false);
  }, [user]);

  // let user: User | null = null;

  // // const cookieStore = cookies(); // Safe on server
  // const cookie = Cookies.get('userInfo');

  // if (cookie) {
  //   try {
  //     user = JSON.parse(cookie);
  //   } catch {
  //     user = null;
  //   }
  // }
  const pathname = usePathname();
  const router = useRouter();
  const { logout, openLogin } = useLogin();
  const [pageType, setPageType] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeDrawer = () => setMobileNavOpen(false);
  const handleCtaAction = () => router.push("/trips");

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const user: User | null = await ApiService.getClientUser([
  //         UserFields.ID,
  //         UserFields.NAME,
  //         UserFields.PROFILE_PICTURE,
  //       ]);
  //       if (user) {
  //         setUser(user);
  //         Cookies.set('userInfo', JSON.stringify(user), { path: '/' });
  //         console.timeEnd("Navbar Client User Fetch Time");
  //       }
  //     } catch {
  //       setUser(null);
  //     }
  //   };
  //   fetchUser();
  // }, []);

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
  const handleLoginClick = () => openLogin();
  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ paddingTop: "10px" }}>
      <div className="container-fluid">
        <Link href="/" className="navbar-brand" style={{ width: "100px" }}>
          <Image src={SyncTripLogo} alt="SyncTrip" style={{ width: "100%" }} />
        </Link>

        <button className="navbar-toggler" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav" style={{ visibility: 'visible' }}>
          <ul className="navbar-nav" style={{ alignItems: "center" }}>
            <li className="nav-item" onClick={handleCtaAction} style={{ cursor: "pointer" }}>
              <span className="nav-link">
                {pageType === PageTypeEnum.TRIP ? "Create Trip" : "Trips"}
              </span>
            </li>

            <li className="nav-item dropdown">
              {LoadingUser ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
                  <div
                    className="skeleton skeleton-profile"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'skeleton-loading 1.5s infinite'
                    }}
                  />
                  {/* User name or login/register button skeleton */}
                  <div
                    className="skeleton skeleton-button"
                    style={{
                      width: '120px',
                      height: '24px',
                      borderRadius: '4px',
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'skeleton-loading 1.5s infinite'
                    }}
                  />


                </div>
              ) :
                !LoadingUser && user ? (
                  <Dropdown show={showDropdown} onToggle={setShowDropdown}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Dropdown.Toggle variant="link" onClick={toggleDropdown} style={{
                        padding: "0",
                        border: "none",
                        background: "transparent",
                        boxShadow: "none",
                        display: "flex",
                        alignItems: "center",
                        color: "black",
                        gap: "10px"
                      }}>
                        <Image
                          src={user.profile_picture?.[0] || "https://via.placeholder.com/40"}
                          alt="Profile"
                          width={40}
                          height={40}
                          style={{ borderRadius: "50%", objectFit: "cover" }}
                        />
                        <span>{user.name}</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.Item as={Link} href={`/user/${user.id}`}>Profile</Dropdown.Item>
                        <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                      </Dropdown.Menu>
                    </div>
                  </Dropdown>
                ) : (
                  <button className="btn btn-black ms-2" onClick={handleLoginClick}>Login / Register</button>
                )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarClient;
