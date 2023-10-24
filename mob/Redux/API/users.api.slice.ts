import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Utils/Genarals";
import { getItem } from "../../Utils/Genarals";
import RoutePaths from "../../Utils/RoutePaths";

const token = getItem(RoutePaths.token);

export const usersApiSlice = createApi({
  reducerPath: "api/users",
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
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/users/search",
        method: "POST",
        invalidatesTags: ["Users"],
      }),
    }),
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["Users"],
    }),
    getAllUsersInRoom: builder.query({
      query: (roomId) => ({
        url: "/users/search",
        method: "POST",
        body: {
          pageSize: 100,
          pageNum: 1,
          filter: {
            roomIds: { operator: "IN", value: [roomId] },
          },
        },
        invalidatesTags: ["Users"],
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserQuery,
  useGetAllUsersInRoomQuery,
} = usersApiSlice;
