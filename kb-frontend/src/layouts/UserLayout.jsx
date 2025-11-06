// src/layouts/UserLayout.jsx
import { NavLink, Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r shadow-sm p-6 md:min-h-screen">
        <h1 className="text-2xl font-bold text-indigo-600 mb-8">
          User Dashboard
        </h1>
        <nav className="space-y-3">
          {[
            { to: "/user/dashboard", label: "Dashboard" },
            { to: "/user/myposts", label: "My Posts" },
            { to: "/user/requests", label: "Update Requests" },
            { to: "/user/edit-profile", label: "Edit Profile" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
