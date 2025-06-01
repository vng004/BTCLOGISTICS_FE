import { Button, Form, message, Modal, Table, Checkbox, Upload } from "antd";
import { PackagePlus, Pen, Trash2 } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { getTitleTab } from "../../../constants/client";
import { displayErrorMessage, formatDateDay } from "../../../constants/util";
import {
  useGetAllBannersQuery,
  useAddBannerMutation,
  useUpdateBannerMutation,
  useRemoveBannerMutation,
} from "../../../redux/slices/bannerApiSlice";
import { Banner } from "../../../interfaces/Banner";
import type { UploadFile, UploadProps } from "antd";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";

const BannerManagement = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const {
    data: banners,
    isLoading: isFetching,
    error: fetchError,
  } = useGetAllBannersQuery(undefined);
  const [addBanner, { isLoading: isCreating }] = useAddBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner] = useRemoveBannerMutation();

  const safeBanners = Array.isArray(banners) ? banners : [];

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

  const handleAddBanner = async (values: { isActive: boolean }) => {
    if (fileList.length === 0 && !editingBanner) {
      message.error("Vui lòng upload ít nhất một hình ảnh!");
      return;
    }

    let images = editingBanner?.images || [];
    if (fileList.length > 0) {
      const files = fileList.map((file) => file.originFileObj as File);
      images = await uploadToCloudinary(files);
    }

    if (images.length === 0) {
      message.error("Không có hình ảnh nào được upload!");
      return;
    }

    try {
      await addBanner({ images, isActive: values.isActive }).unwrap();
      message.success("Thêm mới banner thành công!");
      setIsModalVisible(false);
      setFileList([]);
      form.resetFields();
    } catch (error: any) {
      displayErrorMessage(error);
      setFileList([]);
      form.resetFields();
    }
  };

  const handleUpdateBanner = async (
    id: string,
    values: { isActive: boolean }
  ) => {
    let images = editingBanner?.images || [];
    if (fileList.length > 0) {
      const files = fileList.map((file) => file.originFileObj as File);
      images = await uploadToCloudinary(files);
    }

    if (images.length === 0) {
      message.error("Không có hình ảnh nào được upload!");
      return;
    }

    try {
      await updateBanner({
        id,
        data: { images, isActive: values.isActive },
      }).unwrap();
      message.success("Cập nhật banner thành công");
      setEditingBanner(null);
      setIsModalVisible(false);
      setFileList([]);
      form.resetFields();
    } catch (error: any) {
      displayErrorMessage(error);
      setFileList([]);
      form.resetFields();
    }
  };

  const handleDeleteBanner = (id: string) => {
    if (!id) {
      message.error("Không tìm thấy ID banner để xóa!");
      return;
    }
    Modal.confirm({
      title: (
        <span className="text-red-500 font-title">Xác nhận xóa banner</span>
      ),
      content: (
        <p className="dark:text-[#b9b7c0]">
          Bạn có chắc chắn muốn xóa banner này không?
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
      onOk: () => {
        return new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const data = await deleteBanner(id);
              console.log(data);
              message.success("Xóa banner thành công");
            } catch (error) {
              displayErrorMessage(error);
            }
            resolve(undefined);
          }, 666);
        });
      },
    });
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingBanner(null);
    setFileList([]);
    form.resetFields();
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setIsModalVisible(true);
    setFileList([]);
    form.setFieldsValue({
      isActive: banner.isActive,
    });
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

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (images: string[]) => (
        <div className="flex flex-wrap gap-2 justify-center">
          {images.map((img) => (
            <img
              key={img}
              src={img}
              alt="Banner image"
              className="w-20 h-20 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/80x80";
              }}
            />
          ))}
        </div>
      ),
      width: 300,
      align: "center" as const,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <span className={isActive ? "text-green-600" : "text-red-600"}>
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </span>
      ),
      width: 120,
      align: "center" as const,
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => (
        <span className="font-semibold text-green-600">
          {createdAt ? formatDateDay(createdAt) : "N/A"}
        </span>
      ),
      width: 160,
      align: "center" as const,
    },
    {
      title: "Thời gian cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt: string) => (
        <span className="font-semibold text-red-600">
          {updatedAt ? formatDateDay(updatedAt) : "N/A"}
        </span>
      ),
      width: 160,
      align: "center" as const,
    },
    {
      title: "Hành động",
      key: "action",
      render: (record: Banner) => (
        <div>
          <Button
            onClick={() => handleEditBanner(record)}
            disabled={isUpdating}
          >
            <Pen size={20} />
          </Button>
          <Button
            type="primary"
            danger
            className="ml-2"
            onClick={() => handleDeleteBanner(record._id)}
          >
            <Trash2 size={20} />
          </Button>
        </div>
      ),
      width: 160,
      align: "center" as const,
    },
  ];

  return (
    <div className="">
      <Helmet>
        <title>{getTitleTab("Quản lý banner")}</title>
      </Helmet>

      <div className="flex justify-between items-center flex-col md:flex-row lg:flex-row mb-6 bg-white rounded-[50px] shadow-xl p-4">
        <div className="flex items-center gap-x-6">
          <p className="text-xl">Quản lý banner</p>
        </div>
        <button
          onClick={() => setIsModalVisible(true)}
          className="border-2 mt-4 md:mt-0 lg:mt-0 w-[160px] flex justify-center items-center border-orange-500 py-2 px-5 rounded-[50px] hover:bg-[#F84563] text-[#F84563] bg-white hover:border-orange-500 hover:text-white gap-3 cursor-pointer hover:shadow-md text-lg"
        >
          <div className="flex items-center gap-x-2">
            {isCreating ? <LoadingOutlined /> : <PackagePlus size={20} />}
            <p>Thêm mới</p>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-3xl hover:shadow-md shadow-xl p-10">
        {isFetching ? (
          <div className="flex justify-center">
            <LoadingOutlined />
          </div>
        ) : fetchError ? (
          <p className="text-red-500">
            Lỗi khi lấy dữ liệu banner: {fetchError.toString()}
          </p>
        ) : (
          <Table
            columns={columns}
            dataSource={safeBanners}
            rowKey="id"
            pagination={false}
            className="w-full"
          />
        )}
      </div>

      <Modal
        title={editingBanner ? "Cập nhật banner" : "Tạo banner mới"}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) =>
            editingBanner
              ? handleUpdateBanner(editingBanner._id, values)
              : handleAddBanner(values)
          }
        >
          <Form.Item
            name="images"
            rules={[
              {
                validator: () =>
                  fileList.length > 0 ||
                  (editingBanner && editingBanner.images.length > 0)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Vui lòng upload ít nhất một hình ảnh!")
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
            >
              <Button icon={<UploadOutlined size={20} />}>Chọn hình ảnh</Button>
            </Upload>
          </Form.Item>

          {editingBanner && fileList.length === 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {editingBanner.images.map((img) => (
                <img
                  key={img}
                  src={img}
                  alt="Current image"
                  className="w-40 h-40 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/80x80";
                  }}
                />
              ))}
            </div>
          )}

          <Form.Item
            name="isActive"
            label="Trạng thái hoạt động"
            valuePropName="checked"
          >
            <Checkbox>Hoạt động</Checkbox>
          </Form.Item>

          <button
            type="submit"
            disabled={isCreating || isUpdating || uploading}
            className="w-full p-3 bg-[#F84563] hover:bg-white hover:text-[#F84563] hover:border-orange-500 border-2 text-white rounded-[50px]"
          >
            {isCreating || isUpdating || uploading
              ? <LoadingOutlined />
              : editingBanner
              ? "Cập nhật banner"
              : "Tạo banner"}
          </button>
        </Form>
      </Modal>
    </div>
  );
};

export default BannerManagement;
