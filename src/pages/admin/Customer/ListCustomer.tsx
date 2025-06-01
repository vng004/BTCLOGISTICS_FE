import {
  Button,
  message,
  Modal,
  Pagination,
  Table,
  TableColumnsType,
} from "antd";
import {
  useGetCustomerQuery,
  useRemoveCustomerMutation,
} from "../../../redux/slices/customerApiSlice";
import { Customer } from "../../../interfaces/Customer";
import { Link } from "react-router-dom";
import { Eye, PackagePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  displayErrorMessage,
  smoothScrollToTop,
} from "../../../constants/util";
import { Helmet } from "react-helmet";
import { getTitleTab } from "../../../constants/client";
import { Parcel } from "../../../interfaces/Parcel";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const ListCustomer = () => {
  const { data, isLoading } = useGetCustomerQuery({});
  const [removeCustomer] = useRemoveCustomerMutation();
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const { user } = useSelector((state: RootState) => state.auth);
  const admin = user?.role === "admin";
  const dataSource = data?.data.map((item: Customer, index: number) => ({
    key: (page - 1) * data?.meta?.perPage + index + 1,
    ...item,
  }));

  const columns: TableColumnsType<Customer> = [
    {
      title: "STT",
      key: "key",
      dataIndex: "key",
      render: (_, __, index: number) => {
        return (
          (+data?.meta?.page - 1) * (data?.meta?.perPage || perPage) + index + 1
        );
      },
      width: 50,
      align: "center",
    },
    {
      title: "Mã khách hàng",
      key: "customerCode",
      dataIndex: "customerCode",
      width: 120,
      align: "center",
    },
    {
      title: "Họ tên",
      key: "fullName",
      dataIndex: "fullName",
      width: 120,
      align: "center",
    },
    {
      title: "Sđt",
      key: "phone",
      dataIndex: "phone",
      width: 100,
      align: "center",
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
      width: 140,
      align: "center",
    },
    {
      title: "Địa chỉ",
      key: "address",
      dataIndex: "address",
      width: 160,
      align: "center",
    },
    {
      title: "Số đơn",
      key: "parcels",
      dataIndex: "parcels",
      width: 90,
      align: "center",
      render: (parcels: Parcel[] | undefined) => {
        const parcelCount = parcels?.length || 0;
        return (
          <div
            style={{
              color: parcelCount === 0 ? "#999" : "#000",
              fontWeight: parcelCount > 0 ? "bold" : "normal",
            }}
          >
            {parcelCount}
          </div>
        );
      },
    },
    {
      title: "Chức năng",
      render: (_: any, item: Customer) => (
        <div className="flex items-center justify-center">
          <Link to={`/admin/customer-edit/${item._id}`}>
            <Button type="primary" className="ml-2">
              <Eye size={20} />
            </Button>
          </Link>
          <Button
            type="primary"
            danger
            className="ml-2"
            onClick={() => handleRemove(item._id)}
          >
            <Trash2 size={20} />
          </Button>
        </div>
      ),
      width: 200,
      align: "center" as const,
    },
  ];
  const handleRemove = (id: string) => {
    Modal.confirm({
      title: (
        <span className="text-red-500 font-title">Xác nhận xóa kiện hàng</span>
      ),
      content: (
        <p className="dark:text-[#b9b7c0] ">
          Bạn có chắc chắn muốn xóa kiện hàng này không?
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
              await removeCustomer(id).unwrap();
              message.success("Xóa kiện hàng khỏi danh sách thành công");
            } catch (error) {
              displayErrorMessage(error);
            }
            resolve(undefined);
          }, 666);
        });
      },
    });
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    smoothScrollToTop();
  };
  return (
    <div>
      <Helmet>
        <title>{getTitleTab("Quản lí kiện hàng")}</title>
      </Helmet>
      <div className="flex justify-between items-center flex-col md:flex-row lg:flex-row mb-3 bg-white rounded-[50px] shadow-xl p-4">
        <p className="text-xl">Danh sách khách hàng</p>
        <div className="flex justify-between items-center gap-x-2 ">
          <Link
            to={`/admin/customer-add`}
            className="border-2 mt-4 md:mt-0 lg:mt-0 w-[160px] flex justify-center items-center border-orange-500 py-2 px-5 rounded-[50px] hover:bg-[#F84563] text-[#F84563] bg-white hover:border-orange-500 hover:text-white gap-3 cursor-pointer hover:shadow-md text-lg"
          >
            <PackagePlus size={20} />
            Thêm mới
          </Link>
        </div>
      </div>
      <div className="p-4 bg-white rounded-3xl shadow-lg space-y-5">
        {admin ? (
          <div className="text-center">
            Tài khoản của bạn không có quyền truy cập
          </div>
        ) : (
          <div>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              scroll={{ x: 1000 }}
              loading={isLoading}
            />
            <div className="flex justify-end">
              <Pagination
                current={page}
                total={data?.meta?.total}
                onChange={handlePageChange}
                pageSize={data?.meta?.perPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListCustomer;
