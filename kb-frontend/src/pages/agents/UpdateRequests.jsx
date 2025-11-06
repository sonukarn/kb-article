import { useGetMyUpdateRequestsQuery } from "@/features/posts/postApi";

export default function UpdateRequests() {
  const { data: myReqs, isLoading } = useGetMyUpdateRequestsQuery();
  const requests = myReqs?.requests || [];

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Update Requests</h2>
      {!requests.length ? (
        <p className="text-gray-600">No update requests yet.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((req) => (
            <li
              key={req.id}
              className="p-3 border rounded-md bg-white shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{req.post.title}</p>
                <p className="text-sm text-gray-500">Status: {req.status}</p>
                {req.reason && (
                  <p className="text-xs text-gray-500">Reason: {req.reason}</p>
                )}
              </div>

              <span
                className={`font-medium ${
                  req.status === "APPROVED"
                    ? "text-green-600"
                    : req.status === "REJECTED"
                    ? "text-red-600"
                    : "text-yellow-700"
                }`}
              >
                {req.status === "APPROVED"
                  ? "✔ Edit allowed"
                  : req.status === "REJECTED"
                  ? "✖ Rejected"
                  : "⏳ Pending"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
