// // src/layouts/MainLayout.jsx
// import Navbar from "@/components/Navbar";
// import PageTransition from "@/components/PageTransition";
// import AnnouncementBanner from "@/components/AnnouncementBanner";
// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";

// export default function MainLayout() {
//   const [bannerHeight, setBannerHeight] = useState(0);

//   return (
//     <div className="min-h-screen bg-gray-50 relative">
//       {/* Announcement Banner */}
//       <AnnouncementBanner onHeightChange={setBannerHeight} />

//       {/* Navbar (shifts down dynamically) */}
//       <div
//         className="fixed top-0 left-0 right-0 transition-transform duration-300 z-[100]"
//         style={{ transform: `translateY(${bannerHeight}px)` }}
//       >
//         <Navbar />
//       </div>

//       {/* Main Content */}
//       <main
//         className="container mx-auto p-4 transition-all duration-300"
//         style={{ paddingTop: `${bannerHeight + 72}px` }} // 72px ≈ navbar height
//       >
//         <PageTransition>
//           <Outlet />
//         </PageTransition>
//       </main>
//     </div>
//   );
// }

// MainLayout.jsx
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getSocket } from "@/lib/socket";
import { useSelector } from "react-redux"; // assuming you store user in Redux

export default function MainLayout() {
  const [bannerHeight, setBannerHeight] = useState(0);
  const user = useSelector((state) => state.auth.user); // current logged in user

  useEffect(() => {
    if (user?.id) {
      const socket = getSocket();
      socket.emit("user:connect", user.id);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <AnnouncementBanner onHeightChange={setBannerHeight} />
      <div
        className="fixed top-0 left-0 right-0 transition-transform duration-300 z-[100]"
        style={{ transform: `translateY(${bannerHeight}px)` }}
      >
        <Navbar />
      </div>

      <main
        className="container mx-auto p-4 transition-all duration-300"
        style={{ paddingTop: `${bannerHeight + 72}px` }}
      >
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
