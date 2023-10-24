import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getItem, BASE_URL } from "../../Utils/Genarals";
import RoutePaths from "../../Utils/RoutePaths";


const token = getItem(RoutePaths.token);

export const companieApiSlice = createApi({
  reducerPath: "api/companies",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["companies"],

  endpoints: (builder) => ({
    getAllcompanies: builder.query({
      query: () => "/companies/search",
      providesTags: ["companies"],
    }),

    getcompanie: builder.query({
      query: (id: string) => `/companies/${id}`,
      providesTags: ["companies"],
    }),

    createcompanie: builder.mutation({
      query: ({ formData }) => ({
        url: "/companies",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["companies"],
    }),

    updatecompanie: builder.mutation({
      query: ({ companieId, formData }) => ({
        url: `/companies/${companieId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["companies"],
    }),

    deletecompanie: builder.mutation({
      query: (id: String) => ({
        url: `/companies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["companies"],
    }),
      
  }),
});

export const {
  useGetAllcompaniesQuery,
  useGetcompanieQuery,
  useUpdatecompanieMutation,
  useCreatecompanieMutation,
  useDeletecompanieMutation,
} = companieApiSlice;
