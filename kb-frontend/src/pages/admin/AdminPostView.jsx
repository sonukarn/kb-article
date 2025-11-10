// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useGetAdminPostByIdQuery, useDeletePostMutation } from "@/features/posts/postApi";
// import { toast } from "sonner";

// export default function AdminPostView() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { data: post, isLoading, isError } = useGetAdminPostByIdQuery(id);
//   const [deletePost] = useDeletePostMutation();

//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;
//     try {
//       await deletePost(id).unwrap();
//       toast.success("Post deleted successfully ✅");
//       navigate(-1); // go back to previous page
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete post ❌");
//     }
//   };

//   if (isLoading) return <p className="text-center py-10">Loading...</p>;
//   if (isError || !post)
//     return <p className="text-center text-red-500 py-10">Post not found.</p>;

//   return (
//     <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded">
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <h1 className="text-2xl font-bold">{post.title}</h1>
//           <p className="text-sm text-gray-500">
//             {post.category ? `${post.category} • ` : ""}
//             {post.status}
//           </p>
//           <p className="text-sm text-gray-400">
//             Author: {post.author || "Deleted User"}
//           </p>
//         </div>
//         <button
//           onClick={handleDelete}
//           className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
//         >
//           Delete
//         </button>
//       </div>

//       <hr className="my-4" />

//       <div
//         className="prose max-w-none"
//         dangerouslySetInnerHTML={{ __html: post.content }}
//       />

//       {post.rejectReason && (
//         <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
//           <strong>Reject Reason:</strong>
//           <p className="text-sm text-red-700">{post.rejectReason}</p>
//         </div>
//       )}

//       {post.publishedAt && (
//         <p className="text-xs text-gray-500 mt-4">
//           Published: {new Date(post.publishedAt).toLocaleString()}
//         </p>
//       )}
//     </div>
//   );
// }

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAdminPostByIdQuery,
  useDeletePostMutation,
} from "@/features/posts/postApi";
import { toast } from "sonner";

export default function AdminPostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, isError } = useGetAdminPostByIdQuery(id);
  const [deletePost] = useDeletePostMutation();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(id).unwrap();
      toast.success("Post deleted successfully ✅");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post ❌");
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError || !post)
    return <p className="text-center text-red-500 py-10">Post not found.</p>;

  // ✅ Clean category name + status
  const categoryName =
    post.category?.name ||
    (typeof post.category === "string" ? post.category : "Uncategorized");

  const categoryStatus =
    post.category?.status ||
    (typeof post.category === "string" ? "APPROVED" : null);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">{post.title}</h1>

          {/* ✅ Category + Status */}
          <p className="text-sm text-gray-500 flex items-center gap-2">
            {categoryName && <span>{categoryName}</span>}

            {categoryStatus && (
              <span
                className={`px-2 py-0.5 rounded text-white text-xs ${
                  categoryStatus === "APPROVED"
                    ? "bg-green-600"
                    : categoryStatus === "PENDING"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
              >
                {categoryStatus}
              </span>
            )}

            <span className="text-gray-400">• {post.status}</span>
          </p>

          {/* ✅ Author */}
          <p className="text-sm text-gray-400">
            Author: {post.author || "Deleted User"}
          </p>
        </div>

        <button
          onClick={handleDelete}
          className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>

      <hr className="my-4" />

      {/* ✅ Content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* ✅ Reject Reason */}
      {post.rejectReason && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
          <strong>Reject Reason:</strong>
          <p className="text-sm text-red-700">{post.rejectReason}</p>
        </div>
      )}

      {/* ✅ Published Date */}
      {post.publishedAt && (
        <p className="text-xs text-gray-500 mt-4">
          Published: {new Date(post.publishedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
