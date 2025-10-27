// import React, { useEffect, useState, useRef } from "react";
// import {
//   useGetAnnouncementsQuery,
//   useDismissAnnouncementMutation,
// } from "@/features/announcements/announcementApi";
// import { getSocket } from "@/lib/socket";
// import { toast } from "sonner";
// import { motion, AnimatePresence } from "framer-motion";
// import { X } from "lucide-react";

// export default function AnnouncementBanner({ onHeightChange }) {
//   const { data: announcements = [], refetch } = useGetAnnouncementsQuery();
//   const [dismissAnnouncement] = useDismissAnnouncementMutation();
//   const [visible, setVisible] = useState([]);
//   const ref = useRef(null);

//   // 🔄 Listen for server updates via socket
//   useEffect(() => {
//     const socket = getSocket();
//     const handler = () => refetch();
//     socket.on("announcement:changed", handler);
//     return () => socket.off("announcement:changed", handler);
//   }, [refetch]);

//   // 🧭 When announcements change, show them
//   useEffect(() => {
//     setVisible(announcements);
//   }, [announcements]);

//   // 📏 Dynamically measure height and report to MainLayout
//   useEffect(() => {
//     if (!ref.current || !onHeightChange) return;
//     const observer = new ResizeObserver(() => {
//       onHeightChange(ref.current.offsetHeight || 0);
//     });
//     observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [onHeightChange, visible]);

//   // ❌ Dismiss handler
//   const handleDismiss = async (id) => {
//     try {
//       await dismissAnnouncement(id).unwrap();
//       setVisible((prev) => prev.filter((a) => a.id !== id));
//       toast.success("Announcement dismissed");
//       // instantly update layout height (shift up)
//       setTimeout(() => onHeightChange(ref.current?.offsetHeight || 0), 150);
//     } catch {
//       toast.error("Failed to dismiss announcement");
//     }
//   };

//   if (!visible || visible.length === 0) return null;

//   // 🎨 Define professional color palette
//   const getColorClass = (type) => {
//     switch (type) {
//       case "error":
//         return "bg-red-600/90 text-white";
//       case "warning":
//         return "bg-amber-400/90 text-black";
//       case "success":
//         return "bg-emerald-600/90 text-white";
//       default:
//         return "bg-blue-600/90 text-white";
//     }
//   };

//   return (
//     <div
//       ref={ref}
//       className="fixed top-0 left-0 w-full z-[9999] flex flex-col items-center bg-transparent"
//     >
//       <AnimatePresence>
//         {visible.map((a) => (
//           <motion.div
//             key={a.id}
//             initial={{ y: -40, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -30, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className={`w-full max-w-5xl mx-auto rounded-b-xl shadow-lg backdrop-blur-md bg-opacity-90 px-4 py-3 sm:px-6 sm:py-4 ${getColorClass(
//               a.type
//             )}`}
//           >
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex-1">
//                 <h4 className="font-semibold text-base sm:text-lg leading-tight">
//                   {a.title}
//                 </h4>
//                 <p
//                   className="text-sm sm:text-base opacity-90"
//                   dangerouslySetInnerHTML={{ __html: a.message }}
//                 />
//               </div>

//               {a.dismissible && (
//                 <button
//                   onClick={() => handleDismiss(a.id)}
//                   className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition"
//                 >
//                   <X size={18} />
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         ))}
//       </AnimatePresence>
//     </div>
//   );
// }

// import React, { useEffect, useState, useRef } from "react";
// import {
//   useGetAnnouncementsQuery,
//   useDismissAnnouncementMutation,
// } from "@/features/announcements/announcementApi";
// import { getSocket } from "@/lib/socket";
// import { toast } from "sonner";
// import { motion, AnimatePresence } from "framer-motion";
// import { X } from "lucide-react";

// export default function AnnouncementBanner({ onHeightChange }) {
//   const { data: announcements = [], refetch } = useGetAnnouncementsQuery();
//   const [dismissAnnouncement] = useDismissAnnouncementMutation();
//   const [visible, setVisible] = useState([]);
//   const ref = useRef(null);

//   // 🔄 Listen for real-time updates
//   useEffect(() => {
//     const socket = getSocket();
//     const handler = () => refetch();
//     socket.on("announcement:changed", handler);
//     return () => socket.off("announcement:changed", handler);
//   }, [refetch]);

//   // 🧭 Update visible when announcements change
//   useEffect(() => {
//     setVisible(announcements);
//   }, [announcements]);

//   // 📏 Adjust layout height dynamically
//   useEffect(() => {
//     if (!ref.current || !onHeightChange) return;
//     const observer = new ResizeObserver(() => {
//       onHeightChange(ref.current.offsetHeight || 0);
//     });
//     observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [onHeightChange, visible]);

//   // ❌ Manual dismiss handler
//   const handleDismiss = async (id) => {
//     try {
//       await dismissAnnouncement(id).unwrap();
//       setVisible((prev) => prev.filter((a) => a.id !== id));
//       toast.success("Announcement dismissed");
//       setTimeout(() => onHeightChange(ref.current?.offsetHeight || 0), 150);
//     } catch {
//       toast.error("Failed to dismiss announcement");
//     }
//   };

//   // 🕐 Auto dismiss success announcements
//   useEffect(() => {
//     const timers = [];
//     visible.forEach((a) => {
//       if (a.type === "success" && a.autoDismiss !== false) {
//         const timer = setTimeout(async () => {
//           try {
//             await dismissAnnouncement(a.id).unwrap();
//             setVisible((prev) => prev.filter((v) => v.id !== a.id));
//           } catch {
//             console.error("Auto-dismiss failed");
//           }
//         }, a.duration || 4000); // default 4s
//         timers.push(timer);
//       }
//     });
//     return () => timers.forEach(clearTimeout);
//   }, [visible, dismissAnnouncement]);

//   if (!visible.length) return null;

//   // 🎨 Color palette
//   const getColorClass = (type) => {
//     switch (type) {
//       case "error":
//         return "bg-red-600 text-white";
//       case "warning":
//         return "bg-amber-400 text-black";
//       case "success":
//         return "bg-emerald-600 text-white";
//       default:
//         return "bg-blue-600 text-white";
//     }
//   };

//   return (
//     <div
//       ref={ref}
//       className="fixed top-0 left-0 w-full z-[9999] flex flex-col bg-transparent"
//     >
//       <AnimatePresence>
//         {visible.map((a) => (
//           <motion.div
//             key={a.id}
//             initial={{ y: -40, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -30, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className={`w-full rounded-b-lg shadow-lg px-3 py-2 sm:px-4 sm:py-3 ${getColorClass(
//               a.type
//             )}`}
//           >
//             <div className="flex items-start justify-between gap-3 max-w-7xl mx-auto">
//               <div className="flex-1">
//                 <h4 className="font-semibold text-base leading-tight">
//                   {a.title}
//                 </h4>
//                 <p
//                   className="text-sm opacity-90"
//                   dangerouslySetInnerHTML={{ __html: a.message }}
//                 />
//               </div>
//               {a.dismissible && (
//                 <button
//                   onClick={() => handleDismiss(a.id)}
//                   className="p-1 rounded-full hover:bg-white/20 transition"
//                 >
//                   <X size={18} />
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         ))}
//       </AnimatePresence>
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
import {
  useGetAnnouncementsQuery,
  useDismissAnnouncementMutation,
} from "@/features/announcements/announcementApi";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function AnnouncementBanner({ onHeightChange }) {
  const { data: announcements = [], refetch } = useGetAnnouncementsQuery();
  const [dismissAnnouncement] = useDismissAnnouncementMutation();
  const [visible, setVisible] = useState([]);
  const ref = useRef(null);
  const timersRef = useRef({}); // ✅ track timers to prevent multiple scheduling

  // 🔄 Listen for real-time updates
  useEffect(() => {
    const socket = getSocket();
    const handler = () => refetch();
    socket.on("announcement:changed", handler);
    return () => socket.off("announcement:changed", handler);
  }, [refetch]);

  // 🧭 Update visible announcements
  // useEffect(() => {
  //   setVisible(announcements);
  // }, [announcements]);
  useEffect(() => {
    // Only update if announcements are different from visible
    setVisible((prev) => {
      const isSame =
        prev.length === announcements.length &&
        prev.every((a, i) => a.id === announcements[i].id);
      return isSame ? prev : announcements;
    });
  }, [announcements]);

  // 📏 Update layout height dynamically
  useEffect(() => {
    if (!ref.current || !onHeightChange) return;
    const observer = new ResizeObserver(() => {
      onHeightChange(ref.current.offsetHeight || 0);
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onHeightChange]);

  // ❌ Manual dismiss
  const handleDismiss = async (id) => {
    try {
      await dismissAnnouncement(id).unwrap();
      setVisible((prev) => prev.filter((a) => a.id !== id));
      delete timersRef.current[id]; // clean timer record
      toast.success("Announcement dismissed");
      setTimeout(() => onHeightChange(ref.current?.offsetHeight || 0), 150);
    } catch {
      toast.error("Failed to dismiss announcement");
    }
  };

  // 🕒 Auto dismiss — run only once per announcement
  useEffect(() => {
    visible.forEach((a) => {
      if (
        a.type === "success" &&
        a.autoDismiss !== false &&
        !timersRef.current[a.id]
      ) {
        const timer = setTimeout(async () => {
          try {
            await dismissAnnouncement(a.id).unwrap();
            setVisible((prev) => prev.filter((v) => v.id !== a.id));
            delete timersRef.current[a.id];
          } catch {
            console.error("Auto-dismiss failed for:", a.id);
          }
        }, a.duration || 60000); // 🕐 default 1 minute
        timersRef.current[a.id] = timer;
      }
    });

    return () => {
      // clear all timers when component unmounts
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, [visible, dismissAnnouncement]);

  if (!visible.length) return null;

  // 🎨 Color palette
  const getColorClass = (type) => {
    switch (type) {
      case "error":
        return "bg-red-600 text-white";
      case "warning":
        return "bg-amber-400 text-black";
      case "success":
        return "bg-emerald-600 text-white";
      default:
        return "bg-blue-600 text-white";
    }
  };

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-full z-[9999] flex flex-col bg-transparent"
    >
      <AnimatePresence>
        {visible.map((a) => (
          <motion.div
            key={a.id}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-full rounded-b-lg shadow-lg px-3 py-2 sm:px-4 sm:py-3 ${getColorClass(
              a.type
            )}`}
          >
            <div className="flex items-start justify-between gap-3 max-w-7xl mx-auto">
              <div className="flex-1">
                <h4 className="font-semibold text-base leading-tight">
                  {a.title}
                </h4>
                <p
                  className="text-sm opacity-90"
                  dangerouslySetInnerHTML={{ __html: a.message }}
                />
              </div>
              {a.dismissible && (
                <button
                  onClick={() => handleDismiss(a.id)}
                  className="p-1 rounded-full hover:bg-white/20 transition"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
