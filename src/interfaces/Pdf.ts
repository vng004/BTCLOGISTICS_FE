export interface PdfCustomer {
  customerCode: string;
  fullName: string;
  _id?: string;
}

export interface PdfParcel {
  trackingCode: string;
  weight: string;
}

export interface PdfDataInner {
  customer?: PdfCustomer;
  parcels?: PdfParcel[];
  exportDate?: string;
}

export interface PdfData {
  success: boolean;
  message?: string;
  data?: PdfDataInner;
}
