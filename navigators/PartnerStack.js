import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "../screens/partner/Dashboard";
import Profile from "../screens/partner/Profile";
import MembersPage from "../screens/partner/MembersPage";
import Create1 from "../screens/partner/promotion/Create1";
import CreateOffers from "../screens/partner/offers/CreateOffers";
import Campaign from "../screens/partner/Campaign";
import PartnersTabs from "./PartnersTabs";
import Menu from "../screens/partner/Menu";
import CreatePromotion2 from "../screens/partner/promotion/CreatePromotion2";
import CreatePromotion3 from "../screens/partner/promotion/CreatePromotion3";
import CreatePromotion4 from "../screens/partner/promotion/CreatePromotion4";
import CreatePromotion5 from "../screens/partner/promotion/CreatePromotion5";
import MyOffers from "../screens/partner/offers/MyOffers";
import PreviewOffer from "../screens/partner/offers/PreviewOffer";
import CreatePromotionStack from "./CreatePromotionStack";
import UpdateOffer from "../screens/partner/offers/UpdateOffer";
import PreviewCampaign from "../screens/partner/promotion/PreviewCampaign";
import UpdatePromotion from "../screens/partner/promotion/UpdatePromotion";
import AllProducts from "../screens/partner/products/AllProducts";
import ProductDetails from "../screens/partner/products/ProductDetails";
import EditProduct from "../screens/partner/products/EditProduct";
import CreateProduct from "../screens/partner/products/CreateProduct";
import PointsDetails from "../screens/partner/PointsDetails";
import ScanQrCode from "../screens/home/ScanQrCode";
import ScanResult from "../screens/partner/ScanResult";

const Stack = createNativeStackNavigator();
const PartnerStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen name="PartnersTabs" component={PartnersTabs} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MembersPage" component={MembersPage} />
      <Stack.Screen
        name="CreatePromotionStack"
        component={CreatePromotionStack}
      />
      <Stack.Screen name="MyOffers" component={MyOffers} />
      <Stack.Screen name="CreateOffers" component={CreateOffers} />
      <Stack.Screen name="PreviewOffer" component={PreviewOffer} />
      <Stack.Screen name="UpdateOffer" component={UpdateOffer} />
      <Stack.Screen name="Campaign" component={Campaign} />
      <Stack.Screen name="PreviewCampaign" component={PreviewCampaign} />
      <Stack.Screen name="UpdatePromotion" component={UpdatePromotion} />
      <Stack.Screen name="AllProducts" component={AllProducts} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="CreateProduct" component={CreateProduct} />
      <Stack.Screen name="EditProduct" component={EditProduct} />
      <Stack.Screen name="PointsDetails" component={PointsDetails} />
      <Stack.Screen name="ScanQrCode" component={ScanQrCode} />
      <Stack.Screen name="ScanResult" component={ScanResult} />
    </Stack.Navigator>
  );
};

export default PartnerStack;
