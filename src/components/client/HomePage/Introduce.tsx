import {
  ArrowRightOutlined,
  SearchOutlined,
  StarFilled,
} from "@ant-design/icons";
import { easeInOut, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { imageCargo } from "../../../constants/client";

import { Input } from "antd";

export const Introduce = () => {
  const [count, setCount] = useState(100);
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: any) => {
    if (!keyword.trim()) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const target = 1000; // Mục tiêu là 1000
    const duration = 1500; // Thời gian hoàn thành (1 giây)
    const steps = 100; // Số bước
    const increment = (target - count) / steps; // Giá trị tăng mỗi bước

    const interval = setInterval(() => {
      setCount((prevCount) => {
        const newCount = prevCount + increment;
        if (newCount >= target) {
          clearInterval(interval);
          return target; // Đảm bảo dừng lại ở 1000
        }
        return Math.floor(newCount); // Làm tròn số
      });
    }, duration / steps); // Cập nhật mỗi bước

    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, []);

  return (
    <div>
      <div
        className={`min-h-[100vh] md:min-h-[50vh] lg:min-h-[100vh] pb-[140px] lg:pb-[200px] bg-[url("/assets/images/client/Images/banner.png")] bg-cover bg-center pt-10`}
      >
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 100 }}
          transition={{ duration: 1, ease: easeInOut }}
          className="max-w-[768px] pt-[100px] md:pt-[100px] lg:pt-[150px] 
                    md:max-w-[1024px] 
                    lg:max-w-[1280px]  p-3 mx-auto  grid grid-cols-1 md:grid-cols-2 "
        >
          <div className="">
            <h4 className="text-[16px] mb-[26px] text-[#685f78] lg:text-[20px] font-bold">
              BTC Logistics dẫn đầu trong dịch vụ vận chuyển hàng hóa
            </h4>

            <h1
              className="text-[32px] mb-[30px] font-bold leading-[40px]
                   lg:leading-[60px] text-[#22100d]
                   lg:text-[48px] max-w-full md:max-w-[500px] lg:max-w-[600px]"
            >
              Các dịch vụ vận chuyển hàng hóa uy tín và hiệu quả cho mọi nhu cầu
            </h1>
            <form
              onSubmit={handleSubmit}
              action="/kien-hang"
              className="flex justify-between bg-white p-3 mb-6 rounded-full"
            >
              <SearchOutlined
                style={{
                  color: "#f66962",
                  marginRight: 10,
                  paddingLeft: 10,
                  fontSize: 20,
                }}
              />
              <Input
                type="text"
                name="keyword"
                onChange={(e) => setKeyword(e.target.value)}
                className="bg-transparent border-none w-[270px]  md:w-[300px] lg:w-[520px] focus:border-transparent mr-2 placeholder:text-gray-400 text-lg 
                    text-[#706f74] hover:bg-transparent focus:bg-transparent"
                placeholder="Tra cứu kiện hàng"
              />

              <button
                type="submit"
                className="bg-[#F84563] rounded-full w-[40px] md:w-[38px] lg:w-[46px] lg:h-[44px] hover:bg-[#f9817b] cursor-pointer"
              >
                <ArrowRightOutlined className="text-white text-xl" />
              </button>
            </form>
            <p className="text-[16px] text-[#685f78] lg:text-[20px] mb-6 lg:mb-[10px]">
              Được hơn 10 nghìn khách hàng tin dùng trên toàn quốc từ năm 2024
            </p>

            <div className="flex">
              <h1 className="font-bold text-[32px] lg:text-[48px] mr-14 transition-all ease-in-out">
                {Math.floor(count)}+
              </h1>
              <div className="flex items-center">
                <div className="font-bold text-[32px] lg:text-[48px]">5</div>
                <div className="ml-4 mt-2">
                  <StarFilled className="text-yellow-400 mr-1 lg:mr-4 text-[14px] lg:text-[20px]" />
                  <StarFilled className="text-yellow-400 mr-1 lg:mr-4 text-[14px] lg:text-[20px]" />
                  <StarFilled className="text-yellow-400 mr-1 lg:mr-4 text-[14px] lg:text-[20px]" />
                  <StarFilled className="text-yellow-400 mr-1 lg:mr-4 text-[14px] lg:text-[20px]" />
                  <StarFilled className="text-yellow-400 mr-1 lg:mr-4 text-[14px] lg:text-[20px]" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-[400px] lg:-mt-20 md:w-[404px] lg:w-[646px] justify-self-center md:justify-self-end  lg:justify-self-end">
            <img src={imageCargo} alt="imageCargo" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
