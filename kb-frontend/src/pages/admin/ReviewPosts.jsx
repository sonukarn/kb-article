// // src/pages/admin/ReviewPosts.jsx
// import React from "react";
// import {
//   useListReviewPostsQuery,
//   usePublishPostMutation,
//   useRejectPostMutation,
//   useDeletePostMutation,
// } from "@/features/posts/postApi";

// export default function ReviewPosts() {
//   const { data: posts = [], isLoading } = useListReviewPostsQuery();
//   const [publishPost] = usePublishPostMutation();
//   const [rejectPost] = useRejectPostMutation();
//   const [deletePost] = useDeletePostMutation();

//   const handlePublish = async (id) => {
//     try {
//       await publishPost(id).unwrap();
//       alert("Published");
//     } catch (e) {
//       console.error(e);
//       alert("Publish failed");
//     }
//   };

//   const handleReject = async (id) => {
//     const reason = prompt("Reason for rejection (optional):", "");
//     if (reason === null) return;
//     try {
//       await rejectPost({ id, reason }).unwrap();
//       alert("Rejected");
//     } catch (e) {
//       console.error(e);
//       alert("Reject failed");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this post?")) return;
//     try {
//       await deletePost(id).unwrap();
//       alert("Deleted");
//     } catch (e) {
//       console.error(e);
//       alert("Delete failed");
//     }
//   };

//   if (isLoading) return <div>Loading...</div>;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">Review Posts</h1>

//       {posts.length === 0 && (
//         <div className="text-gray-500">No posts pending review.</div>
//       )}

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {posts.map((post) => (
//           <article
//             key={post.id}
//             className="bg-white shadow rounded-lg p-4 flex flex-col"
//           >
//             <h3 className="font-semibold text-lg mb-2">{post.title}</h3>

//             {post.imageUrl && (
//               <img
//                 src={post.imageUrl}
//                 alt={post.title}
//                 className="h-40 w-full object-cover rounded mb-2"
//               />
//             )}

//             <div
//               className="prose max-w-full mb-2 text-sm"
//               dangerouslySetInnerHTML={{ __html: post.content }}
//             ></div>

//             <div className="flex flex-wrap gap-2 mb-2">
//               {(post.tags ?? "").map((t, i) => (
//                 <span
//                   key={i}
//                   className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
//                 >
//                   {t}
//                 </span>
//               ))}
//             </div>

//             <div className="mt-auto flex gap-2">
//               <button
//                 onClick={() => handlePublish(post.id)}
//                 className="bg-green-600 text-white px-3 py-1 rounded"
//               >
//                 Publish
//               </button>
//               <button
//                 onClick={() => handleReject(post.id)}
//                 className="bg-yellow-600 text-white px-3 py-1 rounded"
//               >
//                 Reject
//               </button>
//               <button
//                 onClick={() => handleDelete(post.id)}
//                 className="bg-red-600 text-white px-3 py-1 rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </article>
//         ))}
//       </div>
//     </div>
//   );
// }

// import React from "react";
// import {
//   useListReviewPostsQuery,
//   usePublishPostMutation,
//   useRejectPostMutation,
//   useDeletePostMutation,
// } from "@/features/posts/postApi";
// import { toast } from "sonner";

// export default function ReviewPosts() {
//   const { data: posts = [], isLoading } = useListReviewPostsQuery();
//   const [publishPost] = usePublishPostMutation();
//   const [rejectPost] = useRejectPostMutation();
//   const [deletePost] = useDeletePostMutation();

//   const handlePublish = async (id) => {
//     try {
//       await publishPost(id).unwrap();
//       toast.success("Published successfully");
//     } catch (e) {
//       console.error(e);
//       toast.error("Publish failed");
//     }
//   };

//   const handleReject = async (id) => {
//     const reason = prompt("Reason for rejection (optional):", "");
//     if (reason === null) return;
//     try {
//       await rejectPost({ id, reason }).unwrap();
//       toast.success("Rejected successfully");
//     } catch (e) {
//       console.error(e);
//       toast.error("Reject failed");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this post?")) return;
//     try {
//       await deletePost(id).unwrap();
//       toast.success("Deleted successfully");
//     } catch (e) {
//       console.error(e);
//       toast.error("Delete failed");
//     }
//   };

//   if (isLoading) return <div>Loading...</div>;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">Review Posts</h1>

//       {posts.length === 0 && (
//         <div className="text-gray-500">No posts pending review.</div>
//       )}

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {posts.map((post) => (
//           <article
//             key={post.id}
//             className="bg-white shadow rounded-lg flex flex-col"
//           >
//             {/* Image */}
//             {post.imageUrl && (
//               <img
//                 src={post.imageUrl}
//                 alt={post.title}
//                 className="h-48 w-full object-cover rounded-t-lg"
//               />
//             )}

//             <div className="p-4 flex flex-col flex-1">
//               {/* Title */}
//               <h3 className="font-semibold text-lg mb-2 line-clamp-2">
//                 {post.title}
//               </h3>

//               {/* Content */}
//               <div
//                 className="prose max-w-full text-sm mb-2 overflow-y-auto"
//                 style={{ maxHeight: "120px" }}
//                 dangerouslySetInnerHTML={{ __html: post.content }}
//               ></div>

//               {/* Tags */}
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {(post.tags ?? []).map((t, i) => (
//                   <span
//                     key={i}
//                     className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
//                   >
//                     {t}
//                   </span>
//                 ))}
//               </div>

//               {/* Action buttons */}
//               <div className="mt-auto flex gap-2">
//                 <button
//                   onClick={() => handlePublish(post.id)}
//                   className="bg-green-600 text-white px-3 py-1 rounded"
//                 >
//                   Publish
//                 </button>
//                 <button
//                   onClick={() => handleReject(post.id)}
//                   className="bg-yellow-600 text-white px-3 py-1 rounded"
//                 >
//                   Reject
//                 </button>
//                 <button
//                   onClick={() => handleDelete(post.id)}
//                   className="bg-red-600 text-white px-3 py-1 rounded"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </article>
//         ))}
//       </div>
//     </div>
//   );
// }

import React from "react";
import {
  useListReviewPostsQuery,
  usePublishPostMutation,
  useRejectPostMutation,
  useDeletePostMutation,
} from "@/features/posts/postApi";
import { toast } from "sonner";

export default function ReviewPosts() {
  const { data: posts = [], isLoading } = useListReviewPostsQuery();
  const [publishPost] = usePublishPostMutation();
  const [rejectPost] = useRejectPostMutation();
  const [deletePost] = useDeletePostMutation();

  const handlePublish = async (id) => {
    try {
      await publishPost(id).unwrap();
      toast.success("Published successfully");
    } catch (e) {
      console.error(e);
      toast.error("Publish failed");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Reason for rejection (optional):", "");
    if (reason === null) return;
    try {
      await rejectPost({ id, reason }).unwrap();
      toast.success("Rejected successfully");
    } catch (e) {
      console.error(e);
      toast.error("Reject failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost(id).unwrap();
      toast.success("Deleted successfully");
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Review Posts</h1>

      {posts.length === 0 && (
        <div className="text-gray-500">No posts pending review.</div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white shadow rounded-lg flex flex-col"
          >
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="h-48 w-full object-cover rounded-t-lg"
              />
            )}

            <div className="p-4 flex flex-col flex-1">
              {/* ✅ Category */}
              <div className="text-sm text-gray-700 mb-2">
                Category:{" "}
                <span className="font-medium">
                  {post.category?.name || "Uncategorized"}
                </span>
                {post.category?.status && (
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded ${
                      post.category.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : post.category.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {post.category.status}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {post.title}
              </h3>

              {/* Content preview */}
              <div
                className="prose max-w-full text-sm mb-2 overflow-y-auto"
                style={{ maxHeight: "120px" }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {(post.tags ?? []).map((t, i) => (
                  <span
                    key={i}
                    className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => handlePublish(post.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleReject(post.id)}
                  className="bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
