import { Customer } from "./Customer";
interface CustomService {
  name: string;
  value: string;
}

interface Parcel {
  trackingCode: string; // Mã Vận Đơn
  quantity: number; // Số Lượng (luôn là 1)
  weight: string; // Cân Nặng (Kg)
  actualCubicMeter: string; // M3 Thực Tính
  actualWeight: string; // Cân Nặng Thực
  length: string; // Chiều Dài
  width: string; // Chiều Rộng
  height: string; // Chiều cao
  packageCode: string
}

export interface TOrderSucces {
  _id: String;
  exportCode: string; // Mã Phiếu Xuất
  customer: Customer; // Thông tin khách hàng
  exportDate: Date; // Ngày xuất kho
  parcels: Parcel[]; // Danh sách các kiện hàng
  totalActualWeight: {
    totalActualWeight1: string; // Tổng Khối (m3)
    totalActualWeight2: string; // Cân Thực Tính (KG)
  };
  transportFeeRate: {
    transportFeeRate1: string; // Đơn Giá Vận Chuyển 1
    transportFeeRate2: string; // Đơn Giá Vận Chuyển 2
  };
  transportFeeNote: string; // Phụ thu đóng gỗ bảo hiểm
  shipFeeNote: string; // Phí Ship
  totalAmount: string; // Số Tiền Cần Thanh Toán
  customServices: CustomService[];
  importEntrustmentFee: string; // Phí ủy thác nhập khẩu
  parcelInformation: string;
}
