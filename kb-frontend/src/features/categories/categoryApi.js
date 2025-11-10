import { API } from "@/api/BaseApi";

export const categoryApi = API.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get categories (optionally by status)
    // getCategories: builder.query({
    //   query: (status = "APPROVED") => `/categories?status=${status}`,
    //   providesTags: ["Categories"],
    // }),
    getCategories: builder.query({
      query: (status = "APPROVED") =>
        status === "ALL"
          ? `/categories` // no filter → backend returns ALL
          : `/categories?status=${status}`,
      providesTags: ["Categories"],
    }),

    // ✅ User: create new (PENDING) category
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
    }),

    // ✅ Admin: approve category
    approveCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}/approve`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
    }),

    // ✅ Admin: reject category
    rejectCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}/reject`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
    }),

    // ✅ Admin: delete category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useApproveCategoryMutation,
  useRejectCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
