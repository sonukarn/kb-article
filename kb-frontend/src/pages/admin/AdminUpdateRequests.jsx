import React, { useEffect } from "react";
import {
  useListUpdateRequestsAdminQuery,
  useActionUpdateRequestMutation,
} from "@/features/posts/postApi";
import { Loader2 } from "lucide-react";
import { getSocket } from "@/lib/socket";
import { io } from "socket.io-client";

export default function AdminUpdateRequests() {
  const { data, isLoading, refetch } = useListUpdateRequestsAdminQuery();
  const [actionRequest, { isLoading: actionLoading }] =
    useActionUpdateRequestMutation();

  // ✅ Real-time listener for new requests
  useEffect(() => {
  const socket = getSocket(); // ✅ use shared socket instance
  socket.on("admin:update-request", (payload) => {
    console.log("🔥 New update request:", payload);
    refetch();
  });
  return () => socket.off("admin:update-request");
}, [refetch]);

  const handleAction = async (id, action) => {
    const adminNote = prompt(`Add ${action} note (optional):`) || "";
    try {
      await actionRequest({ id, action, adminNote }).unwrap();
      refetch();
    } catch (err) {
      console.error("Error processing:", err);
      alert("Error processing request");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );

  const requests = data?.requests || [];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Update Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-600">No update requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border-b">Post Title</th>
                <th className="p-3 border-b">Requested By</th>
                <th className="p-3 border-b">Reason</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{r.post.title}</td>
                  <td className="p-3">
                    {r.user.firstName} {r.user.lastName}
                    <br />
                    <span className="text-xs text-gray-500">
                      {r.user.email}
                    </span>
                  </td>
                  <td className="p-3">{r.reason || "-"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        r.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : r.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    {r.status === "PENDING" ? (
                      <>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleAction(r.id, "approve")}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleAction(r.id, "reject")}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">Processed</span>
                    )}
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
