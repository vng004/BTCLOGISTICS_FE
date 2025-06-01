import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../Api";
import { Auth } from "../../interfaces/Auth";

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<any, { userName: string; password: string }>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    getUsers: builder.query<Auth[], void>({
      query: () => ({
        url: "/auth",
        method: "GET",
      }),
      providesTags: ["Auth"],
      transformResponse: (res: any) => {
        return Array.isArray(res.users) ? res.users : [];
      },
    }),

    getUserById: builder.query<Auth, string>({
      query: (id) => ({
        url: `/auth/${id}`,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    updateUser: builder.mutation<Auth, { id: string; data: Partial<Auth> }>({
      query: ({ id, data }) => ({
        url: `/auth/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    createAdmin: builder.mutation<Auth, { userName: string; password: string }>(
      {
        query: (body) => ({
          url: "/auth/create-admin",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Auth"],
      }
    ),
    deleteUser: builder.mutation<Auth, string>({
      query: (id) => ({
        url: `/auth/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useCreateAdminMutation,
  useDeleteUserMutation,
} = authApiSlice;
