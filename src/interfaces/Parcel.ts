import { Customer } from "./Customer";

export interface StatusHistory {
  status: 0 | 1 | 2 | 3;
  timestamp: string;
}

export interface Parcel {
  _id: string;
  trackingCode: string;
  shipmentStatus: number;
  createdAt?: string;
  updatedAt?: string;
  weight: string;
  customer: Customer;
  statusHistory: StatusHistory[];
  inspection?: boolean;
  description?:string
  packageCode: string
}

export interface GetParcelParams {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  perPage: number;
  shipmentStatus?: number;
  customerCode?: string;
}
