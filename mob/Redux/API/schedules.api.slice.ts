import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const scheduleApi = createApi ({
    reducerPath: 'api/scheduleApi',
    baseQuery: fetchBaseQuery({baseUrl: ''}),
    tagTypes:['schedules'],
    endpoints: (builder) => ({

        getAllPersonalDaySchedules: builder.query (({
            query: () => '/personalDaySchedules',
            providesTags : ['schedules']
            })),
            
    }),
});

export const {useGetAllPersonalDaySchedulesQuery} = scheduleApi;