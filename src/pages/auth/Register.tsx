import { LoadingOutlined } from "@ant-design/icons";
import { Form, Input, message } from "antd";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { getTitleTab, logo_admin, logo_home } from "../../constants/client";
import { useCreateAdminMutation } from "../../redux/slices/authApiSlice";

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [register, { isLoading }] = useCreateAdminMutation();

  const onFinish = async (values: { userName: string; password: string }) => {
    try {
      await register(values).unwrap();
      message.success("Đăng ký thành công!");
      navigate("/VNG-BTCLOGISTICS-dang-nhap-trang-quan-tri");
    } catch (error: any) {
      message.error(error?.data?.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center z-10">
      <Helmet>
        <title>{getTitleTab("Đăng kí quản trị viên")}</title>
      </Helmet>
      <div className="bg-gray-100 absolute top-0 left-0 bg-gradient-to-b from-[#001529] via-[#001529] to-gray-100 bottom-0 leading-5 h-full w-full overflow-hidden"></div>
      <div className="relative min-h-screen flex justify-center gap-36 items-start pt-34 z-10">
        <div className="w-auto text-white text-center">
          <h1 className="my-3 font-semibold text-[44px]">
            Chào mừng Quản Trị Viên!
          </h1>
          <p className="pr-3 text-lg">
            Đăng ký tài khoản để vào trang quản trị của <b>BTC</b>
          </p>
          <div className="flex justify-center mt-6">
            <img src={logo_home} alt="logo" className="w-[180px]" />
          </div>
        </div>
        <Form
          form={form}
          onFinish={onFinish}
          className="space-y-6 w-[466px] bg-white p-10 rounded-lg shadow-2xl"
        >
          <div className="flex flex-col items-center justify-center text-[24px] text-gray-800 h-full">
            <img src={logo_admin} alt="logo" className="w-[80px]" />
            <p>Đăng kí vào trang quản trị</p>
          </div>

          <Form.Item
            name="userName"
            rules={[{ required: true, message: "Tên người dùng là bắt buộc!" }]}
          >
            <Input
              id="userName"
              placeholder="Tên người dùng"
              className="w-full border rounded-xl py-4 px-4 outline-none transition-all"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Mật khẩu là bắt buộc!" }]}
          >
            <Input.Password
              id="password"
              placeholder="Mật khẩu"
              className="w-full border rounded-xl py-4 px-4 outline-none transition-all"
            />
          </Form.Item>

          <motion.button
            whileHover={{
              scale: 1.01,
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full h-14 bg-[#001529] text-white rounded-lg flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <LoadingOutlined /> : "Đăng nhập"}
          </motion.button>
        </Form>
      </div>
      <svg
        className="absolute bottom-0 left-0 w-full z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#fff"
          fillOpacity="1"
          d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default Register;
