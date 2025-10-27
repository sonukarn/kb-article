import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { logouts, setCredentials } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_API,
  // import.meta.env.VITE_API_URL,
  credentials: "include", // always send cookies
  prepareHeaders: (headers) => {
    // No manual Authorization header — cookies will handle it
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Try refresh
    const refreshResult = await baseQuery(
      { url: "auth/refresh", method: "GET" },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      api.dispatch(
        setCredentials({
          success: true,
          user: api.getState().auth.user,
        })
      );
      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logouts());
    }
  }

  return result;
};

export const API = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Category",
    "Notification",
    "NotificationItem",
    "NotificationCount",
    "Posts",
  ],
  endpoints: (builder) => ({}),
});
