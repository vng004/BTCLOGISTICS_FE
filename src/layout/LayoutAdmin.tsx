import { Layout, Modal } from "antd";
import SidebarAdmin from "../components/admin/SideBar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { logout } from "../redux/slices/authSlice";

const LayoutAdmin = () => {
  const { Content } = Layout;
  const { user, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isTokenValid = (token: any) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (!decoded.exp) return false;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  const isAuthenticated =
    token && user && (user.role === "admin" || user.role === "superAdmin");

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    // Kiểm tra token hết hạn mỗi giây
    const interval = setInterval(() => {
      if (token && !isTokenValid(token)) {
        setIsModalVisible(true);
        clearInterval(interval); // Dừng interval sau khi phát hiện token hết hạn
        const timer = setTimeout(() => {
          handleLogout();
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, 1000); // Kiểm tra mỗi giây

    return () => clearInterval(interval);
  }, [token, user, navigate, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <SidebarAdmin />
        <Layout
          style={{
            marginLeft: 210,
            transition: "margin-left 0.2s",
          }}
        >
          <Content className="p-6 bg-gray-100 min-h-[360px]">
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      <Modal
        title={
          <span className="text-red-500 font-title">
            Tài khoản hết hạn đăng nhập
          </span>
        }
        open={isModalVisible}
        onOk={handleLogout}
        okText="Đăng nhập lại"
        okButtonProps={{
          style: {
            backgroundColor: "#F84563",
            borderColor: "#F84563",
            color: "#fff",
          },
        }}
        cancelButtonProps={{ style: { display: "none" } }}
        centered
        maskClosable={false}
        width={400}
      >
        <p className="text-base">
          Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại!
        </p>
      </Modal>
    </>
  );
};

export default LayoutAdmin;
