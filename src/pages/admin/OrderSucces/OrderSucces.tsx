import { Button, Input, message, Modal, Pagination, Table } from "antd";
import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  displayErrorMessage,
  formatDateDay,
  formatPrice,
  smoothScrollToTop
} from "../../../constants/util";
import { Customer } from "../../../interfaces/Customer";
import { Parcel } from "../../../interfaces/Parcel";
import {
  useGetOrderSuccesQuery,
  useRemoveOrderSuccesMutation,
} from "../../../redux/slices/orderSuccesApiSlice";

const OrderSucces = () => {
  const [keyword, setKeyword] = useState("");
  const [exportCode, setExportCode] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const { data, isLoading } = useGetOrderSuccesQuery({
    keyword,
    page,
    per_page: perPage,
    exportCode,
  });
  const [removeOrderSucces] = useRemoveOrderSuccesMutation();
  const dataSource = data?.data || [];

  const columns = [
    {
      title: "Mã phiếu xuất kho",
      dataIndex: "exportCode",
      key: "exportCode",
      width: 150,
      render: (exportCode: string) => <div>{exportCode}</div>,
      align: "center" as const,
    },
    {
      title: "Mã khách hàng",
      dataIndex: "customer",
      key: "customerCode",
      width: 120,
      render: (customer: Customer) => <div>{customer?.customerCode}</div>,
      align: "center" as const,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customer",
      key: "fullName",
      width: 120,
      render: (customer: Customer) => <div>{customer?.fullName}</div>,
      align: "center" as const,
    },
    {
      title: "Kiện hàng",
      dataIndex: "parcels",
      key: "parcels",
      width: 80,
      render: (parcels: Parcel[]) => <div>{parcels.length}</div>,
      align: "center" as const,
    },
    {
      title: "Số tiền cần thanh toán",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 160,
      render: (totalAmount: string) => <div>{formatPrice(totalAmount)}</div>,
      align: "center" as const,
    },
    {
      title: "Thời gian xuất kho",
      dataIndex: "exportDate",
      key: "exportDate",
      width: 160,
      render: (exportDate: string) => <div>{formatDateDay(exportDate)}</div>,
      align: "center" as const,
    },
    {
      title: "Chức năng",
      render: (item: Customer) => (
        <div className="flex items-center justify-center">
          <Link to={`/admin/order-succes/${item._id}`}>
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
        <span className="text-red-500 font-title">
          Xác nhận xóa phiếu xuất kho
        </span>
      ),
      content: (
        <p className="dark:text-[#b9b7c0] ">
          Bạn có chắc chắn muốn xóa phiếu xuất kho này không?
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
              await removeOrderSucces(id).unwrap();
              message.success("Xóa phiếu xuất kho khỏi danh sách thành công");
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

  const handleSearchChange = (e: any) => {
    const value = e.target.value;
    setKeyword(value);
    smoothScrollToTop();
  };
  const handleExportCodeChange = (e: any) => {
    const value = e.target.value;
    setExportCode(value);
    smoothScrollToTop();
  };
  return (
    <div>
      <div className="flex flex-wrap gap-x-6 items-center flex-col md:flex-row lg:flex-row mb-6 bg-white rounded-[50px] shadow-xl p-4">
        <div className="flex items-center gap-x-6">
          <p className="text-xl">Quản lý kiện hàng xuất kho</p>
        </div>
        <Input
          placeholder="Lọc theo mã phiếu"
          value={exportCode}
          onChange={handleExportCodeChange}
          className="px-2 h-[44px] w-52 text-[16px]"
          allowClear
        />
        <Input
          placeholder="Lọc theo mã khách hàng"
          value={keyword}
          onChange={handleSearchChange}
          className="px-2 h-[44px] w-52 text-[16px]"
          allowClear
        />
      </div>

      <div className="p-4 bg-white rounded-3xl shadow-lg space-y-5">
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
    </div>
  );
};

export default OrderSucces;
