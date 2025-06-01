import { easeInOut, motion, useInView } from "framer-motion";
import { useRef } from "react";
import { orderingProcedure } from "../../../constants/client";

const OrderingProcedure = () => {
  const topRef = useRef(null);
  const isTopInView = useInView(topRef, { amount: 0.1, once: true });

  const steps = [
    {
      title: "Bước 1",
      description: "Khách hàng gửi yêu cầu mua hộ hoặc vận chuyển hàng hóa",
    },
    {
      title: "Bước 2",
      description: "Khách hàng đặt cọc để đảm bảo đơn hàng",
    },
    {
      title: "Bước 3",
      description: "BTC nhanh chóng xử lý và xác nhận yêu cầu",
    },
    {
      title: "Bước 4",
      description: "Hàng hóa từ Trung Quốc được nhập kho và phát đi",
    },
    {
      title: "Bước 5",
      description: "Kho BTC Trung Quốc tiếp nhận và hoàn tất thủ tục thông quan",
    },
    {
      title: "Bước 6",
      description: "Kho BTC Việt Nam nhận hàng và kiểm tra chất lượng",
    },
    {
      title: "Bước 7",
      description: "Khách hàng nhận hàng, thanh toán và phản hồi nếu cần",
    },
  ];

  // Variants cho hiệu ứng tuần tự
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeInOut } },
  };

  return (
    <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={isTopInView ? { y: 0, opacity: 1 } : {}}
    transition={{ duration: 1, ease: easeInOut }}
    ref={topRef}
      className="pt-20 lg:pt-40 px-4 text-lg bg-[url('/assets/images/client/Images/course-bg.png')] bg-cover bg-center min-h-[100vh] md:min-h-[50vh] lg:min-h-[100vh]"
    >
      <div
        className="max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px] mx-auto p-3 md:p-0"
      >
        <h2 className="text-3xl font-bold text-center text-[#22100d] mb-20">
          QUY TRÌNH MUA HỘ VÀ VẬN CHUYỂN
        </h2>
        <div className="flex flex-col md:flex-row md:justify-between items-start gap-8">
          <img
            src={orderingProcedure}
            alt="Minh họa quy trình mua hộ và vận chuyển"
            className="w-full md:w-[44%] md:h-[720px] object-cover rounded-lg"
          />
          <motion.div
            className="md:w-[50%]"
            variants={containerVariants}
            initial="hidden"
            animate={isTopInView ? "visible" : "hidden"}
            role="list"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex  items-start mb-4 md:mb-8 lg:mb-14 relative"
                variants={stepVariants}
                role="listitem"
              >
                <div className="flex  md:flex-col items-center mr-4">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      index % 2 === 0 ? "bg-[#F84563]" : "bg-orange-500"
                    } flex items-center justify-center text-white font-bold text-sm`}
                    aria-label={`Bước ${index + 1}`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 bg-gray-300 mt-2 absolute top-10 left-4 h-[calc(100%-3rem)] md:h-[calc(100%-2rem)]"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#22100d]">{step.title}</h3>
                  <p className="text-lg text-gray-700">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderingProcedure;