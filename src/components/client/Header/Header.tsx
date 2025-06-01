import { ArrowRightOutlined, SearchOutlined } from "@ant-design/icons";
import { Drawer, Input, Menu } from "antd";
import {
  Award,
  ClipboardCheck,
  House,
  Mail,
  MenuIcon,
  PackagePlus,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { logo_home } from "../../../constants/client";

const Header = () => {
  const [showForm, setShowForm] = useState(false);
  const [headerBg, setHeaderBg] = useState(false);
  const [keyword, setKeyword] = useState("");
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowForm(true);
      } else {
        setShowForm(false);
      }
      if (window.scrollY > 50) {
        setHeaderBg(true);
        setIsScrolled(true);
      } else {
        setHeaderBg(false);
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: any) => {
    if (!keyword.trim()) {
      e.preventDefault();
    }
  };
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const getLink = ({ isActive }: any) => {
    return `border-orange-500 text-[#F84563] px-1 lg:px-2 py-2 rounded-md border-2 ${
      isActive
        ? "bg-[#F84563] text-white border border-[#F84563]"
        : "hover:bg-[#F84563] hover:text-white hover:border-[#F84563]"
    } lg:text-lg`;
  };
  return (
    <div
      className={`fixed top-0 right-0 left-0 z-999 ${
        headerBg && "bg-white shadow-lg"
      }`}
    >
      <div
        className={` ${!isHomePage && "bg-[#F84563] text-gray-50"}  ${
          isScrolled ? "hidden" : ""
        }`}
      >
        <div className="hidden md:flex items-center justify-between max-w-[768px] md:max-w-[1024px] px-3 lg:p-1 lg:max-w-[1280px] mx-auto ">
          <div className="gap-2 flex items-center text-sm">
            <p>Hotline hỗ trợ: </p>
            <Phone width={16} />
            <Link className="hover:underline" to="tel:0889296929">
              (+84) 889296929
            </Link>
          </div>
          <div className="gap-2 flex items-center text-sm">
            <p>Email liên hệ: </p>
            <Mail width={16} />
            <a
              className="hover:underline"
              href="mailto:Adlogistics.btc@gmail.com"
            >
              Adlogistics.btc@gmail.com
            </a>
          </div>
        </div>
      </div>
      <div
        className={`flex flex-wrap justify-center lg:justify-between items-center gap-y-2  max-w-[768px] md:max-w-[1024px] p-2 lg:p-1 lg:max-w-[1280px] mx-auto  lg:pb-0  lg:pt-0  ${
          !showForm && isHomePage ? "h-[84px] " : "h-[120px] lg:h-[84px]"
        }`}
      >
        <Link
          to={"/"}
          className={`w-36 hidden lg:block ${!showForm && "hidden"}`}
        >
          <img src={logo_home} alt="LOGO" />
        </Link>

        <div className="lg:hidden flex justify-center items-center w-full relative">
          <button
            className="p-2 absolute left-0 lg:right-0 block lg:hidden"
            onClick={toggleMenu}
          >
            <MenuIcon size={30} />
          </button>

          <div className="lg:hidden left-0 absolute">
            <Drawer
              title={<p className="text-lg font-semibold">Danh mục</p>}
              placement="left"
              closable={true}
              onClose={() => setIsMenuOpen(false)}
              open={isMenuOpen}
              onClick={toggleMenu}
            >
              <Menu
                mode="vertical"
                className="text-[#1c2434] font-semibold text-[16px] md:text-lg"
                items={[
                  {
                    key: "/",
                    icon: <House size={18} />,
                    label: <Link to="/">Trang Chủ</Link>,
                  },
                  {
                    key: "/xe-dap-the-thao",
                    icon: <PackagePlus size={18} />,
                    label: <Link to="/lien-he-dat-hang">Đặt hàng hộ</Link>,
                  },
                  {
                    key: "/hang-van-chuyen-chinh-ngach",
                    icon: <ClipboardCheck size={18} />,
                    label: (
                      <Link to="/hang-van-chuyen-chinh-ngach">
                        Hàng chính ngạch
                      </Link>
                    ),
                  },
                  {
                    key: "/gioi-thieu",
                    icon: <Award size={18} />,
                    label: <Link to="/gioi-thieu">Giới thiệu</Link>,
                  },
                ]}
              />
              <div className="absolute bottom-4 md:bottom-16 text-[16px] md:text-lg space-y-3">
                <p className=" font-semibold pb-2 text-lg">Hỗ trợ</p>
                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-green-500" />
                  <p>Hotline:</p>
                  <Link
                    className=" font-semibold text-lg"
                    to="tel:0889296929
"
                  >
                    (+84) 889296929
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-red-500" />
                  <p>Email liên hệ: </p>

                  <a
                    className=" font-semibold text-lg"
                    href="mailto:Adlogistics.btc@gmail.com"
                  >
                    Adlogistics.btc@gmail.com
                  </a>
                </div>
              </div>
            </Drawer>
          </div>
          <Link to={"/"} className="w-34">
            <img src={logo_home} alt="LOGO" />
          </Link>
          <div></div>
        </div>

        <div className={`${isHomePage && !showForm ? "hidden " : ""}`}>
          <form
            action="/kien-hang"
            onSubmit={handleSubmit}
            className="flex border border-orange-500 justify-between bg-white p-2 lg:mb-0 rounded-full "
          >
            <SearchOutlined className="text-[#F84563] mr-[10px] pl-[10px]" />
            <Input
              type="text"
              name="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="bg-transparent border-none w-[250px] md:w-[440px] focus:border-transparent lg:mr-2 placeholder:text-[#706f74] 
                    text-[#706f74] "
              placeholder="Tra cứu kiện hàng"
            />
            <button
              type="submit"
              className="bg-[#F84563] rounded-full w-[30px] hover:bg-[#f9817b]"
            >
              <ArrowRightOutlined className="text-md text-white" />
            </button>
          </form>
        </div>

        <div
          className={`hidden lg:block ${
            !showForm && isHomePage ? "space-x-2 ml-80" : " space-x-2"
          }`}
        >
          <NavLink to={"/"} className={getLink}>
            Trang chủ
          </NavLink>
          <NavLink to={"/lien-he-dat-hang"} className={getLink}>
            Đặt hàng hộ
          </NavLink>
          <NavLink to={"/hang-van-chuyen-chinh-ngach"} className={getLink}>
            Hàng chính ngạch
          </NavLink>
          <NavLink to={"/gioi-thieu"} className={getLink}>
            Giới thiệu
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;
