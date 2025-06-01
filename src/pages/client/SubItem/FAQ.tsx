const FAQ = () => {
  return (
    <div className="max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px] mx-auto pt-46 md:pt-[155px]  space-y-10 p-3">
      <div className="">
        <h1 className="text-2xl md:text-3xl font-bold text-[#F84563] text-center mb-10">
          Những câu hỏi thường gặp
        </h1>
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <div
            className="
              border border-orange-500 rounded-lg shadow-md 
              p-4 sm:p-5 
              hover:shadow-lg hover:border-orange-600 
              transition-all duration-300 cursor-pointer
            "
          >
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#F84563] mb-2">
              Hàng order là gì?
            </h3>
            <p className="text-base sm:text-lg text-gray-600">
              Hàng order là hàng hóa được BTC Logistics đặt mua từ các sàn
              thương mại điện tử Trung Quốc (Taobao, 1688, Tmall) theo yêu cầu
              khách hàng tại Việt Nam. Với dịch vụ đặt hàng hộ chuyên nghiệp,
              chúng tôi đảm bảo quy trình nhanh chóng, minh bạch, giúp bạn tiếp
              cận nguồn hàng chất lượng mà không cần tự đặt.
            </p>
          </div>

          <div
            className="
              border border-orange-500 rounded-lg shadow-md 
              p-4 sm:p-5 
              hover:shadow-lg hover:border-orange-600 
              transition-all duration-300 cursor-pointer
            "
          >
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#F84563] mb-2">
              Đặt hàng trên website như thế nào?
            </h3>
            <p className="text-base sm:text-lg text-gray-600">
              Để đặt hàng, bạn chỉ cần cung cấp thông tin sản phẩm (link, tên,
              số lượng) qua hệ thống đặt hàng trực tuyến của BTC Logistics.
              Chúng tôi hỗ trợ đặt mua từ các trang Taobao, 1688, Tmall,
              Pinduoduo, xử lý thanh toán và vận chuyển về Việt Nam nhanh chóng,
              đảm bảo đúng yêu cầu.
            </p>
          </div>

          {/* FAQ 3 */}
          <div
            className="
              border border-orange-500 rounded-lg shadow-md 
              p-4 sm:p-5 
              hover:shadow-lg hover:border-orange-600 
              transition-all duration-300 cursor-pointer
            "
          >
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#F84563] mb-2">
              Làm sao để mua đúng sản phẩm?
            </h3>
            <p className="text-base sm:text-lg text-gray-600">
              BTC Logistics cung cấp công cụ tìm kiếm thông minh với tính năng
              dịch tự động, giúp bạn dễ dàng nhập từ khóa tiếng Việt để tìm đúng
              sản phẩm trên các sàn Trung Quốc. Đội ngũ hỗ trợ của chúng tôi
              cũng kiểm tra kỹ thông tin sản phẩm để đảm bảo bạn nhận đúng hàng.
            </p>
          </div>

          {/* FAQ 4 */}
          <div
            className="
              border border-orange-500 rounded-lg shadow-md 
              p-4 sm:p-5 
              hover:shadow-lg hover:border-orange-600 
              transition-all duration-300 cursor-pointer
            "
          >
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#F84563] mb-2">
              Lựa chọn hàng như thế nào để tránh hàng giả, hàng nhái?
            </h3>
            <p className="text-base sm:text-lg text-gray-600">
              Để tránh hàng giả, BTC Logistics kiểm tra kỹ thông tin sản phẩm,
              đánh giá nhà cung cấp dựa trên uy tín và phản hồi. Đội ngũ giàu
              kinh nghiệm của chúng tôi tư vấn chọn hàng chất lượng, đảm bảo giá
              trị thực. Bạn cũng có thể tham khảo hướng dẫn từ chúng tôi để nhận
              biết sản phẩm chính hãng.
            </p>
          </div>

          {/* FAQ 5 */}
          <div
            className="
              border border-orange-500 rounded-lg shadow-md 
              p-4 sm:p-5 
              hover:shadow-lg hover:border-orange-600 
              transition-all duration-300 cursor-pointer
            "
          >
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#F84563] mb-2">
              Chọn nhà cung cấp như thế nào?
            </h3>
            <p className="text-base sm:text-lg text-gray-600">
              BTC Logistics tổng hợp danh sách nhà cung cấp uy tín trên Taobao,
              1688, Tmall dựa trên lượt mua và đánh giá tích cực. Chúng tôi hỗ
              trợ bạn kiểm tra phản hồi, bình luận và hình ảnh thực tế từ khách
              hàng trước để chọn nhà cung cấp chất lượng, đảm bảo nguồn hàng tốt
              nhất.
            </p>
          </div>

          {/* FAQ 6 */}
          <div
            className="
              border border-orange-500 rounded-lg shadow-md 
              p-4 sm:p-5 
              hover:shadow-lg hover:border-orange-600 
              transition-all duration-300 cursor-pointer
            "
          >
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#F84563] mb-2">
              Mua gì với BTC Logistics?
            </h3>
            <p className="text-base sm:text-lg text-gray-600">
              BTC Logistics hỗ trợ đặt mua đa dạng sản phẩm từ thời trang, gia
              dụng, mỹ phẩm, điện tử đến thiết bị dân dụng từ Trung Quốc. Chúng
              tôi cam kết không vận chuyển hàng cấm, dễ cháy nổ, đảm bảo an toàn
              và chất lượng. Hãy liên hệ để được tư vấn nguồn hàng phù hợp nhất!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
