import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getItem, BASE_URL } from "../../Utils/Genarals";
import RoutePaths from "../../Utils/RoutePaths";

const token = getItem(RoutePaths.token);

export const supplierApiSlice = createApi({
  reducerPath: "api/suppliers",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["suppliers"],

  endpoints: (builder) => ({
    getAllsuppliers: builder.query({
      query: () => "/suppliers/search",
      providesTags: ["suppliers"],
    }),

    getsupplier: builder.query({
      query: (id: string) => `/suppliers/${id}`,
      providesTags: ["suppliers"],
    }),

    createsupplier: builder.mutation({
      query: ({ formData }) => ({
        url: "/suppliers",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["suppliers"],
    }),

    updatesupplier: builder.mutation({
      query: ({ supplierId, formData }) => ({
        url: `/suppliers/${supplierId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["suppliers"],
    }),

    deletesupplier: builder.mutation({
      query: (id: String) => ({
        url: `/suppliers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["suppliers"],
    }),
      
  }),
});

export const {
  useGetAllsuppliersQuery,
  useGetsupplierQuery,
  useUpdatesupplierMutation,
  useCreatesupplierMutation,
  useDeletesupplierMutation,
} = supplierApiSlice;
