import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getItem, BASE_URL } from "../../Utils/Genarals";
import RoutePaths from "../../Utils/RoutePaths";




export const itemrequestApiSlice = createApi({
  reducerPath: "api/procurements",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    async prepareHeaders(headers) {
      const token = await getItem(RoutePaths.token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["procurements"],

  endpoints: (builder) => ({
    getAllitemrequests: builder.query({
      query: () => "/procurements/search",
      providesTags: ["procurements"],
    }),

    getitemrequest: builder.query({
      query: (id: string) => "/procurements/${id}",
      providesTags: ["procurements"],
    }),

    createitemrequest: builder.mutation({
      query: (ReqData) => ({
        url: "/procurements",
        method: "POST",
        body: ReqData,
      }),
      invalidatesTags: ["procurements"],
    }),

    updateitemrequest: builder.mutation({
      query: ({ itemrequestId, formData }) => ({
        url: `/procurements/${itemrequestId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["procurements"],
    }),

    deleteitemrequest: builder.mutation({
      query: (id: String) => ({
        url: `/procurements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["procurements"],
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