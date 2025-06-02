import { LoadingOutlined } from "@ant-design/icons";
import { Form, Input, message } from "antd";
import { FilePenLine, PackagePlus } from "lucide-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { getTitleTab } from "../../../constants/client";
import { displayErrorMessage, formatDateDay } from "../../../constants/util";
import {
  useAddExchangeRateMutation,
  useGetExchangeRateQuery,
  useUpdateExchangeRateMutation,
} from "../../../redux/slices/exchangeRateApiSlice";

const ExchangeRate = () => {
  const [form] = Form.useForm();
  const {
    data,
    isLoading: isFetching,
  } = useGetExchangeRateQuery();
  const [addExchangeRate, { isLoading: isAdding }] =
    useAddExchangeRateMutation();

  const [updateExchangeRate, { isLoading: isUpdating }] =
    useUpdateExchangeRateMutation();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        rate: data.rate,
      });
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const onFinish = async (values: { rate: string }) => {
    try {
      if (data) {
        await updateExchangeRate(values).unwrap();
        message.success("Cập nhật tỷ giá thành công!");
      } else {
        await addExchangeRate(values).unwrap();
        message.success("Thêm mới tỷ giá thành công!");
      }
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  return (
    <div className="">
      <Helmet>
        <title>{getTitleTab("Quản lý tỷ giá")}</title>
      </Helmet>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          rate: "",
        }}
      >
        <div className="flex justify-between items-center flex-col md:flex-row lg:flex-row mb-6 bg-white rounded-[50px] shadow-xl p-4">
          <div className="flex items-center gap-x-6">
            <p className="text-xl">Quản lý tỷ giá</p>
          </div>
          <button
            type="submit"
            disabled={isAdding || isUpdating || isFetching}
            className="border-2 mt-4 md:mt-0 lg:mt-0 w-[160px] flex justify-center items-center border-orange-500 py-2 px-5 rounded-[50px] hover:bg-[#F84563] text-[#F84563] bg-white hover:border-orange-500 hover:text-white gap-3 cursor-pointer hover:shadow-md text-lg"
          >
            {data ? (
              <div className="flex items-center gap-x-2">
                {isUpdating ? <LoadingOutlined /> : <FilePenLine size={20} />}
                <p>Cập nhật</p>
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                {isAdding ? <LoadingOutlined /> : <PackagePlus size={20} />}
                <p>Thêm mới</p>
              </div>
            )}
          </button>
        </div>

        <div className="bg-white rounded-3xl hover:shadow-md shadow-xl p-10">
          {isFetching ? (
            <div className="flex justify-center">
              <LoadingOutlined />
            </div>
          ) : (
            <>
              <Form.Item
                name="rate"
                label="Tỷ giá (VND/CNY)"
                rules={[
                  { required: true, message: "Vui lòng nhập tỷ giá!" },
                  {
                    pattern: /^[0-9]+(\.[0-9]+)?$/,
                    message:
                      "Tỷ giá phải là một số hợp lệ (ví dụ: 3500 hoặc 3500.5)!",
                  },
                ]}
              >
                <Input className="w-full p-3" placeholder="Nhập tỷ giá" />
              </Form.Item>

              {data && (
                <div className="space-y-2 text-[16px]">
                  <p>
                    Thời gian tạo:{" "}
                    <span className="font-semibold text-green-600">
                      {formatDateDay(data.createdAt)}
                    </span>
                  </p>
                  <p>
                    Thời gian cập nhật:{" "}
                    <span className="font-semibold text-red-600">
                      {formatDateDay(data.updatedAt)}
                    </span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Form>
    </div>
  );
};

export default ExchangeRate;
