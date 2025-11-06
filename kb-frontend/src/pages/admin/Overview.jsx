// src/pages/admin/Overview.jsx
import React from "react";
import {
  useListReviewPostsQuery,
  useGetPublishedPostsQuery,
} from "@/features/posts/postApi";

export default function Overview() {
  const { data: reviewPosts } = useListReviewPostsQuery();
  const { data: publishedPosts } = useGetPublishedPostsQuery();

  const pending = reviewPosts?.length ?? 0;
  const published = publishedPosts?.length ?? 0;
  const total = pending + published;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Pending review</p>
          <p className="text-2xl font-semibold">{pending}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-2xl font-semibold">{published}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Total posts</p>
          <p className="text-2xl font-semibold">{total}</p>
        </div>
      </div>
    </div>
  );
}
