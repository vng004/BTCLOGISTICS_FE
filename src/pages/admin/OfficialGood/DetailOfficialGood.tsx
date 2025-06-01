import { Form, Image, Input, message, Modal, Select, Timeline } from "antd";
import { FilePenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { getTitleTab } from "../../../constants/client";
import { displayErrorMessage, formatDateDay } from "../../../constants/util";
import { TOfficialGood } from "../../../interfaces/OfficialGood";
import { LoadingOutlined } from "@ant-design/icons";
import {
  useGetOfficialGoodByIdQuery,
  useUpdateOfficialGoodMutation,
} from "../../../redux/slices/officialGoodApiSlice";

const { Option } = Select;
const { TextArea } = Input;

const DetailOfficialGood = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [status, SetStatus] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>(
    0
  ); // Sửa type của status
  const { data } = useGetOfficialGoodByIdQuery(id!, { skip: !id });
  const [updateOfficialGood, { isLoading: isUpdating }] =
    useUpdateOfficialGoodMutation();
  const statusHistory = data?.statusHistory || [];

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
      SetStatus(data.status); // Cập nhật status từ dữ liệu API
    }
  }, [data, form]);

  const onFinish = async (values: Partial<TOfficialGood>) => {
    Modal.confirm({
      title: (
        <span className="text-[#F84563] font-title">
          Xác nhận cập nhật đơn hàng chính ngạch
        </span>
      ),
      content: (
        <p className="dark:text-[#b9b7c0] ">
          Bạn có chắc chắn muốn cập nhật đơn hàng chính ngạch này?
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
            message.error("Không tìm thấy id đơn hàng chính ngạch!");
            return;
          }
          await updateOfficialGood({ id, data: values }).unwrap();
          message.success("Cập nhật đơn hàng thành công");
          navigate("/admin/official-good");
        } catch (error: any) {
          displayErrorMessage(error);
        }
      },
    });
  };
  const statusMapping = [
    { value: 0, label: "Tiếp nhận đơn hàng", color: "text-gray-500" },
    {
      value: 1,
      label: "Xử lý và báo giá (gửi mail)",
      color: "text-orange-500",
    },
    { value: 2, label: "Khách đã duyệt", color: "text-blue-500" },
    { value: 3, label: "Đã duyệt và lên đơn", color: "text-cyan-500" },
    { value: 4, label: "Kho TQ nhận đơn", color: "text-purple-500" },
    { value: 5, label: "Đang vận chuyển về VN", color: "text-yellow-500" },
    { value: 6, label: "Hàng về kho VN", color: "text-teal-500" },
    { value: 7, label: "Giao hàng và thanh toán", color: "text-lime-500" },
    { value: 8, label: "Đơn hàng đã hoàn thành", color: "text-green-500" },
    { value: 9, label: "Khách đã từ chối đặt hàng", color: "text-red-500" },
  ];

  const getStatusLabel = (
    statusValue: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  ) => {
    return (
      statusMapping.find((item) => item.value === statusValue)?.label ||
      "Không xác định"
    );
  };

  const confirmStatusChange = (
    value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  ) => {
    Modal.confirm({
      title: (
        <span className="text-[#ef4d38] text-lg">
          Xác nhận thay đổi trạng thái
        </span>
      ),
      content: (
        <p className=" text-[#685f78]">
          Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng từ
          <span className="text-[#ef4d38] font-semibold text-[16px]">
            {" "}
            "{getStatusLabel(status)}"{" "}
          </span>
          thành
          <span className="text-[#ef4d38] font-semibold text-[16px]">
            {" "}
            "{getStatusLabel(value)}"{" "}
          </span>
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

  const statusLabels: { [key: number]: string } = {
    0: "Tiếp nhận đơn hàng",
    1: "Xử lý và báo giá",
    2: "Khách đã duyệt",
    3: "Đã duyệt và lên đơn",
    4: "Kho TQ nhận đơn",
    5: "Đang vận chuyển về VN",
    6: "Hàng về kho VN",
    7: "Giao hàng và thanh toán",
    8: "Đơn hàng đã hoàn thành",
    9: "Khách đã từ chối đặt hàng",
  };

  const statusColors: { [key: number]: string } = {
    0: "gray",
    1: "orange",
    2: "blue",
    3: "cyan",
    4: "purple",
    5: "yellow",
    6: "teal",
    7: "lime",
    8: "green",
    9: "red",
  };
  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>{getTitleTab(`Chi tiết đơn hàng chính ngạch`)}</title>
      </Helmet>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={isUpdating}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-2 bg-white rounded-[50px] shadow-xl p-4">
          <div className="flex items-center gap-x-6 mb-4 md:mb-0">
            <h1 className="text-2xl font-semibold">
              Chỉnh sửa đơn hàng chính ngạch
              <span className="text-lg text-gray-700 pl-2">
                ({formatDateDay(data?.createdAt)})
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-x-4 w-full md:w-auto">
            <Form.Item name="status" className="mb-0 flex-1 md:flex-none">
              <Select
                value={status}
                onChange={confirmStatusChange}
                className="h-10 min-w-[250px]"
              >
                {statusMapping.map((statusItem) => (
                  <Option
                    key={statusItem.value}
                    value={statusItem.value}
                    disabled={statusItem.value === 2}
                  >
                    <p className={`text-lg font-semibold ${statusItem.color}`}>
                      {statusItem.label}
                    </p>
                  </Option>
                ))}
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
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin khách hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin sản phẩm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="Tên sản phẩm" name="productName">
                <Input disabled className="py-[10px]" />
              </Form.Item>
              <Form.Item label="Mã HS Code" name="hsCode">
                <Input disabled className="py-[10px]" />
              </Form.Item>
            </div>
          </div>
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Hình ảnh sản phẩm
            </h2>
            <Form.Item name="productImage">
              <div className="flex flex-wrap gap-4 border rounded-md">
                {data?.productImage && data.productImage.length > 0 ? (
                  data.productImage.map((img: string, index: number) => (
                    <div key={index} className="w-32   object-cover">
                      <Image
                        src={img}
                        alt={`Product ${index}`}
                        className=" border rounded-md border-[#F84563]"
                      />
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 italic">
                    Không có hình ảnh
                  </span>
                )}
              </div>
            </Form.Item>
          </div>

          {/* Thông số sản phẩm */}
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông số sản phẩm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <Form.Item
                  label="Chất liệu"
                  name={["productSpecs", "material"]}
                >
                  <Input disabled className="py-[10px]" />
                </Form.Item>
                <Form.Item
                  label="Kích thước"
                  name={["productSpecs", "dimensions"]}
                >
                  <Input disabled className="py-[10px]" />
                </Form.Item>
              </div>
              <Form.Item
                label="Thông số kỹ thuật"
                name={["productSpecs", "technicalSpecs"]}
              >
                <TextArea disabled rows={6} />
              </Form.Item>
            </div>
          </div>

          {/* Quy cách đóng kiện hàng */}
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quy cách đóng kiện hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Số lượng kiện hàng"
                name={["packagingDetails", "packageCount"]}
              >
                <Input disabled className="py-[10px]" />
              </Form.Item>
              <Form.Item
                label="Số sản phẩm mỗi kiện"
                name={["packagingDetails", "itemsPerPackage"]}
              >
                <Input disabled className="py-[10px]" />
              </Form.Item>
              <Form.Item
                label="Kích thước kiện hàng"
                name={["packagingDetails", "packageDimensions"]}
              >
                <Input disabled className="py-[10px]" />
              </Form.Item>
              <Form.Item
                label="Trọng lượng kiện hàng"
                name={["packagingDetails", "packageWeight"]}
              >
                <Input disabled className="py-[10px]" />
              </Form.Item>
            </div>
          </div>

          {/* Chi phí và thuế */}
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Chi phí và thuế
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                label="Phí ủy thác nhập khẩu"
                name="importEntrustmentFee"
              >
                <Input className="py-[10px]" type="number" />
              </Form.Item>
              <Form.Item label="Phí pickup" name="pickupFee">
                <Input className="py-[10px]" type="number" />
              </Form.Item>
              <Form.Item
                label="Phí đóng gỗ, gia cố, kiểm đếm"
                name="reinforcementFee"
              >
                <Input className="py-[10px]" type="number" />
              </Form.Item>
              <Form.Item
                label="Cước vận chuyển quốc tế"
                name="internationalShippingFee"
              >
                <Input className="py-[10px]" type="number" />
              </Form.Item>
              <Form.Item label="Thuế VAT" name="vatTax">
                <Input className="py-[10px]" type="number" />
              </Form.Item>
              <Form.Item label="Thuế nhập khẩu" name="importTax">
                <Input className="py-[10px]" type="number" />
              </Form.Item>
              <Form.Item
                label="Thuế tiêu thụ đặc biệt"
                name="specialConsumptionTax"
              >
                <Input className="py-[10px]" type="number" />
              </Form.Item>
              <Form.Item label="Thuế bảo vệ môi trường" name="environmentalTax">
                <Input className="py-[10px]" type="number" />
              </Form.Item>
              <Form.Item
                label="Lệ phí hải quan"
                name={["customsAndOtherFees", "customsFee"]}
              >
                <Input className="py-[10px]" type="number" />
              </Form.Item>
              <Form.Item
                label="Phí kiểm tra chuyên ngành"
                name={["customsAndOtherFees", "inspectionFee"]}
              >
                <Input className="py-[10px]" type="number" />
              </Form.Item>
              <Form.Item
                label="Phí lưu kho, bốc dỡ 2 đầu"
                name="storageAndHandlingFee"
              >
                <Input className="py-[10px]" type="number" />
              </Form.Item>
              <Form.Item
                label="Phí vận chuyển nội địa VN"
                name="domesticShippingFee"
              >
                <Input className="py-[10px]" type="number" />
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

export default DetailOfficialGood;
