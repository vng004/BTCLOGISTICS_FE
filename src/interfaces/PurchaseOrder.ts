export interface StatusHistory {
  status: 0 | 1 | 2 | 3 | 4;
  timestamp: string;
}
export interface PurchaseOrder {
  _id: string;
  orderCode: string;
  customerCode: string;
  fullName: string;
  phone: string;
  productName: string;
  productLink: string;
  orderDetails?: string;
  quantity?: number;
  email?: string;
  actualValue: string;
  domesticFee?: string;
  totalAmount: string;
  trackingCode: string;
  description?: string;
  createdAt?: string;
  status: 0 | 1 | 2 | 3 | 4;
  purchaseCode: string;
  statusHistory: StatusHistory[];
}
