import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getItem, BASE_URL } from "../../Utils/Genarals";
import RoutePaths from "../../Utils/RoutePaths";

const token = getItem(RoutePaths.token);

export const deliverieApiSlice = createApi({
  reducerPath: "api/deliveries",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["deliveries"],

  endpoints: (builder) => ({
    getAlldeliveries: builder.query({
      query: () => "/deliveries/search",
      providesTags: ["deliveries"],
    }),

    getdeliverie: builder.query({
      query: (id: string) => `/deliveries/${id}`,
      providesTags: ["deliveries"],
    }),

    createdeliverie: builder.mutation({
      query: ({ formData }) => ({
        url: "/deliveries",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["deliveries"],
    }),

      
  }),
});

export const {
  useGetAlldeliveriesQuery,
  useGetdeliverieQuery,
  useCreatedeliverieMutation,
} = deliverieApiSlice;
