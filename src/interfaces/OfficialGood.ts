export interface TOfficialGood {
  _id: string;
  productName: string;
  productImage?: string[];
  hsCode?: string;

  productSpecs: {
    material?: string;
    dimensions?: string;
    technicalSpecs?: string;
  };

  packagingDetails: {
    packageCount: number;
    itemsPerPackage: number;
    packageDimensions?: string;
    packageWeight: number;
  };

  fullName: string;
  phone: string;
  email: string;

  importEntrustmentFee: number;
  pickupFee?: number;
  reinforcementFee: number;
  internationalShippingFee: number;
  vatTax: number;
  importTax: number;
  specialConsumptionTax?: number;
  environmentalTax?: number;
  customsAndOtherFees: {
    customsFee: number;
    inspectionFee: number;
  };
  storageAndHandlingFee: number;
  domesticShippingFee: number;
  status: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  createdAt?: string;
  updatedAt?: string;
  statusHistory: StatusHistory[];
  inspection?: boolean;
}
export interface StatusHistory {
  status: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  timestamp: string;
}
