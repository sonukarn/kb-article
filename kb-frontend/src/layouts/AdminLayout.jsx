// // src/layouts/AdminLayout.jsx
// import React from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useLogoutMutation } from "@/features/auth/authApi";
// import { logouts } from "@/features/auth/authSlice";

// export default function AdminLayout() {
//   const user = useSelector((s) => s.auth.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [logout] = useLogoutMutation();

//   const handleLogout = async () => {
//     try {
//       await logout().unwrap();
//     } catch (e) {
//       console.error(e);
//     } finally {
//       dispatch(logouts());
//       navigate("/login");
//     }
//   };

//   const linkClass = (isActive) =>
//     `block px-3 py-2 rounded-md text-sm font-medium ${
//       isActive
//         ? "bg-indigo-50 text-indigo-700"
//         : "text-gray-700 hover:bg-gray-100"
//     }`;

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
//         <div className="mb-6">
//           <div className="text-xl font-bold">Admin Panel</div>
//           <div className="text-sm text-gray-500 mt-1">
//             {user ? `${user.firstName} ${user.lastName}` : "Admin"}
//           </div>
//         </div>

//         <nav className="space-y-1">
//           <NavLink
//             to="/admin"
//             end
//             className={({ isActive }) => linkClass(isActive)}
//           >
//             Overview
//           </NavLink>
//           <NavLink
//             to="/admin/review"
//             className={({ isActive }) => linkClass(isActive)}
//           >
//             Review Posts
//           </NavLink>
//           <NavLink
//             to="/admin/all"
//             className={({ isActive }) => linkClass(isActive)}
//           >
//             All Posts
//           </NavLink>
//           <NavLink
//             to="/admin/users"
//             className={({ isActive }) => linkClass(isActive)}
//           >
//             Users
//           </NavLink>
//           <NavLink
//             to="/admin/announcements"
//             className={({ isActive }) => linkClass(isActive)}
//           >
//             Announcements
//           </NavLink>
//           <NavLink
//             to="/admin/settings"
//             className={({ isActive }) => linkClass(isActive)}
//           >
//             Settings
//           </NavLink>
//         </nav>

//         <div className="mt-6 border-t pt-4">
//           <button
//             onClick={handleLogout}
//             className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
//           >
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <div className="flex-1 flex flex-col">
//         {/* top navbar area (keeps your existing top Navbar visible) */}
//         <div className="bg-white border-b">
//           <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//             <div className="text-lg font-semibold">Admin</div>
//             <div className="text-sm text-gray-600 hidden sm:block">
//               {user ? `${user.firstName} ${user.lastName}` : "Admin"}
//             </div>
//           </div>
//         </div>

//         <main className="flex-1 p-6 overflow-auto container mx-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "@/features/auth/authApi";
import { logouts } from "@/features/auth/authSlice";
import { X, Menu } from "lucide-react"; // icons for toggle

export default function AdminLayout() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(logouts());
      navigate("/login");
    }
  };

  const linkClass = (isActive) =>
    `block px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black opacity-25"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <aside className="relative w-64 bg-white border-r border-gray-200 p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="text-xl font-bold">Admin Panel</div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => linkClass(isActive)}
              >
                Overview
              </NavLink>
              <NavLink
                to="/admin/review"
                className={({ isActive }) => linkClass(isActive)}
              >
                Review Posts
              </NavLink>
              <NavLink
                to="/admin/all"
                className={({ isActive }) => linkClass(isActive)}
              >
                All Posts
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => linkClass(isActive)}
              >
                Users
              </NavLink>
              <NavLink
                to="/admin/update-requests"
                className={({ isActive }) => linkClass(isActive)}
              >
                Update Requests
              </NavLink>
              <NavLink
                to="/admin/announcements"
                className={({ isActive }) => linkClass(isActive)}
              >
                Announcements
              </NavLink>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) => linkClass(isActive)}
              >
                Settings
              </NavLink>
            </nav>

            <div className="mt-6 border-t pt-4">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <div className="mb-6">
          <div className="text-xl font-bold">Admin Panel</div>
          <div className="text-sm text-gray-500 mt-1">
            {user ? `${user.firstName} ${user.lastName}` : "Admin"}
          </div>
        </div>
        <nav className="space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => linkClass(isActive)}
          >
            Overview
          </NavLink>
          <NavLink
            to="/admin/review"
            className={({ isActive }) => linkClass(isActive)}
          >
            Review Posts
          </NavLink>
          <NavLink
            to="/admin/all"
            className={({ isActive }) => linkClass(isActive)}
          >
            All Posts
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => linkClass(isActive)}
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/update-requests"
            className={({ isActive }) => linkClass(isActive)}
          >
            Update Requests
          </NavLink>
          <NavLink
            to="/admin/announcements"
            className={({ isActive }) => linkClass(isActive)}
          >
            Announcements
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => linkClass(isActive)}
          >
            Settings
          </NavLink>
        </nav>
        <div className="mt-6 border-t pt-4">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                className="md:hidden p-1 rounded hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="text-lg font-semibold">Admin</div>
            </div>
            <div className="text-sm text-gray-600 hidden sm:block">
              {user ? `${user.firstName} ${user.lastName}` : "Admin"}
            </div>
          </div>
        </div>

        <main className="flex-1 p-6 overflow-auto container mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
