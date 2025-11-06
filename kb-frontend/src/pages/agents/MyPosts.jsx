import { useEffect, useState, useMemo } from "react";
import {
  useGetMyPostsQuery,
  useUpdateRejectedPostMutation,
  useCreateUpdateRequestMutation,
  useGetMyUpdateRequestsQuery,
} from "@/features/posts/postApi";
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

  // fetch user's update requests
  const { data: myReqs } = useGetMyUpdateRequestsQuery();

  const [createUpdateRequest] = useCreateUpdateRequestMutation();
  const [updatePost] = useUpdateRejectedPostMutation();

  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editCategory, setEditCategory] = useState("");

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

  // Start editing a post (either from REJECTED or when canEdit true)
  const startEdit = (post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title || "");
    setEditContent(post.content || "");
    setEditTags(post.tags || "");
    setEditCategory(post.category || "");
    // optionally scroll to top of editor etc.
  };

  // Update post (used when editing after rejection OR after admin set canEdit true)
  const handleUpdate = async () => {
    if (!editTitle || !editContent) {
      toast.error("Title and content are required");
      return;
    }
    try {
      await updatePost({
        id: editingPostId,
        data: {
          title: editTitle,
          content: editContent,
          tags: editTags,
          category: editCategory,
        },
      }).unwrap();
      toast.success("Post updated and sent for review!");
      setEditingPostId(null);
      // refresh the posts & requests
      refetchMyPosts();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update post");
    }
  };

  // Request edit access for a published post
  const handleRequestEdit = async (postId) => {
    try {
      // prevent duplicate immediate sends
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

  // Listen to socket events to update UI in real-time
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (payload) => {
      // payload shape used across your code: { userId, postId, action, reason, ... }
      // Only act if it's related to current user (notifications targeted by server)
      console.log("Profile socket payload:", payload);

      // For update-request actions you emit admin:update-request -> admin panel
      // For per-user notifications you already send 'post:notification' with userId
      // We'll refresh posts on relevant actions and show friendly toast
      const action = payload?.action;
      const postId = payload?.postId;
      if (!action) return;

      if (["APPROVED", "REJECTED", "PUBLISHED", "DELETED"].includes(action)) {
        // refetch posts so canEdit/status/rejectReason reflect immediately
        refetchMyPosts();
        // show toast message
        let message = `${payload.title || "Your post"}: ${action}`;
        if (payload.reason) message += ` — ${payload.reason}`;
        toast.success(message);
      }

      // Also if admin specifically approves update request, the server may send action "APPROVED"
      // and include updateRequestId; we already handle it above
    };

    socket.on("post:notification", handler);

    return () => {
      socket.off("post:notification", handler);
      // do not disconnect global socket here
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
                    <ReactQuill
                      value={editContent}
                      onChange={setEditContent}
                      placeholder="Edit your post content..."
                    />
                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="tags (comma separated)"
                      className="w-full border px-2 py-1 rounded-md"
                    />
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      placeholder="category"
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

                    {/* REJECTED flow: show rejection reason + Edit button */}
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

                    {/* APPROVED (admin allowed editing) or canEdit === true -> show Edit button */}
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

                    {/* If published and no pending request and no canEdit, allow requesting edit access */}
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

                    {/* If published but request pending */}
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

                {req.status === "APPROVED" && (
                  <span className="text-green-600 font-medium">
                    ✔ Edit allowed
                  </span>
                )}
                {req.status === "REJECTED" && (
                  <span className="text-red-600 font-medium">✖ Rejected</span>
                )}
                {req.status === "PENDING" && (
                  <span className="text-yellow-700 font-medium">
                    ⏳ Pending
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
