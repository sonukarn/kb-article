import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePost from "./section/CreatePost";

import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import EmailVerificationSent from "./pages/auth/EmailVerificationSent";
import VerifyEmail from "./pages/auth/VerifyEmail";
import EmailVerifiedSuccess from "./pages/auth/EmailVerifiedSuccess";
import BlogDetails from "./pages/BlogDetails";
import useAuthInit from "./hooks/useAuthInit";
import PostLoginRedirect from "./pages/auth/PostLoginRedirect";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import AdminOverview from "./pages/admin/Overview";
import ReviewPosts from "./pages/admin/ReviewPosts";
import AllPosts from "./pages/admin/AllPosts";
import Users from "./pages/admin/Users";
import AnnouncementsAdmin from "./pages/admin/AnnouncementsAdmin";
import NotFound from "./pages/NotFound";
import Profile from "./pages/agents/Profile";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminUpdateRequests from "./pages/admin/AdminUpdateRequests";
import AdminPostView from "./pages/admin/AdminPostView";
import UserLayout from "./layouts/UserLayout";
import Dashboard from "./pages/agents/Dashboard";
import MyPosts from "./pages/agents/MyPosts";
import UpdateRequests from "./pages/agents/UpdateRequests";
import EditProfile from "./pages/agents/EditProfile";

export default function App() {
  // const dispatch = useDispatch();
  useAuthInit(); // runs once on mount
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route
          path="/create-blog"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />{" "} */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="review" element={<ReviewPosts />} />
          <Route path="all" element={<AllPosts />} />
          <Route path="users" element={<Users />} />
          <Route path="update-requests" element={<AdminUpdateRequests />} />
          <Route path="/admin/posts/:id/view" element={<AdminPostView />} />

          <Route path="announcements" element={<AnnouncementsAdmin />} />
          {/* you can add /admin/settings etc. */}
        </Route>
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="myposts" element={<MyPosts />} />
          <Route path="requests" element={<UpdateRequests />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="create-blog" element={<CreatePost />} />
          {/* Add more user-specific pages here */}
        </Route>
      </Route>
      <Route
        path="/post-login-redirect"
        element={
          <ProtectedRoute>
            <PostLoginRedirect />
          </ProtectedRoute>
        }
      />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/forgot" element={<ForgotPassword />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      {/* Verification */}
      <Route path="/verify-email-sent" element={<EmailVerificationSent />} />
      <Route path="/verify-email" element={<VerifyEmail />} />{" "}
      {/* expects ?token=... */}
      <Route path="/verify-email-success" element={<EmailVerifiedSuccess />} />
      {/* fallback route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
