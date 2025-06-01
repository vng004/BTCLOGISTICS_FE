import Banner from "../../components/client/Banner/Banner";
import DetailService from "../../components/client/HomePage/DetailService";
import { Introduce } from "../../components/client/HomePage/Introduce";
import ListServicePrice from "../../components/client/HomePage/ListServicePrice";
import OrderingProcedure from "../../components/client/HomePage/OrderingProcedure";
import OtherServices from "../../components/client/HomePage/OtherServices";

const HomePage = () => {
  return (
    <div className="mb-20 ">
      <Banner />
      <Introduce />
      <OtherServices />
      <OrderingProcedure/>
      <ListServicePrice />
      <DetailService/>
    </div>
  );
};

export default HomePage;
