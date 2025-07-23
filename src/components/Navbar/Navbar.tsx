// "use client";

// import React, { useState, useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import Link from "next/link";
// import { Dropdown } from "react-bootstrap";
// import Image from "next/image";
// import SyncTripLogo from "../assets/images/logoWeb.png"; // Adjust path as needed
// import { PageTypeEnum } from "../constants";
// import { NavbarProps } from "../types";
// import { StorageUtils } from "../utils";
// import "../../styles/navbar/navbar.css";

// // const Navbar = ({ ctaAction, onLoginClick, user }: NavbarProps) => {
// const Navbar = ({ ctaAction }: NavbarProps) => {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [showDropdown, setShowDropdown] = useState(false);
//   const [pageType, setPageType] = useState("");
//   const [mobileNavOpen, setMobileNavOpen] = useState(false);

//   const closeDrawer = () => setMobileNavOpen(false);

//   useEffect(() => {
//     if (pathname === `/${PageTypeEnum.TRIP}`) {
//       setPageType(PageTypeEnum.TRIP);
//     } else if (pathname === `/${PageTypeEnum.LOCATION}`) {
//       setPageType(PageTypeEnum.LOCATION);
//     } else {
//       setPageType(PageTypeEnum.HOME);
//     }
//   }, [pathname]);

//   const toggleDropdown = () => setShowDropdown(!showDropdown);

//   const handleLogout = () => {
//     StorageUtils.clearUserData();
//     window.location.reload();
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light">
//       <div className="container-fluid">
//         <Link href="/" className="navbar-brand" style={{ color: "#65CAD3", fontSize: "30px", fontWeight: "700", width: "100px" }}>
//           <Image src={SyncTripLogo} alt="SyncTrip" style={{ width: "100%", marginLeft: "10px" }} />
//         </Link>

//         <button
//           className="navbar-toggler"
//           type="button"
//           onClick={() => setMobileNavOpen(!mobileNavOpen)}
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//           <ul className="navbar-nav" style={{ alignItems: "center" }}>
//             {pageType === PageTypeEnum.TRIP ? (
//               <li className="nav-item" style={{ cursor: "pointer" }} onClick={ctaAction}>
//                 <span className="nav-link">Create Trip</span>
//               </li>
//             ) : (
//               <li className="nav-item" style={{ cursor: "pointer" }} onClick={() => router.push("/trips")}>
//                 <span className="nav-link">Trips</span>
//               </li>
//             )}

//             <li className="nav-item dropdown" style={{ cursor: "pointer" }}>
//               {user ? (
//                 <Dropdown show={showDropdown} onToggle={setShowDropdown}>
//                   <Dropdown.Toggle
//                     variant="link"
//                     style={{
//                       padding: 0,
//                       border: "none",
//                       background: "transparent",
//                       boxShadow: "none",
//                     }}
//                     onClick={toggleDropdown}
//                   >
//                     <Image
//                       src={user?.profile_picture?.[0] || "https://via.placeholder.com/40"}
//                       alt="Profile"
//                       width={40}
//                       height={40}
//                       style={{ borderRadius: "50%", objectFit: "cover" }}
//                     />
//                     <span className="ms-2" style={{ color: "black", fontSize: "16px", fontWeight: "500" }}>
//                       {user?.name || "User"}
//                     </span>
//                   </Dropdown.Toggle>

//                   <Dropdown.Menu align="end">
//                     <Dropdown.Item as={Link} href={`/user/${user.id}`}>Profile</Dropdown.Item>
//                     <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               ) : (
//                 <button className="btn btn-black ms-2" onClick={onLoginClick}>
//                   Login / Register
//                 </button>
//               )}
//             </li>
//           </ul>
//         </div>
//       </div>

//       {mobileNavOpen && <div className="mobile-overlay" onClick={closeDrawer}></div>}

//       <div className={`mobile-drawer ${mobileNavOpen ? "open" : ""}`}>
//         <div className="d-flex justify-content-between align-items-center p-3">
//           {user ? (
//             <div className="d-flex align-items-center">
//               <Image
//                 src={user?.profile_picture?.[0] || "https://via.placeholder.com/40"}
//                 alt="Profile"
//                 width={40}
//                 height={40}
//                 style={{ borderRadius: "50%", objectFit: "cover" }}
//               />
//               <span className="ms-2">{user?.name || "User"}</span>
//             </div>
//           ) : (
//             <Link href="/" className="navbar-brand" style={{ color: '#65CAD3', fontSize: "30px", fontWeight: "700", width: "100px" }}>
//               <Image src={SyncTripLogo} alt="SyncTrip" style={{ width: "100%" }} />
//             </Link>
//           )}

//           <div className="drawer-header">
//             <span className="drawer-close" onClick={closeDrawer}>&times;</span>
//           </div>
//         </div>

//         <ul className="navbar-nav px-3">
//           {pageType === PageTypeEnum.TRIP ? (
//             <li className="nav-item" onClick={() => { ctaAction(); closeDrawer(); }}>
//               <span className="nav-link">Create Trip</span>
//             </li>
//           ) : (
//             <li className="nav-item" onClick={() => { router.push("/trips"); closeDrawer(); }}>
//               <span className="nav-link">Trips</span>
//             </li>
//           )}

//           {user ? (
//             <li className="nav-item" onClick={() => { handleLogout(); closeDrawer(); }}>
//               <span className="nav-link">Logout</span>
//             </li>
//           ) : (
//             <li className="nav-item" onClick={() => { onLoginClick(); closeDrawer(); }}>
//               <button className="btn btn-black mt-2 w-100">
//                 Login / Register
//               </button>
//             </li>
//           )}
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
