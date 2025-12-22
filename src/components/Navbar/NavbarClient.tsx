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
import { set } from "lodash";
import FeedbackModal from "../common/FeedbackModal";
import NotificationBell from "./NotificationBell";
import ChatIcon from "./ChatIcon";
import path from "path";

const NavbarClient = ({ }) => {
  const [LoadingUser, setLoadingUser] = useState(true);
  const { user, isLoggedIn, logout, openLogin } = useLogin(); // ⬅️ use context directly
  const pathname = usePathname();
  const shouldHideNavbar = pathname.includes('userTrip/planner') || pathname.includes('userTrip/matching') || pathname.includes('/chats');

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
  const [ismobile, setIsMobile] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [feedBackFormOpen, setFeedbackFormOpen] = useState(false);
  const closeDrawer = () => setMobileNavOpen(false);
  // const redirectBtnClick = (redirectionLink: string) => router.push(redirectionLink);
  const redirectBtnClick = (redirectionLink: string) => {
    if (pathname !== redirectionLink) showLoader();
    router.push(redirectionLink);
  };
  const createTripOrGroupTripBtn = () => {
    if (pageType === PageTypeEnum.TRIP) {
      openLogin(() => { redirectBtnClick(ROUTES.CREATE_TRIP) });
    }
    else {
      redirectBtnClick(ROUTES.GROUP_TRIPS);
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 990); // Example breakpoint for mobile
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (route: string) => {
    if (route === ROUTES.BLOGS) {
      if (pathname.includes(ROUTES.BLOGS + "/")) return false;
      else if (pathname === ROUTES.BLOGS) return true;
      return false;
    }
    if (route === ROUTES.EXPLORE) {
      if (pathname.includes(ROUTES.EXPLORE + "/")) return false;
      else if (pathname === ROUTES.EXPLORE) return true;
      return false;
    }
    if (route === ROUTES.USER_TRIPS) {
      if (pathname.includes(ROUTES.USER_TRIPS + "/")) return false;
      else if (pathname === ROUTES.USER_TRIPS) return true;
      return false;
    }
    if (route === ROUTES.CREATE_TRIP) {
      return pathname === ROUTES.CREATE_TRIP;
    }
    if (route === ROUTES.GROUP_TRIPS) {
      return pathname === ROUTES.GROUP_TRIPS;
    }
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
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
        {ismobile ? (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <NotificationBell />
            <ChatIcon />
            <button className="navbar-toggler" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        ) :
          <button className="navbar-toggler" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
            <span className="navbar-toggler-icon"></span>
          </button>}
        {/* <div className={`collapse navbar-collapse justify-content-end ${mobileNavOpen ? 'show' : ''}`} id="navbarNav"> */}

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav" >
          <ul className="navbar-nav" style={{ alignItems: "center", gap: "20px" }}>
            {isLoggedIn &&
              <li className="nav-item"
                onClick={() => {
                  if (!isActive(ROUTES.USER_TRIPS)) {
                    redirectBtnClick(ROUTES.USER_TRIPS);
                  }
                }}
                style={{
                  cursor: isActive(ROUTES.USER_TRIPS) ? "default" : "pointer",
                  pointerEvents: isActive(ROUTES.USER_TRIPS) ? "none" : "auto",
                  borderBottom: isActive(ROUTES.USER_TRIPS) ? "2px solid var(--secondary-1)" : "",
                }}
              // onClick={() => redirectBtnClick(ROUTES.USER_TRIPS)}
              // style={{ cursor: "pointer" }}
              >
                <span className="nav-link">
                  My Trips
                </span>
              </li>

            }
            <li className="nav-item"
              onClick={() => {
                if (!isActive(ROUTES.EXPLORE)) {
                  redirectBtnClick(ROUTES.EXPLORE);
                }
              }}
              style={{
                cursor: isActive(ROUTES.EXPLORE) ? "default" : "pointer",
                pointerEvents: isActive(ROUTES.EXPLORE) ? "none" : "auto",
                borderBottom: isActive(ROUTES.EXPLORE) ? "2px solid var(--secondary-1)" : "",
              }}
            // onClick={() => redirectBtnClick(ROUTES.EXPLORE)}
            // style={{ cursor: "pointer" }}
            >
              <span className="nav-link">
                Explore
              </span>
            </li>
            <li className="nav-item"
              onClick={() => {
                if (!isActive(ROUTES.BLOGS)) {
                  redirectBtnClick(ROUTES.BLOGS);
                }
              }}
              style={{
                cursor: isActive(ROUTES.BLOGS) ? "default" : "pointer",
                pointerEvents: isActive(ROUTES.BLOGS) ? "none" : "auto",
                borderBottom: isActive(ROUTES.BLOGS) ? "2px solid var(--secondary-1)" : "",
              } as React.CSSProperties}
            // onClick={() => redirectBtnClick(ROUTES.BLOGS)}
            // style={{ cursor: "pointer" }}
            >
              <span className="nav-link">
                Blogs
              </span>
            </li>

            {isLoggedIn &&

              <li className="nav-item"
                onClick={() => {
                  if (!isActive(ROUTES.CREATE_TRIP)) {
                    redirectBtnClick(ROUTES.CREATE_TRIP);
                  }
                }}
                style={{
                  cursor: isActive(ROUTES.CREATE_TRIP) ? "default" : "pointer",
                  pointerEvents: isActive(ROUTES.CREATE_TRIP) ? "none" : "auto",
                  borderBottom: isActive(ROUTES.CREATE_TRIP) ? "2px solid var(--secondary-1)" : "",
                }}
              // onClick={() => redirectBtnClick(ROUTES.CREATE_TRIP)} style={{ cursor: "pointer" }}
              >
                <span className="nav-link">
                  Create Trip
                </span>
              </li>
            }

            {/* <li className="nav-item" onClick={() => {
              if (!isActive(ROUTES.GROUP_TRIPS)) {
                redirectBtnClick(ROUTES.GROUP_TRIPS);
              }
            }}
              style={{
                cursor: isActive(ROUTES.GROUP_TRIPS) ? "default" : "pointer",
                pointerEvents: isActive(ROUTES.GROUP_TRIPS) ? "none" : "auto",
                borderBottom: isActive(ROUTES.GROUP_TRIPS) ? "2px solid var(--secondary-1)" : "",
              }}>
              <span className="nav-link">
                Group Trips
              </span>
            </li> */}
            <li className="nav-item"
              onClick={() => setFeedbackFormOpen(true)}
              style={{ cursor: "pointer" }}>
              <span className="nav-link">
                {isLoggedIn ? 'Feedback' : 'Contact'}
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
                  <div className="flex items-center gap-4">
                    {/* Notification Icon */}
                    <NotificationBell />

                    <ChatIcon />
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
                            style={{ borderRadius: "50%", objectFit: "cover", width: "40px", height: "40px" }}
                          />
                          <span>{user.name}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                          <Dropdown.Item as={Link} href={`/user/${user.id}`}>Profile</Dropdown.Item>
                          <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                      </div>
                    </Dropdown>
                  </div>
                ) : (
                  <button className="btn btn-primary ms-2" onClick={handleLoginClick}>Login / Register</button>
                )}
            </li>
          </ul>
        </div>
      </div>



      {feedBackFormOpen && (
        <FeedbackModal
          feedBackFormOpen={feedBackFormOpen}
          setFeedbackFormOpen={setFeedbackFormOpen}
          isLoggedIn={isLoggedIn}
          user={user}
        />
      )}




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
                  style={{ borderRadius: "50%", objectFit: "cover", width: "40px", height: "40px" }}
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
          {isLoggedIn &&

            <li className="nav-item"
              onClick={() => {
                if (!isActive(ROUTES.USER_TRIPS)) {
                  redirectBtnClick(ROUTES.USER_TRIPS);
                  closeDrawer();
                }
              }}
              style={{
                cursor: isActive(ROUTES.USER_TRIPS) ? "default" : "pointer",
                pointerEvents: isActive(ROUTES.USER_TRIPS) ? "none" : "auto",
                borderBottom: isActive(ROUTES.USER_TRIPS) ? "2px solid var(--secondary-1)" : "",
              }}
            //  onClick={() => { redirectBtnClick(ROUTES.USER_TRIPS); closeDrawer(); }}
            >
              <span className="nav-link">My Trips</span>
            </li>
          }
          <li className="nav-item"
            onClick={() => {
              if (!isActive(ROUTES.EXPLORE)) {
                redirectBtnClick(ROUTES.EXPLORE);
                closeDrawer();

              }
            }}
            style={{
              cursor: isActive(ROUTES.EXPLORE) ? "default" : "pointer",
              pointerEvents: isActive(ROUTES.EXPLORE) ? "none" : "auto",
              borderBottom: isActive(ROUTES.EXPLORE) ? "2px solid var(--secondary-1)" : "",
            }}
          // onClick={() => { redirectBtnClick(ROUTES.EXPLORE); closeDrawer(); }}
          >
            <span className="nav-link">Explore</span>
          </li>
          <li className="nav-item"
            onClick={() => {
              if (!isActive(ROUTES.BLOGS)) {
                redirectBtnClick(ROUTES.BLOGS);
                closeDrawer();
              }
            }}
            style={{
              cursor: isActive(ROUTES.BLOGS) ? "default" : "pointer",
              pointerEvents: isActive(ROUTES.BLOGS) ? "none" : "auto",
              borderBottom: isActive(ROUTES.BLOGS) ? "2px solid var(--secondary-1)" : "",
            }}
          //  onClick={() => { redirectBtnClick(ROUTES.BLOGS); closeDrawer();

          //   }}
          >
            <span className="nav-link">Blogs</span>
          </li>
          {isLoggedIn &&

            <li className="nav-item"
              onClick={() => {
                if (!isActive(ROUTES.CREATE_TRIP)) {
                  redirectBtnClick(ROUTES.CREATE_TRIP);
                  closeDrawer();
                }
              }}
              style={{
                cursor: isActive(ROUTES.CREATE_TRIP) ? "default" : "pointer",
                pointerEvents: isActive(ROUTES.CREATE_TRIP) ? "none" : "auto",
                borderBottom: isActive(ROUTES.CREATE_TRIP) ? "2px solid var(--secondary-1)" : "",
              }}
            //  onClick={() => { openLogin(() => { redirectBtnClick(ROUTES.CREATE_TRIP) }); }}
            >
              <span className="nav-link">Create Trip</span>
            </li>
          }
          {/* {pageType == PageTypeEnum.TRIP ? (
            <li className="nav-item"
              onClick={() => {
                if (!isActive(ROUTES.CREATE_TRIP)) {
                  redirectBtnClick(ROUTES.CREATE_TRIP);
                  closeDrawer();
                }
              }}
              style={{
                cursor: isActive(ROUTES.CREATE_TRIP) ? "default" : "pointer",
                pointerEvents: isActive(ROUTES.CREATE_TRIP) ? "none" : "auto",
                borderBottom: isActive(ROUTES.CREATE_TRIP) ? "2px solid var(--secondary-1)" : "",
              }}
            //  onClick={() => { openLogin(() => { redirectBtnClick(ROUTES.CREATE_TRIP) }); }}
            >
              <span className="nav-link">Create Trip</span>
            </li>
          )
            : ( */}
          {/* <li className="nav-item"
            onClick={() => {
              if (!isActive(ROUTES.GROUP_TRIPS)) {
                redirectBtnClick(ROUTES.GROUP_TRIPS);
                closeDrawer();
              }
            }}
            style={{
              cursor: isActive(ROUTES.GROUP_TRIPS) ? "default" : "pointer",
              pointerEvents: isActive(ROUTES.GROUP_TRIPS) ? "none" : "auto",
              borderBottom: isActive(ROUTES.GROUP_TRIPS) ? "2px solid var(--secondary-1)" : "",
            }}
          // onClick={() => { redirectBtnClick(ROUTES.GROUP_TRIPS); closeDrawer(); }}
          >
            <span className="nav-link">Group Trips</span>
          </li> */}
          {/* )
          } */}
          <li className="nav-item"
            onClick={() => { closeDrawer(); setFeedbackFormOpen(true) }}
            style={{ cursor: "pointer" }}>
            <span className="nav-link">
              {isLoggedIn ? 'Feedback' : 'Contact'}
            </span>
          </li>

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
