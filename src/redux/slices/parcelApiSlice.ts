import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../Api";
import { GetParcelParams, Parcel } from "../../interfaces/Parcel";

export const parcelApiSlice = createApi({
  reducerPath: "parcelApi",
  baseQuery: baseQuery,
  tagTypes: ["Parcel"],
  endpoints: (builder) => ({
    getParcels: builder.query<any, GetParcelParams>({
      query: ({
        keyword = "",
        startDate,
        endDate,
        perPage,
        page,
        shipmentStatus,
        customerCode
      }) => ({
        url: "/parcel",
        params: {
          keyword,
          startDate,
          endDate,
          page,
          per_page: perPage,
          shipmentStatus,
          customerCode
        },
      }),
      providesTags: ["Parcel"],
    }),
    getParcelById: builder.query<Parcel, string | undefined>({
      query: (id) => `/parcel/${id}`,
      transformResponse: (res: { data: Parcel }) => res.data,
      providesTags: ["Parcel"],
    }),
    AddParcel: builder.mutation<
      Parcel[],
      FormData | { trackingCode: string; weight: string }
    >({
      query: (formData) => ({
        url: "/parcel/import-add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Parcel"],
    }),
    updateParcel: builder.mutation<
      Parcel,
      {
        id: string;
        trackingCode?: string;
        weight?: string;
        inspection?:boolean
        description?:string
        shipmentStatus?:number
        packageCode?:string
      }
    >({
      query: ({ id, trackingCode, weight,inspection,description,shipmentStatus,packageCode }) => ({
        url: `/parcel/${id}`,
        method: "PATCH",
        body: { trackingCode, weight,inspection,description,shipmentStatus,packageCode },
      }),
      invalidatesTags: ["Parcel"],
    }),
    updateParcelStatus: builder.mutation<number, FormData>({
      query: (data) => ({
        url: "/parcel/import-update",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Parcel"],
    }),
    inspectionParcelStatus: builder.mutation<number, FormData>({
      query: (data) => ({
        url: "/parcel/toggle-inspection",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Parcel"],
    }),
    removeParcel: builder.mutation<Parcel, string>({
      query: (id) => ({
        url: `/parcel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Parcel"],
    }),
    
    assignToParcel: builder.mutation({
      query: ({ trackingCode, customerCode }) => ({
        url: `/parcel/assignToParcel`,
        method: "POST",
        body: { trackingCode, customerCode },
      }),
      invalidatesTags: ["Parcel"],
    }),
  }),
});

export const {
  useGetParcelsQuery,
  useGetParcelByIdQuery,
  useAddParcelMutation,
  useUpdateParcelMutation,
  useUpdateParcelStatusMutation,
  useRemoveParcelMutation,
  useAssignToParcelMutation,
  useInspectionParcelStatusMutation
} = parcelApiSlice;
