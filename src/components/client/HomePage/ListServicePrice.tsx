import { LoadingOutlined } from "@ant-design/icons";
import { easeInOut, motion, useInView } from "framer-motion";
import { formatDateDay } from "../../../constants/util";
import { useGetExchangeRateQuery } from "../../../redux/slices/exchangeRateApiSlice";
import { useRef } from "react";
import { ArrowRightLeft, Repeat } from "lucide-react";

const ListServicePrice = () => {
  const { data, isLoading } = useGetExchangeRateQuery();
  const topRef = useRef(null);
  const isTopInView = useInView(topRef, { amount: 0.1, once: true });

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={isTopInView ? { y: 0, opacity: 100 } : {}}
      transition={{ duration: 1, ease: easeInOut }}
      ref={topRef}
      className="mt-20 bg-[url('/assets/images/client/Images/sec-bg-02.png')] bg-cover bg-center min-h-[80vh] md:min-h-fit max-w-[768px] md:max-w-[1024px]  lg:max-w-[1280px] mx-auto p-3  border border-orange-500 rounded-md shadow-xl"
    >
      <div className="max-w-[500px] md:max-w-[920px]  mx-auto p-2  text-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6 pt-5">
          Tỷ Giá Ngoại Tệ
        </h2>

        {isLoading ? (
          <div className="text-center">
            <LoadingOutlined className="text-4xl text-[#F84563]" />
            <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : data ? (
          <div className="rounded-2xl p-4">
            <div className="text-center mb-12 flex flex-col gap-2 items-center">
              <p className="text-xl text-gray-900">
                1 Đồng Nhân dân tệ Trung Quốc
              </p>
              <Repeat className="text-gray-700" size={16} />
              <p className="font-semibold  text-2xl sm:text-3xl text-[#F84563]">
                {data.rate} Việt Nam Đồng
              </p>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row justify-between mb-4">
                <p className="text-gray-800">Loại ngoại tệ: CNY</p>
                <p className="text-gray-800">
                  Cập nhật lúc: {formatDateDay(data.updatedAt)}
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <motion.div className="border-2 border-gray-200 rounded-xl shadow-md p-6 w-full max-w-[370px] text-center md:text-left ">
                  <div className="flex justify-center md:justify-normal items-center mb-2">
                    <p className="text-lg">CNY - Nhân dân tệ Trung Quốc</p>
                  </div>
                  <p className="text-2xl font-semibold text-[#F84563]">1.00</p>
                </motion.div>

                <ArrowRightLeft />

                <motion.div className="border-2 border-gray-200 rounded-xl shadow-md p-6 w-full max-w-[370px] text-center md:text-left">
                  <div className="flex justify-center md:justify-normal  items-center mb-2">
                    <p className="text-lg">VND - Việt Nam Đồng</p>
                  </div>
                  <p className="text-2xl font-semibold text-[#F84563]">
                    {data.rate}
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-[16px] text-gray-500">
                Tỷ giá được cập nhật tự động từ nguồn đáng tin cậy.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Tỷ giá chưa được cập nhật để hiển thị.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ListServicePrice;
