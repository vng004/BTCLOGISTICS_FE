import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../Api";
import { Customer } from "../../interfaces/Customer";

export const customerApiSlice = createApi({
  reducerPath: "customerApi",
  baseQuery: baseQuery,
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    getCustomer: builder.query<
      any,
      { page?: number; per_page?: number; keyword?: string }
    >({
      query: ({ page, per_page, keyword }) => ({
        url: `/customer`,
        params: {
          keyword,
          page,
          per_page,
        },
      }),
      providesTags: ["Customer"],
    }),
    getCustomerById: builder.query<Customer, string | undefined>({
      query: (id) => `/customer/${id}`,
      transformResponse: (res: { data: Customer }) => res.data,
      providesTags: ["Customer"],
    }),
    addCustomer: builder.mutation<Customer, Customer>({
      query: (body) => ({
        url: "/customer",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation<Customer, { id: string; data: Customer }>({
      query: ({ id, data }) => ({
        url: `/customer/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Customer"],
    }),
    removeCustomer: builder.mutation<Customer, string>({
      query: (id) => ({
        url: `/customer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
    checkCustomerCode: builder.query({
      query: (body) => ({
        url: "/customer/check",
        method: "POST",
        body,
      }),
      transformResponse: (res: { data: Customer }) => res.data,
    }),
  }),
});

export const {
  useGetCustomerQuery,
  useGetCustomerByIdQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useRemoveCustomerMutation,
  useCheckCustomerCodeQuery,
} = customerApiSlice;
