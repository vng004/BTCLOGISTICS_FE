import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../Api";
import { PurchaseOrder } from "../../interfaces/PurchaseOrder";

export const purchaseOrderApiSlice = createApi({
  reducerPath: "purchaseOrderApi",
  baseQuery: baseQuery,
  tagTypes: ["PurchaseOrder"],
  endpoints: (builder) => ({
    // Lấy danh sách đơn hàng
    getPurchaseOrders: builder.query<
      any,
      { keyword?: string; page: number; per_page: number; status?: number | undefined }
    >({
      query: ({ keyword = "", page, per_page,status }) => ({
        url: "/purchase-order",
        params: { page, per_page, keyword,status },
      }),
      providesTags: ["PurchaseOrder"],
    }),

    // Lấy chi tiết đơn hàng theo ID
    getPurchaseOrderById: builder.query<PurchaseOrder, string>({
      query: (id) => `/purchase-order/${id}`,
      providesTags: ["PurchaseOrder"],
      transformResponse: (res: { data: PurchaseOrder }) => res.data,
    }),

    getPurchaseOrderByOrderCode: builder.mutation<PurchaseOrder, { orderCode: string }>({
      query: (body) => ({
        url: '/purchase-order/code',
        method: 'POST',
        body,
      }),
      transformResponse: (res: { data: PurchaseOrder }) => res.data,

      invalidatesTags: ["PurchaseOrder"],
    }),

    // Thêm đơn hàng mới
    addPurchaseOrder: builder.mutation<PurchaseOrder, Partial<PurchaseOrder>>({
      query: (body) => ({
        url: "/purchase-order/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PurchaseOrder"],
    }),

    // Cập nhật đơn hàng
    updatePurchaseOrder: builder.mutation<
      PurchaseOrder,
      { id: string; data: Partial<PurchaseOrder> }
    >({
      query: ({ id, data }) => ({
        url: `/purchase-order/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PurchaseOrder"],
    }),

    // Xóa đơn hàng
    removePurchaseOrder: builder.mutation<PurchaseOrder, string>({
      query: (id) => ({
        url: `/purchase-order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PurchaseOrder"],
    }),
  }),
});

export const {
  useGetPurchaseOrdersQuery,
  useGetPurchaseOrderByIdQuery,
  useAddPurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
  useRemovePurchaseOrderMutation,
  useGetPurchaseOrderByOrderCodeMutation
} = purchaseOrderApiSlice;
