import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Table,
} from "antd";
import { jwtDecode } from "jwt-decode";
import { PackagePlus, Pen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { getTitleTab } from "../../../constants/client";
import { displayErrorMessage } from "../../../constants/util";
import { Auth, TokenPayload } from "../../../interfaces/Auth";
import {
  useCreateAdminMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../../redux/slices/authApiSlice";
import { LoadingOutlined } from "@ant-design/icons";

const UserManagement = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [editForm] = Form.useForm();

  const {
    data: users,
    isLoading: isFetching,
    error: fetchError,
  } = useGetUsersQuery(undefined);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: TokenPayload = jwtDecode(token);
        setIsSuperAdmin(decoded.role === "superAdmin");
      } catch (error) {
        setIsSuperAdmin(false);
      }
    }
  }, []);

  const safeUsers = Array.isArray(users) ? users : [];

  const handleUpdateUser = async (
    id: string,
    values: {
      role?: "admin" | "superAdmin";
      password?: string;
      userName: string;
    }
  ) => {
    if (!id) {
      message.error("Không tìm thấy ID người dùng để cập nhật!");
      return;
    }
    try {
      await updateUser({ id, data: values }).unwrap();
      message.success("Cập nhật tài khoản thành công");
      setEditingUser(null);
      editForm.resetFields();
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  const handleCreateAdmin = async (values: {
    userName: string;
    password: string;
  }) => {
    try {
      await createAdmin(values).unwrap();
      message.success("Thêm mới tài khoản thành công!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      displayErrorMessage(error);
      form.resetFields();
    }
  };

  const handleDeleteUser = (id: string) => {
    if (!id) {
      message.error("Không tìm thấy ID người dùng để xóa!");
      return;
    }
    Modal.confirm({
      title: (
        <span className="text-red-500 font-title">
          Xác nhận xóa tài khoản admin
        </span>
      ),
      content: (
        <p className="dark:text-[#b9b7c0]">
          Bạn có chắc chắn muốn xóa tài khoản admin này không?
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
              await deleteUser(id).unwrap();
              message.success("Xóa tài khoản admin thành công");
            } catch (error) {
              displayErrorMessage(error);
            }
            resolve(undefined);
          }, 666);
        });
      },
    });
  };

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "userName",
      key: "userName",
      render: (userName: string, record: Auth) => (
        <span className="break-all">
          {editingUser === record.id ? (
            <Form
              form={editForm}
              onFinish={(values) =>
                handleUpdateUser(record.id, {
                  userName: values.userName,
                  role: record.role, // Giữ role hiện tại nếu không thay đổi
                  password: values.newPassword || record.plainPassword, // Giữ password nếu không thay đổi
                })
              }
              initialValues={{ userName: userName }}
            >
              <div className="flex justify-center items-center gap-x-2">
                <Form.Item
                  name="userName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên người dùng!",
                    },
                  ]}
                  className="mb-0"
                  style={{ width: "120px" }}
                >
                  <Input
                    placeholder="Nhập tên người dùng"
                    style={{ height: "32px" }}
                  />
                </Form.Item>
              </div>
            </Form>
          ) : (
            userName
          )}
        </span>
      ),
      width: 160,
      align: "center" as const,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: "admin" | "superAdmin", record: Auth) => (
        <span>
          {editingUser === record.id ? (
            <select
              value={role}
              onChange={(e) =>
                handleUpdateUser(record.id, {
                  role: e.target.value as "admin" | "superAdmin",
                  userName:
                    editForm.getFieldValue("userName") || record.userName,
                  password:
                    editForm.getFieldValue("newPassword") ||
                    record.plainPassword,
                })
              }
              style={{ height: "32px", width: "120px", padding: "0 8px" }}
            >
              <option value="admin">admin</option>
              <option value="superAdmin">super admin</option>
            </select>
          ) : (
            role
          )}
        </span>
      ),
      width: 120, // Tăng width để cân đối với select
      align: "center" as const,
    },
    {
      title: "Mật khẩu",
      dataIndex: "plainPassword",
      key: "plainPassword",
      render: (plainPassword: string, record: Auth) => (
        <span className="text-gray-500 break-all">
          {editingUser === record.id ? (
            <Form
              form={editForm}
              onFinish={(values) =>
                handleUpdateUser(record.id, {
                  userName: values.userName || record.userName,
                  role: record.role,
                  password: values.newPassword,
                })
              }
              initialValues={{ newPassword: plainPassword }}
            >
              <div className="flex justify-center items-center gap-x-2">
                <Form.Item
                  name="newPassword"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  ]}
                  className="mb-0"
                  style={{ width: "150px" }}
                >
                  <Input.Password
                    placeholder="Nhập mật khẩu mới"
                    style={{ height: "32px" }}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isUpdating}
                  style={{ height: "32px", padding: "0 16px" }}
                >
                  Cập nhật
                </Button>
              </div>
            </Form>
          ) : (
            plainPassword
          )}
        </span>
      ),
      width: 260,
      align: "center" as const,
    },
    {
      title: "Hành động",
      key: "action",
      render: (record: Auth) => (
        <div>
          <Button
            onClick={() => {
              setEditingUser(editingUser === record.id ? null : record.id);
              if (editingUser === record.id) {
                editForm.resetFields();
              }
            }}
            disabled={isUpdating}
          >
            {editingUser === record.id ? (
              "Hủy"
            ) : (
              <>
                <Pen size={20} />
              </>
            )}
          </Button>
          <Button
            type="primary"
            danger
            className="ml-2"
            onClick={() => handleDeleteUser(record.id)}
            disabled={record.role === "superAdmin"}
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
        <title>{getTitleTab("Quản lý người dùng")}</title>
      </Helmet>

      <div className="flex justify-between items-center flex-col md:flex-row lg:flex-row mb-6 bg-white rounded-[50px] shadow-xl p-4">
        <div className="flex items-center gap-x-6">
          <p className="text-xl">Quản lý người dùng</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setIsModalVisible(true)}
            className="border-2 mt-4 md:mt-0 lg:mt-0 w-[160px] flex justify-center items-center border-orange-500 py-2 px-5 rounded-[50px] hover:bg-[#F84563] text-[#F84563] bg-white hover:border-orange-500 hover:text-white gap-3 cursor-pointer hover:shadow-md text-lg"
          >
            <div className="flex items-center gap-x-2">
              {isCreating ? <LoadingOutlined /> : <PackagePlus size={20} />}
              <p>Thêm mới</p>
            </div>
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl hover:shadow-md shadow-xl p-10">
        {isFetching ? (
          <div className="flex justify-center">
            <LoadingOutlined  />
          </div>
        ) : fetchError ? (
          <p className="text-[#F84563]">Không có quyền truy cập</p>
        ) : (
          <Table
            columns={columns}
            dataSource={safeUsers}
            rowKey="id"
            pagination={false}
            className="w-full"
          />
        )}
      </div>

      <Modal
        title="Tạo tài khoản Admin"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateAdmin}>
          <Form.Item
            name="userName"
            label="Tên người dùng"
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng!" },
            ]}
          >
            <Input className="w-full p-3" placeholder="Nhập tên người dùng" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              className="w-full p-3"
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full p-3 bg-[#F84563] hover:bg-white hover:text-[#F84563] hover:border-orange-500 border-2 text-white rounded-[50px]"
          >
            {isCreating ? "Đang tạo..." : "Tạo tài khoản"}
          </button>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
