// components/Navbar/NavbarClient.tsx
"use client";

import React, { useState, useEffect, use } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Dropdown } from "react-bootstrap";
import Image from "next/image";
import SyncTripLogo from "../../assets/images/logoWeb.png";
import { PageTypeEnum, ROUTES, UserFields } from "@/constants";
import { useLogin } from "../providers/LoginProvider";
import "../../../styles/navbar/navbar.css";
import { User } from "@/types";
import Cookies from 'js-cookie';
import { useLoader } from '@/components/providers/LoaderContext';
// import { triggerLogin } from "@/utils";
import { redirect } from 'next/navigation';

const NavbarClient = ({ }) => {
  const [LoadingUser, setLoadingUser] = useState(true);
  const { user, isLoggedIn, logout, openLogin } = useLogin(); // ⬅️ use context directly
  const pathname = usePathname();
  const shouldHideNavbar = pathname.includes('userTrip/planner');

  // const cookie = Cookies.get('userInfo');
  // const [user, setUser] = useState<User | null>(() => {
  //   try {

  //     return cookie ? JSON.parse(cookie) : null;
  //   } catch {

  //     return null;
  //   }
  // });

  useEffect(() => {
    // as soon as context has finished checking localStorage, stop loading skeleton
    setLoadingUser(false);
  }, [user, isLoggedIn]);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 2); // 10px scroll threshold
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
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
  const { showLoader } = useLoader();

  // const pathname = usePathname();
  const router = useRouter();
  // const { logout, openLogin } = useLogin();
  const [pageType, setPageType] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeDrawer = () => setMobileNavOpen(false);
  // const redirectBtnClick = (redirectionLink: string) => router.push(redirectionLink);
  const redirectBtnClick = (redirectionLink: string) => {
    if (pathname !== redirectionLink) showLoader();
    router.push(redirectionLink);
  };
  const handleCtaAction = () => {
    redirectBtnClick("/trips");
  };

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
    <nav className={`navbar navbar-expand-lg navbar-light ${isSticky ? "sticky" : ""}`} style={{ paddingTop: "10px", display: shouldHideNavbar ? 'none' : 'flex' }}>
      <div className="container-fluid">
        <Link href="/" onClick={() => redirectBtnClick("/")} className="navbar-brand" style={{ width: "100px" }}>
          <Image src={SyncTripLogo} alt="SyncTrip" style={{ width: "100%" }} />
        </Link>

        <button className="navbar-toggler" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* <div className={`collapse navbar-collapse justify-content-end ${mobileNavOpen ? 'show' : ''}`} id="navbarNav"> */}

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav" >
          <ul className="navbar-nav" style={{ alignItems: "center", gap: "20px" }}>
            <li className="nav-item"
              onClick={() => redirectBtnClick(ROUTES.EXPLORE)}
              style={{ cursor: "pointer" }}>
              <span className="nav-link">
                Explore
              </span>
            </li>
              <li className="nav-item"
                onClick={() => redirectBtnClick(ROUTES.BLOGS)}
                style={{ cursor: "pointer" }}>
                <span className="nav-link">
                  Blogs
                </span>
              </li>
              {isLoggedIn && <li className="nav-item"
              onClick={() => redirectBtnClick(ROUTES.USER_TRIPS)}
              style={{ cursor: "pointer" }}>
              <span className="nav-link">
                My Trips
              </span>
            </li>}

            <li className="nav-item" onClick={handleCtaAction} style={{ cursor: "pointer" }}>
              <span className="nav-link">
                {pageType === PageTypeEnum.TRIP ? "Create Trip" : "Group Trips"}
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
                  <button className="btn btn-primary ms-2" onClick={handleLoginClick}>Login / Register</button>
                )}
            </li>
          </ul>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="mobile-overlay" onClick={closeDrawer}></div>
      )}

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileNavOpen ? "open" : ""}`}>
        <div className='' style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem" }}>
          {/* <div><a className="navbar-brand" href="/" style={{ display: 'inline-block', color: '#65CAD3', fontSize: "30px", fontWeight: "700", width: "100px" }}>
                        <img src={SyncTripLogo} alt="SyncTrip" style={{ width: "100%", }} />
                    </a>
                    </div> */}
          {user ? (
            <>
              <div
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >

                {/* <img
                  src={user.profile_picture?.[0] || "https://via.placeholder.com/40"}
                  alt="Profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                /> */}
                <Image
                  src={user.profile_picture?.[0] || "https://via.placeholder.com/40"}
                  alt="Profile"
                  width={40}
                  height={40}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <span className="ms-2 mt-2">{user?.name || "User"}</span>

              </div>


            </>
          ) : (
            <div>
              {/* <a className="navbar-brand" href="/" style={{ display: 'inline-block', color: '#65CAD3', fontSize: "30px", fontWeight: "700", width: "100px" }}> */}
              <Link href="/" onClick={() => redirectBtnClick("/")} className="navbar-brand" style={{ display: 'inline-block', color: '#65CAD3', fontSize: "30px", fontWeight: "700", width: "100px" }}>
                <Image src={SyncTripLogo} alt="SyncTrip" style={{ width: "100%" }} />
                {/* <img src={SyncTripLogo.src} alt="SyncTrip" style={{ width: "100%", }} /> */}
              </Link>
            </div>
          )}
          <div className="drawer-header">
            <span className="drawer-close" onClick={closeDrawer}>&times;</span>
          </div>
        </div>
        <ul className="navbar-nav" style={{ alignItems: "flex-start", padding: "1rem" }}>
          <li className="nav-item" onClick={() => { redirectBtnClick(ROUTES.EXPLORE); closeDrawer(); }}>
            <span className="nav-link">Explore</span>
          </li>
          <li className="nav-item" onClick={() => { redirectBtnClick(ROUTES.BLOGS); closeDrawer(); }}>
            <span className="nav-link">Blogs</span>
          </li>
          {isLoggedIn && <li className="nav-item" onClick={() => { redirectBtnClick(ROUTES.USER_TRIPS); closeDrawer(); }}>
            <span className="nav-link">My Trips</span>
          </li>}
          {pageType == PageTypeEnum.TRIP ? (
            <li className="nav-item" onClick={handleLoginClick}>
              <span className="nav-link">Create Trip</span>
            </li>
          ) : (
            <li className="nav-item" onClick={() => { redirectBtnClick(ROUTES.TRIPS); closeDrawer(); }}>
              <span className="nav-link">Group Trips</span>
            </li>
          )}

          {user ? (
            // <li className="nav-item" onClick={() => { window.location.href = "/profile"; closeDrawer(); }}>
            //     <span className="nav-link">Profile</span>
            // </li>
            <li className="nav-item" onClick={logout}>
              <span className="nav-link">Logout</span>
            </li>
          ) : (
            <li className="nav-item" onClick={() => { handleLoginClick(); closeDrawer(); }}>
              <button className="btn btn-primary mt-2" style={{ width: "100%" }}>
                Login / Register
              </button>
            </li>
          )}


        </ul>
      </div>
    </nav>
  );
};

export default NavbarClient;
