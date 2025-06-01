import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../Api";
import { TOrderSucces } from "../../interfaces/OrderSucces";
export const orderSuccesApiSlice = createApi({
  reducerPath: "orderSuccesApi",
  baseQuery: baseQuery,
  tagTypes: ["orderSucces"],
  endpoints: (builder) => ({
    addParcelsForOrderSucces: builder.mutation<any, string[]>({
      query: (trackingCodes) => ({
        url: "/order-succes/pdf",
        method: "POST",
        body: { trackingCode: trackingCodes },
      }),
      invalidatesTags: ["orderSucces"],
    }),
   getOrderSucces: builder.query<
  any,
  {
    keyword?: string;
    page?: number;
    per_page?: number;
    exportCode?: string;
    start_date?: string;
    end_date?: string;
    customerCode?: string; // Thêm customerCode
  }
>({
  query: ({
    keyword = "",
    page,
    per_page,
    exportCode,
    start_date,
    end_date,
    customerCode, // Thêm vào query
  }) => ({
    url: `/order-succes`,
    params: {
      keyword,
      page,
      per_page,
      exportCode,
      start_date,
      end_date,
      customerCode, // Truyền customerCode vào params
    },
  }),
  providesTags: ["orderSucces"],
}),
    getOrderSuccesById: builder.query<TOrderSucces, string | undefined>({
      query: (id) => ({
        url: `/order-succes/${id}`,
      }),
      transformResponse: (res: { data: TOrderSucces }) => res.data,
      providesTags: ["orderSucces"],
    }),
    updateOrderSucces: builder.mutation<
      TOrderSucces,
      { id: string; data: Partial<TOrderSucces> }
    >({
      query: ({ id, data }) => ({
        url: `/order-succes/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["orderSucces"],
    }),
    removeOrderSucces: builder.mutation<TOrderSucces, string>({
      query: (id) => ({
        url: `/order-succes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orderSucces"],
    }),
  }),
});
export const {
  useAddParcelsForOrderSuccesMutation,
  useGetOrderSuccesByIdQuery,
  useGetOrderSuccesQuery,
  useUpdateOrderSuccesMutation,
  useRemoveOrderSuccesMutation,
} = orderSuccesApiSlice;
