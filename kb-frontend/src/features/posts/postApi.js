import { API } from "@/api/BaseApi";

export const postApi = API.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create post
    createPost: builder.mutation({
      query: (data) => {
        return {
          url: "/posts",
          method: "POST",
          body: data,
          credentials: "include", // since using cookies
        };
      },
    }),

    getPublishedPosts: builder.query({
      query: ({ category, search } = {}) => {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (search) params.append("search", search);
        return `/posts${params.toString() ? `?${params.toString()}` : ""}`;
      },
      providesTags: ["Posts"],
    }),
    getAdminPostById: builder.query({
      query: (id) => ({
        url: `/posts/admin/${id}/view`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Posts"],
    }),
    getMyPosts: builder.query({
      query: () => ({
        url: "/posts/my-posts",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Posts"],
    }),
    getPostById: builder.query({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),
    // ✅ Admin: list review posts
    listReviewPosts: builder.query({
      query: () => ({
        url: "/posts/admin/review",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Posts"],
    }),

    // ✅ Admin: publish post
    publishPost: builder.mutation({
      query: (id) => ({
        url: `/posts/admin/${id}/publish`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["Posts"],
    }),

    // ✅ Admin: reject post
    rejectPost: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/posts/admin/${id}/reject`,
        method: "PATCH",
        body: { reason },
        credentials: "include",
      }),
      invalidatesTags: ["Posts"],
    }),
    // ✅ User: Update rejected post
    updateRejectedPost: builder.mutation({
      query: ({ id, data }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Posts"],
    }),
    // ✅ Admin: delete post
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/admin/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Posts"],
    }),
    generateContent: builder.mutation({
      query: (prompt) => ({
        url: "/posts/generate",
        method: "POST",
        body: { prompt },
      }),
    }),
    createUpdateRequest: builder.mutation({
      query: (data) => ({
        url: "/posts/update-requests",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Posts", "UpdateRequests"],
    }),
    getMyUpdateRequests: builder.query({
      query: () => ({
        url: "/posts/update-requests/mine",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["UpdateRequests"],
    }),
    listUpdateRequestsAdmin: builder.query({
      query: () => ({
        url: "/posts/admin/update-requests",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["UpdateRequests"],
    }),
    actionUpdateRequest: builder.mutation({
      query: ({ id, action, adminNote }) => ({
        url: `/posts/admin/update-requests/${id}`,
        method: "PATCH",
        body: { action, adminNote },
        credentials: "include",
      }),
      invalidatesTags: ["UpdateRequests", "Posts"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetMyPostsQuery,
  useGetAdminPostByIdQuery,
  useGetPublishedPostsQuery,
  useLazyGetPublishedPostsQuery,
  useListReviewPostsQuery,
  usePublishPostMutation,
  useRejectPostMutation,
  useDeletePostMutation,
  useGetPostByIdQuery,
  useGenerateContentMutation,
  useUpdateRejectedPostMutation,
  useCreateUpdateRequestMutation,
  useGetMyUpdateRequestsQuery,
  useListUpdateRequestsAdminQuery,
  useActionUpdateRequestMutation,
} = postApi;
