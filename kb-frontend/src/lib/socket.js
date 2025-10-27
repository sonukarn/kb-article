import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(
      // import.meta.env.VITE_API_URL || "https://kb.rvtechnologies.net.in",
      import.meta.env.VITE_SOCKET_URL,
      {
        withCredentials: true,
        path: "/socket.io",
        transports: ["websocket", "polling"], // ensures stable connection
      }
    );
  }
  return socket;
}

// Call this function after user login to identify user to backend
export function connectUser(userId) {
  const socket = getSocket();
  socket.emit("user:connect", userId);
}

// Listen for notifications anywhere
export function onPostNotification(callback) {
  const socket = getSocket();
  socket.on("post:notification", callback);
}
