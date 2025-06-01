import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../Api";
import { ExchangeRate } from "../../interfaces/ExchangeRate";

export const exchangeRateApiSlice = createApi({
  reducerPath: "rateApi",
  baseQuery: baseQuery,
  tagTypes: ["Rate"],
  endpoints: (builder) => ({
    getExchangeRate: builder.query<ExchangeRate, void>({
      query: () => "/exchange-rate",
      transformResponse: (res: { data: ExchangeRate }) => res.data,
      providesTags: ["Rate"],
    }),

    addExchangeRate: builder.mutation<ExchangeRate, Partial<ExchangeRate>>({
      query: (body) => ({
        url: "/exchange-rate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Rate"],
    }),

    updateExchangeRate: builder.mutation<ExchangeRate, Partial<ExchangeRate>>({
      query: (body) => ({
        url: "/exchange-rate",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Rate"],
    }),
  }),
});

export const {
  useGetExchangeRateQuery,
  useAddExchangeRateMutation,
  useUpdateExchangeRateMutation,
} = exchangeRateApiSlice;
