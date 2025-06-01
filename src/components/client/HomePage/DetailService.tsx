import { easeInOut, motion, useInView } from "framer-motion";
import {
  BaggageClaim,
  HeartHandshake,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import { useRef, useState } from "react";
import { AboutUs } from "../../../constants/client";

const DetailService = () => {
  const [hoverStates, setHoverStates] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleMouseEnter = (index: any) => {
    const newHoverStates = [...hoverStates];
    newHoverStates[index] = true;
    setHoverStates(newHoverStates);
  };

  const handleMouseLeave = (index: any) => {
    const newHoverStates = [...hoverStates];
    newHoverStates[index] = false;
    setHoverStates(newHoverStates);
  };

  const sectionRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { amount: 0.1, once: true });


  // Variants cho từng khối dịch vụ
  const serviceItemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: easeInOut },
    },
  };

  return (
    <div
      className="bg-[url('/assets/images/client/Images/sec-bg-02.png')] bg-cover bg-center  min-h-[50vh] "
      ref={sectionRef}
    >
      <div className="max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px] mt-10 md:mt-30 mx-auto flex justify-between flex-col md:flex-row p-4 lg:p-1">
        <div className="">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={isSectionInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: easeInOut }}
            className="flex justify-between items-center mb-[18px]"
          >
            <div className="">
              <p className="text-[#f66962] mb-[18px] text-[20px] font-subtitle">
                Có gì HOT ?
              </p>
              <h1 className="text-[#0b0b0b] text-[36px] font-title">
                Các dịch vụ nổi bật
              </h1>
            </div>
          </motion.div>
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            animate={isSectionInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: easeInOut }}
            className="w-full md:w-[400px] lg:w-[700px] mb-[57px]"
          >
            Với khát vọng mang đến cho khách hàng một hệ thống logistics liền
            mạch và hiệu quả. BTC Logistics là cầu nối uy tín giữa Việt Nam và
            Trung Quốc, mang đến giải pháp đặt hàng và vận chuyển tối ưu từ các
            sàn thương mại điện tử lớn nhất, chúng tôi sẽ hỗ trợ bạn” cùng giá
            trị cốt lõi là sự uy tín. BTC Logistics mang đến cho quý Khách Hàng
            những giải pháp thương mại điện tử đa dạng, linh hoạt và tối ưu
            nhất. Hãy khởi đầu hành trình ngay bây giờ, cùng BTC Logistics khám
            phá trải nghiệm mua sắm quốc tế đỉnh cao. Hãy bắt đầu ngay hôm nay!
          </motion.p>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={isSectionInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: easeInOut }}
            className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-6"
          >
            <motion.div
              variants={serviceItemVariants}
              onMouseEnter={() => handleMouseEnter(0)}
              onMouseLeave={() => handleMouseLeave(0)}
              animate={hoverStates[0] ? "hover" : "rest"}
              className="flex border-[1px] border-[#e9ecef] rounded-2xl p-5 hover:shadow-xl shadow-md"

            >
              <BaggageClaim className="text-orange-400 w-[20%] md:w-[40%] lg:w-[20%]" />
              <p className="ml-4 text-[14px]">
                Mua sắm hàng Trung Quốc dễ dàng, tiện lợi mọi lúc mọi nơi, như
                mua hàng Việt
              </p>
            </motion.div>
            <motion.div
              variants={serviceItemVariants}
              onMouseEnter={() => handleMouseEnter(1)}
              onMouseLeave={() => handleMouseLeave(1)}
              animate={hoverStates[1] ? "hover" : "rest"}
              className="flex border-[1px] border-[#e9ecef] rounded-2xl p-5 hover:shadow-xl shadow-md"
            >
              <SearchCheck className="text-orange-400 w-[20%] md:w-[40%] lg:w-[20%]" />
              <p className="ml-4 text-[14px]">
                BTC Logistics hỗ trợ tìm kiếm sản phẩm và nhà cung cấp chính
                hãng hoàn toàn miễn phí
              </p>
            </motion.div>
            <motion.div
              variants={serviceItemVariants}
              onMouseEnter={() => handleMouseEnter(3)}
              onMouseLeave={() => handleMouseLeave(3)}
              animate={hoverStates[3] ? "hover" : "rest"}
              className="flex border-[1px] border-[#e9ecef] rounded-2xl p-5 hover:shadow-xl shadow-md"
            >
              <HeartHandshake className="text-orange-400 w-[20%] md:w-[40%] lg:w-[20%]" />
              <p className="ml-4 text-[14px]">
                Hỗ trợ đặt hàng, mua hộ hàng đúng với yêu cầu của khách hàng,
                đúng trang web, đúng sản phẩm.
              </p>
            </motion.div>
            <motion.div
              variants={serviceItemVariants}
              onMouseEnter={() => handleMouseEnter(4)}
              onMouseLeave={() => handleMouseLeave(4)}
              animate={hoverStates[4] ? "hover" : "rest"}
              className="flex border-[1px] border-[#e9ecef] rounded-2xl p-5 hover:shadow-xl shadow-md"
            >
              <ShieldCheck className="text-orange-400 w-[20%] md:w-[40%] lg:w-[20%]" />
              <p className="ml-4 text-[14px]">
                Bảo hiểm hàng hóa trực tiếp, không qua trung gian, đảm bảo an
                toàn cho đơn hàng
              </p>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isSectionInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: easeInOut }}
          className=""
        >
          <img
            className="max-w-[320px]  mt-6 lg:mt-16 lg:max-w-[600px]"
            src={AboutUs}
            alt="BTC Logistics Services"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default DetailService;
