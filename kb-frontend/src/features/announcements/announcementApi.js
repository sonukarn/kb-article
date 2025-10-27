import { API } from "@/api/BaseApi";

// src/features/announcements/announcementApi.js

export const announcementApi = API.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      // add optional params argument
      query: (params) => {
        const queryString = params?.all ? "?all=true" : "";
        return `/announcements${queryString}`;
      },
      providesTags: ["Announcement"],
    }),
    createAnnouncement: builder.mutation({
      query: (payload) => ({
        url: "/announcements",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Announcement"],
    }),
    updateAnnouncement: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/announcements/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Announcement"],
    }),
    deleteAnnouncement: builder.mutation({
      query: (id) => ({ url: `/announcements/${id}`, method: "DELETE" }),
      invalidatesTags: ["Announcement"],
    }),
    dismissAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/announcements/${id}/dismiss`,
        method: "POST",
      }),
      invalidatesTags: ["Announcement"],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useDismissAnnouncementMutation,
} = announcementApi;
