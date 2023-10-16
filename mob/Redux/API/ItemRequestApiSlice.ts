import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Utils/Generals";
import { getItem } from "../../Utils/Generals";
import RoutePaths from "../../config";

const token = getItem(RoutePaths.token);

export const itemrequestApiSlice = createApi({
  reducerPath: "api/itemrequests",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["itemrequests"],

  endpoints: (builder) => ({
    getAllitemrequests: builder.query({
      query: () => "/itemrequests/search",
      providesTags: ["itemrequests"],
    }),

    getitemrequest: builder.query({
      query: (id: string) => `/itemrequests/${id}`,
      providesTags: ["itemrequests"],
    }),

    createitemrequest: builder.mutation({
      query: ({ formData }) => ({
        url: "/itemrequests",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["itemrequests"],
    }),

    updateitemrequest: builder.mutation({
      query: ({ itemrequestId, formData }) => ({
        url: `/itemrequests/${itemrequestId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["itemrequests"],
    }),

    deleteitemrequest: builder.mutation({
      query: (id: String) => ({
        url: `/itemrequests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["itemrequests"],
    }),
      
  }),
});

export const {
  useGetAllitemrequestsQuery,
  useGetitemrequestQuery,
  useUpdateitemrequestMutation,
  useCreateitemrequestMutation,
  useDeleteitemrequestMutation,
} = itemrequestApiSlice;
