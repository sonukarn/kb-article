// src/index.js
import "./config/env.js";
import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import postsRoutes from "./routes/posts.js";
import AnouncementsRoute from "./routes/announcementRoutes.js";
import user from "./routes/userRoute.js";
const app = express();
const server = http.createServer(app);

// const io = new IOServer(server, {
//   cors: { origin: "http://localhost:5173", credentials: true },
// });
const io = new IOServer(server, {
  cors: {
    origin: ["http://localhost:5173", "https://example.com"],
    credentials: true,
  },
});
// make io available to controllers: store on app
app.set("io", io);
const connectedUsers = new Map();
app.set("connectedUsers", connectedUsers);
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  // Listen for user identification from frontend after login
  socket.on("user:connect", (userId) => {
    connectedUsers.set(userId.toString(), socket.id);
    console.log("User connected:", userId, socket.id);
  });
  socket.on("disconnect", () => {
    // Remove disconnected user
    for (let [userId, id] of connectedUsers.entries()) {
      if (id === socket.id) connectedUsers.delete(userId);
    }
    console.log("Socket disconnected:", socket.id);
  });
});
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "https://example.com", // your real frontend domain
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Simple rate limiter could be added here for auth endpoints
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/announcements", AnouncementsRoute);
app.use("/api/users", user);

// health
app.get("/", (req, res) => res.send("KB Articles API is running"));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
