// src/admin/AdminDashboard.jsx
import React, { useState } from "react";
import {
  useListReviewPostsQuery,
  usePublishPostMutation,
  useRejectPostMutation,
  useDeletePostMutation,
} from "@/features/posts/postApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const AdminDashboard = () => {
  const { data: posts, isLoading } = useListReviewPostsQuery();
  const [publishPost] = usePublishPostMutation();
  const [rejectPost] = useRejectPostMutation();
  const [deletePost] = useDeletePostMutation();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const handlePublish = async (id) => {
    try {
      await publishPost(id).unwrap();
      alert("Post published successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to publish post");
    }
  };

  const handleReject = (post) => {
    setSelectedPost(post);
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    try {
      await rejectPost({ id: selectedPost.id, reason: rejectReason }).unwrap();
      alert("Post rejected");
      setRejectDialogOpen(false);
      setRejectReason("");
      setSelectedPost(null);
    } catch (err) {
      console.error(err);
      alert("Failed to reject post");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(id).unwrap();
      alert("Post deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  if (isLoading) return <div className="p-6">Loading posts...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {posts?.length === 0 ? (
        <p>No posts pending review.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="font-bold text-lg mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-2">
                {post.content.slice(0, 100)}...
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Author: {post.author.firstName} {post.author.lastName}
              </p>
              {post.tags && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags.split(",").map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}

              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handlePublish(post.id)}
                >
                  Publish
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(post)}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reject Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>Provide a reason for rejecting this post:</p>
            <Input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Reject Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
