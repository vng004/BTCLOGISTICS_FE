import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Table,
  TableColumnsType,
  Tabs,
  Tag,
  TreeSelect,
  Upload,
} from "antd";
import {
  CheckCheck,
  Eye,
  FileCheck2,
  FileSliders,
  ListTodo,
  PackagePlus,
  Trash2,
  UploadIcon,
} from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { getTitleTab } from "../../../constants/client";
import {
  displayErrorMessage,
  formatDateDay,
  smoothScrollToTop,
} from "../../../constants/util";
import { Customer } from "../../../interfaces/Customer";
import { Parcel } from "../../../interfaces/Parcel";
import { useGetCustomerQuery } from "../../../redux/slices/customerApiSlice";
import { useAddParcelsForOrderSuccesMutation } from "../../../redux/slices/orderSuccesApiSlice";
import {
  useAddParcelMutation,
  useAssignToParcelMutation,
  useGetParcelsQuery,
  useInspectionParcelStatusMutation,
  useRemoveParcelMutation,
  useUpdateParcelMutation,
  useUpdateParcelStatusMutation,
} from "../../../redux/slices/parcelApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const ListParcels = () => {
  const [form] = Form.useForm();
  const { TabPane } = Tabs;
  const [keyword, setKeyword] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [startDate, setStartDate] = useState<string | "">("");
  const [endDate, setEndDate] = useState<string | "">("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const [selectedParcel, setSelectedParcel] = useState<string[]>([]);
  const [status, setStatus] = useState<number | undefined>(undefined);
  const { data, isLoading } = useGetParcelsQuery({
    keyword,
    startDate: startDate,
    endDate: endDate,
    perPage,
    page,
    shipmentStatus: status,
    customerCode,
  });
  const [packageCode, setPackageCode] = useState<string | "">("");
  const [removeParcel] = useRemoveParcelMutation();
  const [updateParcelStatus, { isLoading: isUpdating }] =
    useUpdateParcelStatusMutation();
  const [addParcel] = useAddParcelMutation();
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isModalInspectionOpen, setIsModalInspectionOpen] = useState(false);
  const [fileListUpdate, setFileListUpdate] = useState<any[]>([]);
  const [fileListInspection, setFileListInspection] = useState<any[]>([]);
  const [fileListAdd, setFileListAdd] = useState<any[]>([]);
  const [assignCustomerToParcel] = useAssignToParcelMutation();
  const { data: customerData } = useGetCustomerQuery({});
  const customers = customerData?.data || [];
  const [addParcelForOrderSucces, { isLoading: addOrder }] =
    useAddParcelsForOrderSuccesMutation();
  const [updateParcel, { isLoading: updateLoading }] =
    useUpdateParcelMutation();
  const [shipmentStatus, setShipmentStatus] = useState<number | undefined>(
    undefined
  );
  const [inspectionParcel, { isLoading: isInspection }] =
    useInspectionParcelStatusMutation();
  const dataSource =
    data?.data.map((item: Parcel, index: number) => ({
      key: (page - 1) * data?.meta?.perPage + index + 1,
      ...item,
    })) || [];
  const { user } = useSelector((state: RootState) => state.auth);
  const admin = user?.role === "admin";
  const handleSelectAllChange = () => {
    const allEligibleTrackingCodes = dataSource
      .filter((record: Parcel) => record.shipmentStatus === 3)
      .map((record: Parcel) => record.trackingCode);

    const allSelected = allEligibleTrackingCodes.every((code: any) =>
      selectedParcel.includes(code)
    );

    if (allSelected) {
      setSelectedParcel([]);
    } else {
      setSelectedParcel(allEligibleTrackingCodes);
    }
  };

  const handleInspectionChange = async (id: string, checked: boolean) => {
    try {
      await updateParcel({ id: id, inspection: checked });
      message.success("Cập nhật trạng thái kiểm hóa thành công!");
    } catch (error) {
      displayErrorMessage(error);
    }
  };

  const columns: TableColumnsType<Parcel> = [
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
      align: "center",
    },
    {
      title: "Mã bao",
      key: "packageCode",
      dataIndex: "packageCode",
      width: 110,
      align: "center",
    },
    {
      title: "Mã vận đơn",
      key: "trackingCode",
      dataIndex: "trackingCode",
      width: 110,
      align: "center",
    },

    {
      title: "Mã khách hàng",
      key: "customer",
      dataIndex: "customer",
      width: 110,
      align: "center",
      render: (customer, record) => {
        const handleAssignToParcel = async (
          newCustomerCode: string | undefined
        ) => {
          try {
            await assignCustomerToParcel({
              trackingCode: record.trackingCode,
              customerCode: newCustomerCode || customer?.customerCode,
            }).unwrap();
            message.success("Gán khách hàng cho kiện hàng thành công!");
          } catch (error) {
            displayErrorMessage(error);
          }
        };

        return (
          <div>
            <TreeSelect
              className="w-34 h-[37px]"
              treeDefaultExpandAll
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              value={customer?.customerCode}
              onChange={handleAssignToParcel}
              showSearch
              filterTreeNode={(inpValue, treeNode) =>
                treeNode.props.title
                  ?.toString()
                  .toLowerCase()
                  .includes(inpValue.toLowerCase())
              }
            >
              {(Array.isArray(customers) ? customers : []).map(
                (cust: Customer) => (
                  <TreeSelect.TreeNode
                    key={cust.customerCode}
                    value={cust.customerCode}
                    title={`${cust.customerCode}`}
                  />
                )
              )}
            </TreeSelect>
          </div>
        );
      },
    },

    {
      title: "Thời gian",
      key: "createdAt",
      dataIndex: "createdAt",
      width: 120,
      render: (createdAt: string) => <div>{formatDateDay(createdAt)}</div>,
      align: "center",
    },
    {
      title: "HQ kiểm hóa",
      key: "inspection",
      dataIndex: "inspection",
      width: 100,
      align: "center",
      render: (inspection: boolean, record: Parcel) => (
        <Checkbox
          onChange={(e) => handleInspectionChange(record._id, e.target.checked)}
          checked={inspection || false}
          disabled={updateLoading}
        />
      ),
    },
    {
      title: "Trạng thái",
      key: "shipmentStatus",
      dataIndex: "shipmentStatus",
      width: 110,
      align: "center",
      render: (shipmentStatus: 0 | 1 | 2 | 3) => (
        <Tag
          className="text-sm font-semibold py-2 px-2 min-w-[130px] text-center"
          color={
            shipmentStatus === 0
              ? "blue"
              : shipmentStatus === 1
              ? "yellow"
              : shipmentStatus === 2
              ? "cyan"
              : "green"
          }
        >
          {shipmentStatus === 0
            ? "Lưu kho TQ"
            : shipmentStatus === 1
            ? "Luân chuyển về VN"
            : shipmentStatus === 2
            ? "Lưu kho VN"
            : "Đã giao hàng"}
        </Tag>
      ),
    },
    {
      title: (
        <div className="flex justify-center items-center gap-2">
          <span>Xuất kho</span>
          <Button
            size="small"
            onClick={handleSelectAllChange}
            disabled={
              !dataSource.length ||
              dataSource.every((record: Parcel) => record.shipmentStatus !== 3)
            }
          >
            <CheckCheck size={18} />
          </Button>
        </div>
      ),
      key: "trackingCode",
      dataIndex: "trackingCode",
      width: 130,
      render: (trackingCode: string, record: Parcel) => (
        <Checkbox
          checked={selectedParcel.includes(trackingCode)}
          disabled={record.shipmentStatus !== 3}
          onChange={(e) => handleCheckboxChange(trackingCode, e.target.checked)}
        />
      ),
      align: "center",
    },
    {
      title: "Chức năng",
      render: (_: any, item: Parcel) => (
        <div className="flex items-center justify-center">
          <Link to={`/admin/parcel/${item._id}`}>
            <Button type="primary">
              <Eye size={20} />
            </Button>
          </Link>
          {!admin && (
            <Button
              type="primary"
              danger
              className="ml-2"
              onClick={() => handleRemoveParcel(item._id)}
            >
              <Trash2 size={20} />
            </Button>
          )}
        </div>
      ),
      width: 100,
      align: "center" as const,
    },
  ];

  const handleCheckboxChange = (trackingCode: string, checked: boolean) => {
    setSelectedParcel((prev) =>
      checked
        ? [...prev, trackingCode]
        : prev.filter((code) => code !== trackingCode)
    );
  };

  const handleParcelsForOrderSucces = async () => {
    try {
      await addParcelForOrderSucces(selectedParcel).unwrap();
      setSelectedParcel([]);
      message.success("Đã xuất kho thông tin kiện hàng thành công!");
    } catch (error) {
      displayErrorMessage(error);
    }
  };

  const handleRemoveParcel = (id: string) => {
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
              await removeParcel(id).unwrap();
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

  const handleSearchChange = (e: any) => {
    const value = e.target.value;
    setKeyword(value);
    setPage(1);
  };

  const handleCustomerCodeChange = (e: any) => {
    const value = e.target.value;
    setCustomerCode(value);
    setPage(1);
  };

  const handleStartDateChange = (date: any) => {
    if (date) {
      setStartDate(date.format("YYYY-MM-DD"));
      setPage(1);
      console.log(startDate);
    } else setStartDate("");
  };

  const handleEndDateChange = (date: any) => {
    if (date) {
      setEndDate(date.format("YYYY-MM-DD"));
      setPage(1);
      console.log(startDate);
    } else setEndDate("");
  };

  const handlePackageCodeChange = (e: any) => {
    setPackageCode(e.target.value);
  };

  const handleFileUpload = async (
    action: "update" | "add" | "inspection",
    fileList: any[],
    shipmentStatus?: number
  ) => {
    if (fileList.length === 0) {
      message.error("Vui lòng chọn file Excel để tải lên!");
      return;
    }

    const file = fileList[0]?.originFileObj;
    if (!file) {
      message.error("File không hợp lệ hoặc không được chọn!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (action === "update" && shipmentStatus !== undefined) {
      formData.append("shipmentStatus", shipmentStatus.toString());
      formData.append("packageCode", packageCode);
    }
    try {
      if (action === "update") {
        await updateParcelStatus(formData).unwrap();
        message.success("Cập nhật trạng thái kiện hàng thành công!");
        handleCancelUpdate();
      } else if (action === "add") {
        await addParcel(formData).unwrap();
        message.success("Thêm mới kiện hàng thành công!");
        handleCancelAdd();
      } else {
        await inspectionParcel(formData).unwrap();
        message.success("Thay đỏi trạng thái hải quan kiểm hàng thành công!");
        handleCancelAdd();
      }
      return true;
    } catch (error) {
      displayErrorMessage(error);
      console.error(error);
      return false;
    }
  };

  const handleOkAdd = async () => {
    const activeTab = form.getFieldValue("activeTab") || "1";
    if (activeTab === "1") {
      const dataFile = await handleFileUpload("add", fileListAdd);
      if (dataFile) setIsModalAddOpen(false);
    } else {
      const dataManual = await handleAddManual();
      if (dataManual) setIsModalAddOpen(false);
    }
  };

  const handleStatusChange = (checkedValues: number[]) => {
    setShipmentStatus(checkedValues[checkedValues.length - 1]);
  };

  const uploadPropsUpdate = {
    onRemove: () => {
      setFileListUpdate([]);
    },
    beforeUpload: (file: any) => {
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        message.error("Vui lòng tải lên file Excel (.xlsx hoặc .xls)!");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: (info: any) => {
      const { fileList: newFileList } = info;
      setFileListUpdate(newFileList);
    },
    fileList: fileListUpdate,
  };

  const uploadPropsInspection = {
    onRemove: () => {
      setFileListInspection([]);
    },
    beforeUpload: (file: any) => {
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        message.error("Vui lòng tải lên file Excel (.xlsx hoặc .xls)!");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: (info: any) => {
      const { fileList: newFileList } = info;
      setFileListInspection(newFileList);
    },
    fileList: fileListInspection,
  };

  const uploadPropsAdd = {
    onRemove: () => {
      setFileListAdd([]);
    },
    beforeUpload: (file: any) => {
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        message.error("Vui lòng tải lên file Excel (.xlsx hoặc .xls)!");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: (info: any) => {
      const { fileList: newFileList } = info;
      setFileListAdd(newFileList);
    },
    fileList: fileListAdd,
  };

  const showModalUpdate = () => {
    setIsModalUpdateOpen(true);
  };

  const showModalInspection = () => {
    setIsModalInspectionOpen(true);
  };

  const handleCancelUpdate = () => {
    setIsModalUpdateOpen(false);
    setFileListUpdate([]);
  };

  const showModalAdd = () => {
    setIsModalAddOpen(true);
  };

  const handleCancelInspection = () => {
    setIsModalInspectionOpen(false);
    setFileListInspection([]);
  };

  const handleCancelAdd = () => {
    setIsModalAddOpen(false);
    setFileListAdd([]);
    form.resetFields();
    form.setFieldsValue({ activeTab: "1" });
  };

  const handleAddManual = async () => {
    try {
      const values = await form.validateFields();
      const { trackingCode, weight } = values;

      try {
        await addParcel({ trackingCode, weight }).unwrap();
        message.success("Thêm mới kiện hàng thành công!");
        handleCancelAdd();
        return true;
      } catch (error) {
        displayErrorMessage(error);
        console.log(error);
        return false;
      }
    } catch (error) {
      displayErrorMessage(error);

      return false;
    }
  };

  const handleStatus = (status: number | undefined) => {
    setStatus(status);
    setPage(1);
  };
  return (
    <div className=" ">
      <Helmet>
        <title>{getTitleTab("Quản lí kiện hàng")}</title>
      </Helmet>
      <div className="flex justify-between items-center flex-col md:flex-row lg:flex-row mb-3 bg-white rounded-[50px] shadow-xl p-4">
        <p className="font-title text-xl">Danh sách kiện hàng</p>
        {admin ? (
          ""
        ) : (
          <div className="flex justify-between items-center gap-x-2 text-[16px]">
            <div
              className="border-2 mt-4 md:mt-0 lg:mt-0 w-[240px] flex justify-center items-center border-orange-500 py-2 px-5 rounded-[50px] hover:bg-[#F84563] text-[#F84563] bg-white hover:border-orange-500 hover:text-white gap-3 cursor-pointer hover:shadow-md"
              onClick={showModalInspection}
            >
              <ListTodo size={18} /> Thay đổi trạng thái HQ
            </div>
            <div
              className="border-2 mt-4 md:mt-0 lg:mt-0 w-[210px] flex justify-center items-center border-orange-500 py-2 px-5 rounded-[50px] hover:bg-[#F84563] text-[#F84563] bg-white hover:border-orange-500 hover:text-white gap-3 cursor-pointer hover:shadow-md"
              onClick={showModalUpdate}
            >
              <FileSliders size={18} /> Cập nhật trạng thái
            </div>
            <div
              className="border-2 mt-4 md:mt-0 lg:mt-0 w-[170px] flex justify-center items-center border-orange-500 py-2 px-5 rounded-[50px] hover:bg-[#F84563] text-[#F84563] bg-white hover:border-orange-500 hover:text-white gap-3 cursor-pointer hover:shadow-md"
              onClick={showModalAdd}
            >
              <PackagePlus size={18} /> Nhập kho TQ
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-white rounded-3xl shadow-lg space-y-5">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-x-6">
           <Input
              placeholder="Lọc theo mã bao, mã vận đơn"
              value={keyword}
              onChange={handleSearchChange}
              className="px-2 h-[44px] w-60  text-[16px]"
              allowClear
            />
            <Input
              placeholder="Lọc theo mã khách hàng"
              value={customerCode}
              onChange={handleCustomerCodeChange}
              className="px-2 h-[44px] w-52 text-[16px]"
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
              <TreeSelect.TreeNode value={0} title="Lưu kho TQ" />
              <TreeSelect.TreeNode value={1} title="Luân chuyển về VN" />
              <TreeSelect.TreeNode value={2} title="Lưu kho VN" />
              <TreeSelect.TreeNode value={3} title="Đã giao hàng" />
            </TreeSelect>
          </div>
          <div className="flex items-center gap-x-10">
            <div className="text-[14px] space-x-2 flex items-center">
              <DatePicker
                format="DD/MM/YYYY"
                value={startDate ? moment(startDate) : ""}
                onChange={handleStartDateChange}
                className="px-2 h-[44px]"
                placeholder="Ngày bắt đầu"
              />
              <div>-</div>
              <DatePicker
                format="DD/MM/YYYY"
                value={endDate ? moment(endDate) : ""}
                onChange={handleEndDateChange}
                className="px-2 h-[44px]"
                placeholder="Ngày Kết thúc"
              />
            </div>
            <div
              className="border-2 mt-4 md:mt-0 lg:mt-0 w-[140px] flex justify-center items-center border-orange-500 h-[44px] px-5 rounded-[50px] bg-[#F84563] text-white hover:bg-white hover:border-orange-500 hover:text-[#F84563] gap-3 hover:shadow-md cursor-pointer"
              onClick={handleParcelsForOrderSucces}
            >
              {addOrder ? <LoadingOutlined /> : <FileCheck2 size={18} />}
              Xuất kho
            </div>
          </div>
        </div>
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
        <Modal
          title="Thay đổi trạng thái hải quan kiểm hóa"
          open={isModalInspectionOpen}
          onOk={() => handleFileUpload("inspection", fileListInspection)}
          onCancel={handleCancelInspection}
          okText="Xác nhận"
          cancelText="Hủy"
          confirmLoading={isInspection}
          okButtonProps={{
            style: { backgroundColor: "#ff4667", borderColor: "#ff4667" },
          }}
          cancelButtonProps={{
            style: { borderColor: "#ff4667", color: "#ff4667" },
          }}
          width={600}
          styles={{ body: { height: 300, paddingBottom: 50 } }}
        >
          <Upload.Dragger {...uploadPropsInspection}>
            <p className="flex justify-center pb-2">
              <UploadIcon size={42} className="text-[#ff4667]" />
            </p>
            <p className="ant-upload-text">
              Kéo thả file vào đây hoặc nhấn để chọn file
            </p>
          </Upload.Dragger>
        </Modal>

        <Modal
          title="Cập nhật trạng thái kiện hàng"
          open={isModalUpdateOpen}
          onOk={() =>
            handleFileUpload("update", fileListUpdate, shipmentStatus)
          }
          onCancel={handleCancelUpdate}
          okText="Xác nhận"
          cancelText="Hủy"
          confirmLoading={isUpdating}
          okButtonProps={{
            style: { backgroundColor: "#ff4667", borderColor: "#ff4667" },
          }}
          cancelButtonProps={{
            style: { borderColor: "#ff4667", color: "#ff4667" },
          }}
          width={600}
          styles={{ body: { height: 320, paddingBottom: 50 } }}
        >
          <Form
            form={form}
            initialValues={{ activeTab: "1" }}
            layout="vertical"
            className="space-y-10 mt-6 w-full"
          >
            <div className="space-y-4">
              <Checkbox.Group
                onChange={handleStatusChange}
                value={shipmentStatus !== undefined ? [shipmentStatus] : []}
                className="flex justify-between"
              >
                <Checkbox value={1}>Luân chuyển về VN</Checkbox>
                <Checkbox value={2}>Lưu kho VN</Checkbox>
                <Checkbox value={3}>Đã giao hàng</Checkbox>
              </Checkbox.Group>

              <Form.Item
                name="packageCode"
                label={<span className="">Mã bao</span>}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền đầy đủ mã mã bao đơn hàng",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập mã bao đơn hàng"
                  id="trackingCode"
                  className="p-3"
                  onChange={handlePackageCodeChange}
                />
              </Form.Item>
            </div>
            <Form.Item className="h-40 w-full">
              <Upload.Dragger {...uploadPropsUpdate}>
                <p className="flex justify-center pb-2">
                  <UploadIcon size={42} className="text-[#ff4667]" />
                </p>
                <p className="ant-upload-text">
                  Kéo thả file vào đây hoặc nhấn để chọn file
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Thêm mới kiện hàng"
          open={isModalAddOpen}
          onOk={() => handleOkAdd()}
          onCancel={handleCancelAdd}
          okText="Xác nhận"
          cancelText="Hủy"
          confirmLoading={isUpdating}
          okButtonProps={{
            style: { backgroundColor: "#ff4667", borderColor: "#ff4667" },
          }}
          cancelButtonProps={{
            style: { borderColor: "#ff4667", color: "#ff4667" },
          }}
          width={600}
          styles={{ body: { height: 330 } }}
        >
          <Form
            form={form}
            initialValues={{ activeTab: "1" }}
            layout="vertical"
          >
            <Tabs
              defaultActiveKey="1"
              onChange={(key) => {
                form.setFieldsValue({ activeTab: key });
                if (key === "2") {
                  setFileListAdd([]);
                }
              }}
            >
              <TabPane tab="Thêm bằng file" key="1">
                <Upload.Dragger {...uploadPropsAdd}>
                  <p className="flex justify-center p-10">
                    <UploadIcon size={42} className="text-[#ff4667]" />
                  </p>
                  <p className="ant-upload-text">
                    Kéo thả file vào đây hoặc nhấn để chọn file
                  </p>
                </Upload.Dragger>
              </TabPane>
              <TabPane tab="Thêm thủ công" key="2">
                <Form.Item
                  name="trackingCode"
                  label={<span className="">Mã vận đơn (Tracking)</span>}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng điền đầy đủ mã vận đơn",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập mã vận đơn"
                    id="trackingCode"
                    className="p-3"
                  />
                </Form.Item>
                <Form.Item
                  name="weight"
                  label={<span className="">Cân nặng (kg)</span>}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng điền đầy đủ cân nặng",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập cân nặng"
                    id="weight"
                    className="p-3"
                    type="number"
                  />
                </Form.Item>
              </TabPane>
            </Tabs>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ListParcels;
