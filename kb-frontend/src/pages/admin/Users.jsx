import React from "react";
import { useGetAllUsersQuery, useAdminDeleteUserMutation } from "@/features/user/userApi";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export default function Users() {
  const { data: users = [], isLoading, isError } = useGetAllUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useAdminDeleteUserMutation();

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading users...
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Failed to load users.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Users</h1>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3 text-center">Posts</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.role.toLowerCase()}</td>
                  <td className="px-4 py-3">
                    {user.isVerified ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-500 font-medium">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">{user.postCount}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={isDeleting}
                      className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
