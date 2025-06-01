import { LoadingOutlined, MinusCircleOutlined } from "@ant-design/icons";
import {
  Document,
  Font,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { Form, Input, message, Modal, Space, Table } from "antd";
import { Download, FilePenLine, Plus } from "lucide-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { getTitleTab } from "../../../constants/client";
import { displayErrorMessage, formatPrice } from "../../../constants/util";
import {
  useGetOrderSuccesByIdQuery,
  useUpdateOrderSuccesMutation,
} from "../../../redux/slices/orderSuccesApiSlice";
import robotoFont from "../../../fonts/Roboto-Regular.ttf";
import { TOrderSucces } from "../../../interfaces/OrderSucces";

Font.register({
  family: "Roboto",
  src: robotoFont,
});

const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: "Roboto", fontSize: 10 },
  header: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 5,
  },
  subheader: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
    color: "#696969",
  },
  body: { marginBottom: 5 },
  textRed: { color: "#ef4444", fontWeight: "bold" },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#d3d3d3",
  },
  tableRow: { flexDirection: "row" },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#d3d3d3",
    padding: 5,
    textAlign: "center",
  },
  tableHeader: {
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#d3d3d3",
  },
  signature: {
    width: "30%",
    textAlign: "right",
  },
  highlighted: { backgroundColor: "#FFFF00" },
  note: {
    fontSize: 10,
    marginTop: 5,
    textAlign: "center",
  },
});

interface PDFDocumentProps {
  data: TOrderSucces | undefined;
}

const PDFDocument = ({ data }: PDFDocumentProps) => {
  const parcels = data?.parcels || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>PHIẾU XUẤT KHO</Text>
        <Text style={styles.subheader}>{data?.exportCode}</Text>
        <Text style={[styles.body]}>
          Mã Khách Hàng:{" "}
          <Text style={styles.textRed}>{data?.customer?.customerCode}</Text>
        </Text>
        <Text style={[styles.body]}>
          Tên Khách Hàng:{" "}
          <Text style={styles.textRed}>{data?.customer?.fullName}</Text>
        </Text>
        <Text style={[styles.body]}>
          Ngày Xuất Kho:{" "}
          <Text style={styles.textRed}>
            {data?.exportDate &&
              new Date(data.exportDate).toLocaleDateString("vi-VN")}
          </Text>
        </Text>
        <Text style={[styles.body]}>
          Thông Tin Hàng:{" "}
          <Text style={styles.textRed}>{data?.parcelInformation}</Text>
        </Text>
        <Text style={styles.note}>
          lưu ý: cân nặng quy đổi bằng dài*rộng*cao/6000
        </Text>
        <View />
        <View style={styles.table}>
          {/* Header của bảng */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCol, { width: "6%" }]}>
              <Text>STT</Text>
            </View>
            <View style={[styles.tableCol, { width: "34%" }]}>
              <Text>Mã Vận Đơn</Text>
              <Text>(TRACKING)</Text>
            </View>
            <View style={[styles.tableCol, { width: "9%" }]}>
              <Text>Số Lượng</Text>
            </View>
            <View style={[styles.tableCol, { width: "9%" }]}>
              <Text>Cân Nặng</Text>
            </View>
            <View style={[styles.tableCol, { width: "6%" }]}>
              <Text>Dài</Text>
            </View>
            <View style={[styles.tableCol, { width: "6%" }]}>
              <Text>Rộng</Text>
            </View>
            <View style={[styles.tableCol, { width: "6%" }]}>
              <Text>Cao</Text>
            </View>
            <View style={[styles.tableCol, { width: "12%" }]}>
              <Text>M3 Thực Tính</Text>
            </View>
            <View style={[styles.tableCol, { width: "12%" }]}>
              <Text>Cân Thực Tính</Text>
            </View>
          </View>
          {/* Dữ liệu kiện hàng */}
          {parcels.map((parcel:any, index:any) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text>{index + 1}</Text>
              </View>
              <View style={[styles.tableCol, { width: "34%" }]}>
                <Text>{parcel.trackingCode}</Text>
              </View>
              <View style={[styles.tableCol, { width: "9%" }]}>
                <Text>{parcel.quantity}</Text>
              </View>
              <View style={[styles.tableCol, { width: "9%" }]}>
                <Text>{parcel.weight}</Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text>{parcel.length}</Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text>{parcel.width}</Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text>{parcel.height}</Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text>{parcel.actualCubicMeter}</Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text>{parcel.actualWeight}</Text>
              </View>
            </View>
          ))}
          {/* Tổng Khối / Cân Thực Tính (m3,KG) */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "76%" }]}>
              <Text>Tổng Khối / Cân Thực Tính (M3,KG)</Text>
            </View>
            <View style={[styles.tableCol, { width: "12%" }]}>
              <Text>
                {formatPrice(data?.totalActualWeight?.totalActualWeight1!)}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "12%" }]}>
              <Text>
                {formatPrice(data?.totalActualWeight?.totalActualWeight2!) ||
                  "0"}
              </Text>
            </View>
          </View>
          {/* Bảng Giá Vận Chuyển (TG:3650) */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "76%" }]}>
              <Text>Bảng Giá Vận Chuyển (TG:3650)</Text>
            </View>
            <View style={[styles.tableCol, { width: "12%" }]}>
              <Text>
                {formatPrice(data?.transportFeeRate?.transportFeeRate1!)}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "12%" }]}>
              <Text>
                {formatPrice(data?.transportFeeRate?.transportFeeRate2!)}
              </Text>
            </View>
          </View>
          {/* Phụ Thu Đóng Gỗ Bảo Hiểm */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "76%" }]}>
              <Text>Phụ Thu Đóng Gỗ Bảo Hiểm</Text>
            </View>
            <View style={[styles.tableCol, { width: "24%" }]}>
              <Text>{formatPrice(data?.transportFeeNote!)}</Text>
            </View>
          </View>
          {/* Phí Ủy Thác Nhập Khẩu */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "76%" }]}>
              <Text>Phí Ủy Thác Nhập Khẩu</Text>
            </View>
            <View style={[styles.tableCol, { width: "24%" }]}>
              <Text>{formatPrice(data?.importEntrustmentFee!)}</Text>
            </View>
          </View>
          {/* Phí Ship */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "76%" }]}>
              <Text>Phí Ship</Text>
            </View>
            <View style={[styles.tableCol, { width: "24%" }]}>
              <Text>{formatPrice(data?.shipFeeNote!)}</Text>
            </View>
          </View>
          {/* Custom Services */}
          {data?.customServices?.map((c:any, index:any) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "76%" }]}>
                <Text>{c.name}</Text>
              </View>
              <View style={[styles.tableCol, { width: "24%" }]}>
                <Text>{formatPrice(c.value)}</Text>
              </View>
            </View>
          ))}
          {/* Số Tiền Cần Thanh Toán (VNĐ) */}
          <View style={[styles.tableRow, styles.highlighted]}>
            <View style={[styles.tableCol, { width: "76%" }]}>
              <Text>Số Tiền Cần Thanh Toán (VNĐ)</Text>
            </View>
            <View style={[styles.tableCol, { width: "24%" }]}>
              <Text>{formatPrice(data?.totalAmount!)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const DetailOrderSucces = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { data } = useGetOrderSuccesByIdQuery(id, {
    skip: !id,
  });
  const [updateOrderSucces, { isLoading }] = useUpdateOrderSuccesMutation();

  useEffect(() => {
    if (data) {
      const orderSucces = data;
      form.setFieldsValue({
        totalActualWeight: {
          totalActualWeight1:
            (orderSucces.totalActualWeight?.totalActualWeight1) || "",
          totalActualWeight2:
            orderSucces.totalActualWeight?.totalActualWeight2 || "",
        },
        transportFeeRate: {
          transportFeeRate1:
            formatPrice(orderSucces.transportFeeRate?.transportFeeRate1) || "",
          transportFeeRate2:
            formatPrice(orderSucces.transportFeeRate?.transportFeeRate2) || "",
        },
        transportFeeNote: formatPrice(orderSucces.transportFeeNote) || "",
        shipFeeNote: formatPrice(orderSucces.shipFeeNote) || "",
        totalAmount: formatPrice(orderSucces.totalAmount) || "",
        parcelInformation: orderSucces?.parcelInformation,
        importEntrustmentFee: formatPrice(orderSucces?.importEntrustmentFee),
        customServices: orderSucces?.customServices || [],
        parcels: orderSucces?.parcels || [],
      });
    }
  }, [data, form]);

  const onFinish = async (values: TOrderSucces) => {
    Modal.confirm({
      title: (
        <span className="text-[#F84563] font-title">
          Xác nhận cập nhật phiếu xuất kho
        </span>
      ),
      content: (
        <p className="dark:text-[#b9b7c0] ">
          Bạn có chắc chắn muốn cập nhật phiếu xuất kho này?
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
      onOk: async () => {
        try {
          if (!id) {
            message.error("Không tìm thấy id phiếu xuất kho!");
            return;
          }
          await updateOrderSucces({
            id,
            data: values,
          }).unwrap();

          message.success("Cập nhật OrderSucces thành công!");
        } catch (error: any) {
          displayErrorMessage(error);
        }
      },
    });
  };

  return (
    <div className="">
      <Helmet>
        <title>{getTitleTab(`Quản lí file xuất kiện hàng`)}</title>
      </Helmet>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className=" bg-white shadow-md p-10 rounded-md"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold">PHIẾU XUẤT KHO</h1>
          <p className="text-lg">{data?.exportCode}</p>
        </div>

        <div className="mb-4 text-lg space-y-2">
          <div className="flex items-center justify-between w-[600px]">
            <p>Mã Khách Hàng:</p>
            <span className="text-red-400 font-semibold">
              {data?.customer?.customerCode}
            </span>
          </div>
          <div className="flex items-center justify-between w-[600px]">
            <p>Tên Khách Hàng:</p>
            <span className="text-red-400 font-semibold">
              {data?.customer?.fullName}
            </span>
          </div>
          <div className="flex items-center justify-between w-[600px]">
            <p>Ngày xuất kho:</p>
            <span className="text-red-400 font-semibold">
              {data?.exportDate
                ? new Date(data.exportDate).toLocaleDateString("vi-VN")
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-between w-[600px]">
            <p>Thông tin hàng</p>
            <Form.Item name="parcelInformation">
              <Input className="w-[300px] h-10 text-base" />
            </Form.Item>
          </div>
        </div>

        <div>
          <Form.List name="parcels">
            {(fields) => (
              <Table
                columns={[
                  {
                    title: "STT",
                    dataIndex: "index",
                    key: "index",
                    render: (_: any, __: any, index: number) => index + 1,
                    width: 50,
                    align: "center" as const,
                  },
                  {
                    title: "MÃ VẬN ĐƠN",
                    dataIndex: "trackingCode",
                    key: "trackingCode",
                    align: "center" as const,
                    render: (text: string) => <span>{text}</span>,
                  },
                  {
                    title: "SỐ LƯỢNG",
                    dataIndex: "quantity",
                    key: "quantity",
                    align: "center" as const,
                    render: (_: any, __: any, index: number) => (
                      <Form.Item name={[index, "quantity"]} noStyle>
                        <Input
                          type="number"
                          className="h-10 text-center text-base w-20"
                          placeholder="Số lượng"
                        />
                      </Form.Item>
                    ),
                  },
                  {
                    title: "THUỘC TÍNH",
                    dataIndex: "weight",
                    key: "weight",
                    align: "center" as const,
                    render: (text: string) => <span>{text}</span>,
                  },
                  {
                    title: "D",
                    dataIndex: "length",
                    key: "length",
                    align: "center" as const,
                    render: (_: string, __: any, index: number) => (
                      <Form.Item name={[index, "length"]} noStyle>
                        <Input className="h-10 text-center text-base w-20" />
                      </Form.Item>
                    ),
                  },
                  {
                    title: "R",
                    dataIndex: "width",
                    key: "width",
                    align: "center" as const,
                    render: (_: string, __: any, index: number) => (
                      <Form.Item name={[index, "width"]} noStyle>
                        <Input className="h-10 text-center text-base w-20" />
                      </Form.Item>
                    ),
                  },
                  {
                    title: "C",
                    dataIndex: "height",
                    key: "height",
                    align: "center" as const,
                    render: (_: string, __: any, index: number) => (
                      <Form.Item name={[index, "height"]} noStyle>
                        <Input className="h-10 text-center text-base w-20" />
                      </Form.Item>
                    ),
                  },
                  {
                    title: "M3 THỰC TÍNH",
                    dataIndex: "actualCubicMeter",
                    key: "actualCubicMeter",
                    align: "center" as const,
                    render: (_: string, __: any, index: number) => (
                      <Form.Item name={[index, "actualCubicMeter"]} noStyle>
                        <Input className="h-10 text-center text-base w-20" />
                      </Form.Item>
                    ),
                  },
                  {
                    title: "CÂN NẶNG THỰC",
                    dataIndex: "actualWeight",
                    key: "actualWeight",
                    align: "center" as const,
                    render: (_: string, __: any, index: number) => (
                      <Form.Item name={[index, "actualWeight"]} noStyle>
                        <Input className="h-10 text-center text-base w-20" />
                      </Form.Item>
                    ),
                  },
                ]}
                dataSource={fields.map((field, index) => ({
                  ...data?.parcels[index],
                  key: field.name,
                }))}
                pagination={false}
                bordered
                className=""
              />
            )}
          </Form.List>
        </div>
        <div className="text-lg ">
          <div className="flex justify-between ">
            <p>Tổng Khối / Cân Thực Tính (m3,KG)</p>
            <div className="flex">
              <Form.Item
                name={["totalActualWeight", "totalActualWeight1"]}
                noStyle
              >
                <Input
                  className="h-10 text-center text-base w-[146px] "
                  readOnly
                />
              </Form.Item>
              <Form.Item
                name={["totalActualWeight", "totalActualWeight2"]}
                noStyle
              >
                <Input
                  className="h-10 text-center text-base w-[164px]"
                  readOnly
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-between">
            <p>Đơn Giá Vận Chuyển</p>
            <div className="flex">
              <Form.Item
                name={["transportFeeRate", "transportFeeRate1"]}
                noStyle
              >
                <Input className="h-10 text-center text-base w-[146px]" />
              </Form.Item>
              <Form.Item
                name={["transportFeeRate", "transportFeeRate2"]}
                noStyle
              >
                <Input className="h-10 text-center text-base w-[164px]" />
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-between">
            <p>Phụ Thu Đóng Gỗ Bảo Hiểm</p>
            <Form.Item name="transportFeeNote" className="w-[310px]">
              <Input
                className="h-10 text-center text-base"
                placeholder="Nhập phụ thu đóng gỗ bảo hiểm"
              />
            </Form.Item>
          </div>
          <div className="flex justify-between">
            <p>Phí Ủy Thác Nhập Khẩu</p>
            <Form.Item name="importEntrustmentFee" className="w-[310px]">
              <Input
                className="h-10 text-center text-base"
                placeholder="Nhập phí ủy thác nhập khẩu"
              />
            </Form.Item>
          </div>
          <div className="flex justify-between">
            <p>Phí Ship</p>
            <Form.Item name="shipFeeNote" className="w-[310px]">
              <Input
                className="h-10 text-center text-base"
                placeholder="Nhập phí ship"
              />
            </Form.Item>
          </div>

          <div className="">
            <Form.List name="customServices">
              {(fields, { add, remove }) => (
                <>
                  <div className="flex gap-10 text-lg font-semibold items-center">
                    <p>Chỉnh Sửa Dịch Vụ Tùy Chỉnh</p>
                    <button
                      type="button"
                      onClick={() => add()}
                      className="border-2 w-[200px] flex justify-center items-center border-orange-500 py-2 px-3 rounded-[50px] hover:bg-[#F84563] text-[#F84563] bg-white hover:border-orange-500 hover:text-white gap-3 cursor-pointer hover:shadow-md"
                    >
                      <Plus size={17} /> Thêm dịch vụ
                    </button>
                  </div>
                  <div className="">
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} className="flex justify-between">
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          label="Tên Dịch Vụ"
                        >
                          <Input
                            placeholder="Tên dịch vụ"
                            className="h-10 text-center w-[400px] text-base"
                          />
                        </Form.Item>
                        <div className="relative">
                          <Form.Item
                            {...restField}
                            name={[name, "value"]}
                            label="Giá Trị (VNĐ)"
                            className="w-[310px] relative"
                          >
                            <Input
                              placeholder="Giá trị"
                              className="h-10 text-center text-base"
                            />
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            className="text-red-500 absolute right-0 top-0 text-lg"
                            title="Xóa"
                          />
                        </div>
                      </Space>
                    ))}
                  </div>
                </>
              )}
            </Form.List>
          </div>
          <div className="flex justify-between">
            <p>Số Tiền Cần Thanh Toán (VNĐ)</p>
            <Form.Item
              name="totalAmount"
              className="w-[310px]"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số tiền cần thanh toán!",
                },
              ]}
            >
              <Input
                className="h-10 text-center text-base"
                placeholder="Nhập số tiền cần thanh toán"
              />
            </Form.Item>
          </div>
        </div>

        <div className=" space-x-4 flex justify-between items-center">
          <button
            type="submit"
            disabled={isLoading}
            className="border-2 mt-4 md:mt-0 lg:mt-0 w-[48%] flex justify-center items-center  py-3 px-5 text-lg rounded-[50px] bg-[#F84563] hover:text-[#F84563] hover:bg-white hover:border-orange-500 text-white gap-3 cursor-pointer hover:shadow-md"
          >
            {isLoading ? <LoadingOutlined /> : <FilePenLine size={18} />}
            Cập nhật
          </button>
          {data && (
            <PDFDownloadLink
              document={<PDFDocument data={data} />}
              fileName={`${data?.exportCode}.pdf`}
              className="border-2 mt-4 md:mt-0 lg:mt-0 w-[48%] flex justify-center items-center  py-3 px-5 text-lg rounded-[50px] bg-[#F84563] hover:text-[#F84563] hover:bg-white hover:border-orange-500 text-white gap-3 cursor-pointer hover:shadow-md"
            >
              <Download size={18} />
              Xuất PDF
            </PDFDownloadLink>
          )}
        </div>
      </Form>
    </div>
  );
};

export default DetailOrderSucces;
