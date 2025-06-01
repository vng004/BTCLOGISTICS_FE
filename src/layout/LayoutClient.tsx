import { Tooltip } from "antd";
import { motion } from "framer-motion";
import { ArrowBigUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "../components/client/Header/Header";
import { email, fb, phone, qrWc, wechat, zl } from "../constants/client";
import { smoothScrollToTop } from "../constants/util";
import Modal from "antd/es/modal/Modal";
import Footer from "../components/client/Footer/Footer";
const LayoutClient = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalWC, setIsModalWC] = useState(false);

  useEffect(() => {
    const toogleVisible = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toogleVisible);
    return () => window.removeEventListener("scroll", toogleVisible);
  }, []);

  const handleModaleWC = () => {
    setIsModalWC(true);
  };
  const handleCancelModaleWC = () => {
    setIsModalWC(false);
  };
  return (
    <div>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow ">
          <Outlet />
        </main>

        <Footer />
        <div className="fixed bottom-0 md:bottom-100 lg:bottom-30 bg-white rounded-lg border border-orange-500 md:right-6 flex w-full md:w-auto justify-center gap-x-5 md:justify-between py-1 md:py-0 md:gap-y-1 md:flex-col items-center z-100">
          <Tooltip title="Gọi ngay" placement="right">
            <Link to="tel:0889296929">
              <img
                src={phone}
                alt="phone"
                className="w-15 h-15  transition-transform transform hover:scale-110"
              />
            </Link>
          </Tooltip>

          <Tooltip title="Chat Zalo" placement="right">
            <Link to="https://zalo.me/0889296929">
              <img
                src={zl}
                alt="zalo"
                className="w-15 h-15  transition-transform transform hover:scale-110"
              />
            </Link>
          </Tooltip>
          <Tooltip title="Email" placement="right">
            <a href="mailto:Adlogistics.btc@gmail.com">
              <img
                src={email}
                alt="email"
                className="w-[46px] h-[46px] rounded-md transition-transform transform hover:scale-110"
              />
            </a>
          </Tooltip>
          <Tooltip title="Facebook" placement="right">
            <Link to="https://www.facebook.com/o.dhmhn">
              <img
                src={fb}
                alt="facebook"
                className="w-15 h-15  transition-transform transform hover:scale-110"
              />
            </Link>
          </Tooltip>

          <Tooltip title="Wechat" placement="right">
            <button className="" onClick={handleModaleWC}>
              <img
                src={wechat}
                alt="WeChat"
                className="w-[45px] h-[45px] transition-transform transform hover:scale-110 rounded-md md:mb-2 md:mt-1"
              />
            </button>
          </Tooltip>
        </div>
        {isVisible && (
          <motion.button
            onClick={smoothScrollToTop}
            initial={{ opacity: 0, y: 100 }} // Bắt đầu ở dưới
            animate={{ opacity: 1, y: 0 }} // Xuất hiện tại vị trí 0
            whileHover={{ scale: 1.1 }} // xác định trạng thái khi hover vào nút.
            whileTap={{ scale: 0.9 }} // Hiệu ứng sau khi click
            className="right-4 md:right-[32px] bottom-26 md:bottom-7 fixed bg-[#F84563] text-white  w-11  h-11 flex items-center justify-center rounded-lg"
          >
            <ArrowBigUp />
          </motion.button>
        )}
        {isModalWC && (
          <Modal
            open={isModalWC}
            footer={null}
            width={400}
            onCancel={handleCancelModaleWC}
            className="text-[#F84563] text-center"
          >
            <b className="text-[18px]">Vui lòng quét mã để thêm bạn bè</b>
            <img src={qrWc} className="mb-10" />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default LayoutClient;
