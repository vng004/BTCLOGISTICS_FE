import { message } from "antd";
export const formatDateDay = (data?: string): string => {
  if (!data) {
    return "";
  }
  const date = new Date(data);
  if (isNaN(date.getTime())) {
    return "";
  }

  const timePart = date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const datePart = date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${timePart} ngày ${datePart}`;
};

export const smoothScrollToTop = () => {
  const startY = window.scrollY; // Vị trí hiện tại
  const duration = 500; // Thời gian cuộn (ms)
  const startTime = performance.now(); // Lấy thời gian bắt đầu

  const scroll = (currentTime: number) => {
    const elapsed = currentTime - startTime; // Thời gian đã trôi qua
    const progress = Math.min(elapsed / duration, 1); // Tiến độ cuộn (giới hạn trong khoảng [0, 1])

    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // Hàm easing (mượt)

    const nextY = startY * (1 - easeInOutQuad(progress)); // Tính vị trí tiếp theo
    window.scrollTo(0, nextY); // Cuộn đến vị trí tiếp theo

    if (progress < 1) {
      requestAnimationFrame(scroll); // Tiếp tục cuộn
    }
  };

  requestAnimationFrame(scroll); // Bắt đầu cuộn
};
export const displayErrorMessage = (error: any) => {
  if (!error) return;

  const errorMessage = error?.data?.message || "Đã xảy ra lỗi không xác định";
  message.error(errorMessage, 10);
};

export const formatPrice = (
  price: string,
  currency: string = "VND",
  locale: string = "vi-VN"
): string => {
  // Chuyển price thành số nếu là string
  const numericPrice =
    typeof price === "string"
      ? parseFloat(price.replace(/[^0-9.-]+/g, ""))
      : price;

  // Kiểm tra giá trị hợp lệ
  if (isNaN(numericPrice)) {
    return "Giá không hợp lệ";
  }

  if (numericPrice < 0) {
    return "Giá không được âm";
  }

  // Làm tròn đến số nguyên gần nhất
  const roundedPrice = Math.round(numericPrice);

  // Sử dụng Intl.NumberFormat để định dạng số
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0, // Loại bỏ phần thập phân cho VND
  });

  return formatter.format(roundedPrice);
};

export const formatPriceNumber = (
  price: number,
  currency: string = "VND",
  locale: string = "vi-VN"
): string => {
  // Kiểm tra giá trị hợp lệ
  if (isNaN(price)) {
    return "Giá không hợp lệ";
  }

  if (price < 0) {
    return "Giá không được âm";
  }

  // Làm tròn đến số nguyên gần nhất
  const roundedPrice = Math.round(price);

  // Sử dụng Intl.NumberFormat để định dạng số
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0, // Loại bỏ phần thập phân cho VND
  });

  return formatter.format(roundedPrice);
};
