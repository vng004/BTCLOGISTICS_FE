import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  Archive,
  Banknote,
  HeartHandshake,
  LayoutDashboard,
  PackageOpen,
  PrinterCheck,
  TvMinimalPlay,
  UserCog,
  UsersRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logo_admin } from "../../constants/client";
import { logout } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";
import "../../scss/Sidebar.scss";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const SidebarAdmin = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Danh sách cơ bản không bao gồm "Tài khoản admin"
  const baseItems: MenuItem[] = [
    getItem(
      <NavLink to="/admin">Bảng tổng hợp</NavLink>,
      "1",
      <LayoutDashboard width={16} />
    ),
    getItem(
      <NavLink to="/admin/parcel">Danh sách kiện hàng</NavLink>,
      "2",
      <Archive width={16} />
    ),
    getItem("Khách hàng", "sub1", <UsersRound width={16} />, [
      getItem(
        <NavLink to={"/admin/customer"}>Danh sách Khách hàng</NavLink>,
        "3"
      ),
      getItem(
        <NavLink to={"/admin/customer-add"}>Thêm mới Khách hàng</NavLink>,
        "4"
      ),
    ]),

    getItem(
      <NavLink to="/admin/purchase-order">Đơn hàng đặt hộ</NavLink>,
      "9",
      <HeartHandshake width={16} />
    ),
    getItem(
      <NavLink to="/admin/official-good">Đơn hàng chính ngạch</NavLink>,
      "88",
      <PackageOpen width={16} />
    ),

    getItem(
      <NavLink to="/admin/order-succes">Kiện hàng xuất kho</NavLink>,
      "10",
      <PrinterCheck width={16} />
    ),
  ];

  const items: MenuItem[] =
    user?.role === "superAdmin"
      ? [
          ...baseItems,
          getItem(
            <NavLink to="/admin/exchange-rate">Tỷ giá (VNĐ/CNY)</NavLink>,
            "5",
            <Banknote width={16} />
          ),
          getItem(
            <NavLink to="/admin/banner">Banner quảng cáo</NavLink>,
            "7",
            <TvMinimalPlay width={16} />
          ),
          getItem(
            <NavLink to="/admin/auth">Tài khoản admin</NavLink>,
            "6",
            <UserCog width={16} />
          ),
        ]
      : baseItems;

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Sider
      width={215}
      className="bg-[#001529]"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="flex justify-center items-center p-3 bg-[#001529]">
        {/* <span className="text-white text-lg">BTC Logistics</span>
         */}
        <img src={logo_admin} alt="" className="w-30" />
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
        className="bg-[#001529]"
      />
      <div className="text-white flex justify-center mt-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-[#F84563] text-white rounded-lg text-center"
        >
          Đăng xuất
        </button>
      </div>
    </Sider>
  );
};

export default SidebarAdmin;
