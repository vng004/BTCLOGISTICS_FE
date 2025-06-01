import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Table,
  Tabs,
  Tag,
  Timeline,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  ArrowBigDown,
  ArrowBigRight,
  CalendarClock,
  CircleCheckBig,
  Eye,
  HandCoins,
  PackagePlus,
  PackageSearch,
  Wallet
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  orderCustomer,
  shippingProcess,
  video,
} from "../../../constants/client";
import {
  displayErrorMessage,
  formatDateDay,
  formatPrice,
} from "../../../constants/util";
import { PurchaseOrder } from "../../../interfaces/PurchaseOrder";
import { useCheckCustomerCodeQuery } from "../../../redux/slices/customerApiSlice";
import {
  useAddPurchaseOrderMutation,
  useGetPurchaseOrderByOrderCodeMutation,
  useGetPurchaseOrdersQuery,
  useUpdatePurchaseOrderMutation,
} from "../../../redux/slices/purchaseOrderApiSlice";

const CreatePurchaseOrder = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [customerCode, setCustomerCode] = useState("");
  const [searchCustomerCode, setSearchCustomerCode] = useState("");
  const [isCustomerValid, setIsCustomerValid] = useState(false);
  const [isSearchCustomerValid, setIsSearchCustomerValid] = useState(false);
  const [orderCode, setOrderCode] = useState<string>("");
  const [isModalSuccess, setIsModalSuccess] = useState(false);
  const [isModalDetail, setIsModalDetail] = useState(false);
  const [addPurchaseOrder, { isLoading: isCreating }] =
    useAddPurchaseOrderMutation();
  const { data: customer, error: checkError } = useCheckCustomerCodeQuery(
    { customerCode },
    { skip: !customerCode }
  );
  const { data: searchCustomer, error: searchCheckError } =
    useCheckCustomerCodeQuery(
      { customerCode: searchCustomerCode },
      { skip: !searchCustomerCode }
    );
  const { data: purchaseOrders } = useGetPurchaseOrdersQuery({
    keyword: searchCustomerCode,
    page: 1,
    per_page: 9,
  });
  const [getPurchaseOrder, { data: orderDetail }] =
    useGetPurchaseOrderByOrderCodeMutation();
  const [updatePurchareOrder, { isLoading: isUpdating }] =
    useUpdatePurchaseOrderMutation();
  useEffect(() => {
    if (orderCode) {
      getPurchaseOrder({ orderCode });
    }
  }, [orderCode, getPurchaseOrder]);

  const checkCustomerCode = async (type: "create" | "search") => {
    try {
      const currentError = type === "create" ? checkError : searchCheckError;
      const currentCustomer = type === "create" ? customer : searchCustomer;

      if (currentError || !currentCustomer) {
        message.error("Mã khách hàng không tồn tại");
        return;
      }
      if (type === "create") {
        setIsCustomerValid(true);
        form.setFieldsValue({ customerCode: currentCustomer.customerCode });
      } else {
        setIsSearchCustomerValid(true);
      }
      message.success("Mã khách hàng hợp lệ");
    } catch (err) {
      message.error("Vui lòng nhập mã khách hàng");
    }
  };
  const closeModalSuccess = () => {
    setIsModalSuccess(false);
    form.resetFields();
    setIsCustomerValid(false);
  };
  const closeModalDetail = () => {
    setIsModalDetail(false);
    setOrderCode("");
  };

  const onFinish = async (values: {
    customerCode: string;
    fullName: string;
    phone: string;
    productName: string;
    productLink: string;
    orderDetails?: string;
    quantity?: number;
    email?: string;
    actualValue: string;
  }) => {
    try {
      await addPurchaseOrder({
        ...values,
        customerCode: customerCode,
      }).unwrap();
      setIsModalSuccess(true);
    } catch (err) {
      displayErrorMessage(err);
    }
  };
  const handleCancelStatusChange = (id: string) => {
    Modal.confirm({
      title: <span className="text-[#ef4d38]">Xác nhận từ chối đặt hàng </span>,
      content: (
        <p className="dark:text-[#b9b7c0] text-[#685f78]">
          Bạn có chắc chắn muốn từ chối đặt đơn hàng sau khi chúng tôi đã báo
          giá
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
      onOk: async () => {
        await updatePurchareOrder({ id, data: { status: 4 } });
        setIsModalDetail(false);
      },
    });
  };

  const onReset = () => {
    if (customer?.customerCode) {
      form.resetFields();

      form.setFieldsValue({ customerCode: customer?.customerCode });
    }
  };

  const handleModaleDetail = (code: string) => {
    setIsModalDetail(true);
    setOrderCode(code);
  };
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      align: "center" as const,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      align: "center" as const,
    },

    {
      title: "Link sản phẩm",
      dataIndex: "productLink",
      key: "productLink",
      render: (text: string) => (
        <Link to={text} className="hover:text-[#F84563] hover:underline">
          Xem link
        </Link>
      ),
      align: "center" as const,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
    },
    {
      title: "Giá trị thực",
      dataIndex: "actualValue",
      key: "actualValue",
      render: (actualValue: string) => <div> {formatPrice(actualValue)} </div>,
      align: "center" as const,
    },

    {
      title: "Thời gian tạo đơn",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => <div> {formatDateDay(createdAt)} </div>,
      align: "center" as const,
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        return (
          <Tag
            className="text-sm font-semibold py-2 px-2 min-w-[130px] text-center ml-2"
            color={
              status === 0
                ? "orange"
                : status === 1
                ? "blue"
                : status === 2
                ? "purple"
                : status === 3
                ? "green"
                : "red"
            }
          >
            {status === 0
              ? "Chưa xác nhận"
              : status === 1
              ? "Đã xác nhận"
              : status === 2
              ? "Đã đặt cọc"
              : status === 3
              ? "Tất toán đơn hàng"
              : "Hủy đơn"}
          </Tag>
        );
      },
      align: "center" as const,
      width: 150,
    },
    {
      title: "Chi tiết",
      render: (item: PurchaseOrder) => (
        <div className="flex items-center justify-center">
          <Button onClick={() => handleModaleDetail(item.orderCode)}>
            Xem <Eye />
          </Button>
        </div>
      ),
      width: 200,
      align: "center" as const,
    },
  ];

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
    <div className="max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px] mx-auto pt-46 md:pt-[155px] space-y-10 p-3">
      <div>
        <p className="text-center text-[#F84563] mb-2 md:mb-6 font-semibold text-2xl">
          ĐƠN HÀNG ĐẶT HỘ
        </p>
        <div className="border border-orange-500 rounded-xl p-3 md:p-6">
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "Thêm mới đơn hàng",
                children: (
                  <Card>
                    {!isCustomerValid ? (
                      <Form layout="vertical">
                        <div className="flex justify-center">
                          <img
                            src={orderCustomer}
                            alt=""
                            className="w-[500px]"
                          />
                        </div>
                        <div className="flex justify-center">
                          <Form.Item name="customerCode" className="w-[600px]">
                            <Input
                              className="py-3 md:py-4 rounded-l-full border"
                              placeholder="Nhập mã khách hàng"
                              onChange={(e) => setCustomerCode(e.target.value)}
                            />
                          </Form.Item>
                          <Form.Item>
                            <button
                              type="button"
                              onClick={() => checkCustomerCode("create")}
                              className="bg-[#F84563] text-white px-6 py-3 md:py-[13px]  w-[125px] md:w-[160px] rounded-r-full border hover:bg-[#ff7f94] border-[#ff7f94] md:text-lg"
                              disabled={!customerCode.trim()}
                            >
                              Kiểm tra
                            </button>
                          </Form.Item>
                        </div>
                      </Form>
                    ) : (
                      <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        className="p-6"
                      >
                        {/* Thông tin khách hàng */}
                        <div className="mb-4">
                          <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Thông tin khách hàng
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                            <Form.Item
                              label="Mã khách hàng"
                              name="customerCode"
                            >
                              <Input
                                disabled
                                className="py-3 font-semibold"
                                value={customerCode}
                              />
                            </Form.Item>
                            <Form.Item
                              label="Tên khách hàng"
                              name="fullName"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập tên khách hàng",
                                },
                              ]}
                            >
                              <Input
                                className="py-3"
                                placeholder="Nhập tên khách hàng"
                              />
                            </Form.Item>
                            <Form.Item
                              label="Số điện thoại"
                              name="phone"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập số điện thoại",
                                },
                              ]}
                            >
                              <Input
                                className="py-3"
                                placeholder="Nhập số điện thoại"
                              />
                            </Form.Item>
                            <Form.Item
                              label="Email"
                              name="email"
                              rules={[
                                {
                                  type: "email",
                                  message: "Email không hợp lệ",
                                },
                              ]}
                            >
                              <Input
                                className="py-3"
                                placeholder="Nhập email (tùy chọn)"
                              />
                            </Form.Item>
                          </div>
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="mb-4">
                          <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Thông tin sản phẩm
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                            <Form.Item
                              label="Tên sản phẩm"
                              name="productName"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập tên sản phẩm",
                                },
                              ]}
                            >
                              <Input
                                className="py-3"
                                placeholder="Nhập tên sản phẩm"
                              />
                            </Form.Item>
                            <Form.Item
                              label="Link sản phẩm"
                              name="productLink"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập link sản phẩm",
                                },
                              ]}
                            >
                              <Input
                                className="py-3"
                                placeholder="Nhập link sản phẩm"
                              />
                            </Form.Item>
                            <Form.Item
                              label="Số lượng"
                              name="quantity"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập số lượng",
                                },
                              ]}
                            >
                              <Input
                                className="py-3"
                                min={1}
                                placeholder="Nhập số lượng (tùy chọn)"
                              />
                            </Form.Item>
                            <Form.Item
                              label="Giá trị thực"
                              name="actualValue"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập giá trị thực",
                                },
                              ]}
                            >
                              <Input
                                className="py-3"
                                placeholder="Nhập giá trị thực"
                              />
                            </Form.Item>
                          </div>
                          <div className="w-full">
                            <Form.Item
                              label="Thông số hàng"
                              name="orderDetails"
                            >
                              <TextArea
                                className="py-3 w-full"
                                rows={6}
                                placeholder="Nhập thông số hàng (tùy chọn)"
                              />
                            </Form.Item>
                          </div>
                        </div>

                        <Form.Item>
                          <div className="flex gap-x-4 mt-6">
                            <button
                              onClick={onReset}
                              type="reset"
                              className="px-6 py-2 w-[160px] rounded-full text-[15px] md:text-lg border-2 border-orange-500 text-[#F84563] hover:border-[#ff7f94] hover:text-[#ff7f94]"
                            >
                              Đặt lại
                            </button>
                            <button
                              type="submit"
                              className="bg-[#F84563] text-white px-6 py-2 w-[160px] rounded-full border-2 hover:bg-[#ff7f94] border-[#ff7f94] text-[15px] md:text-lg"
                            >
                              Xác nhận {isCreating && <LoadingOutlined />}
                            </button>
                          </div>
                        </Form.Item>
                      </Form>
                    )}
                  </Card>
                ),
              },
              {
                key: "2",
                label: "Tra cứu đơn hàng đã tạo",
                children: (
                  <Card>
                    {!isSearchCustomerValid ? (
                      <Form form={searchForm} layout="vertical">
                        <div className="flex justify-center">
                          <img
                            src={orderCustomer}
                            alt=""
                            className="w-[500px]"
                          />
                        </div>
                        <div className="flex justify-center">
                          <Form.Item
                            name="searchCustomerCode"
                            className="w-[600px]"
                          >
                            <Input
                              className="py-3 md:py-4 rounded-l-full border"
                              placeholder="Nhập mã khách hàng để tra cứu"
                              onChange={(e) =>
                                setSearchCustomerCode(e.target.value)
                              }
                            />
                          </Form.Item>
                          <Form.Item>
                            <button
                              type="button"
                              onClick={() => checkCustomerCode("search")}
                              className="bg-[#F84563] text-white px-7 py-3 md:py-[13px]  w-[110px] md:w-[160px] rounded-r-full border hover:bg-[#ff7f94] border-[#ff7f94] md:text-lg"
                              disabled={!searchCustomerCode.trim()}
                            >
                              Tra cứu
                            </button>
                          </Form.Item>
                        </div>
                      </Form>
                    ) : (
                      <div>
                        <div className="mb-4">
                          <button
                            onClick={() => {
                              setIsSearchCustomerValid(false);
                              setSearchCustomerCode("");
                              searchForm.resetFields();
                            }}
                            className="bg-[#F84563] text-white hover:bg-[#ff7f94] py-2 px-3 rounded-[50px]"
                          >
                            Tra cứu khách hàng khác
                          </button>
                        </div>
                        {purchaseOrders?.data?.length > 0 ? (
                          <Table
                            columns={columns}
                            dataSource={purchaseOrders.data}
                            rowKey="id"
                            pagination={false}
                            scroll={{ x: 800 }}
                          />
                        ) : (
                          <div className="text-center text-gray-500">
                            <p>Không có đơn hàng nào cho mã khách hàng này.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ),
              },
            ]}
          />
          {isModalSuccess && (
            <Modal
              open={isModalSuccess}
              footer={null}
              closeIcon={false}
              className=" w-[550px] h-[400px] p-6 rounded-lg "
            >
              <div className="flex flex-col justify-center items-center pt-10">
                <CircleCheckBig
                  size={100}
                  strokeWidth={1}
                  className="text-green-400"
                />

                <div className="text-center mt-10">
                  <p className="text-gray-800 font-semibold text-xl">
                    Thêm mới đơn hàng muốn đặt hộ thành công!
                  </p>
                  <p>Cảm ơn bạn đã tin tưởng!</p>
                </div>

                <button
                  className="border-2 border-green-500 text-green-500  md:px-6 py-3 w-[100px] hover:scale-110 transition-transform duration-200 font-semibold rounded-full text-lg mt-10"
                  onClick={closeModalSuccess}
                  type="reset"
                >
                  Đóng
                </button>
              </div>
            </Modal>
          )}
          <Modal
            open={isModalDetail}
            footer={null}
            width={800}
            closeIcon={false}
          >
            {orderDetail && (
              <div className="p-4 md:p-6">
                <p className="text-[17px] md:text-xl bg-[#F84563] text-white px-4 py-2 rounded-md mb-6">
                  Chi tiết đơn hàng: {orderDetail.orderCode}
                </p>

                <div className="grid grid-cols-1 gap-6">
                  {/* Thông tin khách hàng */}
                  <div className="border-2 rounded-md ">
                    <h2 className="font-semibold  p-4 border-b border-[#F84563]">
                      <p className="text-lg text-[#F84563]">
                        Thông tin khách hàng
                      </p>
                    </h2>
                    <div className="space-y-3 p-4 ">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Họ và tên:
                        </span>
                        <span>{orderDetail.fullName || "Trống"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Mã khách hàng:
                        </span>
                        <span>{orderDetail.customerCode || "Trống"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Số điện thoại:
                        </span>
                        <span>{orderDetail.phone || "Trống"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Email:
                        </span>
                        <span>{orderDetail.email || "Trống"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 rounded-md ">
                    <h2 className="font-semibold flex flex-wrap items-center justify-between p-4 border-b border-[#F84563]">
                      <p className="text-lg text-[#F84563]">
                        Thông tin đơn hàng
                      </p>
                      <div className="space-x-2">
                        <span className="font-medium text-gray-600">
                          Thời gian tạo:
                        </span>
                        <span>{formatDateDay(orderDetail.createdAt)}</span>
                      </div>
                    </h2>
                    <div className="space-y-3 p-4">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Tên sản phẩm:
                        </span>
                        <span>{orderDetail.productName || "Trống"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Link sản phẩm:
                        </span>
                        <a
                          href={orderDetail.productLink}
                          className="hover:underline hover:text-[#F84563] truncate max-w-[300px]"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {orderDetail.productLink || "Trống"}
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Số lượng:
                        </span>
                        <span>{orderDetail.quantity || "Trống"}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Thông số hàng:
                        </span>
                        <span>{orderDetail.orderDetails || "Trống"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Giá trị thực:
                        </span>
                        <span>
                          {formatPrice(orderDetail.actualValue) || "0đ"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Phí nội địa:
                        </span>
                        <span>
                          {orderDetail.domesticFee
                            ? `${orderDetail.domesticFee}đ`
                            : "0đ"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Tổng tiền:
                        </span>
                        <span>
                          {orderDetail.totalAmount
                            ? `${orderDetail.totalAmount}đ`
                            : "0đ"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">
                          Trạng thái:
                        </span>
                        <Tag
                          className="text-sm font-semibold py-2 px-2  text-center"
                          color={
                            orderDetail.status === 0
                              ? "orange"
                              : orderDetail.status === 1
                              ? "blue"
                              : orderDetail.status === 2
                              ? "purple"
                              : orderDetail.status === 3
                              ? "green"
                              : "red"
                          }
                        >
                          {orderDetail.status === 0
                            ? "Chưa xác nhận"
                            : orderDetail.status === 1
                            ? "Đã xác nhận"
                            : orderDetail.status === 2
                            ? "Đã đặt cọc"
                            : orderDetail.status === 3
                            ? "Tất toán đơn hàng"
                            : "Đơn hàng đã bị hủy"}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 border rounded-md">
                  <h2 className="font-semibold  p-4 border-b border-[#F84563]">
                    <p className="text-lg text-[#F84563]">
                      Thông tin vận chuyển
                    </p>
                  </h2>
                  <div className="p-4">
                    {orderDetail.statusHistory.length > 0 ? (
                      <Timeline
                        items={orderDetail.statusHistory.map(
                          (history: any, index: number) => ({
                            key: index, // Thêm key để tránh cảnh báo React
                            color: statusColors[history.status],
                            children: (
                              <>
                                <p className="font-semibold">
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
                          })
                        )}
                      />
                    ) : (
                      <p className="text-gray-500">
                        Chưa có thông tin vận chuyển.
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-center md:justify-end mt-6">
                  <button
                    onClick={closeModalDetail}
                    className="border-2 border-orange-500 bg-[#F84563] text-white px-10 py-2 rounded-full hover:bg-[#ff7f94] hover:border-[#ff7f94] md:text-lg"
                  >
                    Đóng
                  </button>
                  {orderDetail?.status == 0 && (
                    <button
                      onClick={() => handleCancelStatusChange(orderDetail._id)}
                      className="border-2 border-orange-500  text-[#F84563] px-10 py-2 rounded-full hover:bg-[#F84563] hover:border-orange-500 md:text-lg hover:text-white"
                    >
                      {isUpdating ? <LoadingOutlined /> : "Từ chối đặt hàng"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
      <div>
        <div className="mt-10 rounded-md flex flex-col items-center space-y-6">
          <p className="text-[#F84563] font-semibold text-2xl border-b pb-1 border-orange-500">
            Quy trình vận chuyển hành hóa
          </p>
        </div>
        <div className="mt-10 flex justify-center md:space-x-10 lg:space-x-0 space-y-2 lg:justify-between flex-wrap items-center text-gray-600 ">
          <div
            className="flex justify-between items-center w-full md:w-[190px] border border-orange-500 rounded-lg space-x-6 px-5 py-2  font-medium hover:shadow-lg  hover:scale-105 
              transition-all duration-300 cursor-pointer"
          >
            <PackageSearch size={30} className="w-[20%] text-[#F84563]" />
            <p className="w-[74%]">Tìm Kiếm Sản Phẩm</p>
          </div>
          <ArrowBigRight
            className="text-orange-500  hidden md:block"
            size={30}
          />
          <ArrowBigDown className="text-orange-500 block md:hidden" size={30} />
          <div
            className="flex justify-between items-center w-full md:w-[190px] border border-orange-500 rounded-lg space-x-6 px-5 py-2  font-medium hover:shadow-lg  hover:scale-105 
              transition-all duration-300 cursor-pointer"
          >
            <PackagePlus size={30} className="w-[20%] text-[#F84563]" />
            <p className="w-[74%]">Tạo đơn hàng</p>
          </div>
          <ArrowBigRight
            className="text-orange-500  hidden md:block"
            size={30}
          />
          <ArrowBigDown className="text-orange-500 block md:hidden" size={30} />
          <div
            className="flex justify-between items-center w-full md:w-[190px] border border-orange-500 rounded-lg space-x-6 px-5 py-2  font-medium hover:shadow-lg  hover:scale-105 
              transition-all duration-300 cursor-pointer"
          >
            <Wallet size={30} className="w-[20%] text-[#F84563]" />
            <p className="w-[74%]">Đặt Cọc Tiền Hàng</p>
          </div>
          <ArrowBigRight
            className="text-orange-500  hidden md:block"
            size={30}
          />
          <ArrowBigDown className="text-orange-500 block md:hidden" size={30} />
          <div
            className="flex justify-between items-center w-full md:w-[190px] border border-orange-500 rounded-lg space-x-6 px-5 py-2  font-medium hover:shadow-lg  hover:scale-105 
              transition-all duration-300 cursor-pointer"
          >
            <CalendarClock size={30} className="w-[20%] text-[#F84563]" />
            <p className="w-[74%]">Theo Dõi Đơn Hàng</p>
          </div>
          <ArrowBigRight
            className="text-orange-500  hidden md:block"
            size={30}
          />
          <ArrowBigDown className="text-orange-500 block md:hidden" size={30} />
          <div
            className="flex justify-between items-center w-full md:w-[190px] border border-orange-500 rounded-lg space-x-5 px-5 py-2  font-medium hover:shadow-lg  hover:scale-105 
              transition-all duration-300 cursor-pointer"
          >
            <HandCoins size={30} className="w-[20%] text-[#F84563]" />
            <p className="w-[80%]">Thanh Toán & Nhận Hàng</p>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <video
            className="rounded-lg shadow-md lg:w-[82%]"
            controls
            poster={shippingProcess}
          >
            <source src={video} type="video/mp4" />
          </video>
        </div>
        <div className="py-8 sm:py-12 lg:py-16">
          <div>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl font-bold text-gray-800">
                CAM KẾT DỊCH VỤ MUA HÀNG TRUNG QUỐC
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
                BTC Logistics luôn nỗ lực không ngừng nghỉ để mang đến cho Quý
                khách trải nghiệm mua hàng tốt nhất, vận chuyển nhanh chóng – uy
                tín – giá tốt; nhằm mang lại sự hài lòng tốt nhất khi sử dụng
                dịch vụ nhập hàng Trung Quốc của chúng tôi.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-6 lg:gap-8">
              <div
                className="
              border border-orange-500 rounded-lg shadow-md 
              p-4 sm:p-5 lg:p-6 
              hover:shadow-lg hover:border-orange-600 hover:scale-105 
              transition-all duration-300 cursor-pointer
            "
              >
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#F84563] mb-2">
                  CAM KẾT ĐẶT HÀNG
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Đền bù 100% tiền hàng nếu BTC Logistics đặt sai link của quý
                  khách. Cam kết mua hàng trong vòng 24h kể từ lúc đơn hàng được
                  đặt cọc.
                </p>
              </div>
              <div
                className="
              border border-orange-500 rounded-lg shadow-md 
              p-4 sm:p-5 lg:p-6 
              hover:shadow-lg hover:border-orange-600 hover:scale-105 
              transition-all duration-300 cursor-pointer
            "
              >
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#F84563] mb-2">
                  CAM KẾT BỒI THƯỜNG
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Chúng tôi cam kết đền bù 100% tiền hàng nếu có sai sót trong
                  quá trình đặt hàng Trung Quốc, cũng như thất lạc khi vận
                  chuyển hàng hóa.
                </p>
              </div>
              <div
                className="
              border border-orange-500 rounded-lg shadow-md 
              p-4 sm:p-5 lg:p-6 
              hover:shadow-lg hover:border-orange-600 hover:scale-105 
              transition-all duration-300 cursor-pointer
            "
              >
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#F84563] mb-2">
                  CAM KẾT ĐÚNG GIÁ
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Cam kết mua hàng Trung Quốc đúng giá được công bố trên các
                  website và đúng phí vận chuyển nội địa không gian dối.
                </p>
              </div>
              <div
                className="
              border border-orange-500 rounded-lg shadow-md 
              p-4 sm:p-5 lg:p-6 
              hover:shadow-lg hover:border-orange-600 hover:scale-105 
              transition-all duration-300 cursor-pointer
            "
              >
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#F84563] mb-2">
                  THỜI GIAN VẬN CHUYỂN
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  BTC Logistics luôn luôn cố gắng tối ưu chi phí, thời gian để
                  việc vận chuyển hàng hóa từ Trung Quốc về Việt Nam nhanh nhất,
                  an toàn nhất có thể.
                </p>
              </div>
              <div
                className="
              border border-orange-500 rounded-lg shadow-md 
              p-4 sm:p-5 lg:p-6 
              hover:shadow-lg hover:border-orange-600 hover:scale-105 
              transition-all duration-300 cursor-pointer
            "
              >
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#F84563] mb-2">
                  TỶ GIÁ NHÂN DÂN TỆ
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Tỷ giá công khai minh bạch khớp với hệ thống đặt hàng. Luôn
                  luôn ưu tiên để tỷ giá thấp nhất nhằm mang lại lợi ích tối đa
                  cho khách hàng.
                </p>
              </div>
              <div
                className="
              border border-orange-500 rounded-lg shadow-md 
              p-4 sm:p-5 lg:p-6 
              hover:shadow-lg hover:border-orange-600 hover:scale-105 
              transition-all duration-300 cursor-pointer
            "
              >
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#F84563] mb-2">
                  CAM KẾT HỖ TRỢ
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  BTC Logistics luôn luôn cố gắng phục vụ 24/7 nhằm mang lại
                  dịch vụ tốt nhất tới quý khách hàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;
