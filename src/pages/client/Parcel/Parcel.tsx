import { Link, useSearchParams } from "react-router-dom";
import { useGetParcelsQuery } from "../../../redux/slices/parcelApiSlice";
import { formatDateDay } from "../../../constants/util";
import { Tag, Timeline } from "antd";

const Parcel = () => {
  const [searchParams] = useSearchParams();
  const trackingCode = searchParams.get("keyword");
  const { data } = useGetParcelsQuery({
    keyword: trackingCode || undefined,
    page: 1,
    perPage: 1,
  });
  const parcel = data?.data?.[0];
  const statusHistory = parcel?.statusHistory || [];
  const statusLabels: { [key: number]: string } = {
    0: "Kiện hàng đã lưu kho Trung Quốc",
    1: "Kiện hàng đang được luân chuyển về Việt Nam",
    2: "Kiện hàng đã về tới kho Việt Nam",
    3: "Kiện hàng đã được giao thành công",
  };

  const statusColors: { [key: number]: string } = {
    0: "blue",
    1: "yellow",
    2: "cyan",
    3: "green",
  };

  if (!parcel) {
    return (
      <div
        className={` min-h-screen bg-[url("/assets/images/client/Images/sec-bg-01.png")] bg-cover bg-center flex justify-center items-center`}
      >
        <div className="max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px] mx-auto p-4 ">
          <div>
            <p className="  text-lg">Kiện hàng không tồn tại.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[url("/assets/images/client/Images/sec-bg-01.png")] bg-cover bg-center`}
    >
      <div className="max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px]  mx-auto pt-46 md:pt-[155px]  p-3 md:p-0 pb-20 md:pb-0">
        <div className="space-y-4 md:space-y-16">
          <div className="flex justify-between flex-wrap space-y-4">
            <div className="space-y-3 w-full md:w-[49%] p-4 bg-white rounded-md shadow-md">
              <p className="p-2 border border-orange-500 rounded-md text-[#F84563]">
                Thông tin kiện hàng
              </p>
              <div>
                <span>Mã kiện hàng: </span>
                <span className="font-semibold ml-2 md:ml-13">
                  {parcel.trackingCode}
                </span>
              </div>
              <div>
                <span>Ngày xuất kho: </span>
                <span className="font-semibold ml-2 md:ml-[46px]">
                  {formatDateDay(parcel.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>Thông tin đơn hàng:</span>
                <div className="md:w-[420px] hover:text-[#F84563]">
                  <Link to={`${parcel.description}`}>{parcel.description}</Link>
                </div>
              </div>
              <div className="flex items-center">
                <span>Trạng thái hiện tại: </span>
                {parcel.inspection === false ? (
                  <Tag
                    className="text-sm font-semibold py-2 px-2 min-w-[130px] text-center ml-6"
                    color={
                      parcel.shipmentStatus === 0
                        ? "blue"
                        : parcel.shipmentStatus === 1
                        ? "yellow"
                        : parcel.shipmentStatus === 2
                        ? "cyan"
                        : parcel.shipmentStatus === 3
                        ? "green"
                        : ""
                    }
                  >
                    {parcel.shipmentStatus === 0
                      ? "Lưu kho Trung Quốc"
                      : parcel.shipmentStatus === 1
                      ? "Đang luân chuyển về Việt Nam"
                      : parcel.shipmentStatus === 2
                      ? "Lưu kho Việt Nam"
                      : parcel.shipmentStatus === 3
                      ? "Đã giao hàng"
                      : ""}
                  </Tag>
                ) : (
                  <div className="pl-5">
                    <Tag
                      className="text-sm font-semibold py-2 px-2 text-center"
                      color="error"
                    >
                      Hải quan đang kiểm hóa hàng
                    </Tag>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3 w-full md:w-[49%] p-4 bg-white rounded-md shadow-md">
              <p className="p-2 border border-orange-500 rounded-md text-[#F84563]">
                Người nhận
              </p>
              <div>
                <span>Họ và tên: </span>
                <span className="ml-11">
                  {parcel.customer?.customerCode || "Chưa được thiết lập"}
                </span>
              </div>
              <div>
                <span>Số điện thoại: </span>
                <span className="ml-5">
                  {parcel.customer?.phone
                    ? "xxxxx" + parcel.customer?.phone.slice(5)
                    : "Chưa được thiết lập"}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-md p-4 space-y-6">
            <p className="p-2 border border-orange-500 rounded-md text-[#F84563]">
              Lịch sử di chuyển kiện hàng
            </p>
            <div>
              {statusHistory.length > 0 ? (
                <Timeline
                  items={statusHistory.map((history: any, index: number) => ({
                    key: index,
                    color: statusColors[history.status],
                    children: (
                      <>
                        <p className="font-semibold text-lg">
                          {statusLabels[history.status]}
                        </p>
                        <p>
                          Thời gian:{" "}
                          <span className="text-green-700">
                            {formatDateDay(history.timestamp)}
                          </span>
                        </p>
                      </>
                    ),
                  }))}
                />
              ) : (
                <p className="text-gray-500">Chưa có thông tin vận chuyển.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parcel;
