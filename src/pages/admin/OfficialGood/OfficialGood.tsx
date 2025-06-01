import { useState } from "react";
import {
  useGetOfficialGoodQuery,
  useRemoveOfficialGoodMutation,
  useUpdateOfficialGoodMutation,
} from "../../../redux/slices/officialGoodApiSlice";
import { TOfficialGood } from "../../../interfaces/OfficialGood";
import {
  Button,
  Checkbox,
  Image,
  Input,
  message,
  Modal,
  Pagination,
  Table,
  Tag,
  TreeSelect,
} from "antd";
import { Link } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import {
  displayErrorMessage,
  formatDateDay,
  smoothScrollToTop,
} from "../../../constants/util";
import { getTitleTab } from "../../../constants/client";
import { Helmet } from "react-helmet";

const OfficialGood = () => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [perPage] = useState(6);
  const { data, isLoading } = useGetOfficialGoodQuery({
    keyword,
    page: 1,
    per_page: 6,
  });
  const [removeOfficialGood] = useRemoveOfficialGoodMutation();
  const [updateOfficialGood, { isLoading: isUpdating }] =
    useUpdateOfficialGoodMutation();

  const dataSource =
    data?.data.map((item: TOfficialGood, index: number) => ({
      key: (page - 1) * data?.meta?.perPage + index + 1,
      ...item,
    })) || [];

  const handleRemove = (id: string) => {
    Modal.confirm({
      title: (
        <span className="text-red-500 font-title">
          Xác nhận xóa đơn hàng nhận báo giá
        </span>
      ),
      content: (
        <p className="dark:text-[#b9b7c0]">
          Bạn có chắc chắn muốn xóa đơn hàng nhận báo giá này không?
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
              await removeOfficialGood(id).unwrap();
            } catch (error) {
              displayErrorMessage(error);
            }
            resolve(undefined);
          }, 666);
        });
      },
    });
  };
  const handleInspectionChange = async (id: string, checked: boolean) => {
    try {
      await updateOfficialGood({ id, data: { inspection: checked } });
      message.success("Cập nhật trạng thái kiểm hóa thành công!");
    } catch (error) {
      displayErrorMessage(error);
    }
  };
const columns = [
  {
    title: "STT",
    key: "key",
    dataIndex: "key",
    render: (_: any, __: any, index: number) => (
      (+data?.meta?.page - 1) * (data?.meta?.perPage || perPage) + index + 1
    ),
    width: 50,
    align: "center" as const,
  },
  {
    title: "Tên KH",
    dataIndex: "fullName",
    key: "fullName",
    align: "center" as const,
    width: 100,
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
      <Image className="w-24" src={productImage[0] || ""} /> // Sửa w-22 thành w-24
    ),
    align: "center" as const,
    width: 100,
  },
  {
    title: "Sl kiện",
    dataIndex: "packagingDetails",
    key: "packagingDetails",
    align: "center" as const,
    render: (_: TOfficialGood["packagingDetails"], record: TOfficialGood) => (
      <div>{record.packagingDetails?.packageCount ?? "N/A"}</div>
    ),
  },
  {
    title: "HQ kiểm hóa",
    key: "inspection",
    dataIndex: "inspection",
    width: 100,
    align: "center" as const,
    render: (inspection: boolean, record: TOfficialGood) => (
      <Checkbox
        onChange={(e) => handleInspectionChange(record._id, e.target.checked)}
        checked={inspection}
        disabled={isUpdating}
      />
    ),
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
    width: 130,
    render: (status: number, record: TOfficialGood) => {
      return record.inspection ? (
        <Tag
          className="text-sm font-semibold py-2 px-2 min-w-[130px] text-center ml-2"
          color="error"
        >
          Hải quan đang kiểm hóa hàng
        </Tag>
      ) : (
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
              ? "cyan"
              : status === 4
              ? "geekblue"
              : status === 5
              ? "gold"
              : status === 6
              ? "green"
              : status === 7
              ? "lime"
              : "default"
          }
        >
          {status === 0
            ? "Tiếp nhận đơn hàng"
            : status === 1
            ? "Xử lý và báo giá"
            : status === 2
            ? "Khách đã duyệt"
            : status === 3
            ? "Đã duyệt và lên đơn"
            : status === 4
            ? "Kho TQ nhận đơn"
            : status === 5
            ? "Đang vận chuyển về VN"
            : status === 6
            ? "Hàng về kho VN"
            : status === 7
            ? "Giao hàng và thanh toán"
            : "Đơn hàng đã hoàn thành"}
        </Tag>
      );
    },
    align: "center" as const,
  },
  {
    title: "Chức năng",
    render: (item: TOfficialGood) => (
      <div className="flex items-center justify-center">
        <Link to={`/admin/official-good/${item._id}`}>
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
  const handlePageChange = (page: number) => {
    setPage(page);
    smoothScrollToTop();
  };

  const handleSearchChange = (e: any) => {
    const value = e.target.value;
    setKeyword(value);
    setPage(1); // Reset to page 1 on new search
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
        <title>{getTitleTab("Quản lí đơn hàng nhận báo giá")}</title>
      </Helmet>
      <div className="flex gap-x-10 items-center flex-col md:flex-row lg:flex-row mb-6 bg-white rounded-[50px] shadow-xl p-4">
        <div className="flex items-center gap-x-6">
          <p className="text-xl">Quản lý đơn hàng nhận báo giá</p>
        </div>

        <Input
          placeholder="Lọc theo: tên, sđt"
          value={keyword}
          onChange={handleSearchChange}
          className="px-2 h-[44px] w-50 text-[16px]"
          allowClear
        />
        <TreeSelect
          className="w-60 px-2 h-[44px]  text-[16px]"
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          onChange={handleStatus}
          value={status}
          placeholder="Lọc theo trạng thái"
          allowClear
        >
          <TreeSelect.TreeNode value={0} title="Tiếp nhận đơn hàng" />
          <TreeSelect.TreeNode value={1} title="Xử lý và báo giá" />
          <TreeSelect.TreeNode value={2} title="Khách đã duyệt" />
          <TreeSelect.TreeNode value={3} title="Đã duyệt và lên đơn" />
          <TreeSelect.TreeNode value={4} title="Kho TQ nhận đơn" />
          <TreeSelect.TreeNode value={5} title="Đang vận chuyển về VN" />
          <TreeSelect.TreeNode value={6} title="Hàng về kho VN" />
          <TreeSelect.TreeNode value={7} title="Giao hàng và thanh toán" />
          <TreeSelect.TreeNode value={8} title="Đơn hàng đã hoàn thành" />
          <TreeSelect.TreeNode value={9} title="Khách đã từ chối đặt hàng" />
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

export default OfficialGood;
