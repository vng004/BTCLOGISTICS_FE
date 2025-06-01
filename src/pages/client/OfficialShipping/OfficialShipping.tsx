import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  message,
  Modal,
  Table,
  Tabs,
  Tag,
  Timeline,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import {
  ArrowBigDown,
  ArrowBigRight,
  CalendarClock,
  CircleCheckBig,
  Eye,
  HandCoins,
  PackagePlus,
  PackageSearch,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import {
  orderCustomer,
  shippingProcess,
  video,
} from "../../../constants/client";
import {
  displayErrorMessage,
  formatDateDay,
  formatPriceNumber,
} from "../../../constants/util";
import { TOfficialGood } from "../../../interfaces/OfficialGood";
import {
  useAddOfficialGoodMutation,
  useGetOfficialGoodByIdQuery,
  useGetOfficialGoodQuery,
  useUpdateOfficialGoodMutation,
} from "../../../redux/slices/officialGoodApiSlice";

const OfficialShipping = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [searchCustomerPhone, setSearchCustomerPhone] = useState("");
  const [isSearchPhoneValid, setIsSearchCustomerValid] = useState(false);
  const [isModalSuccess, setIsModalSuccess] = useState(false);
  const [isModalDetail, setIsModalDetail] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [id, setId] = useState("");
  const [updateOfficialGood, { isLoading: isUpdating }] =
    useUpdateOfficialGoodMutation();
  const { data: officialGood } = useGetOfficialGoodQuery({
    keyword: searchCustomerPhone,
    page: 1,
    per_page: 6,
  });

  const { data: officialGoodDetail } = useGetOfficialGoodByIdQuery(id, {
    skip: !id,
  });
  const [addOfficialGood, { isLoading: isCreating }] =
    useAddOfficialGoodMutation();

  const uploadToCloudinary = async (files: File[]) => {
    setUploading(true);
    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          throw new Error("Upload failed for one of the images");
        }
      }
      return uploadedUrls;
    } catch (error) {
      message.error("Upload hình ảnh thất bại!");
      console.error(error);
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleAddOfficialGood = async (values: TOfficialGood) => {
    if (fileList.length === 0) {
      message.error("Vui lòng upload ít nhất một hình ảnh!");
      return;
    }
    let images: string[] = [];
    try {
      const files = fileList.map((file) => file.originFileObj as File);
      images = await uploadToCloudinary(files);
      if (images.length === 0) {
        throw new Error("Upload hình ảnh thất bại");
      }
    } catch (error) {
      message.error("Upload hình ảnh thất bại!");
      return;
    }

    try {
      const payload = { ...values, productImage: images };
      await addOfficialGood(payload).unwrap();
      form.resetFields();
      setFileList([]);
      setIsModalSuccess(true);
    } catch (error) {
      displayErrorMessage(error);
    }
  };

  const uploadProps: UploadProps = {
    multiple: true,
    accept: "image/*",
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    beforeUpload: () => false,
  };

  const closeModalSuccess = () => {
    setIsModalSuccess(false);
    form.resetFields();
    setFileList([]);
  };

  const closeModalDetail = () => {
    setIsModalDetail(false);
  };

  const onReset = () => {
    form.resetFields();
    setFileList([]);
  };

  const handleModaleDetail = (id: string) => {
    setIsModalDetail(true);
    setId(id);
  };

  const handleCheckPhone = async () => {
    try {
      setIsSearchCustomerValid(true);
    } catch (error) {}
  };

  const statusMapping = [
    { value: 0, label: "Tiếp nhận đơn hàng", color: "text-gray-500" },
    { value: 1, label: "Xử lý và báo giá", color: "text-orange-500" },
    { value: 2, label: "Khách đã duyệt", color: "text-blue-500" },
    { value: 3, label: "Đã duyệt và lên đơn", color: "text-cyan-500" },
    { value: 4, label: "Kho TQ nhận đơn", color: "text-purple-500" },
    { value: 5, label: "Đang vận chuyển về VN", color: "text-yellow-500" },
    { value: 6, label: "Hàng về kho VN", color: "text-teal-500" },
    { value: 7, label: "Giao hàng và thanh toán", color: "text-lime-500" },
    { value: 8, label: "Đơn hàng đã hoàn thành", color: "text-green-500" },
    { value: 9, label: "Đơn hàng đã bị hủy", color: "text-red-500" },
  ];

  const getStatusLabel = (
    statusValue: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  ) => {
    return (
      statusMapping.find((item) => item.value === statusValue)?.label ||
      "Không xác định"
    );
  };

  const getStatusColor = (
    statusValue: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  ) => {
    const colorClass = statusMapping.find(
      (item) => item.value === statusValue
    )?.color;
    return colorClass
      ? colorClass.replace("text-", "").replace("-500", "")
      : "gray"; // Mặc định là gray nếu không tìm thấy
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
  const columns = [
    {
      title: "Tên KH",
      dataIndex: "fullName",
      key: "fullName",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Sđt",
      dataIndex: "phone",
      key: "phone",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Ảnh",
      dataIndex: "productImage",
      key: "productImage",
      render: (productImage: string[]) => (
        <Image className="w-22" src={productImage[0] || ""} />
      ),
      align: "center" as const,
      width: 100,
    },
    {
      title: "Thời gian tạo đơn",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => <div>{formatDateDay(createdAt)}</div>,
      align: "center" as const,
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: any, record: TOfficialGood) => {
        return record.inspection === false ? (
          <Tag
            className="text-sm font-semibold py-2 px-2 text-center"
            color={getStatusColor(status)}
          >
            {getStatusLabel(status)}
          </Tag>
        ) : (
          <Tag
            className="text-sm font-semibold py-2 px-2 text-center"
            color="error"
          >
            Hải quan đang kiểm hóa hàng
          </Tag>
        );
      },
      align: "center" as const,
      width: 150,
    },
    {
      title: "Chi tiết",
      render: (item: TOfficialGood) => (
        <div className="flex items-center justify-center">
          <Button onClick={() => handleModaleDetail(item._id!)}>
            Xem <Eye />
          </Button>
        </div>
      ),
      width: 200,
      align: "center" as const,
    },
  ];

  const handleSuccessStatusChange = () => {
    Modal.confirm({
      title: <span className="text-[#ef4d38]">Xác nhận đặt hàng </span>,
      content: (
        <p className="dark:text-[#b9b7c0] text-[#685f78]">
          Bạn có chắc chắn muốn đặt đơn hàng sau khi chúng tôi đã báo giá
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
        await updateOfficialGood({
          id,
          data: {
            status: 2,
            fullName: officialGoodDetail?.fullName,
            phone: officialGoodDetail?.phone,
          },
        });
        message.success(
          "Đơn hàng của bạn đã được xác nhận đặt hàng thành công"
        );
      },
    });
  };
  const handleCancelStatusChange = () => {
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
        await updateOfficialGood({
          id,
          data: {
            status: 9,
          },
        });
        message.success("Bạn đã hủy đơn hàng thành công");
      },
    });
  };
  return (
    <div className="max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px] mx-auto pt-46 md:pt-[140px] space-y-10 p-3">
      <div className=" border border-orange-500 rounded-xl p-3 md:p-6">
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "Nhận báo giá đơn hàng",
              children: (
                <Card>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddOfficialGood}
                    className="p-4"
                  >
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Thông tin khách hàng
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item
                          label="Họ và tên"
                          name="fullName"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập họ và tên",
                            },
                          ]}
                        >
                          <Input
                            className="py-3"
                            placeholder="Nhập họ và tên"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Sđt (lưu ý sđt dùng để tra cứu đơn hàng đã được báo giá)"
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
                            { type: "email", message: "Email không hợp lệ" },
                            { required: true, message: "Vui lòng nhập email" },
                          ]}
                        >
                          <Input className="py-3" placeholder="Nhập email" />
                        </Form.Item>
                      </div>
                    </div>

                    {/* Mô tả đơn hàng */}
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Mô tả đơn hàng
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Form.Item label="HS code" name="hsCode">
                          <Input className="py-3" placeholder="Nhập HS code" />
                        </Form.Item>
                      </div>
                      <div className="border flex justify-start p-2 w-full">
                        <Form.Item
                          name="productImage"
                          label="Ảnh sản phẩm"
                          rules={[
                            {
                              validator: () =>
                                fileList.length > 0
                                  ? Promise.resolve()
                                  : Promise.reject(
                                      new Error(
                                        "Vui lòng upload ít nhất một hình ảnh!"
                                      )
                                    ),
                            },
                          ]}
                        >
                          <Upload
                            {...uploadProps}
                            listType="picture"
                            showUploadList={{
                              showPreviewIcon: true,
                              showRemoveIcon: true,
                            }}
                            className="w-full img"
                          >
                            <Button icon={<UploadOutlined size={20} />}>
                              Chọn hình ảnh
                            </Button>
                          </Upload>
                        </Form.Item>
                      </div>
                    </div>

                    {/* Thông số sản phẩm */}
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Thông số sản phẩm
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item
                          label="Chất liệu"
                          name={["productSpecs", "material"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập chất liệu",
                            },
                          ]}
                        >
                          <Input
                            className="py-3 w-full"
                            placeholder="Nhập chất liệu"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Kích thước"
                          name={["productSpecs", "dimensions"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập kích thước",
                            },
                          ]}
                        >
                          <Input
                            className="py-3 w-full"
                            placeholder="Nhập kích thước"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Thông số kỹ thuật"
                          name={["productSpecs", "technicalSpecs"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập thông số kỹ thuật",
                            },
                          ]}
                        >
                          <Input
                            className="py-3 w-full"
                            placeholder="Nhập thông số kỹ thuật (điện áp, công suất, v.v.)"
                          />
                        </Form.Item>
                      </div>
                    </div>

                    {/* Quy cách đóng kiện */}
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Quy cách đóng kiện
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                          label="Số lượng kiện hàng"
                          name={["packagingDetails", "packageCount"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số lượng kiện hàng",
                            },
                            {
                              validator: (_, value) =>
                                !value || (!isNaN(value) && Number(value) > 0)
                                  ? Promise.resolve()
                                  : Promise.reject(
                                      new Error(
                                        "Số lượng kiện hàng phải là số dương"
                                      )
                                    ),
                            },
                          ]}
                        >
                          <Input
                            className="py-3 w-full"
                            placeholder="Nhập số lượng kiện hàng"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Số sản phẩm trong mỗi kiện"
                          name={["packagingDetails", "itemsPerPackage"]}
                          rules={[
                            {
                              required: true,
                              message:
                                "Vui lòng nhập số sản phẩm trong mỗi kiện",
                            },
                            {
                              validator: (_, value) =>
                                !value || (!isNaN(value) && Number(value) > 0)
                                  ? Promise.resolve()
                                  : Promise.reject(
                                      new Error(
                                        "Số sản phẩm trong mỗi kiện phải là số dương"
                                      )
                                    ),
                            },
                          ]}
                        >
                          <Input
                            className="py-3 w-full"
                            placeholder="Nhập số sản phẩm trong mỗi kiện"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Kích thước kiện hàng"
                          name={["packagingDetails", "packageDimensions"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập kích thước kiện hàng",
                            },
                          ]}
                        >
                          <Input
                            className="py-3 w-full"
                            placeholder="Nhập kích thước kiện hàng"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Cân nặng mỗi kiện (kg)"
                          name={["packagingDetails", "packageWeight"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập cân nặng mỗi kiện",
                            },
                            {
                              validator: (_, value) =>
                                !value || (!isNaN(value) && Number(value) > 0)
                                  ? Promise.resolve()
                                  : Promise.reject(
                                      new Error(
                                        "Cân nặng mỗi kiện phải là số dương"
                                      )
                                    ),
                            },
                          ]}
                        >
                          <Input
                            className="py-3 w-full"
                            placeholder="Nhập cân nặng mỗi kiện"
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="text-[17px]">
                      <span className="text-[#F84563] font-semibold">
                        Lưu ý:{" "}
                      </span>
                      <span>
                        Sau khi bạn điền xong thông tin đơn hàng muốn báo giá,{" "}
                        <span className="underline  hover:text-[#F84563]">
                          số điện thoại
                        </span>{" "}
                        bạn nhập sẽ là thứ để bạn tra cứu đơn hàng này. Sau khi
                        bạn gửi đơn báo giá, chúng tôi sẽ lên đơn báo giá cho
                        bạn trong thời gian sớm nhất, và sẽ gửi thông báo vào
                        trong{" "}
                        <span className="underline  hover:text-[#F84563]">
                          email
                        </span>{" "}
                        mà bạn điền.
                      </span>
                    </div>
                    <Form.Item>
                      <div className="flex justify-center md:justify-start gap-4 mt-6">
                        <button
                          onClick={onReset}
                          type="reset"
                          className="px-6 py-2 w-[140px] rounded-full text-[15px] md:text-lg border-2 border-orange-500 text-[#F84563] hover:border-[#ff7f94] hover:text-[#ff7f94]"
                        >
                          Đặt lại
                        </button>
                        <button
                          type="submit"
                          className="bg-[#F84563] text-white px-6 py-2 w-[160px] rounded-full border-2 hover:bg-[#ff7f94] border-[#ff7f94] text-[15px] md:text-lg flex items-center justify-center gap-x-2"
                          disabled={isCreating || uploading}
                        >
                          {isCreating || (uploading && <LoadingOutlined />)}
                          <p>Nhận báo giá</p>
                        </button>
                      </div>
                    </Form.Item>
                  </Form>
                </Card>
              ),
            },
            {
              key: "2",
              label: "Tra cứu đơn hàng đã báo giá",
              children: (
                <Card>
                  {!isSearchPhoneValid ? (
                    <Form form={searchForm} layout="vertical">
                      <div className="flex justify-center">
                        <img src={orderCustomer} alt="" className="w-[500px]" />
                      </div>
                      <div className="flex justify-center">
                        <Form.Item
                          name="searchCustomerPhone"
                          className="w-[600px]"
                        >
                          <Input
                            className="py-3 md:py-4 rounded-l-full border"
                            placeholder="Nhập số điện thoại để tra cứu"
                            onChange={(e) =>
                              setSearchCustomerPhone(e.target.value)
                            }
                          />
                        </Form.Item>
                        <Form.Item>
                          <button
                            type="button"
                            className="bg-[#F84563] text-white px-7 py-3 md:py-[13px]  w-[110px] md:w-[160px] rounded-r-full border hover:bg-[#ff7f94] border-[#ff7f94] md:text-lg"
                            disabled={!searchCustomerPhone.trim()}
                            onClick={handleCheckPhone}
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
                            setSearchCustomerPhone("");
                            searchForm.resetFields();
                          }}
                          className="bg-[#F84563] text-white hover:bg-[#ff7f94] py-2 px-3 rounded-[50px]"
                        >
                          Tra cứu khách hàng khác
                        </button>
                      </div>
                      {officialGood?.data.length > 0 ? (
                        <Table
                          columns={columns}
                          dataSource={officialGood.data}
                          rowKey="id"
                          pagination={false}
                          scroll={{ x: 800 }}
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <p>Không có đơn hàng nào cho số điện thoại này.</p>
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
                  Nhận báo giá đơn hàng thành công!
                </p>
                <p>
                  Chúng tôi sẽ báo giá lại cho khách hàng, vui lòng chú ý email
                  để nhận thông báo từ BTC
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
        <Modal open={isModalDetail} footer={null} width={900} closeIcon={false}>
          {officialGoodDetail && (
            <div>
              <div className=" rounded-md  space-y-2">
                <p className="bg-[#F84563] text-white px-2 py-2 rounded-md text-center md:text-left md:text-xl">
                  Chi tiết đơn hàng đã được báo giá bởi BTC LOGISTISC
                </p>
                <div className="w-full border-2 rounded-md md:text-[17px]">
                  <div className="bg-gray-200  px-4 py-1">
                    <b>Trạng thái đơn hàng</b>
                  </div>
                  <div className="px-4 py-1">
                    {officialGoodDetail.inspection === false ? (
                      <Tag
                        className="text-sm font-semibold py-2 px-2 text-center"
                        color={
                          officialGoodDetail.status === 0
                            ? "gray"
                            : officialGoodDetail.status === 1
                            ? "orange"
                            : officialGoodDetail.status === 2
                            ? "blue"
                            : officialGoodDetail.status === 3
                            ? "cyan"
                            : officialGoodDetail.status === 4
                            ? "purple"
                            : officialGoodDetail.status === 5
                            ? "yellow"
                            : officialGoodDetail.status === 6
                            ? "teal"
                            : officialGoodDetail.status === 7
                            ? "lime"
                            : officialGoodDetail.status === 8
                            ? "green"
                            : "red"
                        }
                      >
                        {officialGoodDetail.status === 0
                          ? "Tiếp nhận đơn hàng"
                          : officialGoodDetail.status === 1
                          ? "Xử lý và báo giá"
                          : officialGoodDetail.status === 2
                          ? "Khách hàng đã đồng ý đặt hàng"
                          : officialGoodDetail.status === 3
                          ? "Đã duyệt và lên đơn"
                          : officialGoodDetail.status === 4
                          ? "Kho TQ nhận đơn"
                          : officialGoodDetail.status === 5
                          ? "Đang vận chuyển về VN"
                          : officialGoodDetail.status === 6
                          ? "Hàng về kho VN"
                          : officialGoodDetail.status === 7
                          ? "Giao hàng và thanh toán"
                          : officialGoodDetail.status === 8
                          ? "Đơn hàng đã hoàn thành"
                          : "Đơn hàng đã bị từ chối"}
                      </Tag>
                    ) : (
                      <div className="">
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
              </div>
              <div className="space-y-4 mt-4 ">
                <div className="md:text-[17px]  space-y-4">
                  <div className="w-full border-2 rounded-md ">
                    <div className="bg-gray-200  px-4 py-1">
                      <b>Thông Tin Khách Hàng</b>
                    </div>
                    <div className="flex items-center gap-x-2 md:gap-x-10  px-4 py-1">
                      <p>Họ và tên: </p>
                      <p>{officialGoodDetail.fullName}</p>
                    </div>
                    <div className="flex items-center gap-x-2 md:gap-x-10  px-4 py-1">
                      <p>Sđt: </p>
                      <span>
                        {officialGoodDetail.phone
                          ? "xxxxx" + officialGoodDetail.phone.slice(4)
                          : "Trống"}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-2 md:gap-x-10  px-4 py-1">
                      <p>Email: </p>
                      <span>
                        {officialGoodDetail.email
                          ? "xxxxx" + officialGoodDetail.email.slice(4)
                          : "Trống"}
                      </span>
                    </div>
                  </div>
                  <div className="w-full border-2 rounded-md ">
                    <div className="bg-gray-200  px-4 py-1">
                      <b>Mô Tả Đơn Hàng</b>
                    </div>
                    <div className="flex items-center gap-x-2 md:gap-x-10  px-4 py-1">
                      <p>Tên sản phẩm: </p>
                      <p>{officialGoodDetail.productName}</p>
                    </div>
                    <div className="px-4 py-1">
                      <p>Ảnh : </p>
                      <div className="flex gap-2 w-[60%]">
                        {officialGoodDetail.productImage?.map((img) => (
                          <Image
                            src={img}
                            alt="productImage"
                            className="border rounded-md border-[#F84563] img"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full border-2 rounded-md">
                    <div className="bg-gray-200  px-4 py-1">
                      <b>Thông Số Sản Phẩm</b>
                    </div>
                    <div className="flex items-center gap-x-2 md:gap-x-10  px-4 py-1 ">
                      <p>Chất liệu sản phẩm: </p>
                      <span>{officialGoodDetail.productSpecs?.material}</span>
                    </div>
                    <div className="flex items-center gap-x-2 md:gap-x-10  px-4 py-1">
                      <p>Kích thước sản phẩm: </p>
                      <span>{officialGoodDetail.productSpecs?.dimensions}</span>
                    </div>
                    <div className="flex items-center gap-x-2 md:gap-x-10  px-4 py-1">
                      <p>Thông số kỹ thuật (điện áp, công suất, v.v.): </p>
                      <span>
                        {officialGoodDetail.productSpecs?.technicalSpecs}
                      </span>
                    </div>
                  </div>

                  <div className="w-full border-2 rounded-md ">
                    <div className="bg-gray-200  px-4 py-1">
                      <b>Quy Cách Đóng Kiện Hàng</b>
                    </div>
                    <div className="flex items-center gap-x-2 md:gap-x-10  px-4 py-1">
                      <p>Số lượng kiện hàng: </p>
                      <span>
                        {officialGoodDetail.packagingDetails?.packageCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-2 md:gap-x-10  px-4 py-1">
                      <p>Số sản phẩm trong mỗi kiện: </p>
                      <span>
                        {officialGoodDetail.packagingDetails?.itemsPerPackage}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-2 md:gap-x-10  px-4 py-1">
                      <p>Kích thước kiện hàng: </p>
                      <span>
                        {officialGoodDetail.packagingDetails?.packageDimensions}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-2 md:gap-x-10  px-4 py-1">
                      <p>Cân nặng mỗi kiện (kg): </p>
                      <span>
                        {officialGoodDetail.packagingDetails?.packageWeight}
                      </span>
                    </div>
                  </div>

                  <table className="w-full  border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border px-4 py-1 text-left">
                          Bảng báo giá
                        </th>
                        <th className="border px-4 py-1 text-right">
                          Thành tiền (VNĐ)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-4 py-1">
                          Phí ủy thác nhập khẩu (hàng ghép)
                        </td>
                        <td className="border px-4 py-1 text-right">
                          {formatPriceNumber(
                            officialGoodDetail.importEntrustmentFee || 0
                          ).toString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-1">Phí pickup</td>
                        <td className="border px-4 py-1 text-right">
                          {formatPriceNumber(officialGoodDetail.pickupFee || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-1">
                          Phí đóng gỗ, gia cố, kiểm đếm
                        </td>
                        <td className="border px-4 py-1 text-right">
                          {formatPriceNumber(
                            officialGoodDetail.reinforcementFee || 0
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-1">
                          Cước vận chuyển quốc tế
                        </td>
                        <td className="border px-4 py-1 text-right">
                          {formatPriceNumber(
                            officialGoodDetail.internationalShippingFee || 0
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-1">
                          Thuế giá trị gia tăng (VAT)
                        </td>
                        <td className="border px-4 py-1 text-right">
                          {formatPriceNumber(officialGoodDetail.vatTax || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-1">Thuế nhập khẩu</td>
                        <td className="border px-4 py-1 text-right">
                          {formatPriceNumber(officialGoodDetail.importTax || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-1">
                          Thuế tiêu thụ đặc biệt
                        </td>
                        <td className="border px-4 py-1 text-right">
                          {formatPriceNumber(
                            officialGoodDetail.specialConsumptionTax || 0
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-1">
                          Thuế bảo vệ môi trường
                        </td>
                        <td className="border px-4 py-1 text-right">
                          {formatPriceNumber(
                            officialGoodDetail.environmentalTax || 0
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-1">Lệ phí hải quan</td>
                        <td className="border px-4 py-1 text-right">
                          {formatPriceNumber(
                            officialGoodDetail.customsAndOtherFees
                              ?.customsFee || 0
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-1">
                          Phí kiểm tra chuyên ngành
                        </td>
                        <td className="border px-4 py-1 text-right">
                          {formatPriceNumber(
                            officialGoodDetail.customsAndOtherFees
                              ?.inspectionFee || 0
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-1">
                          Phí lưu kho, bốc dỡ 2 đầu
                        </td>
                        <td className="border px-4 py-1 text-right">
                          {formatPriceNumber(
                            officialGoodDetail.storageAndHandlingFee || 0
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-1">
                          Phí vận chuyển nội địa Việt Nam
                        </td>
                        <td className="border px-4 py-1 text-right">
                          {formatPriceNumber(
                            officialGoodDetail.domesticShippingFee || 0
                          )}
                        </td>
                      </tr>
                      <tr className="bg-yellow-200">
                        <td className="border px-4 py-1 font-bold">
                          Tổng chi phí dự kiến
                        </td>
                        <td className="border px-4 py-1 text-right font-bold">
                          {formatPriceNumber(
                            (officialGoodDetail.importEntrustmentFee || 0) +
                              (officialGoodDetail.pickupFee || 0) +
                              (officialGoodDetail.reinforcementFee || 0) +
                              (officialGoodDetail.internationalShippingFee ||
                                0) +
                              (officialGoodDetail.vatTax || 0) +
                              (officialGoodDetail.importTax || 0) +
                              (officialGoodDetail.specialConsumptionTax || 0) +
                              (officialGoodDetail.environmentalTax || 0) +
                              (officialGoodDetail.customsAndOtherFees
                                ?.customsFee || 0) +
                              (officialGoodDetail.customsAndOtherFees
                                ?.inspectionFee || 0) +
                              (officialGoodDetail.storageAndHandlingFee || 0) +
                              (officialGoodDetail.domesticShippingFee || 0)
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="border rounded-md">
                  <div className="bg-gray-200 md:text-[17px]  px-4 py-1">
                    <b> Thông tin vận chuyển</b>
                  </div>

                  <div className="px-4 py-1">
                    {officialGoodDetail.statusHistory.length > 0 ? (
                      <Timeline
                        items={officialGoodDetail.statusHistory.map(
                          (history: any, index: number) => ({
                            key: index, // Thêm key để tránh cảnh báo React
                            color: statusColors[history.status],
                            children: (
                              <>
                                <p className="font-semibold mt-3">
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
                <div>
                  <p>ĐIỀU KIỆN BÁO GIÁ</p>

                  <p>
                    1. Đã bao gồm tổng chi phí từ kho Trung Quốc tới kho BTC tại
                    Hà Nội
                  </p>

                  <p>
                    2. Thời gian nhận hàng tại Việt Nam: từ 10-15 ngày kể từ khi
                    nhận hàng tại kho Trung Quốc
                  </p>

                  <p>3. Hiệu lực bảo giả: 10 ngày</p>

                  <p>4: Kho nhận hàng: Quảng Châu (Sea), Bằng Tường (Bộ)</p>

                  <p>
                    5. Đối với hàng nặng, quá khổ sẽ tính thêm chi phí nâng hạ.
                    Phí này sẽ được thông báo trực tiếp tới khách hàng
                  </p>

                  <p>6. Thông tin liên hệ: BTC (SĐT/Zalo: 088 9296 929)</p>
                  <p>Rất hân hạnh được phục vụ quý khách!!</p>
                </div>
                <div className="flex justify-center md:justify-end space-x-6">
                  <button
                    onClick={closeModalDetail}
                    className="border-2 border-orange-500 bg-[#F84563] text-white  px-6 md:px-10 py-2 rounded-full hover:bg-[#ff7f94] hover:border-[#ff7f94] md:text-lg"
                  >
                    Đóng
                  </button>
                  {officialGoodDetail?.status == 0 && (
                    <div className="space-x-2">
                      <button
                        onClick={handleCancelStatusChange}
                        className="border-2 border-orange-500  text-[#F84563]  px-6 md:px-10 py-2 rounded-full hover:bg-[#F84563] hover:border-orange-500 md:text-lg hover:text-white"
                      >
                        {isUpdating ? <LoadingOutlined /> : "Hủy đặt hàng"}
                      </button>
                    </div>
                  )}
                  {officialGoodDetail?.status == 1 && (
                    <div className="space-x-2">
                      <button
                        onClick={handleCancelStatusChange}
                        className="border-2 border-orange-500  text-[#F84563]  px-6 md:px-10 py-2 rounded-full hover:bg-[#F84563] hover:border-orange-500 md:text-lg hover:text-white"
                      >
                        Từ chối đặt hàng
                      </button>
                      <button
                        onClick={handleSuccessStatusChange}
                        className="border-2 border-orange-500  text-[#F84563]  px-6 md:px-10 py-2 rounded-full hover:bg-[#F84563] hover:border-orange-500 md:text-lg hover:text-white"
                      >
                        {isUpdating ? <LoadingOutlined /> : "Đồng ý đặt hàng"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
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

export default OfficialShipping;
