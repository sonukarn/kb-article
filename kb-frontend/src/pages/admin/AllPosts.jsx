// import React from "react";
// import {
//   useGetPublishedPostsQuery,
//   useListReviewPostsQuery,
// } from "@/features/posts/postApi";

// export default function AllPosts() {
//   const { data: published = [] } = useGetPublishedPostsQuery();
//   const { data: review = [] } = useListReviewPostsQuery();

//   const all = [...(published || []), ...(review || [])];

//   // Helper to truncate content
//   const truncateText = (text, maxLength = 150) => {
//     if (!text) return "";
//     return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">All Posts</h1>

//       {all.length === 0 && <p className="text-gray-500">No posts.</p>}

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {all.map((post) => (
//           <div
//             key={post.id}
//             className="bg-white rounded shadow flex flex-col h-full overflow-hidden"
//           >
//             {/* Post Image */}
//             {post.imageUrl && (
//               <img
//                 src={post.imageUrl}
//                 alt={post.title}
//                 className="w-full h-40 object-cover"
//               />
//             )}

//             <div className="p-4 flex flex-col flex-1">
//               {/* Title */}
//               <h3 className="font-semibold text-lg mb-1 line-clamp-2">
//                 {post.title}
//               </h3>

//               {/* Status */}
//               <div className="text-xs text-gray-500 mb-2 capitalize">
//                 {post.status}
//               </div>

//               {/* Truncated Content */}
//               <div
//                 className="prose max-w-full mb-2 text-sm overflow-hidden line-clamp-5"
//                 dangerouslySetInnerHTML={{
//                   __html: truncateText(post.content, 250),
//                 }}
//               />

//               {/* Button */}
//               <div className="mt-auto flex gap-2">
//                 <button className="px-3 py-1 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition">
//                   View
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import React from "react";
// import {
//   useGetPublishedPostsQuery,
//   useListReviewPostsQuery,
//   useDeletePostMutation,
// } from "@/features/posts/postApi";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// export default function AllPosts() {
//   const { data: published = [] } = useGetPublishedPostsQuery();
//   const { data: review = [] } = useListReviewPostsQuery();
//   const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
//   const navigate = useNavigate();

//   const all = [...(published || []), ...(review || [])];

//   const truncateText = (text, maxLength = 150) => {
//     if (!text) return "";
//     return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;

//     try {
//       await deletePost(id).unwrap();
//       toast.success("Post deleted successfully ✅");
//     } catch (err) {
//       console.error("Error deleting post:", err);
//       toast.error("Failed to delete post ❌");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">All Posts</h1>

//       {all.length === 0 && <p className="text-gray-500">No posts.</p>}

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {all.map((post) => (
//           <div
//             key={post.id}
//             className="bg-white rounded shadow flex flex-col h-full overflow-hidden"
//           >
//             {post.imageUrl && (
//               <img
//                 src={post.imageUrl}
//                 alt={post.title}
//                 className="w-full h-40 object-cover"
//               />
//             )}

//             <div className="p-4 flex flex-col flex-1">
//               <h3 className="font-semibold text-lg mb-1 line-clamp-2">
//                 {post.title}
//               </h3>

//               <div className="text-xs text-gray-500 mb-2 capitalize">
//                 {post.category ? `${post.category} • ` : ""}
//                 {post.status || "unknown"}
//               </div>

//               <div
//                 className="prose max-w-full mb-2 text-sm overflow-hidden line-clamp-5"
//                 dangerouslySetInnerHTML={{
//                   __html: truncateText(post.content, 250),
//                 }}
//               />

//               <div className="mt-auto flex gap-2">
//                 <button
//                   onClick={() => navigate(`/admin/posts/${post.id}/view`)}
//                   className="px-3 py-1 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
//                 >
//                   View
//                 </button>

//                 <button
//                   disabled={isDeleting}
//                   onClick={() => handleDelete(post.id)}
//                   className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition disabled:opacity-50"
//                 >
//                   {isDeleting ? "Deleting..." : "Delete"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import React from "react";
// import {
//   useGetPublishedPostsQuery,
//   useListReviewPostsQuery,
//   useDeletePostMutation,
// } from "@/features/posts/postApi";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// export default function AllPosts() {
//   const { data: published = [] } = useGetPublishedPostsQuery();
//   const { data: review = [] } = useListReviewPostsQuery();
//   const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
//   const navigate = useNavigate();

//   // ✅ Combine both published + under-review posts
//   const all = [...(published || []), ...(review || [])];

//   const truncateText = (text, maxLength = 150) => {
//     if (!text) return "";
//     return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;

//     try {
//       await deletePost(id).unwrap();
//       toast.success("Post deleted successfully ✅");
//     } catch (err) {
//       console.error("Error deleting post:", err);
//       toast.error("Failed to delete post ❌");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">All Posts</h1>

//       {all.length === 0 && <p className="text-gray-500">No posts.</p>}

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {all.map((post) => (
//           <div
//             key={post.id}
//             className="bg-white rounded shadow flex flex-col h-full overflow-hidden"
//           >
//             {/* Thumbnail */}
//             {post.imageUrl && (
//               <img
//                 src={post.imageUrl}
//                 alt={post.title}
//                 className="w-full h-40 object-cover"
//               />
//             )}

//             <div className="p-4 flex flex-col flex-1">
//               {/* ✅ Title */}
//               <h3 className="font-semibold text-lg mb-1 line-clamp-2">
//                 {post.title}
//               </h3>

//               {/* ✅ Category + Status */}
//               <div className="flex items-center gap-2 text-xs mb-2">
//                 {/* ✅ Category Name */}
//                 <span className="text-gray-600">
//                   {post.category?.name || "Uncategorized"}
//                 </span>

//                 {/* ✅ Category Status Badge */}
//                 {post.category?.status && (
//                   <span
//                     className={`px-2 py-0.5 rounded text-white ${
//                       post.category.status === "APPROVED"
//                         ? "bg-green-600"
//                         : post.category.status === "PENDING"
//                         ? "bg-yellow-600"
//                         : "bg-red-600"
//                     }`}
//                   >
//                     {post.category.status}
//                   </span>
//                 )}

//                 {/* ✅ Post Status */}
//                 <span className="text-gray-500">
//                   •{" "}
//                   {post.status
//                     ? post.status
//                     : post.publishedAt
//                     ? "PUBLISHED"
//                     : "REVIEW"}
//                 </span>
//               </div>

//               {/* ✅ Content Preview */}
//               <div
//                 className="prose max-w-full mb-2 text-sm overflow-hidden line-clamp-5"
//                 dangerouslySetInnerHTML={{
//                   __html: truncateText(post.content, 250),
//                 }}
//               />

//               {/* ✅ Actions */}
//               <div className="mt-auto flex gap-2">
//                 <button
//                   onClick={() => navigate(`/admin/posts/${post.id}/view`)}
//                   className="px-3 py-1 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
//                 >
//                   View
//                 </button>

//                 <button
//                   disabled={isDeleting}
//                   onClick={() => handleDelete(post.id)}
//                   className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition disabled:opacity-50"
//                 >
//                   {isDeleting ? "Deleting..." : "Delete"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React from "react";
import {
  useGetPublishedPostsQuery,
  useListReviewPostsQuery,
  useDeletePostMutation,
} from "@/features/posts/postApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AllPosts() {
  const { data: published = [] } = useGetPublishedPostsQuery();
  const { data: review = [] } = useListReviewPostsQuery();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const navigate = useNavigate();

  // ✅ Combine all posts
  const all = [...(published || []), ...(review || [])];

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(id).unwrap();
      toast.success("Post deleted successfully ✅");
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post ❌");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Posts</h1>

      {all.length === 0 && <p className="text-gray-500">No posts.</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {all.map((post) => {
          // ✅ FIX CATEGORY HANDLING (old + new posts)
          const categoryName =
            post.category?.name ||
            (typeof post.category === "string"
              ? post.category
              : "Uncategorized");

          const categoryStatus =
            post.category?.status ||
            (typeof post.category === "string" ? "APPROVED" : null);

          // ✅ FIX POST STATUS
          const postStatus = post.status
            ? post.status
            : post.publishedAt
            ? "PUBLISHED"
            : "REVIEW";

          return (
            <div
              key={post.id}
              className="bg-white rounded shadow flex flex-col h-full overflow-hidden"
            >
              {/* Thumbnail */}
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
              )}

              <div className="p-4 flex flex-col flex-1">
                {/* ✅ Title */}
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                  {post.title}
                </h3>

                {/* ✅ Category + Status */}
                <div className="flex items-center gap-2 text-xs mb-2">
                  {/* ✅ Category Name */}
                  <span className="text-gray-600">{categoryName}</span>

                  {/* ✅ Category Status Badge */}
                  {categoryStatus && (
                    <span
                      className={`px-2 py-0.5 rounded text-white ${
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

                  {/* ✅ Post Status */}
                  <span className="text-gray-500">• {postStatus}</span>
                </div>

                {/* ✅ Content Preview */}
                <div
                  className="prose max-w-full mb-2 text-sm overflow-hidden line-clamp-5"
                  dangerouslySetInnerHTML={{
                    __html: truncateText(post.content, 250),
                  }}
                />

                {/* ✅ Actions */}
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/posts/${post.id}/view`)}
                    className="px-3 py-1 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                  >
                    View
                  </button>

                  <button
                    disabled={isDeleting}
                    onClick={() => handleDelete(post.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
