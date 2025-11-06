import { io } from "socket.io-client";

let socket;
let currentUserId = null;

export function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      path: "/socket.io",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    // Auto reconnect handler
    socket.on("connect", () => {
      console.log("🔗 Socket connected:", socket.id);
      if (currentUserId) {
        socket.emit("user:connect", currentUserId);
        console.log("🧩 Identified user on socket:", currentUserId, socket.id);

      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }
  return socket;
}
// export function getSocket() {
//   if (!socket) {
//     socket = io(
//       // import.meta.env.VITE_API_URL || "https://kb.rvtechnologies.net.in",
//       import.meta.env.VITE_SOCKET_URL,
//       {
//         withCredentials: true,
//         path: "/socket.io",
//         transports: ["websocket", "polling"], // ensures stable connection
//       }
//     );
//   }
//   return socket;
// }

// Call this function after user login to identify user to backend
// export function connectUser(userId) {
//   const socket = getSocket();
//   socket.emit("user:connect", userId);
// }
export function connectUser(userId) {
  const socket = getSocket();
  currentUserId = userId;
  if (socket.connected) {
    socket.emit("user:connect", userId);
  } else {
    socket.once("connect", () => {
      socket.emit("user:connect", userId);
    });
  }
}

// Listen for notifications anywhere
export function onPostNotification(callback) {
  const socket = getSocket();
  socket.on("post:notification", callback);
}
