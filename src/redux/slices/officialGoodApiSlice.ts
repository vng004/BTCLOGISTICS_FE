import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../Api";
import { TOfficialGood } from "../../interfaces/OfficialGood";

export const officialGoodApiSlice = createApi({
  reducerPath: "officialGoodApi",
  tagTypes: ["OfficialGood"],
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getOfficialGood: builder.query<
      any,
      {
        keyword?: string;
        page: number;
        per_page: number;
        status?: number | undefined;
      }
    >({
      query: ({ keyword = "", page, per_page, status }) => ({
        url: "/official-good",
        params: { page, per_page, keyword, status },
      }),
      providesTags: ["OfficialGood"],
    }),
    getOfficialGoodById: builder.query<TOfficialGood, string>({
      query: (id) => `/official-good/${id}`,
      transformResponse: (res: { data: TOfficialGood }) => res.data,
      providesTags: ["OfficialGood"],
    }),

    addOfficialGood: builder.mutation<TOfficialGood, Partial<TOfficialGood>>({
      query: (body) => ({
        url: "/official-good/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["OfficialGood"],
    }),

    // Cập nhật đơn hàng
    updateOfficialGood: builder.mutation<
      TOfficialGood,
      { id: string; data: Partial<TOfficialGood> }
    >({
      query: ({ id, data }) => ({
        url: `/official-good/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["OfficialGood"],
    }),

    // Xóa đơn hàng
    removeOfficialGood: builder.mutation<TOfficialGood, string>({
      query: (id) => ({
        url: `/official-good/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OfficialGood"],
    }),
  }),
});

export const {
  useGetOfficialGoodQuery,
  useAddOfficialGoodMutation,
  useGetOfficialGoodByIdQuery,
  useRemoveOfficialGoodMutation,
  useUpdateOfficialGoodMutation,
} = officialGoodApiSlice;
