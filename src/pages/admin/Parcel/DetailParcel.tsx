import { LoadingOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Timeline, TreeSelect, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { CircleUser, FilePenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getTitleTab } from "../../../constants/client";
import { displayErrorMessage, formatDateDay } from "../../../constants/util";
import {
  useGetParcelByIdQuery,
  useUpdateParcelMutation,
} from "../../../redux/slices/parcelApiSlice";
import { RootState } from "../../../redux/store";

const DetailParcel = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { data } = useGetParcelByIdQuery(id);
  const customer = data?.customer;
  const statusHistory = data?.statusHistory || [];
  const [updateParcel, { isLoading }] = useUpdateParcelMutation();
  const nav = useNavigate();
  const [shipmentStatus, setShipmentStatus] = useState<number | undefined>(
    undefined
  );
  useEffect(() => {
    if (data) {
      form.setFieldValue("trackingCode", data?.trackingCode);
      form.setFieldValue("packageCode", data?.packageCode);
      form.setFieldValue("weight", data?.weight);
      form.setFieldValue("description", data?.description);
      form.setFieldValue("shipmentStatus", data?.shipmentStatus);
      form.setFieldValue("createdAt", formatDateDay(data?.createdAt));
      form.setFieldValue("updatedAt", formatDateDay(data?.updatedAt));
    }
  }, [data]);
  const { user } = useSelector((state: RootState) => state.auth);
  const admin = user?.role === "admin";
  const handlUpdate = async (values: {
    trackingCode: string;
    weight: string;
    description: string;
    packageCode: string;

  }) => {
    Modal.confirm({
      title: (
        <span className="text-[#F84563] font-title">
          Xác nhận cập nhật kiện hàng
        </span>
      ),
      content: (
        <p className="dark:text-[#b9b7c0] ">
          Bạn có chắc chắn muốn cập nhật kiện hàng này?
        </p>
      ),
      okText: "Đồng ý",
      okType: "danger",
      okButtonProps: {
        style: {
          backgroundColor: "#F84563",
          borderColor: "#F84563",
          color: "#fff",
        },
      },
      cancelButtonProps: {
        className: "custom-cancel-btn",
      },
      cancelText: "Hủy",
      centered: true,
      maskClosable: false,
      width: 600,
      icon: null,
      onOk: async () => {
        try {
          if (!id) {
            message.error("Không tìm thấy id kiện hàng!");
            return;
          }
          const { trackingCode, weight, description, packageCode } = values;
          const data =  await updateParcel({
            id,
            trackingCode,
            weight,
            description,
            shipmentStatus,
            packageCode,
          })
          ;console.log(data)
          message.success("Cập nhật kiện hàng thành công!");
          nav("/admin/parcel");
        } catch (error: any) {
          displayErrorMessage(error);
        }
      },
    });
  };

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

  const handleStatus = (status: number | undefined) => {
    setShipmentStatus(status);
  };

  return (
    <div>
      <Helmet>
        <title>{getTitleTab(`Chi tiết kiện hàng ${data?.trackingCode}`)}</title>
      </Helmet>

      <Form form={form} layout="vertical" onFinish={handlUpdate}>
        <div className="flex justify-between items-center mb-6 bg-white rounded-[50px] shadow-xl p-4">
          <div>
            <p className="font-title text-xl">Chi tiết kiện hàng</p>
          </div>
          <div className="flex items-center ">
            <p className="text-lg">Trạng thái:</p>
            <Form.Item name="shipmentStatus" className="w-50 -mb-[2px]">
              <TreeSelect
                className="px-2 h-[44px]"
                onChange={handleStatus}
                value={shipmentStatus}
                allowClear
                placeholder="Chọn trạng thái"
              >
                <TreeSelect.TreeNode value={0} title="Lưu kho TQ" />
                <TreeSelect.TreeNode value={1} title="Luân chuyển về VN" />
                <TreeSelect.TreeNode value={2} title="Lưu kho VN" />
                <TreeSelect.TreeNode value={3} title="Đã giao hàng" />
              </TreeSelect>
            </Form.Item>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="border-2  w-[140px] flex justify-center items-center border-orange-500 py-2 px-5 rounded-[50px] hover:bg-[#F84563] text-[#F84563] bg-white hover:border-orange-500 hover:text-white gap-3 cursor-pointer hover:shadow-md"
              >
                {isLoading ? <LoadingOutlined /> : <FilePenLine size={18} />}
                Cập nhật
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-x-4">
          <div className="w-full md:w-[48%] bg-white rounded-3xl hover:shadow-md shadow-xl p-10">
            <div className="flex justify-between items-center">
              <Form.Item
                name="createdAt"
                label={<span>Thời gian tạo kiện hàng</span>}
                className="w-[46%] border-none bg-transparent"
              >
                <Input
                  className="h-12 text-lg text-green-700"
                  id="createdAt"
                  readOnly
                />
              </Form.Item>
              <Form.Item
                name="updatedAt"
                label={<span>Thời gian cập nhật kiện hàng</span>}
                className="w-[46%] border-none bg-transparent"
              >
                <Input
                  className="h-12 text-lg text-red-700"
                  id="updatedAt"
                  readOnly
                />
              </Form.Item>
            </div>
            <div className="">
              <Form.Item
                className="w-full"
                name="packageCode"
                label={<span>Mã bao</span>}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền đầy đủ mã vận đơn",
                  },
                ]}
              >
                <Input id="packageCode" className="p-3" />
              </Form.Item>
              <Form.Item
                className="w-full"
                name="trackingCode"
                label={<span>Mã vận đơn (Tracking)</span>}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền đầy đủ mã vận đơn",
                  },
                ]}
              >
                <Input id="trackingCode" className="p-3" />
              </Form.Item>
              {!admin ? (
                <Form.Item
                  className="w-full"
                  name="weight"
                  label={<span>Cân nặng (kg)</span>}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng điền đầy đủ cân nặng",
                    },
                  ]}
                >
                  <Input id="weight" className="p-3" />
                </Form.Item>
              ) : (
                <Form.Item
                  className="w-full"
                  name="weight"
                  label={<span>Cân nặng (kg)</span>}
                >
                  <Input id="weight" className="p-3" disabled />
                </Form.Item>
              )}
            </div>
            <Form.Item
              className="w-full"
              name="description"
              label={<span>Thông tin đơn hàng</span>}
            >
              <TextArea
                id="description"
                className="p-3"
                rows={4}
                placeholder="Nhập thông tin đơn hàng..." // Tùy chọn: thêm placeholder
              />
            </Form.Item>
          </div>

          {admin ? (
            <div className="w-full md:w-[48%] bg-white rounded-3xl hover:shadow-md cursor-text shadow-xl py-6 px-12 space-y-8  ">
              <div className="flex flex-col items-center justify-center">
                <CircleUser size={80} strokeWidth={1} />
                <p className="font-semibold text-2xl">
                  {customer?.fullName ? customer?.fullName : "Trống"}
                </p>
              </div>
              <div className="flex justify-between items-center text-[16px] space-y-4">
                <p>Mã khách hàng:</p>
                <p className="font-semibold text-lg">
                  {customer?.customerCode ? customer?.customerCode : "Trống"}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full md:w-[48%] bg-white rounded-3xl  shadow-xl  space-y-4 p-6">
              <div className="text-[16px] space-y-1 py-4 px-6 ">
                <h3 className="text-gray-600 text-lg mb-4 border-b-2 pb-2">
                  Thông tin vận chuyển
                </h3>
                <div className="flex justify-between items-center">
                  <p>Họ và tên:</p>
                  <p className="font-semibold text-lg">
                    {customer?.fullName ? customer?.fullName : "Trống"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Mã khách hàng:</p>
                  <p className="font-semibold text-lg">
                    {customer?.customerCode ? customer?.customerCode : "Trống"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Số điện thoại:</p>
                  <p className="font-semibold text-lg">
                    {customer?.phone ? customer?.phone : "Trống"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Email:</p>
                  <p className="font-semibold text-lg">
                    {customer?.email ? customer?.email : "Trống"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Địa chỉ:</p>
                  <p className="font-semibold text-lg">
                    {customer?.address ? customer?.address : "Trống"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Số lượng kiện hàng đang có:</p>
                  <p className="font-semibold text-lg">
                    {customer?.parcels && customer?.parcels.length
                      ? customer?.parcels.length
                      : "Trống"}
                  </p>
                </div>
              </div>
              <div className="text-[16px] space-y-1 py-4 px-6 ">
                <h3 className="text-gray-600 text-lg mb-4 border-b-2 pb-2">
                  Thông tin vận chuyển
                </h3>
                {statusHistory.length > 0 ? (
                  <Timeline
                    items={statusHistory.map((history: any, index: number) => ({
                      key: index, // Thêm key để tránh cảnh báo React
                      color: statusColors[history.status],
                      children: (
                        <>
                          <p className="font-semibold ">
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
          )}
        </div>
      </Form>
    </div>
  );
};

export default DetailParcel;
