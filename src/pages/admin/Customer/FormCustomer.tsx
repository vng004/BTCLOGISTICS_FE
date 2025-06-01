import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Form,
  Input,
  message,
  Space,
  Table,
  Tag
} from "antd";
import { Eye, FilePenLine, PackagePlus } from "lucide-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { getTitleTab } from "../../../constants/client";
import { displayErrorMessage, formatDateDay } from "../../../constants/util";
import { Customer } from "../../../interfaces/Customer";
import {
  useAddCustomerMutation,
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from "../../../redux/slices/customerApiSlice";

const FormCustomer = () => {
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading: isFetching } = useGetCustomerByIdQuery(id, {
    skip: !id,
  });
  const [addCustomer, { isLoading: isAdding }] = useAddCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  const statusLabels: { [key: number]: string } = {
    0: "Lưu kho TQ",
    1: "Luân chuyển về VN",
    2: "Lưu kho VN",
    3: "Đã giao hàng",
  };

  const statusColors: { [key: number]: string } = {
    0: "blue",
    1: "yellow",
    2: "cyan",
    3: "green",
  };

  useEffect(() => {
    if (id && data) {
      form.setFieldsValue({
        customerCode: data.customerCode,
        fullName: data.fullName,
        address: data.address,
        phone: data.phone,
        email: data.email,
      });
    } else if (!id) {
      form.resetFields();
    }
  }, [id, data, form]);

  const onFinish = async (values: Customer) => {
    try {
      if (id) {
        await updateCustomer({ id: id, data: values }).unwrap();
        message.success("Cập nhật khách hàng thành công!");
      } else {
        await addCustomer(values).unwrap();
        form.resetFields();
        message.success("Thêm mới khách hàng thành công!");
      }
      navigate("/admin/customer");
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  const renderStatusHistoryMenu = (
    statusHistory?: { status: number; timestamp: string }[]
  ) => {
    if (!Array.isArray(statusHistory) || statusHistory.length === 0) {
      return [
        {
          key: "no-history",
          label: "Không có lịch sử trạng thái",
        },
      ];
    }

    return statusHistory.map((history, index) => ({
      key: String(index),
      label: (
        <Space>
          <Tag color={statusColors[history.status]}>
            {statusLabels[history.status]}
          </Tag>
          <span>{formatDateDay(history.timestamp)}</span>
        </Space>
      ),
    }));
  };

  const columns = [
    {
      title: "Mã vận đơn",
      dataIndex: "trackingCode",
      key: "trackingCode",
      width: 150,
    },

    {
      title: "Cân nặng",
      dataIndex: "weight",
      key: "weight",
      width: 100,
      render: (weight: string) => `${weight}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "shipmentStatus",
      key: "shipmentStatus",
      width: 150,
      render: (status: number) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Lịch sử trạng thái",
      key: "statusHistory",
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: renderStatusHistoryMenu(record.statusHistory),
          }}
          trigger={["click"]}
        >
          <Button>
            Xem <Eye />
          </Button>
        </Dropdown>
      ),
      width: 150,
    },
  ];

  return (
    <div className="">
      <Helmet>
        <title>{getTitleTab(`Quản lí khách hàng`)}</title>
      </Helmet>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          customerCode: "",
          fullName: "",
          address: "",
          phone: "",
          email: "",
        }}
      >
        <div className="flex justify-between items-center flex-col md:flex-row lg:flex-row mb-6 bg-white rounded-[50px] shadow-xl p-4">
          <div className="flex items-center gap-x-6">
            <p className="text-xl">Quản lí khách hàng</p>
          </div>
          <button
            type="submit"
            disabled={isAdding || isUpdating || isFetching}
            className="border-2 mt-4 md:mt-0 lg:mt-0 w-[160px] flex justify-center items-center border-orange-500 py-2 px-5 rounded-[50px] hover:bg-[#F84563] text-[#F84563] bg-white hover:border-orange-500 hover:text-white gap-3 cursor-pointer hover:shadow-md text-lg"
          >
            {id ? (
              <div className="flex items-center gap-x-2">
                {isUpdating ? <LoadingOutlined /> : <FilePenLine size={20} />}
                <p>Cập nhật</p>
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                {isAdding ? <LoadingOutlined /> : <PackagePlus size={20} />}
                <p>Thêm mới</p>
              </div>
            )}
          </button>
        </div>
        <div className="bg-white rounded-3xl hover:shadow-md shadow-xl p-10 mb-6">
          <div className="flex justify-between items-center">
            <Form.Item
              name="customerCode"
              label="Mã khách hàng"
              className="w-[32%]"
              rules={[
                { required: true, message: "Vui lòng nhập mã khách hàng!" },
                {
                  max: 50,
                  message: "Mã khách hàng không được dài quá 50 ký tự!",
                },
              ]}
            >
              <Input
                className="p-3"
                placeholder="Nhập mã khách hàng (ví dụ: CUST001)"
              />
            </Form.Item>

            <Form.Item
              name="fullName"
              label="Họ và tên"
              className="w-[32%]"
              rules={[
                { required: true, message: "Vui lòng nhập họ và tên!" },
                {
                  max: 100,
                  message: "Họ và tên không được dài quá 100 ký tự!",
                },
              ]}
            >
              <Input className="p-3" placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item
              name="phone"
              className="w-[32%]"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]{10,15}$/,
                  message:
                    "Số điện thoại phải là số và có độ dài từ 10 đến 15 ký tự!",
                },
              ]}
            >
              <Input className="p-3" placeholder="Nhập số điện thoại" />
            </Form.Item>
          </div>
          <div className="flex justify-between items-center">
            <Form.Item
              name="email"
              label="Email"
              className="w-[32%]"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input className="p-3" placeholder="Nhập email" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              className="w-[66%]"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ!" },
                { max: 200, message: "Địa chỉ không được dài quá 200 ký tự!" },
              ]}
            >
              <Input className="p-3" placeholder="Nhập địa chỉ" />
            </Form.Item>
          </div>
        </div>
        {data?.parcels && (
          <div className="bg-white rounded-3xl hover:shadow-md shadow-xl p-10">
            <p className="text-lg border-b-2 pb-2">
              Danh sách kiện hàng <b> ({data?.parcels?.length} đơn)</b>
            </p>
            <Table
              columns={columns}
              dataSource={data?.parcels || []}
              rowKey="_id"
            />
          </div>
        )}
      </Form>
    </div>
  );
};

export default FormCustomer;
