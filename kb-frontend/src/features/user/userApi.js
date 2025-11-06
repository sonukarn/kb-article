// src/features/users/userApi.js
import { API } from "@/api/BaseApi";

export const userApi = API.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all users (admin)
    getAllUsers: builder.query({
      query: () => ({
        url: "/users/admin/all",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Users"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/me",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ Delete user (admin)
    adminDeleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/admin/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useAdminDeleteUserMutation,
  useUpdateProfileMutation,
} = userApi;
