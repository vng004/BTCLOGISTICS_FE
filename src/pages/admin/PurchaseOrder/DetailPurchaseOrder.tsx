import { Form, Input, message, Modal, Select, Timeline } from "antd";
import { FilePenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { getTitleTab } from "../../../constants/client";
import { displayErrorMessage, formatDateDay } from "../../../constants/util";
import { PurchaseOrder } from "../../../interfaces/PurchaseOrder";
import {
  useGetPurchaseOrderByIdQuery,
  useUpdatePurchaseOrderMutation,
} from "../../../redux/slices/purchaseOrderApiSlice";
import { LoadingOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const DetailPurchaseOrder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [status, SetStatus] = useState<0 | 1 | 2 | 3 | 4>(0);
  const { data } = useGetPurchaseOrderByIdQuery(id!, {
    skip: !id,
  });
  const [updatePurchaseOrder, { isLoading: isUpdating }] =
    useUpdatePurchaseOrderMutation();

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  const onFinish = async (values: Partial<PurchaseOrder>) => {
    if (!id) return;
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
          await updatePurchaseOrder({
            id,
            data: values,
          }).unwrap();
          message.success("Cập nhật đơn hàng thành công");
          navigate("/admin/purchase-order");
        } catch (error: any) {
          displayErrorMessage(error);
        }
      },
    });
  };

  const confirmStatusChange = (value: 0 | 1 | 2 | 3 | 4) => {
    Modal.confirm({
      title: (
        <span className="text-[#ef4d38]">Xác nhận thay đổi trạng thái</span>
      ),
      content: (
        <p className="dark:text-[#b9b7c0] text-[#685f78]">
          Bạn có chắc chắn muốn{" "}
          <span className="text-[#ef4d38] font-semibold text-[16px]">
            thay đổi trạng thái
          </span>{" "}
          đơn hàng này không?
        </p>
      ),
      okText: "Xác nhận",
      okType: "danger",
      okButtonProps: {
        style: {
          backgroundColor: "#F84563",
          borderColor: "#F84563",
          color: "#fff",
        },
      },
      cancelButtonProps: {
        style: {
          backgroundColor: "#fff",
          color: "#F84563",
          borderColor: "#F84563",
        },
      },
      cancelText: "Hủy",
      centered: true,
      maskClosable: false,
      icon: null,
      width: 600,
      onOk: () => {
        form.setFieldsValue({ status: value });
        SetStatus(value);
      },
    });
  };
  const statusHistory = data?.statusHistory || [];

  const statusLabels: { [key: number]: string } = {
    0: " Chưa xác nhận",
    1: "Đã xác nhận",
    2: "Đã đặt cọc",
    3: "Tất toán đơn hàng",
    4: "Hủy đơn",
  };

  const statusColors: { [key: number]: string } = {
    0: "orange",
    1: "blue",
    2: "purple",
    3: "green",
    4: "red",
  };
  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>{getTitleTab(`Chi tiết đơn hàng`)}</title>
      </Helmet>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={isUpdating}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 bg-white rounded-[50px] shadow-xl p-4">
          <div className="flex items-center gap-x-6 mb-4 md:mb-0">
            <h1 className="text-2xl font-semibold">
              Chỉnh sửa đơn hàng: <span>{data?.orderCode}</span>
              <span className="text-lg text-gray-700">
                ({formatDateDay(data?.createdAt)})
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-x-4 w-full md:w-auto">
            <Form.Item name="status" className="mb-0 flex-1 md:flex-none">
              <Select
                value={status}
                onChange={confirmStatusChange}
                className="h-10 min-w-[190px] "
              >
                <Option value={0}>
                  <p className="text-orange-500 text-lg font-semibold">
                    Chưa xác nhận
                  </p>
                </Option>
                <Option value={1}>
                  <p className="text-blue-500 text-lg font-semibold">
                    Đã xác nhận
                  </p>
                </Option>
                <Option value={2}>
                  <p className="text-purple-500 text-lg font-semibold">
                    Đã đặt cọc
                  </p>
                </Option>
                <Option value={3}>
                  <p className="text-green-500 text-lg font-semibold">
                    Tất toán đơn hàng
                  </p>
                </Option>
                <Option value={4}>
                  <p className="text-red-500 text-lg font-semibold">Hủy đơn</p>
                </Option>
              </Select>
            </Form.Item>
            <button
              type="submit"
              disabled={isUpdating}
              className="border-2 w-full md:w-[140px] flex justify-center items-center border-orange-500 py-2 px-5 rounded-[50px] hover:bg-[#F84563] text-[#F84563] bg-white hover:border-orange-500 hover:text-white gap-3 cursor-pointer hover:shadow-md disabled:opacity-50"
            >
              {isUpdating ? <LoadingOutlined /> : <FilePenLine size={18} />}
              Cập nhật
            </button>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-xl">
          {/* Thông tin khách hàng */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin khách hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item label="Mã khách hàng" name="customerCode">
                <Input disabled className="py-[10px]" />
              </Form.Item>
              <Form.Item label="Tên khách hàng" name="fullName">
                <Input disabled className="py-[10px]" />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phone">
                <Input disabled className="py-[10px]" />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input disabled className="py-[10px]" />
              </Form.Item>
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin sản phẩm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item label="Tên sản phẩm" name="productName">
                <Input disabled className="py-[10px]" />
              </Form.Item>
              <Form.Item label="Link sản phẩm" name="productLink">
                <input
                  className="border rounded-md py-[10px] px-3 w-full hover:border-orange-500 text-gray-700 outline-none"
                  type="text"
                  name="productLink"
                  disabled
                />
              </Form.Item>

              <div className="">
                <Form.Item label="Số lượng" name="quantity">
                  <Input disabled className="py-[10px]" />
                </Form.Item>
                <Form.Item label="Giá trị thực" name="actualValue">
                  <Input disabled className="py-[10px]" />
                </Form.Item>
              </div>
              <Form.Item label="Thông số hàng" name="orderDetails">
                <TextArea rows={6} disabled />
              </Form.Item>
            </div>
          </div>

          {/* Thông tin vận chuyển và chi phí */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin vận chuyển và chi phí
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item
                label="Mã vận đơn"
                name="trackingCode"
                rules={[
                  { required: true, message: "Vui lòng nhập mã vận đơn" },
                ]}
              >
                <Input placeholder="Nhập mã vận đơn" className="py-[10px]" />
              </Form.Item>
              <Form.Item
                label="Mã mua hàng"
                name="purchaseCode"
                rules={[
                  { required: true, message: "Vui lòng nhập mã mua hàng" },
                ]}
              >
                <Input placeholder="Nhập mã mua hàng" className="py-[10px]" />
              </Form.Item>
              <Form.Item label="Phí nội địa" name="domesticFee">
                <Input
                  placeholder="Nhập phí nội địa (tùy chọn)"
                  className="py-[10px]"
                />
              </Form.Item>
              <Form.Item
                label="Tổng tiền"
                name="totalAmount"
                rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}
              >
                <Input placeholder="Nhập tổng tiền" className="py-[10px]" />
              </Form.Item>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Chi tiết đơn hàng
            </h2>
            <div>
              <Form.Item label="Mô tả" name="description">
                <TextArea rows={6} placeholder="Nhập mô tả (tùy chọn)" />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
      <div className="mt-6 bg-white rounded-3xl shadow-xl p-6">
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
  );
};

export default DetailPurchaseOrder;
