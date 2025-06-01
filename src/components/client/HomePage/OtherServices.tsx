import { easeInOut, motion, useInView } from "framer-motion";
import { Earth, Trophy, Truck, Users } from "lucide-react"; // Import biểu tượng từ lucide-react
import { useRef, useState } from "react";

const OtherServices = () => {
  const [hoverStates, setHoverStates] = useState([false, false, false, false]);

  // Sử dụng để bắt sự kiện hover vào card thông tin
  const handleMouseEnter = (index: number) => {
    const newHoverStates = [...hoverStates];
    newHoverStates[index] = true;
    setHoverStates(newHoverStates);
  };

  // Sử dụng để bắt sự kiện hover vào card thông tin
  const handleMouseLeave = (index: number) => {
    const newHoverStates = [...hoverStates];
    newHoverStates[index] = false;
    setHoverStates(newHoverStates);
  };

  // Tạo ref cho từng khối
  const topRef = useRef(null);

  // Theo dõi theo từng khối ref để tạo hiệu ứng cho nó
  const isTopInView = useInView(topRef, { amount: 0.1, once: true });

  return (
    <div className="max-w-[1280px] mx-auto p-3 md:p-0">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={isTopInView ? { y: 0, opacity: 100 } : {}}
        transition={{ duration: 1, ease: easeInOut }}
        ref={topRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 px-[16px] lg:px-0 relative mt-[-60px]"
      >
        <motion.div
          initial={{ y: 0 }}
          transition={{ duration: 0.3, ease: easeInOut }}
          onMouseEnter={() => handleMouseEnter(1)}
          onMouseLeave={() => handleMouseLeave(1)}
          animate={hoverStates[1] ? { y: -10 } : {}}
          className="flex items-center p-[26px] border-[1px] border-[#e9ecef] dark:border-transparent bg-[#fff] dark:bg-[#2b2838] rounded-2xl shadow-xl hover:shadow-none"
        >
          <div className="w-[81px] h-[81px] bg-[#fff0ee] rounded-full p-5 flex items-center justify-center">
            <Truck className="w-10 h-10 text-[#ff6347]" />{" "}
            {/* Biểu tượng xe tải */}
          </div>
          <div className="ml-[20px]">
            <h4 className="dark:text-[#B9B7C0] text-[#000] text-[20px] font-title">
              30.000+
            </h4>
            <p className="dark:text-[#B9B7C0] text-[#000] text-[16px]">
              Đơn hàng giao tận nơi
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 0 }}
          transition={{ duration: 0.3, ease: easeInOut }}
          onMouseEnter={() => handleMouseEnter(2)}
          onMouseLeave={() => handleMouseLeave(2)}
          animate={hoverStates[2] ? { y: -10 } : {}}
          className="flex items-center p-[26px] border-[1px] border-[#e9ecef] dark:border-transparent bg-[#fff] dark:bg-[#2b2838] rounded-2xl shadow-xl hover:shadow-none"
        >
          <div className="w-[81px] h-[81px] bg-[#ecfef4] rounded-full p-5 flex items-center justify-center">
            <Earth className="w-10 h-10 text-green-400" />
            {/* Biểu tượng bản đồ */}
          </div>
          <div className="ml-[20px]">
            <h4 className="dark:text-[#B9B7C0] text-[#000] text-[20px] font-title">
              34/34
            </h4>
            <p className="dark:text-[#B9B7C0] text-[#000] text-[16px]">
              Tỉnh thành phục vụ
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 0 }}
          transition={{ duration: 0.3, ease: easeInOut }}
          onMouseEnter={() => handleMouseEnter(3)}
          onMouseLeave={() => handleMouseLeave(3)}
          animate={hoverStates[3] ? { y: -10 } : {}}
          className="flex items-center p-[26px] border-[1px] border-[#e9ecef] dark:border-transparent bg-[#fff] dark:bg-[#2b2838] rounded-2xl shadow-xl hover:shadow-none"
        >
          <div className="w-[81px] h-[81px] bg-[#fff2f8] rounded-full p-5 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-[#ff69b4]" />
            {/* Biểu tượng hàng hóa */}
          </div>
          <div className="ml-[20px]">
            <h4 className="dark:text-[#B9B7C0] text-[#000] text-[20px] font-title">
              10+ năm
            </h4>
            <p className="dark:text-[#B9B7C0] text-[#000] text-[16px]">
              Kinh nghiệm vận chuyển Trung Việt
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 0 }}
          transition={{ duration: 0.3, ease: easeInOut }}
          onMouseEnter={() => handleMouseEnter(4)}
          onMouseLeave={() => handleMouseLeave(4)}
          animate={hoverStates[4] ? { y: -10 } : {}}
          className="flex items-center p-[26px] border-[1px] border-[#e9ecef] dark:border-transparent bg-[#fff] dark:bg-[#2b2838] rounded-2xl shadow-xl hover:shadow-none"
        >
          <div className="w-[81px] h-[81px] bg-[#eafdff] rounded-full p-5 flex items-center justify-center">
            <Users className="w-10 h-10 text-blue-300" />{" "}
          </div>
          <div className="ml-[20px]">
            <h4 className="dark:text-[#B9B7C0] text-[#000] text-[20px] font-title">
              15.348+
            </h4>
            <p className="dark:text-[#B9B7C0] text-[#000] text-[16px]">
              Khách hàng tin cậy
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OtherServices;
