import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Landing from "../screens/auth/Landing";
import Login from "../screens/auth/Login";
import SignUp from "../screens/auth/SignUp";
import SignUpOtp from "../screens/auth/SignUpOtp";
import HomeTabs from "./HomeTabs";
import User from "../screens/home/User";
import Airtime from "../screens/features/airtime/Index";
import Data from "../screens/features/data/Index";
import ComingSoon from "../screens/features/ComingSoon";
import AirtimeReviewOrder from "../screens/features/airtime/ReviewOrder";
import AirtimeCheckout from "../screens/features/airtime/Checkout";
import DataReviewOrder from "../screens/features/data/ReviewOrder";
import Onboarding from "../screens/auth/Onboarding";
import Merchandise from "../screens/features/merchandise/Index";
import ForgotPassword from "../screens/auth/ForgotPassword";
import ChangePassword from "../screens/auth/ChangePassword";
import Card from "../screens/home/Card";
import Offer from "../screens/home/Offer";
import Reward from "../screens/home/Reward";
import TravelHome from "../screens/travel";
import { useRecoilState } from "recoil";
import LocationState from "../recoil/Location";
import * as Location from "expo-location";
import SelectDate from "../screens/travel/SelectDate";
import LoadOffer from "../screens/home/LoadOffer";
import TvSub from "../screens/features/tvsub/Index";
import SubscriptionMain from "../screens/features/tvsub/SubscriptionMain";
import CableReviewOrder from "../screens/features/tvsub/ReviewOrder";
import PaymentProcessing from "../screens/features/PaymentProcessing";
import Electricity from "../screens/features/electricity/Index";
import ElectricityReviewOrder from "../screens/features/electricity/ReviewOrder";
import Cart from "../screens/features/merchandise/Cart";
import MerchandiseCheckout from "../screens/features/merchandise/Checkout";
import ScanQrCode from "../screens/home/ScanQrCode";
import EditProfile from "../screens/home/EditProfile";
import GiftCard from "../screens/features/giftcard/GiftCard";
import GiftCardDetails from "../screens/features/giftcard/GiftCardDetails";
import GiftCardDelivery from "../screens/features/giftcard/GiftCardDelivery";
import GiftCardPayment from "../screens/features/giftcard/GiftCardPayment";
import MyGiftCards from "../screens/features/giftcard/MyGiftCards";
import GiftCardStack from "./GiftCardStack";
import Notifications from "../screens/home/Notifications";
import BillPayment from "../screens/home/BillPayment";
import Dashboard from "../screens/home/Dashboard";

const Stack = createNativeStackNavigator();
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true, // Enable swipe gestures for navigation
        gestureDirection: "horizontal", // Set the swipe direction
      }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Airtime" component={Airtime} />
      <Stack.Screen name="AirtimeReviewOrder" component={AirtimeReviewOrder} />
      <Stack.Screen name="AirtimeCheckout" component={AirtimeCheckout} />
      <Stack.Screen name="Data" component={Data} />
      <Stack.Screen name="DataReviewOrder" component={DataReviewOrder} />
      <Stack.Screen name="Merchandise" component={Merchandise} />
      <Stack.Screen name="ComingSoon" component={ComingSoon} />
      <Stack.Screen name="Cards" component={Card} />
      <Stack.Screen name="Offers" component={Offer} />
      <Stack.Screen name="LoadOffer" component={LoadOffer} />
      <Stack.Screen name="Rewards" component={Reward} />
      <Stack.Screen name="ScanQrCode" component={ScanQrCode} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="BillPayment" component={BillPayment} />

      <Stack.Screen name="TravelHome" component={TravelHome} />
      <Stack.Screen name="SelectDate" component={SelectDate} />

      <Stack.Screen name="TvSub" component={TvSub} />
      <Stack.Screen name="SubscriptionMain" component={SubscriptionMain} />
      <Stack.Screen name="CableReviewOrder" component={CableReviewOrder} />

      <Stack.Screen name="Electricity" component={Electricity} />
      <Stack.Screen
        name="ElectricityReviewOrder"
        component={ElectricityReviewOrder}
      />

      <Stack.Screen name="PaymentProcessing" component={PaymentProcessing} />

      <Stack.Screen name="CartScreen" component={Cart} />
      <Stack.Screen
        name="MerchandiseCheckout"
        component={MerchandiseCheckout}
      />

      <Stack.Screen name="GiftCardStack" component={GiftCardStack} />
    </Stack.Navigator>
  );
};

export default HomeStack;
