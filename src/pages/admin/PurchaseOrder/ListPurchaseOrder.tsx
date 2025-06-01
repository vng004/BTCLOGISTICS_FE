import { useState } from "react";
import {
  useGetPurchaseOrdersQuery,
  useRemovePurchaseOrderMutation,
} from "../../../redux/slices/purchaseOrderApiSlice";
import { PurchaseOrder } from "../../../interfaces/PurchaseOrder";
import {
  Button,
  Input,
  message,
  Modal,
  Pagination,
  Table,
  TableColumnsType,
  Tag,
  TreeSelect,
} from "antd";
import {
  displayErrorMessage,
  formatDateDay,
  formatPrice,
  smoothScrollToTop,
} from "../../../constants/util";
import { Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getTitleTab } from "../../../constants/client";
import { Helmet } from "react-helmet";

const ListPurchaseOrder = () => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [perPage] = useState(6);
  const { data, isLoading } = useGetPurchaseOrdersQuery({
    keyword,
    per_page: perPage,
    page,
    status,
  });
  const [removePurchaseOrder] = useRemovePurchaseOrderMutation();

  const dataSource =
    data?.data.map((item: PurchaseOrder, index: number) => ({
      key: (page - 1) * data?.meta?.perPage + index + 1,
      ...item,
    })) || [];

  const columns: TableColumnsType<PurchaseOrder> = [
    {
      title: "STT",
      key: "key",
      dataIndex: "key",
      render: (_: any, __: any, index: number) => {
        return (
          (+data?.meta?.page - 1) * (data?.meta?.perPage || perPage) + index + 1
        );
      },
      width: 50,
      align: "center" as const,
    },
    {
      title: "Mã ĐH",
      dataIndex: "orderCode",
      key: "orderCode",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Mã MH",
      dataIndex: "purchaseCode",
      key: "purchaseCode",
      width: 160,
      align: "center" as const,
    },
    {
      title: "Mã VĐ",
      dataIndex: "trackingCode",
      key: "trackingCode",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Mã KH",
      dataIndex: "customerCode",
      key: "customerCode",
      width: 120,
      align: "center" as const,
    },
    {
      title: "Tên SP",
      dataIndex: "productName",
      key: "productName",
      width: 150,
      align: "center" as const,
    },
    {
      title: "SL",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "center" as const,
    },
    {
      title: "Tổng",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      render: (totalAmount: string) => (
        <div>{totalAmount && formatPrice(totalAmount)}</div>
      ),
      align: "center" as const,
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (createdAt: string) => <div>{formatDateDay(createdAt)}</div>,
      align: "center" as const,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
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
    },
    {
      title: "Chức năng",
      render: (item: PurchaseOrder) => (
        <div className="flex items-center justify-center">
          <Link to={`/admin/purchase-order/${item._id}`}>
            <Button type="primary">
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
      width: 100,
      align: "center" as const,
    },
  ];
  const handleRemove = (id: string) => {
    Modal.confirm({
      title: (
        <span className="text-red-500 font-title">
          Xác nhận xóa đơn hàng đặt hộ
        </span>
      ),
      content: (
        <p className="dark:text-[#b9b7c0]">
          Bạn có chắc chắn muốn xóa đơn hàng đặt hộ này không?
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
              await removePurchaseOrder(id).unwrap();
              message.success("Xóa đơn hàng khỏi danh sách thành công");
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
    setPage(1);
    smoothScrollToTop();
  };

  const handleStatus = (status: number | undefined) => {
    setStatus(status);
    setPage(1);
    console.log(status);
  };
  return (
    <div>
      <Helmet>
        <title>{getTitleTab("Quản lí đơn hàng đặt hộ")}</title>
      </Helmet>
      <div className="flex gap-x-10 items-center flex-col md:flex-row lg:flex-row mb-6 bg-white rounded-[50px] shadow-xl p-4">
        <div className="flex items-center gap-x-6">
          <p className="text-xl">Quản lý đơn hàng đặt hộ</p>
        </div>

        <Input
          placeholder="Nhập từ khóa"
          value={keyword}
          onChange={handleSearchChange}
          className="px-2 h-[44px] w-50 text-[16px]"
          allowClear
        />
        <TreeSelect
          className="w-50 px-2 h-[44px]  text-[16px]"
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          onChange={handleStatus}
          value={status}
          placeholder="Lọc theo trạng thái"
          allowClear
        >
          <TreeSelect.TreeNode value={0} title="Chưa xác nhận" />
          <TreeSelect.TreeNode value={1} title="Đã xác nhận" />
          <TreeSelect.TreeNode value={2} title="Đã đặt cọc" />
          <TreeSelect.TreeNode value={3} title="Tất toán đơn hàng" />
          <TreeSelect.TreeNode value={4} title="Đã hủy đơn" />
        </TreeSelect>
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
            pageSize={perPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ListPurchaseOrder;
