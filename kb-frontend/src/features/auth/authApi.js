import { API } from "@/api/BaseApi";
import { logouts, setCredentials } from "./authSlice";

export const authApi = API.injectEndpoints({
  endpoints: (builder) => ({
    // AUTH
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // server should return basic user info in response
          if (data?.user) dispatch(setCredentials(data));
        } catch (err) {
          // ignore
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logouts());
        }
      },
    }),
    verifyEmail: builder.query({
      query: ({ token, id }) => `/auth/verify-email?token=${token}&id=${id}`,
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, id, password, confirmPassword }) => ({
        url: `/auth/reset-password?token=${token}&id=${id}`,
        method: "POST",
        body: { password, confirmPassword },
      }),
    }),
    refresh: builder.query({
      query: () => ({
        url: "auth/refresh",
        credentials: "include",
      }),
    }),
    // POSTS
    getPublishedPosts: builder.query({
      query: () => "/posts",
      providesTags: (result = []) => [
        "Posts",
        ...result.map((r) => ({ type: "Posts", id: r.id })),
      ],
    }),

    // Create post (multipart/form-data, includes image file as `image`)
    createPost: builder.mutation({
      query: (formData) => ({
        url: "/posts",
        method: "POST",
        // fetchBaseQuery will send formData as-is and browser will set headers
        body: formData,
      }),
      invalidatesTags: [{ type: "Posts" }],
    }),

    // Admin endpoints
    listReviewPosts: builder.query({
      query: () => "/posts/admin/review",
      providesTags: (result = []) => [
        "Posts",
        ...result.map((r) => ({ type: "Posts", id: r.id })),
      ],
    }),
    publishPost: builder.mutation({
      query: (id) => ({
        url: `/posts/admin/${id}/publish`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Posts" }],
    }),
    rejectPost: builder.mutation({
      query: (idAndBody) => ({
        url: `/posts/admin/${idAndBody.id}/reject`,
        method: "PATCH",
        body: { reason: idAndBody.reason },
      }),
      invalidatesTags: [{ type: "Posts" }],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetPublishedPostsQuery,
  useCreatePostMutation,
  useListReviewPostsQuery,
  usePublishPostMutation,
  useRejectPostMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailQuery,
  useRefreshQuery,
} = authApi;
