import { commit, introduce, target } from "../../../constants/client";

const IntroduceBTC = () => {
  return (
    <div className="max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px] mx-auto pt-46 md:pt-[155px]  space-y-10 p-3">
      <div className="space-y-10 md:space-y-16">
        <div className="text-center">
          <div
            className="
          relative flex flex-col items-center justify-center 
          bg-cover bg-center rounded-lg
          min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]
          p-4 sm:p-6 lg:p-8
        "
            style={{ backgroundImage: `url(${introduce})` }}
          >
            <div className="absolute inset-0 bg-gray-700/60 rounded-lg z-0"></div>

            <h2 className="text-2xl font-bold text-white z-10">
              BTC Logistics
            </h2>
            <p className="text-[17px] md:text-xl text-white mt-4 w-auto md:w-[650px] lg:w-[820px] z-10 font-semibold">
              BTC Logistics là công ty logistics hàng đầu trong lĩnh vực vận
              chuyển hàng hóa (Việt - Trung) (Trung - Việt). Là đơn vị uy tín
              lâu năm trên thị trường cung cấp dịch vụ đặt hàng order, vận
              chuyển hàng hóa từ các sàn thương mại điện tử lớn nhất Trung Quốc
              về Việt Nam.
            </p>
          </div>
        </div>
        <div className="space-y-12">
          <div className="flex flex-col justify-center gap-y-6 items-center md:items-start md:flex-row md:justify-between  relative">
            <div className="w-full md:w-[48%] relative">
              <img
                src={target}
                alt="targetBTC"
                className="rounded-md relative"
              />
              <h3 className=" md:text-xl w-[195px] md:w-[210px] text-center font-semibold bg-[#F84563] text-white p-3 rounded-md absolute bottom-5 left-5 ">
                Sứ mệnh & Mục tiêu
              </h3>
            </div>

            <div className="w-full md:w-[50%]">
              <p className=" lg:text-[22px] text-gray-800">
                Sứ mệnh của BTC Logistics “Làm đơn giản hóa mọi hoạt động kinh
                doanh trên toàn cầu”. Mục tiêu hàng đầu của chúng tôi là giúp
                thương nhân, doanh nghiệp Việt Nam kết nối trực tiếp với nhà
                cung cấp mà không cần qua kênh trung gian nào khác.
              </p>
              <p className=" lg:text-[22px] text-gray-800 mt-3">
                Bằng công nghệ, trí tuệ và khát khao mang đến cho khách hàng
                nguồn hàng kinh doanh tốt nhất, chúng tôi luôn nỗ lực tìm ra
                giải pháp, tư vấn, tìm kiếm và đặt hàng cho các đại lý, cửa hàng
                trên toàn quốc hoạt động trên nhiều lĩnh vực khác nhau. Chúng
                tôi đặt chữ tín hàng đầu, khách hàng kinh doanh thắng lợi mới là
                thành công của chúng tôi.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse  justify-center gap-y-6 items-center md:items-start md:flex-row md:justify-between  relative">
            <div className="w-full md:w-[50%]">
              <p className=" lg:text-[22px] text-gray-800">
                BTC Logistics cam kết mang đến cho quý khách dịch vụ tốt nhất.
                Với hơn 10 năm kinh nghiệm, sự am hiểu sâu thị trường Trung
                Quốc, chúng tôi có thể đáp ứng mọi yêu cầu của khách hàng trong
                việc đặt hàng, tìm nguồn hàng cũng như các vấn đề khác.
              </p>
              <p className=" lg:text-[22px] text-gray-800 mt-3">
                Nhà sản xuất, doanh nghiệp thương mại, cá nhân buôn bán không
                cần tới chợ đầu mối truyền thống, đi Trung Quốc nhập hàng. Bởi
                thông qua Alibaba và các website thương mại điện tử hàng đầu thế
                giới, hàng hóa được nhập online giá gốc trực tiếp từ các nhà
                cung cấp một cách đơn giản.
              </p>
            </div>
            <div className="w-full md:w-[48%] relative">
              <img
                src={commit}
                alt="commitBTC"
                className="rounded-md relative"
              />
              <h3 className=" md:text-xl w-[195px]  md:w-[210px] text-center font-semibold bg-[#F84563] text-white p-3 rounded-md absolute bottom-4 right-4 ">
                Cam kết dịch vụ
              </h3>
            </div>
          </div>
        </div>

        <div className="">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#F84563] mb-4">
            Thế mạnh của BTC Logistics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="border border-orange-500 rounded-lg shadow-md p-4 sm:p-5 hover:shadow-lg hover:border-orange-600 hover:scale-105 transition-all duration-300 cursor-pointer">
              <p className=" md:text-lg text-gray-600">
                Nhập hàng hóa bán buôn rẻ nhất thị trường bởi sở hữu hệ sinh
                thái nhập hàng tận gốc từ các nhà cung cấp lớn nhất tại Trung
                Quốc và các nước Châu Á, đồng thời cung cấp cho khách hàng hệ
                thống đặt hàng chính xác, nhanh chóng và quản lý đơn hàng dễ
                dàng.
              </p>
            </div>
            <div className="border border-orange-500 rounded-lg shadow-md p-4 sm:p-5 hover:shadow-lg hover:border-orange-600 hover:scale-105 transition-all duration-300 cursor-pointer">
              <p className=" md:text-lg text-gray-600">
                Sở hữu sức mạnh về công nghệ, hệ thống kho vận, hệ thống đại lý,
                hệ thống thông tin nguồn hàng. Cam kết hàng hóa lưu thông liên
                tục.
              </p>
            </div>
            <div className="border border-orange-500 rounded-lg shadow-md p-4 sm:p-5 hover:shadow-lg hover:border-orange-600 hover:scale-105 transition-all duration-300 cursor-pointer">
              <p className=" md:text-lg text-gray-600">
                Tốc độ giao hàng nhanh chóng chỉ từ 48h từ kho Trung Quốc về
                Việt Nam. Tiết kiệm thời gian công sức và tiền bạc đến khách
                hàng.
              </p>
            </div>
            <div className="border border-orange-500 rounded-lg shadow-md p-4 sm:p-5 hover:shadow-lg hover:border-orange-600 hover:scale-105 transition-all duration-300 cursor-pointer">
              <p className=" md:text-lg text-gray-600">
                Tốc độ đặt hàng siêu nhanh chỉ 2h sau khi khách hàng yêu cầu
                lệnh đặt hàng, phá vỡ rào cản ngôn ngữ, quản lý đơn hàng dễ dàng
                và tiện lợi mọi lúc mọi nơi trên các thiết bị di động.
              </p>
            </div>
            <div className="border border-orange-500 rounded-lg shadow-md p-4 sm:p-5 hover:shadow-lg hover:border-orange-600 hover:scale-105 transition-all duration-300 cursor-pointer">
              <p className=" md:text-lg text-gray-600">
                Cam kết báo đúng giá, không tăng phí ship nội địa, không báo
                chênh giá sản phẩm. Cam kết 1 đền 10 nếu BTC báo tăng giá.
              </p>
            </div>
            <div className="border border-orange-500 rounded-lg shadow-md p-4 sm:p-5 hover:shadow-lg hover:border-orange-600 hover:scale-105 transition-all duration-300 cursor-pointer">
              <p className=" md:text-lg text-gray-600">
                Có chính sách chiết khấu với khách hàng lớn, với khách hàng
                quen. Bảng giá dịch vụ cạnh tranh, giá vận chuyển siêu rẻ, được
                đánh giá là rẻ nhất thị trường hiện nay. Đội ngũ nhân viên CSKH
                phục vụ hết sức tận tình, luôn sẵn sàng hỗ trợ.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#F84563] mb-4">
            Hỗ trợ khách hàng
          </h3>
          <ul className="space-y-2 md:text-lg text-gray-700 list-disc list-inside">
            <li className="hover:text-[#F84563]">
              Tư vấn tìm nguồn hàng phong phú từ các nhà cung cấp uy tín tại
              Trung Quốc và giải đáp thắc mắc, hỗ trợ khách hàng trong quá trình
              thực hiện đơn hàng.
            </li>
            <li className="hover:text-[#F84563]">
              Phân tích mô hình kinh doanh của khách hàng, đưa ra giải pháp nhập
              hàng tối ưu.
            </li>
            <li className="hover:text-[#F84563]">
              Hỗ trợ khách hàng phát triển kinh doanh thông qua Thương mại điện
              tử.
            </li>
            <li className="hover:text-[#F84563]">
              Hỗ trợ tư vấn tìm kiếm nguồn hàng, đánh giá chất lượng nhà cung
              cấp uy tín.
            </li>
            <li className="hover:text-[#F84563]">
              Hỗ trợ tư vấn giải pháp nhập hàng giá gốc tận nhà (nếu cần).
            </li>
            <li className="hover:text-[#F84563]">
              Hỗ trợ đàm phán giá tốt nhất với nhà cung cấp.
            </li>
            <li className="hover:text-[#F84563]">
              Hỗ trợ dẫn khách đến tận nhà sản xuất để đàm phán, mua hàng nếu
              khách muốn xem trực tiếp sản phẩm.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IntroduceBTC;
