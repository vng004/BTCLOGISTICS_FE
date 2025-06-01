import { CloseOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import { useGetAllBannersQuery } from "../../../redux/slices/bannerApiSlice";

const Banner = () => {
  const { data: banners } = useGetAllBannersQuery();
  const [isOpen, setIsOpen] = useState(false);
  const carouselRef = useRef<any>(null);

  useEffect(() => {
    if (banners && banners.length > 0) {
      setIsOpen(true);

      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 100000);

      return () => clearTimeout(timer);
    }
  }, [banners]);

  const nextSlide = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const prevSlide = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  if (!banners || banners.length === 0) return null;

  const activeBanners = banners.filter((banner) => banner.isActive);

  return (
    <Modal
      open={isOpen}
      footer={null}
      width={800}
      className="bn relative p-4"
      closeIcon={null}
      centered
      bodyStyle={{ padding: 0 }}
    >
      <button
        onClick={() => setIsOpen(false)}
        className="absolute right-[-15px] top-[-15px] bg-[#F84563] w-10 h-10 rounded-full flex items-center justify-center text-white text-xl hover:bg-[#f9817b] transition-colors duration-300"
      >
        <CloseOutlined />
      </button>
      <div className="relative">
        <Carousel
          ref={carouselRef}
          autoplay
          autoplaySpeed={6000}
          arrows={false}
          dots={false}
        >
          {activeBanners.map((banner) => (
            <div
              key={banner._id}
              className=" flex justify-center items-center"
            >
              <img
                src={banner.images[0]}
                alt={`Quảng cáo ${banner._id}`}
                className="w-full h-[460px] object-contain" 
              />
            </div>
          ))}
        </Carousel>

        {activeBanners.length > 1 && (
          <div>
            <button
              onClick={prevSlide}
              className="
              absolute 
              left-[-45px] md:left-[-60px] 
              top-1/2 -translate-y-1/2 
              bg-[#F84563] 
              w-10 h-10 md:h-13 md:w-13 rounded-full
              flex items-center justify-center
              text-white 
              hover:bg-[#f9817b] transition-colors duration-300
            "
            >
              <LeftOutlined />
            </button>
            <button
              onClick={nextSlide}
              className="
              absolute 
              right-[-45px] md:right-[-60px] 
              top-1/2 -translate-y-1/2 
              bg-[#F84563]  
              w-10 h-10 md:h-13 md:w-13 rounded-full
              flex items-center justify-center
              text-white 
              hover:bg-[#f9817b] transition-colors duration-300
            "
            >
              <RightOutlined />
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Banner;
