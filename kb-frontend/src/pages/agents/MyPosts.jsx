// import { useEffect, useState, useMemo } from "react";
// import {
//   useGetMyPostsQuery,
//   useUpdateRejectedPostMutation,
//   useCreateUpdateRequestMutation,
//   useGetMyUpdateRequestsQuery,
// } from "@/features/posts/postApi";
// import { toast } from "sonner";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import { getSocket } from "@/lib/socket";

// export default function MyPosts() {
//   // fetch user's posts
//   const {
//     data: postsData,
//     isLoading,
//     isError,
//     refetch: refetchMyPosts,
//   } = useGetMyPostsQuery();

//   // fetch user's update requests
//   const { data: myReqs } = useGetMyUpdateRequestsQuery();

//   const [createUpdateRequest] = useCreateUpdateRequestMutation();
//   const [updatePost] = useUpdateRejectedPostMutation();

//   const [editingPostId, setEditingPostId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editContent, setEditContent] = useState("");
//   const [editTags, setEditTags] = useState("");
//   const [editCategory, setEditCategory] = useState("");

//   // convenience arrays
//   const posts = postsData?.posts || [];
//   const myRequests = myReqs?.requests || [];

//   // map of postId => boolean (pending request exists)
//   const pendingByPost = useMemo(() => {
//     const map = new Map();
//     myRequests.forEach((r) => {
//       if (r.status === "PENDING") map.set(r.postId, true);
//     });
//     return map;
//   }, [myRequests]);

//   // Start editing a post (either from REJECTED or when canEdit true)
//   // const startEdit = (post) => {
//   //   setEditingPostId(post.id);
//   //   setEditTitle(post.title || "");
//   //   setEditContent(post.content || "");
//   //   setEditTags(post.tags || "");
//   //   setEditCategory(post.category || "");
//   //   // optionally scroll to top of editor etc.
//   // };
//   const startEdit = (post) => {
//     setEditingPostId(post.id);
//     setEditTitle(post.title || "");
//     setEditContent(post.content || "");
//     setEditTags(post.tags ? post.tags.join(", ") : "");
//     setEditCategory(post.category?.name || ""); // ✅ fixed
//   };

//   // Update post (used when editing after rejection OR after admin set canEdit true)
//   const handleUpdate = async () => {
//     if (!editTitle || !editContent) {
//       toast.error("Title and content are required");
//       return;
//     }
//     try {
//       await updatePost({
//         id: editingPostId,
//         data: {
//           title: editTitle,
//           content: editContent,
//           tags: editTags,
//           category: editCategory,
//         },
//       }).unwrap();
//       toast.success("Post updated and sent for review!");
//       setEditingPostId(null);
//       // refresh the posts & requests
//       refetchMyPosts();
//     } catch (err) {
//       console.error("Update failed:", err);
//       toast.error("Failed to update post");
//     }
//   };

//   // Request edit access for a published post
//   const handleRequestEdit = async (postId) => {
//     try {
//       // prevent duplicate immediate sends
//       if (pendingByPost.get(postId)) {
//         toast("A pending request already exists for this post.");
//         return;
//       }
//       await createUpdateRequest({
//         postId,
//         reason: "I want to improve my article",
//       }).unwrap();
//       toast.success("Edit request sent to admin!");
//     } catch (err) {
//       console.error("create request error:", err);
//       toast.error(err?.data?.message || "Failed to create request");
//     }
//   };

//   // Listen to socket events to update UI in real-time
//   useEffect(() => {
//     const socket = getSocket();
//     if (!socket) return;

//     const handler = (payload) => {
//       // payload shape used across your code: { userId, postId, action, reason, ... }
//       // Only act if it's related to current user (notifications targeted by server)
//       console.log("Profile socket payload:", payload);

//       // For update-request actions you emit admin:update-request -> admin panel
//       // For per-user notifications you already send 'post:notification' with userId
//       // We'll refresh posts on relevant actions and show friendly toast
//       const action = payload?.action;
//       const postId = payload?.postId;
//       if (!action) return;

//       if (["APPROVED", "REJECTED", "PUBLISHED", "DELETED"].includes(action)) {
//         // refetch posts so canEdit/status/rejectReason reflect immediately
//         refetchMyPosts();
//         // show toast message
//         let message = `${payload.title || "Your post"}: ${action}`;
//         if (payload.reason) message += ` — ${payload.reason}`;
//         toast.success(message);
//       }

//       // Also if admin specifically approves update request, the server may send action "APPROVED"
//       // and include updateRequestId; we already handle it above
//     };

//     socket.on("post:notification", handler);

//     return () => {
//       socket.off("post:notification", handler);
//       // do not disconnect global socket here
//     };
//   }, [refetchMyPosts]);

//   if (isLoading) return <p className="text-center mt-10">Loading...</p>;
//   if (isError)
//     return <p className="text-center text-red-600">Failed to load posts.</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-10">
//       <section>
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">My Posts</h2>

//         {posts.length === 0 ? (
//           <p className="text-gray-600">No posts yet.</p>
//         ) : (
//           <ul className="space-y-4">
//             {posts.map((post) => (
//               <li
//                 key={post.id}
//                 className="p-4 border rounded-md bg-gray-50 shadow-sm"
//               >
//                 {editingPostId === post.id ? (
//                   <div className="space-y-4 bg-white p-4 rounded-md shadow-inner border">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Title
//                       </label>
//                       <input
//                         type="text"
//                         value={editTitle}
//                         onChange={(e) => setEditTitle(e.target.value)}
//                         placeholder="Enter post title"
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Content
//                       </label>
//                       <ReactQuill
//                         value={editContent}
//                         onChange={setEditContent}
//                         placeholder="Edit your post content..."
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Tags (comma separated)
//                       </label>
//                       <input
//                         type="text"
//                         value={editTags}
//                         onChange={(e) => setEditTags(e.target.value)}
//                         placeholder="example: react, node, prisma"
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Category
//                       </label>
//                       <input
//                         type="text"
//                         value={
//                           typeof editCategory === "object"
//                             ? editCategory?.name || ""
//                             : editCategory || ""
//                         }
//                         onChange={(e) => setEditCategory(e.target.value)}
//                         placeholder="Type category name (or leave same)"
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                       />
//                       <p className="text-xs text-gray-500 mt-1">
//                         (If you type a new category, it will be sent for admin
//                         approval)
//                       </p>
//                     </div>

//                     <div className="flex gap-3 pt-2">
//                       <button
//                         onClick={handleUpdate}
//                         className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
//                       >
//                         Save Changes
//                       </button>
//                       <button
//                         onClick={() => setEditingPostId(null)}
//                         className="text-gray-600 hover:underline"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   // --- Normal post view ---
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       {post.title}
//                     </h3>
//                     <p className="text-sm text-gray-500">
//                       Status: {post.status}
//                     </p>

//                     {/* REJECTED flow: show rejection reason + Edit button */}
//                     {post.status === "REJECTED" && (
//                       <>
//                         <p className="text-red-600 text-sm mt-1">
//                           Rejection Reason:{" "}
//                           {post.rejectReason || "No reason provided"}
//                         </p>
//                         <button
//                           onClick={() => startEdit(post)}
//                           className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
//                         >
//                           Edit Post
//                         </button>
//                       </>
//                     )}

//                     {/* APPROVED (admin allowed editing) or canEdit === true -> show Edit button */}
//                     {post.canEdit && (
//                       <div className="mt-2">
//                         <p className="text-sm text-green-600">
//                           Edit access granted
//                         </p>
//                         <button
//                           onClick={() => startEdit(post)}
//                           className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
//                         >
//                           Edit Post
//                         </button>
//                       </div>
//                     )}

//                     {/* If published and no pending request and no canEdit, allow requesting edit access */}
//                     {post.status === "PUBLISHED" &&
//                       !post.canEdit &&
//                       !pendingByPost.get(post.id) && (
//                         <button
//                           onClick={() => handleRequestEdit(post.id)}
//                           className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
//                         >
//                           Request Edit Access
//                         </button>
//                       )}

//                     {/* If published but request pending */}
//                     {post.status === "PUBLISHED" &&
//                       !post.canEdit &&
//                       pendingByPost.get(post.id) && (
//                         <div className="mt-2 text-sm text-yellow-700">
//                           Edit request pending
//                         </div>
//                       )}
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>

//       {/* --- My Update Requests Section --- */}
//       <section>
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">
//           My Update Requests
//         </h2>

//         {!myRequests?.length ? (
//           <p className="text-gray-600">No update requests yet.</p>
//         ) : (
//           <ul className="space-y-3">
//             {myRequests.map((req) => (
//               <li
//                 key={req.id}
//                 className="p-3 border rounded-md bg-white shadow-sm flex justify-between items-center"
//               >
//                 <div>
//                   <p className="font-medium">{req.post.title}</p>
//                   <p className="text-sm text-gray-500">Status: {req.status}</p>
//                   {req.reason && (
//                     <p className="text-xs text-gray-500">
//                       Reason: {req.reason}
//                     </p>
//                   )}
//                 </div>

//                 {req.status === "APPROVED" && (
//                   <span className="text-green-600 font-medium">
//                     ✔ Edit allowed
//                   </span>
//                 )}
//                 {req.status === "REJECTED" && (
//                   <span className="text-red-600 font-medium">✖ Rejected</span>
//                 )}
//                 {req.status === "PENDING" && (
//                   <span className="text-yellow-700 font-medium">
//                     ⏳ Pending
//                   </span>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// }

// import { useEffect, useState, useMemo } from "react";
// import {
//   useGetMyPostsQuery,
//   useUpdateRejectedPostMutation,
//   useCreateUpdateRequestMutation,
//   useGetMyUpdateRequestsQuery,
// } from "@/features/posts/postApi";
// import { useGetCategoriesQuery } from "@/features/categories/categoryApi";
// import { toast } from "sonner";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import { getSocket } from "@/lib/socket";

// export default function MyPosts() {
//   // fetch user's posts
//   const {
//     data: postsData,
//     isLoading,
//     isError,
//     refetch: refetchMyPosts,
//   } = useGetMyPostsQuery();

//   // categories (approved)
//   const { data: catData } = useGetCategoriesQuery("APPROVED");
//   const approvedCategories = catData?.categories || [];

//   // fetch user's update requests
//   const { data: myReqs } = useGetMyUpdateRequestsQuery();

//   const [createUpdateRequest] = useCreateUpdateRequestMutation();
//   const [updatePost] = useUpdateRejectedPostMutation();

//   const [editingPostId, setEditingPostId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editContent, setEditContent] = useState("");
//   const [editTags, setEditTags] = useState("");
//   // We'll track category as either selected id (string) or if creating new -> newCategoryName
//   const [editCategoryId, setEditCategoryId] = useState(""); // holds category id as string or ""
//   const [newCategoryName, setNewCategoryName] = useState("");
//   const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);

//   // convenience arrays
//   const posts = postsData?.posts || [];
//   const myRequests = myReqs?.requests || [];

//   // map of postId => boolean (pending request exists)
//   const pendingByPost = useMemo(() => {
//     const map = new Map();
//     myRequests.forEach((r) => {
//       if (r.status === "PENDING") map.set(r.postId, true);
//     });
//     return map;
//   }, [myRequests]);

//   // Start editing a post (either from REJECTED or when canEdit true)
//   const startEdit = (post) => {
//     setEditingPostId(post.id);
//     setEditTitle(post.title || "");
//     setEditContent(post.content || "");
//     setEditTags(
//       (Array.isArray(post.tags) ? post.tags.join(",") : post.tags) || ""
//     );
//     // If post has category object -> set id, otherwise blank
//     if (post.category && post.category.id) {
//       setEditCategoryId(String(post.category.id));
//       setIsCreatingNewCategory(false);
//       setNewCategoryName("");
//     } else {
//       setEditCategoryId("");
//       setIsCreatingNewCategory(false);
//       setNewCategoryName("");
//     }
//     // scroll or focus if you want
//   };

//   // Update post (used when editing after rejection OR after admin set canEdit true)
//   const handleUpdate = async () => {
//     if (!editTitle || !editContent) {
//       toast.error("Title and content are required");
//       return;
//     }

//     const payload = {
//       title: editTitle,
//       content: editContent,
//       tags: editTags,
//     };

//     if (isCreatingNewCategory && newCategoryName.trim()) {
//       payload.newCategoryName = newCategoryName.trim();
//     } else if (!isCreatingNewCategory && editCategoryId) {
//       // send numeric categoryId
//       payload.categoryId = Number(editCategoryId);
//     } else {
//       // neither selected nor new -> ensure null is passed so backend clears category if needed
//       payload.categoryId = null;
//     }

//     try {
//       await updatePost({ id: editingPostId, data: payload }).unwrap();
//       toast.success("Post updated and sent for review!");
//       setEditingPostId(null);
//       setEditTitle("");
//       setEditContent("");
//       setEditTags("");
//       setEditCategoryId("");
//       setNewCategoryName("");
//       setIsCreatingNewCategory(false);
//       // refresh the posts & requests
//       refetchMyPosts();
//     } catch (err) {
//       console.error("Update failed:", err);
//       toast.error(err?.data?.message || "Failed to update post");
//     }
//   };

//   // Request edit access for a published post
//   const handleRequestEdit = async (postId) => {
//     try {
//       if (pendingByPost.get(postId)) {
//         toast("A pending request already exists for this post.");
//         return;
//       }
//       await createUpdateRequest({
//         postId,
//         reason: "I want to improve my article",
//       }).unwrap();
//       toast.success("Edit request sent to admin!");
//     } catch (err) {
//       console.error("create request error:", err);
//       toast.error(err?.data?.message || "Failed to create request");
//     }
//   };

//   // Listen to socket events to update UI in real-time
//   useEffect(() => {
//     const socket = getSocket();
//     if (!socket) return;

//     const handler = (payload) => {
//       const action = payload?.action;
//       if (!action) return;
//       if (["APPROVED", "REJECTED", "PUBLISHED", "DELETED"].includes(action)) {
//         refetchMyPosts();
//         let message = `${payload.title || "Your post"}: ${action}`;
//         if (payload.reason) message += ` — ${payload.reason}`;
//         toast.success(message);
//       }
//     };

//     socket.on("post:notification", handler);

//     return () => {
//       socket.off("post:notification", handler);
//     };
//   }, [refetchMyPosts]);

//   if (isLoading) return <p className="text-center mt-10">Loading...</p>;
//   if (isError)
//     return <p className="text-center text-red-600">Failed to load posts.</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-10">
//       <section>
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">My Posts</h2>

//         {posts.length === 0 ? (
//           <p className="text-gray-600">No posts yet.</p>
//         ) : (
//           <ul className="space-y-4">
//             {posts.map((post) => (
//               <li
//                 key={post.id}
//                 className="p-4 border rounded-md bg-gray-50 shadow-sm"
//               >
//                 {editingPostId === post.id ? (
//                   // --- Editing block ---
//                   <div className="space-y-3">
//                     <input
//                       type="text"
//                       value={editTitle}
//                       onChange={(e) => setEditTitle(e.target.value)}
//                       placeholder="Post title"
//                       className="w-full border px-2 py-1 rounded-md"
//                     />

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Category
//                       </label>
//                       <select
//                         value={isCreatingNewCategory ? "new" : editCategoryId}
//                         onChange={(e) => {
//                           const val = e.target.value;
//                           if (val === "new") {
//                             setIsCreatingNewCategory(true);
//                             setEditCategoryId("");
//                           } else {
//                             setIsCreatingNewCategory(false);
//                             setNewCategoryName("");
//                             setEditCategoryId(val);
//                           }
//                         }}
//                         className="w-full border px-2 py-1 rounded-md"
//                       >
//                         <option value="">-- Select category --</option>
//                         {approvedCategories.map((c) => (
//                           <option key={c.id} value={String(c.id)}>
//                             {c.name}
//                           </option>
//                         ))}
//                         <option value="new">+ Create new category</option>
//                       </select>

//                       {isCreatingNewCategory && (
//                         <div className="mt-2">
//                           <input
//                             type="text"
//                             value={newCategoryName}
//                             onChange={(e) => setNewCategoryName(e.target.value)}
//                             placeholder="New category name"
//                             className="w-full border px-2 py-1 rounded-md"
//                           />
//                           <p className="text-xs text-gray-500 mt-1">
//                             New category will be created as PENDING (requires
//                             admin approval)
//                           </p>
//                         </div>
//                       )}
//                     </div>

//                     <ReactQuill
//                       value={editContent}
//                       onChange={setEditContent}
//                       placeholder="Edit your post content..."
//                     />

//                     <input
//                       type="text"
//                       value={editTags}
//                       onChange={(e) => setEditTags(e.target.value)}
//                       placeholder="tags (comma separated)"
//                       className="w-full border px-2 py-1 rounded-md"
//                     />

//                     <div className="flex gap-2">
//                       <button
//                         onClick={handleUpdate}
//                         className="bg-indigo-600 text-white px-4 py-1 rounded-md hover:bg-indigo-700"
//                       >
//                         Update Post
//                       </button>
//                       <button
//                         onClick={() => setEditingPostId(null)}
//                         className="text-gray-600 hover:underline"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   // --- Normal post view ---
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       {post.title}
//                     </h3>
//                     <p className="text-sm text-gray-500">
//                       Status: {post.status}
//                     </p>

//                     {post.status === "REJECTED" && (
//                       <>
//                         <p className="text-red-600 text-sm mt-1">
//                           Rejection Reason:{" "}
//                           {post.rejectReason || "No reason provided"}
//                         </p>
//                         <button
//                           onClick={() => startEdit(post)}
//                           className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
//                         >
//                           Edit Post
//                         </button>
//                       </>
//                     )}

//                     {post.canEdit && (
//                       <div className="mt-2">
//                         <p className="text-sm text-green-600">
//                           Edit access granted
//                         </p>
//                         <button
//                           onClick={() => startEdit(post)}
//                           className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
//                         >
//                           Edit Post
//                         </button>
//                       </div>
//                     )}

//                     {post.status === "PUBLISHED" &&
//                       !post.canEdit &&
//                       !pendingByPost.get(post.id) && (
//                         <button
//                           onClick={() => handleRequestEdit(post.id)}
//                           className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
//                         >
//                           Request Edit Access
//                         </button>
//                       )}

//                     {post.status === "PUBLISHED" &&
//                       !post.canEdit &&
//                       pendingByPost.get(post.id) && (
//                         <div className="mt-2 text-sm text-yellow-700">
//                           Edit request pending
//                         </div>
//                       )}
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>

//       {/* --- My Update Requests Section --- */}
//       <section>
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">
//           My Update Requests
//         </h2>

//         {!myRequests?.length ? (
//           <p className="text-gray-600">No update requests yet.</p>
//         ) : (
//           <ul className="space-y-3">
//             {myRequests.map((req) => (
//               <li
//                 key={req.id}
//                 className="p-3 border rounded-md bg-white shadow-sm flex justify-between items-center"
//               >
//                 <div>
//                   <p className="font-medium">{req.post.title}</p>
//                   <p className="text-sm text-gray-500">Status: {req.status}</p>
//                   {req.reason && (
//                     <p className="text-xs text-gray-500">
//                       Reason: {req.reason}
//                     </p>
//                   )}
//                 </div>

//                 <span
//                   className={`font-medium ${
//                     req.status === "APPROVED"
//                       ? "text-green-600"
//                       : req.status === "REJECTED"
//                       ? "text-red-600"
//                       : "text-yellow-700"
//                   }`}
//                 >
//                   {req.status === "APPROVED"
//                     ? "✔ Edit allowed"
//                     : req.status === "REJECTED"
//                     ? "✖ Rejected"
//                     : "⏳ Pending"}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// }

import { useEffect, useState, useMemo, useRef } from "react";
import {
  useGetMyPostsQuery,
  useUpdateRejectedPostMutation,
  useCreateUpdateRequestMutation,
  useGetMyUpdateRequestsQuery,
  useUploadPostImageMutation, // 👈 make sure this exists in postApi
} from "@/features/posts/postApi";
import { useGetCategoriesQuery } from "@/features/categories/categoryApi";
import { toast } from "sonner";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { getSocket } from "@/lib/socket";

export default function MyPosts() {
  // fetch user's posts
  const {
    data: postsData,
    isLoading,
    isError,
    refetch: refetchMyPosts,
  } = useGetMyPostsQuery();

  // categories (approved)
  const { data: catData } = useGetCategoriesQuery("APPROVED");
  const approvedCategories = catData?.categories || [];

  // fetch user's update requests
  const { data: myReqs } = useGetMyUpdateRequestsQuery();

  const [createUpdateRequest] = useCreateUpdateRequestMutation();
  const [updatePost] = useUpdateRejectedPostMutation();
  const [uploadPostImage] = useUploadPostImageMutation(); // 👈 for image upload

  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);

  // track images used while editing (for future use)
  const [contentImages, setContentImages] = useState([]);

  // Quill ref for editing editor
  const quillRef = useRef(null);

  // convenience arrays
  const posts = postsData?.posts || [];
  const myRequests = myReqs?.requests || [];

  // map of postId => boolean (pending request exists)
  const pendingByPost = useMemo(() => {
    const map = new Map();
    myRequests.forEach((r) => {
      if (r.status === "PENDING") map.set(r.postId, true);
    });
    return map;
  }, [myRequests]);

  // --- Quill image handler (same idea as CreatePost) ---
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large (max 5MB)");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      try {
        toast.loading("Uploading image...", { id: "edit-upload-image" });
        const res = await uploadPostImage(formData).unwrap();
        toast.success("Image uploaded", { id: "edit-upload-image" });

        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range ? range.index : 0, "image", res.url);
        }

        setContentImages((prev) => [
          ...prev,
          { url: res.url, publicId: res.publicId },
        ]);
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.error(
          err?.data?.message || "Failed to upload image. Please try again."
        );
      }
    };
  };

  // Quill toolbar config for EDITOR (same style as create)
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: handleImageUpload,
        },
      },
    }),
    [] // handler is stable
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "align",
    "blockquote",
    "code-block",
    "list",
    "indent",
    "link",
    "image",
    "video",
  ];

  // Start editing a post
  const startEdit = (post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title || "");
    setEditContent(post.content || "");
    setEditTags(
      (Array.isArray(post.tags) ? post.tags.join(",") : post.tags) || ""
    );

    if (post.category && post.category.id) {
      setEditCategoryId(String(post.category.id));
      setIsCreatingNewCategory(false);
      setNewCategoryName("");
    } else {
      setEditCategoryId("");
      setIsCreatingNewCategory(false);
      setNewCategoryName("");
    }

    // reset images tracked for this editing session
    setContentImages([]);
  };

  // Update post (after rejection or canEdit)
  const handleUpdate = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const payload = {
      title: editTitle,
      content: editContent,
      tags: editTags,
      // If you later want backend image syncing on edit:
      // contentImages,
    };

    if (isCreatingNewCategory && newCategoryName.trim()) {
      payload.newCategoryName = newCategoryName.trim();
    } else if (!isCreatingNewCategory && editCategoryId) {
      payload.categoryId = Number(editCategoryId);
    } else {
      payload.categoryId = null;
    }

    try {
      await updatePost({ id: editingPostId, data: payload }).unwrap();
      toast.success("Post updated and sent for review!");
      setEditingPostId(null);
      setEditTitle("");
      setEditContent("");
      setEditTags("");
      setEditCategoryId("");
      setNewCategoryName("");
      setIsCreatingNewCategory(false);
      setContentImages([]);
      refetchMyPosts();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err?.data?.message || "Failed to update post");
    }
  };

  // Request edit access for a published post
  const handleRequestEdit = async (postId) => {
    try {
      if (pendingByPost.get(postId)) {
        toast("A pending request already exists for this post.");
        return;
      }
      await createUpdateRequest({
        postId,
        reason: "I want to improve my article",
      }).unwrap();
      toast.success("Edit request sent to admin!");
    } catch (err) {
      console.error("create request error:", err);
      toast.error(err?.data?.message || "Failed to create request");
    }
  };

  // socket notifications
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (payload) => {
      const action = payload?.action;
      if (!action) return;
      if (["APPROVED", "REJECTED", "PUBLISHED", "DELETED"].includes(action)) {
        refetchMyPosts();
        let message = `${payload.title || "Your post"}: ${action}`;
        if (payload.reason) message += ` — ${payload.reason}`;
        toast.success(message);
      }
    };

    socket.on("post:notification", handler);

    return () => {
      socket.off("post:notification", handler);
    };
  }, [refetchMyPosts]);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError)
    return <p className="text-center text-red-600">Failed to load posts.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">My Posts</h2>

        {posts.length === 0 ? (
          <p className="text-gray-600">No posts yet.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li
                key={post.id}
                className="p-4 border rounded-md bg-gray-50 shadow-sm"
              >
                {editingPostId === post.id ? (
                  // --- Editing block ---
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Post title"
                      className="w-full border px-2 py-1 rounded-md"
                    />

                    {/* Category selector (same as before) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={isCreatingNewCategory ? "new" : editCategoryId}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "new") {
                            setIsCreatingNewCategory(true);
                            setEditCategoryId("");
                          } else {
                            setIsCreatingNewCategory(false);
                            setNewCategoryName("");
                            setEditCategoryId(val);
                          }
                        }}
                        className="w-full border px-2 py-1 rounded-md"
                      >
                        <option value="">-- Select category --</option>
                        {approvedCategories.map((c) => (
                          <option key={c.id} value={String(c.id)}>
                            {c.name}
                          </option>
                        ))}
                        <option value="new">+ Create new category</option>
                      </select>

                      {isCreatingNewCategory && (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="New category name"
                            className="w-full border px-2 py-1 rounded-md"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            New category will be created as PENDING (requires
                            admin approval)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 🔥 Full Quill editor with image upload */}
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={editContent}
                      onChange={setEditContent}
                      modules={modules}
                      formats={formats}
                      placeholder="Edit your post content..."
                      className="max-h-[300px] overflow-y-auto rounded-lg border border-gray-200 focus-within:border-gray-400 transition-all text-gray-800 font-[Inter]"
                    />

                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="tags (comma separated)"
                      className="w-full border px-2 py-1 rounded-md"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdate}
                        className="bg-indigo-600 text-white px-4 py-1 rounded-md hover:bg-indigo-700"
                      >
                        Update Post
                      </button>
                      <button
                        onClick={() => setEditingPostId(null)}
                        className="text-gray-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // --- Normal post view ---
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Status: {post.status}
                    </p>

                    {post.status === "REJECTED" && (
                      <>
                        <p className="text-red-600 text-sm mt-1">
                          Rejection Reason:{" "}
                          {post.rejectReason || "No reason provided"}
                        </p>
                        <button
                          onClick={() => startEdit(post)}
                          className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                        >
                          Edit Post
                        </button>
                      </>
                    )}

                    {post.canEdit && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600">
                          Edit access granted
                        </p>
                        <button
                          onClick={() => startEdit(post)}
                          className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                        >
                          Edit Post
                        </button>
                      </div>
                    )}

                    {post.status === "PUBLISHED" &&
                      !post.canEdit &&
                      !pendingByPost.get(post.id) && (
                        <button
                          onClick={() => handleRequestEdit(post.id)}
                          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                        >
                          Request Edit Access
                        </button>
                      )}

                    {post.status === "PUBLISHED" &&
                      !post.canEdit &&
                      pendingByPost.get(post.id) && (
                        <div className="mt-2 text-sm text-yellow-700">
                          Edit request pending
                        </div>
                      )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* --- My Update Requests Section --- */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          My Update Requests
        </h2>

        {!myRequests?.length ? (
          <p className="text-gray-600">No update requests yet.</p>
        ) : (
          <ul className="space-y-3">
            {myRequests.map((req) => (
              <li
                key={req.id}
                className="p-3 border rounded-md bg-white shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{req.post.title}</p>
                  <p className="text-sm text-gray-500">Status: {req.status}</p>
                  {req.reason && (
                    <p className="text-xs text-gray-500">
                      Reason: {req.reason}
                    </p>
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
      </section>
    </div>
  );
}
