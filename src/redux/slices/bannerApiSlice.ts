import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../Api";
import { Banner } from "../../interfaces/Banner";

export const bannerApiSlice = createApi({
  reducerPath: "bannerApi",
  baseQuery: baseQuery,
  tagTypes: ["Banner"],
  endpoints: (builder) => ({
    getAllBanners: builder.query<Banner[], void>({
      query: () => ({
        url: "/banner",
        method: "GET",
      }),
      providesTags: ["Banner"],
      transformResponse: (res: any) => {
        return Array.isArray(res.data) ? res.data : [];
      },
    }),
    addBanner: builder.mutation<
      any,
      { images: string[]; isActive: boolean }
    >({
      query: (body) => ({
        url: "/banner",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Banner"],
    }),
    updateBanner: builder.mutation<
      any,
      { id: string; data: { images: string[]; isActive: boolean } }
    >({
      query: ({ id, data }) => ({
        url: `/banner/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Banner"],
    }),
    removeBanner: builder.mutation<Banner, string>({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banner"],
    }),
  }),
});

export const {
  useGetAllBannersQuery,
  useAddBannerMutation,
  useUpdateBannerMutation,
  useRemoveBannerMutation,
} = bannerApiSlice;
