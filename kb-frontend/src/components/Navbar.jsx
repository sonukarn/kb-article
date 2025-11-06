// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useState } from "react";
// import { Menu, X } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { logouts } from "@/features/auth/authSlice";
// import { useLogoutMutation } from "@/features/auth/authApi";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);
//   const user = useSelector((state) => state.auth.user);
//   const dispatch = useDispatch();
//   const [logout] = useLogoutMutation();

//   const isAuthenticated = Boolean(user);

//   const handleLogout = async () => {
//     try {
//       await logout().unwrap();
//       dispatch(logouts());
//       navigate("/login");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const links = [
//     { name: "Home", path: "/" },
//     // { name: "Categories", path: "/categories" },
//     // { name: "About", path: "/about" },
//   ];

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
//       <div className="container mx-auto flex items-center justify-between px-4 py-3">
//         {/* Logo */}
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           onClick={() => navigate("/")}
//           className="flex items-center gap-2 cursor-pointer"
//         >
//           {/* <img
//             src="/logo.png"
//             alt="KB Articles"
//             className="w-8 h-8 object-contain"
//           /> */}
//           <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
//             KB Articles
//           </span>
//         </motion.div>

//         {/* Desktop Nav Links */}
//         {/* <div className="hidden md:flex items-center gap-6">
//           {links.map((link) => (
//             <NavLink
//               key={link.name}
//               to={link.path}
//               className={({ isActive }) =>
//                 `text-sm font-medium ${
//                   isActive
//                     ? "text-indigo-600"
//                     : "text-gray-600 hover:text-indigo-600"
//                 } transition`
//               }
//             >
//               {link.name}
//             </NavLink>
//           ))}

//           {isAuthenticated ? (
//             <button
//               onClick={() => navigate("/create-blog")}
//               className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
//             >
//               Create Blog
//             </button>
//           ) : (
//             <button
//               onClick={() => navigate("/login")}
//               className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-50 transition"
//             >
//               Login
//             </button>
//           )}
//         </div> */}
//         <div className="hidden md:flex items-center gap-6">
//           {links.map((link) => (
//             <NavLink
//               key={link.name}
//               to={link.path}
//               className={({ isActive }) =>
//                 `text-sm font-medium ${
//                   isActive
//                     ? "text-indigo-600"
//                     : "text-gray-600 hover:text-indigo-600"
//                 } transition`
//               }
//             >
//               {link.name}
//             </NavLink>
//           ))}

//           {isAuthenticated ? (
//             <>
//               <button
//                 onClick={() => navigate("/create-blog")}
//                 className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
//               >
//                 Create Article
//               </button>

//               {/* --- user dropdown --- */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <button className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
//                     {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
//                   </button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent align="end" className="w-40">
//                   <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={() => navigate("/profile")}>
//                     Profile
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={handleLogout}>
//                     Logout
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </>
//           ) : (
//             <button
//               onClick={() => navigate("/login")}
//               className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-50 transition"
//             >
//               Login
//             </button>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <div className="md:hidden">
//           <button
//             onClick={() => setOpen(!open)}
//             className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
//           >
//             {open ? <X size={22} /> : <Menu size={22} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu Dropdown */}
//       {/* {open && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="md:hidden bg-white border-t border-gray-200 shadow-lg"
//         >
//           <div className="flex flex-col space-y-3 px-4 py-3">
//             {links.map((link) => (
//               <NavLink
//                 key={link.name}
//                 to={link.path}
//                 onClick={() => setOpen(false)}
//                 className={({ isActive }) =>
//                   `text-sm font-medium ${
//                     isActive
//                       ? "text-indigo-600"
//                       : "text-gray-700 hover:text-indigo-600"
//                   } transition`
//                 }
//               >
//                 {link.name}
//               </NavLink>
//             ))}
//             <hr />
//             {isAuthenticated ? (
//               <button
//                 onClick={() => {
//                   setOpen(false);
//                   navigate("/create-blog");
//                 }}
//                 className="bg-indigo-600 text-white py-2 rounded-lg"
//               >
//                 Create Blog
//               </button>
//             ) : (
//               <button
//                 onClick={() => {
//                   setOpen(false);
//                   navigate("/login");
//                 }}
//                 className="border border-indigo-600 text-indigo-600 py-2 rounded-lg"
//               >
//                 Login
//               </button>
//             )}
//           </div>
//         </motion.div>
//       )} */}
//       {open && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="md:hidden bg-white border-t border-gray-200 shadow-lg"
//         >
//           <div className="flex flex-col space-y-3 px-4 py-3">
//             {links.map((link) => (
//               <NavLink
//                 key={link.name}
//                 to={link.path}
//                 onClick={() => setOpen(false)}
//                 className={({ isActive }) =>
//                   `text-sm font-medium ${
//                     isActive
//                       ? "text-indigo-600"
//                       : "text-gray-700 hover:text-indigo-600"
//                   } transition`
//                 }
//               >
//                 {link.name}
//               </NavLink>
//             ))}
//             <hr />
//             {isAuthenticated ? (
//               <>
//                 <button
//                   onClick={() => {
//                     setOpen(false);
//                     navigate("/create-blog");
//                   }}
//                   className="bg-indigo-600 text-white py-2 rounded-lg"
//                 >
//                   Create Blog
//                 </button>
//                 <button
//                   onClick={() => {
//                     setOpen(false);
//                     navigate("/profile");
//                   }}
//                   className="border border-indigo-600 text-indigo-600 py-2 rounded-lg"
//                 >
//                   Profile
//                 </button>
//                 <button
//                   onClick={() => {
//                     setOpen(false);
//                     handleLogout();
//                   }}
//                   className="border border-red-600 text-red-600 py-2 rounded-lg"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={() => {
//                   setOpen(false);
//                   navigate("/login");
//                 }}
//                 className="border border-indigo-600 text-indigo-600 py-2 rounded-lg"
//               >
//                 Login
//               </button>
//             )}
//           </div>
//         </motion.div>
//       )}
//     </nav>
//   );
// }

import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logouts } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApi";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const isAuthenticated = Boolean(user);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logouts());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const links = [
    { name: "Home", path: "/" },
    // add more links if needed
  ];

  // Setup socket connection & listen for notifications
  // useEffect(() => {
  //   if (!user?.id) return;

  //   const socket = getSocket();

  //   // Connect user
  //   socket.emit("user:connect", user.id);
  //   console.log("🔗 Socket connected for user:", user.id);
  //   // Listen for notifications
  //   socket.on("post:notification", (payload) => {
  //     if (user.role === "ADMIN") return;
  //     if (payload.userId !== user.id) return; // only show for current user

  //     setNotifications((prev) => [payload, ...prev]);
  //     // toast(
  //     //   `${payload.title} was ${payload.action}${
  //     //     payload.reason ? ": " + payload.reason : ""
  //     //   }`
  //     // );
  //     let message = "";

  // if (payload.action === "APPROVED") {
  //   message = "Your edit request was approved — you can now edit your post!";
  // } else if (payload.action === "REJECTED") {
  //   message = `Your edit request was rejected${
  //     payload.reason ? ": " + payload.reason : ""
  //   }`;
  // } else if (payload.action === "PUBLISHED") {
  //   message = `${payload.title} was published`;
  // } else {
  //   message = `${payload.title} was ${payload.action}`;
  // }

  // toast(message);

  //   });

  //   return () => {
  //     socket.off("post:notification");
  //   };
  // }, [user]);
  // useEffect(() => {
  //   if (!user?.id) return;

  //   const socket = getSocket();

  //   // Connect user
  //   socket.emit("user:connect", user.id);

  //   // User notifications
  //   if (user.role !== "ADMIN") {
  //     socket.on("post:notification", (payload) => {
  //       if (String(payload.userId) !== String(user.id)) return;

  //       setNotifications((prev) => [payload, ...prev]);

  //       let message = "";
  //       if (payload.action === "APPROVED") {
  //         message = "Your edit request was approved — you can now edit your post!";
  //       } else if (payload.action === "REJECTED") {
  //         message = `Your edit request was rejected${payload.reason ? ": " + payload.reason : ""}`;
  //       } else if (payload.action === "PUBLISHED") {
  //         message = `${payload.title} was published`;
  //       } else {
  //         message = `${payload.title} was ${payload.action}`;
  //       }

  //       toast(message);
  //     });
  //   }

  //   // Admin notifications
  //   if (user.role === "ADMIN") {
  //     socket.on("admin:update-request", (payload) => {
  //       console.log("🔥 Admin received new update request:", payload);
  //       toast(`${payload.title} has a new update request from user ${payload.userId}`);
  //     });
  //   }

  //   return () => {
  //     socket.off("post:notification");
  //     socket.off("admin:update-request");
  //   };
  // }, [user]);
  // useEffect(() => {
  //   if (!user?.id) return;

  //   const socket = getSocket(); // get your existing socket instance

  //   const handlePostNotification = (payload) => {
  //     if (user.role !== "ADMIN" && payload.userId === user.id) {
  //       setNotifications((prev) => [payload, ...prev]);
  //       // show toast if needed
  //     }
  //   };

  //   const handleAdminUpdateRequest = (payload) => {
  //     if (user.role === "ADMIN") {
  //       // show toast / notification
  //     }
  //   };

  //   // Initial listeners
  //   socket.on("post:notification", handlePostNotification);
  //   socket.on("admin:update-request", handleAdminUpdateRequest);

  //   // Emit connect on mount and on reconnection
  //   const connectUser = () => {
  //     socket.emit("user:connect", user.id);
  //   };

  //   connectUser();

  //   // Reconnect handling
  //   socket.on("connect", connectUser);

  //   return () => {
  //     socket.off("post:notification", handlePostNotification);
  //     socket.off("admin:update-request", handleAdminUpdateRequest);
  //     socket.off("connect", connectUser);
  //   };
  // }, [user]);
  // useEffect(() => {
  //   if (!user?.id) return;

  //   const socket = getSocket(); // get your existing socket instance

  //   const handlePostNotification = (payload) => {
  //     if (user.role !== "ADMIN" && payload.userId === user.id) {
  //       setNotifications((prev) => [payload, ...prev]);
  //       toast(`🔔 ${payload.title} was ${payload.action}`);
  //     }
  //   };

  //   const handleAdminUpdateRequest = (payload) => {
  //     if (user.role === "ADMIN") {
  //       toast(`📢 ${payload.title} has a new update request from user ${payload.userId}`);
  //     }
  //   };

  //   // ✅ Only listen — don't emit user:connect here
  //   socket.on("post:notification", handlePostNotification);
  //   socket.on("admin:update-request", handleAdminUpdateRequest);

  //   return () => {
  //     socket.off("post:notification", handlePostNotification);
  //     socket.off("admin:update-request", handleAdminUpdateRequest);
  //   };
  // }, [user]);
  // useEffect(() => {
  //   if (!user?.id) return;

  //   const socket = getSocket();

  //   // ✅ Always log when we attach listeners (for debugging)
  //   console.log("📡 Listening for socket events for user:", user.id, user.role);

  //   const handlePostNotification = (payload) => {
  //     console.log("📩 Received post:notification:", payload);

  //     // Defensive: make sure payload has what we expect
  //     if (!payload || !payload.userId) return;

  //     // Only show to that specific user
  //     if (String(payload.userId) !== String(user.id)) return;

  //     setNotifications((prev) => [payload, ...prev]);

  //     // Construct message
  //     let message = "";
  //     switch (payload.action?.toLowerCase()) {
  //       case "approved":
  //         message = "✅ Your update request was approved!";
  //         break;
  //       case "rejected":
  //         message = `❌ Your update request was rejected${
  //           payload.reason ? ": " + payload.reason : ""
  //         }`;
  //         break;
  //       case "published":
  //         message = `📢 ${payload.title} was published`;
  //         break;
  //       default:
  //         message = `${payload.title} was ${payload.action}`;
  //     }

  //     toast(message);
  //   };

  //   const handleAdminUpdateRequest = (payload) => {
  //     console.log("📩 Received admin:update-request:", payload);
  //     if (user.role === "ADMIN") {
  //       toast(
  //         `📢 "${payload.title}" has a new update request from user ${payload.userId}`
  //       );
  //     }
  //   };

  //   // ✅ Attach listeners
  //   socket.on("post:notification", handlePostNotification);
  //   socket.on("admin:update-request", handleAdminUpdateRequest);

  //   // ✅ Clean up listeners
  //   return () => {
  //     socket.off("post:notification", handlePostNotification);
  //     socket.off("admin:update-request", handleAdminUpdateRequest);
  //   };
  // }, [user]);
  // useEffect(() => {
  //   if (!user?.id) return;

  //   const socket = getSocket();
  //   console.log("📡 Listening for socket events for user:", user.id, user.role);

  //   // 🔔 For regular users
  //   const handlePostNotification = (payload) => {
  //     console.log("📩 Received post:notification:", payload);
  //     if (user.role !== "ADMIN" && payload.userId === user.id) {
  //       setNotifications((prev) => [payload, ...prev]);
  //       toast(`🔔 ${payload.title} was ${payload.action}`);
  //     }
  //   };

  //   // 📢 For admins — live update requests
  //   const handleAdminUpdateRequest = (payload) => {
  //     console.log("📩 Received admin:update-request:", payload);
  //     if (user.role === "ADMIN") {
  //       toast(`📢 ${payload.title} has a new update request from user ${payload.userId}`);
  //       setNotifications((prev) => [payload, ...prev]);
  //     }
  //   };

  //   // ✅ Register listeners once
  //   socket.off("post:notification").on("post:notification", handlePostNotification);
  //   socket.off("admin:update-request").on("admin:update-request", handleAdminUpdateRequest);

  //   return () => {
  //     socket.off("post:notification", handlePostNotification);
  //     socket.off("admin:update-request", handleAdminUpdateRequest);
  //   };
  // }, [user]);
  useEffect(() => {
    if (!user?.id) return;

    const socket = getSocket();

    console.log("📡 Listening for socket events for user:", user.id, user.role);

    // Connect user explicitly
    socket.emit("user:connect", user.id);

    const handlePostNotification = (payload) => {
      console.log("📩 Received post:notification:", payload);
      if (user.role !== "ADMIN" && payload.userId === user.id) {
        setNotifications((prev) => [payload, ...prev]);
        toast(`🔔 ${payload.title} was ${payload.action}`);
      }
    };

    const handleAdminUpdateRequest = (payload) => {
      console.log("📢 ADMIN RECEIVED update-request:", payload);
      if (user.role === "ADMIN") {
        setNotifications((prev) => [payload, ...prev]);
        toast(
          `📢 ${payload.title} has a new update request from user ${payload.userId}`
        );
      }
    };

    // Remove existing and attach fresh listeners
    socket.off("post:notification", handlePostNotification);
    socket.off("admin:update-request", handleAdminUpdateRequest);

    socket.on("post:notification", handlePostNotification);
    socket.on("admin:update-request", handleAdminUpdateRequest);

    // Reconnect logic
    socket.off("connect").on("connect", () => {
      console.log("🔗 Socket reconnected:", socket.id);
      socket.emit("user:connect", user.id);
    });

    return () => {
      socket.off("post:notification", handlePostNotification);
      socket.off("admin:update-request", handleAdminUpdateRequest);
      socket.off("connect");
    };
  }, [user]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            KB Articles
          </span>
        </motion.div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                } transition`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <>
              {/* Create Article Button */}
              <button
                onClick={() => navigate("/create-blog")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
              >
                Create Article
              </button>

              {/* Notification Bell */}
              <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-red-100 text-red-700 font-semibold">
                    🔔
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs px-2">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-80 max-h-96 overflow-y-auto"
                >
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n, idx) => (
                      <DropdownMenuItem
                        key={idx}
                        onClick={() => {
                          setNotifOpen(false);
                          navigate("/user"); // go to profile to see articles
                        }}
                        className="text-sm"
                      >
                        <span className="font-semibold">{n.title}</span> was{" "}
                        {n.action}
                        {n.reason && (
                          <span className="text-red-600">: {n.reason}</span>
                        )}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                    {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/user")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-50 transition"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="flex flex-col space-y-3 px-4 py-3">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium ${
                    isActive
                      ? "text-indigo-600"
                      : "text-gray-700 hover:text-indigo-600"
                  } transition`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <hr />
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/create-blog");
                  }}
                  className="bg-indigo-600 text-white py-2 rounded-lg"
                >
                  Create Blog
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/user");
                  }}
                  className="border border-indigo-600 text-indigo-600 py-2 rounded-lg"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="border border-red-600 text-red-600 py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="border border-indigo-600 text-indigo-600 py-2 rounded-lg"
              >
                Login
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
