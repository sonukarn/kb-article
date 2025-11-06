import {
  useGetMyPostsQuery,
  useGetMyUpdateRequestsQuery,
} from "@/features/posts/postApi";

export default function Dashboard() {
  const { data: posts } = useGetMyPostsQuery();
  const { data: requests } = useGetMyUpdateRequestsQuery();

  const postCount = posts?.posts?.length || 0;
  const pendingReq =
    requests?.requests?.filter((r) => r.status === "PENDING").length || 0;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-gray-600 font-medium">Total Posts</h3>
          <p className="text-3xl font-bold text-indigo-600">{postCount}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-gray-600 font-medium">Pending Requests</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingReq}</p>
        </div>
      </div>
    </div>
  );
}
