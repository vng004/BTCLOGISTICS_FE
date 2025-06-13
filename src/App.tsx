import { Navigate, Route, Routes } from "react-router-dom";
import "../src/scss/App.scss";
import "../src/scss/CheckBox.scss";
import "../src/scss/PaginationAntd.scss";
import "../src/scss/TableAntd.scss";
import "../src/scss/Banner.scss";
import Parcel from "./pages/client/Parcel/Parcel";
import LayoutAdmin from "./layout/LayoutAdmin";
import LayoutClient from "./layout/LayoutClient";
import BannerManagement from "./pages/admin/Banner/BannerManagement";
import FormCustomer from "./pages/admin/Customer/FormCustomer";
import ListCustomer from "./pages/admin/Customer/ListCustomer";
import ExchangeRate from "./pages/admin/ExchangeRate/ExchangeRate";
import DetailParcel from "./pages/admin/Parcel/DetailParcel";
import ListParcels from "./pages/admin/Parcel/ListParcels";
import UserManagement from "./pages/admin/User/UserManagement";
import LoginToAdmin from "./pages/auth/LoginToAdmin";
import HomePage from "./pages/client/HomePage";
import OrderSucces from "./pages/admin/OrderSucces/OrderSucces";
import DetailOrderSucces from "./pages/admin/OrderSucces/DetailOrderSucces";
import ListPurchaseOrder from "./pages/admin/PurchaseOrder/ListPurchaseOrder";
import DetailPurchaseOrder from "./pages/admin/PurchaseOrder/DetailPurchaseOrder";
import CreatePurchaseOrder from "./pages/client/PurchaseOrder/CreatePurchaseOrder";
import IntroduceBTC from "./pages/client/SubItem/IntroduceBTC";
import ReturnPolicyPage from "./pages/client/SubItem/ReturnPolicyPage";
import ShippingPolicy from "./pages/client/SubItem/ShippingPolicy";
import PurchasePolicy from "./pages/client/SubItem/PurchasePolicy";
import FAQ from "./pages/client/SubItem/FAQ";
import PrivacyPolicy from "./pages/client/SubItem/PrivacyPolicy";
import OfficialShipping from "./pages/client/OfficialShipping/OfficialShipping";
import OfficialGood from "./pages/admin/OfficialGood/OfficialGood";
import DetailOfficialGood from "./pages/admin/OfficialGood/DetailOfficialGood";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/admin/Dashboard/Dashbroad";

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />

          <Route path="/admin/parcel" element={<ListParcels />} />
          <Route path="/admin/parcel/:id" element={<DetailParcel />} />

          <Route path="/admin/customer" element={<ListCustomer />} />
          <Route path="/admin/customer-edit/:id" element={<FormCustomer />} />
          <Route path="/admin/customer-add" element={<FormCustomer />} />

          <Route path="/admin/exchange-rate" element={<ExchangeRate />} />

          <Route path="/admin/auth" element={<UserManagement />} />

          <Route path="/admin/banner" element={<BannerManagement />} />

          <Route path="/admin/order-succes" element={<OrderSucces />} />
          <Route
            path="/admin/order-succes/:id"
            element={<DetailOrderSucces />}
          />

          <Route path="/admin/purchase-order" element={<ListPurchaseOrder />} />
          <Route
            path="/admin/purchase-order/:id"
            element={<DetailPurchaseOrder />}
          />

          <Route path="/admin/official-good" element={<OfficialGood />} />
          <Route
            path="/admin/official-good/:id"
            element={<DetailOfficialGood />}
          />
        </Route>
        <Route path="/" element={<LayoutClient />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/kien-hang" element={<Parcel />} />
          <Route path="/lien-he-dat-hang" element={<CreatePurchaseOrder />} />
          <Route path="/gioi-thieu" element={<IntroduceBTC />} />
          <Route
            path="//hang-van-chuyen-chinh-ngach"
            element={<OfficialShipping />}
          />

          <Route path="/chinh-sach-doi-tra" element={<ReturnPolicyPage />} />
          <Route path="/chinh-sach-van-chuyen" element={<ShippingPolicy />} />
          <Route path="/chinh-sach-mua-hang" element={<PurchasePolicy />} />
          <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy />} />
          <Route path="/nhung-cau-hoi-thuong-gap" element={<FAQ />} />
        </Route>
        <Route
          path="/VNG-BTCLOGISTICS-dang-nhap-trang-quan-tri"
          element={<LoginToAdmin />}
        />
        <Route
          path="/VNG-BTCLOGISTICS-dang-ky-tai-khoan-quan-tri"
          element={<Register />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
