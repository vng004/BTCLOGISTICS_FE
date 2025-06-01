import { Link } from "react-router-dom";
import {
  logo_home,
  shippingProcess,
  video,
  VNG,
} from "../../../constants/client";

const Footer = () => {
  return (
    <footer className="border-2 md:mt-30 ">
      <div className="pt-10 pb-10">
        <div className="space-y-6 max-w-[768px] md:max-w-[1024px] p-4 md:p-6 lg:p-0 lg:max-w-[1280px] mx-auto text-black">
          <div className="flex flex-wrap justify-between gap-10 ">
            <div className="w-[666px] lg:w-[375px] space-y-1 ">
              <img src={logo_home} alt="logo" className="w-46 pb-4" />
              <div>
                <p>
                  BTC Logistics là công ty logistics hàng đầu trong lĩnh vực vận
                  chuyển hàng hóa (Việt - Trung) (Trung - Việt). Là đơn vị uy
                  tín lâu năm trên thị trường cung cấp dịch vụ đặt hàng order,
                  vận chuyển hàng hóa từ các sàn thương mại điện tử lớn nhất
                  Trung Quốc về Việt Nam.
                </p>
                <div>
                  <span>Hotline liên hệ: </span>
                  <Link
                    to="tel:0889296929"
                    className="hover:text-[#F84563] hover:underline font-semibold"
                  >
                    (+84) 889296929
                  </Link>
                </div>
                <div>
                  <span>Email liên hệ: </span>
                  <a
                    href="mailto:Adlogistics.btc@gmail.com"
                    className="hover:text-[#F84563] hover:underline font-semibold"
                  >
                    Adlogistics.btc@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p>Danh Mục</p>
              <div className="text-gray-500">
                <Link to={"/"}>
                  <p className="pt-3 text-[15px] hover:text-[#F84563]">
                    Trang chủ
                  </p>
                </Link>
                <Link to={"/lien-he-dat-hang"}>
                  <p className="pt-3 text-[15px] hover:text-[#F84563]">
                    Đặt hàng hộ
                  </p>
                </Link>
                <Link to={"/gioi-thieu"}>
                  <p className="pt-3 text-[15px] hover:text-[#F84563]">
                    Giới thiệu
                  </p>
                </Link>
                <Link to={"/nhung-cau-hoi-thuong-gap"}>
                  <p className="pt-3 text-[15px] hover:text-[#F84563]">
                    Câu hỏi thường gặp
                  </p>
                </Link>
              </div>
            </div>
            <div className="space-y-3 text-[15px]">
              <p>Chính Sách</p>
              <div className="text-gray-500">
                <Link to={"/chinh-sach-van-chuyen"}>
                  <p className="pt-3 text-[15px] hover:text-[#F84563]">
                    Chính sách vận chuyển
                  </p>
                </Link>
                <Link to={"/chinh-sach-doi-tra"}>
                  <p className="pt-3 text-[15px] hover:text-[#F84563]">
                    Chính sách đổi trả
                  </p>
                </Link>
                <Link to={"/chinh-sach-mua-hang"}>
                  <p className="pt-3 text-[15px] hover:text-[#F84563]">
                    Chính sách mua hàng
                  </p>
                </Link>
                <Link to={"/chinh-sach-bao-mat"}>
                  <p className="pt-3 text-[15px] hover:text-[#F84563]">
                    Chính sách bảo mật
                  </p>
                </Link>
              </div>
            </div>
            <div className=" lg:w-[32%] space-y-5">
              <p>Quy trình vận chuyển</p>
              <video
                className="rounded-lg shadow-xl border-2 border-orange-500"
                controls
                poster={shippingProcess}
              >
                <source src={video} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 border-2 p-4 mb-17 md:mb-0">
        <p className="text-[15px]"></p>
        <div className="flex items-center gap-1">
          <p className="text-[13px] text-gray-800 ">
            <span className="text-[15px]">BTC Logistics</span> cung cấp bởi{" "}
          </p>
          <img src={VNG} alt="VNG" width={36} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
