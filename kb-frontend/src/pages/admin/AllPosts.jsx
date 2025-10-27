import React from "react";
import {
  useGetPublishedPostsQuery,
  useListReviewPostsQuery,
} from "@/features/posts/postApi";

export default function AllPosts() {
  const { data: published = [] } = useGetPublishedPostsQuery();
  const { data: review = [] } = useListReviewPostsQuery();

  const all = [...(published || []), ...(review || [])];

  // Helper to truncate content
  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Posts</h1>

      {all.length === 0 && <p className="text-gray-500">No posts.</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {all.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded shadow flex flex-col h-full overflow-hidden"
          >
            {/* Post Image */}
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-40 object-cover"
              />
            )}

            <div className="p-4 flex flex-col flex-1">
              {/* Title */}
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                {post.title}
              </h3>

              {/* Status */}
              <div className="text-xs text-gray-500 mb-2 capitalize">
                {post.status}
              </div>

              {/* Truncated Content */}
              <div
                className="prose max-w-full mb-2 text-sm overflow-hidden line-clamp-5"
                dangerouslySetInnerHTML={{
                  __html: truncateText(post.content, 250),
                }}
              />

              {/* Button */}
              <div className="mt-auto flex gap-2">
                <button className="px-3 py-1 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
