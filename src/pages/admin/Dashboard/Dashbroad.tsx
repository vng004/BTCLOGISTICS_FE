import { DatePicker, Input } from "antd";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import moment from "moment";
import { useState } from "react";
import { useGetOrderSuccesQuery } from "../../../redux/slices/orderSuccesApiSlice";
import { formatPrice } from "../../../constants/util";

const Dashbroad = () => {
  const currentStartOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const currentEndOfMonth = moment().endOf("month").format("YYYY-MM-DD");

  // State cho ngày bắt đầu, kết thúc và mã khách hàng
  const [startDate, setStartDate] = useState<string>(currentStartOfMonth);
  const [endDate, setEndDate] = useState<string>(currentEndOfMonth);
  const [customerCode, setCustomerCode] = useState<string>("");

  const { data, isLoading, isFetching } = useGetOrderSuccesQuery({
    start_date: startDate,
    end_date: endDate,
    customerCode: customerCode || undefined,
  });
  const sortedData = data
    ? [...data.data].sort((a, b) =>
        moment(a.exportDate).diff(moment(b.exportDate))
      )
    : [];
  const dateData = sortedData.map((item: any) =>
    moment(item.exportDate).format("DD/MM/YYYY")
  );
  const revenueData = sortedData.map((item: any) => item.totalAmount || 0);
  const exportCodeData = sortedData.map((item: any) => item.exportCode);
  const customerCodeData = sortedData.map((item: any) => item.customer.customerCode);

  const option = {
    tooltip: {
      trigger: "axis",
      position: function (pt: any) {
        return [pt[0], "10%"];
      },
      formatter: function (params: any) {
        const dataIndex = params[0].dataIndex;
        return `
          <div>
            <p>Ngày: ${dateData[dataIndex]}</p>
            <p>Mã phiếu: ${exportCodeData[dataIndex]}</p>
            <p>Mã khách hàng: ${customerCodeData[dataIndex]}</p>
            <p>Doanh thu: ${formatPrice(revenueData[dataIndex])}</p>
          </div>
        `;
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: dateData,
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, "100%"],
      axisLabel: {
        formatter: function (value: number) {
          return value;
        },
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: "Doanh thu",
        type: "line",
        symbol: "none",
        sampling: "lttb",
        itemStyle: {
          color: "rgb(255, 70, 131)",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(255, 158, 68)",
            },
            {
              offset: 1,
              color: "rgb(255, 70, 131)",
            },
          ]),
        },
        data: revenueData,
      },
    ],
  };

  const handleStartDateChange = (date: any) => {
    if (date) {
      setStartDate(date.format("YYYY-MM-DD"));
    } else {
      setStartDate("");
    }
  };

  const handleEndDateChange = (date: any) => {
    if (date) {
      setEndDate(date.endOf('day').format("YYYY-MM-DD"));
    } else {
      setEndDate("");
    }
  };

  const handleCustomerCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerCode(e.target.value);
  };

  return (
    <div className="bg-white rounded-md shadow-xl p-4">
      <div className="flex flex-wrap space-y-3 justify-between items-center border-b pb-6">
        <h2 className="text-xl text-[#F84563] font-medium">
          Biểu đồ doanh thu theo thời gian
        </h2>
        <div className="text-[14px] space-x-2 flex items-center">
          <Input
            placeholder="Nhập mã khách hàng"
            value={customerCode}
            onChange={handleCustomerCodeChange}
            className="w-[200px] h-10"
            allowClear
          />
          <DatePicker
            format="DD/MM/YYYY"
            value={startDate ? moment(startDate) : null}
            onChange={handleStartDateChange}
            className="bg-white h-10"
            placeholder="Ngày bắt đầu"
          />
          <div>-</div>
          <DatePicker
            format="DD/MM/YYYY"
            value={endDate ? moment(endDate) : null}
            onChange={handleEndDateChange}
            className="bg-white h-10"
            placeholder="Ngày kết thúc"
          />
        </div>
      </div>
      <div className="mt-6">
        <p className="text-lg">
          Tổng số tiền theo mốc thời gian:
          <span className="text-[#F84563] font-medium">
            {" "}
            {formatPrice(data?.meta?.totalAmount)}
          </span>
        </p>
        <ReactECharts
          option={option}
          className="w-full min-h-[500px]"
          loadingOption={isLoading || isFetching}
        />
      </div>
    </div>
  );
};

export default Dashbroad;
