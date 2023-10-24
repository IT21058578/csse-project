import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { getItem, BASE_URL } from '../../Utils/Genarals';
import RoutePaths from '../../Utils/RoutePaths';


const token = getItem(RoutePaths.token);

export const usersApiSlice = createApi({
    
    reducerPath : 'api/users',
    baseQuery : fetchBaseQuery({baseUrl : BASE_URL ,
        prepareHeaders(headers) {
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
          },}),
    tagTypes : ['Users'],

    endpoints : (builder) => ({

        getAllUsers : builder.query(({
            query : () => '/users/search',
            providesTags : ['Users'],
        })),

        getUser : builder.query({
            query : (id) => `/users/${id}`,
            providesTags : ['Users']
        }),

        deleteUser: builder.mutation({
            query : (id : String) => ({
                url : `/users/${id}`,
                method : 'DELETE',
            }),
            invalidatesTags : ['Users']
        }),

        assignToSite: builder.mutation({
            query: ({ userId, siteId }) => ({
              url: `/users/${userId}/assign`,
              method: 'PUT',
              params: { 'site-id': siteId },
            }),
            invalidatesTags : ['Users']
        }),

        unassignFromSite: builder.mutation({
            query: ({ userId, siteId }) => ({
              url: `/users/${userId}/unassign`,
              method: 'PUT',
              params: { 'site-id': siteId },
            }),
            invalidatesTags : ['Users']
        }),

    })
})


export const {
    useGetAllUsersQuery,
    useGetUserQuery,
    useDeleteUserMutation,
    useAssignToSiteMutation,
    useUnassignFromSiteMutation
 } = usersApiSlice;
