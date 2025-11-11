import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeTabs from "./HomeTabs";
import User from "../screens/home/User";
import Airtime from "../screens/features/airtime/Index";
import Data from "../screens/features/data/Index";
import ComingSoon from "../screens/features/ComingSoon";
import AirtimeReviewOrder from "../screens/features/airtime/ReviewOrder";
import AirtimeCheckout from "../screens/features/airtime/Checkout";
import DataReviewOrder from "../screens/features/data/ReviewOrder";
import Merchandise from "../screens/features/merchandise/Index";
import Card from "../screens/home/Card";
import Offer from "../screens/home/Offer";
import Reward from "../screens/home/Reward";
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
import GiftCardStack from "./GiftCardStack";
import Notifications from "../screens/home/Notifications";
import BillPayment from "../screens/home/BillPayment";
import ProductDetailsScreen from "../screens/features/merchandise/ProductDetails";
import FlightPaymentScreen from "../screens/travel/FlightPaymentScreen";
import PinScreen from "../screens/home/Pin";

import Settings from "../screens/home/Settings";

// Travel / Booking

import TravelScreen from "../screens/travel/Travel";
import NewTravelScreen from "../screens/travel/NewTravel";
import SearchTickets from "../screens/travel/SearchTicket";
import TicketDetailsScreen from "../screens/travel/TicketDetails";
import FlightDetailsScreen from "../screens/travel/TravelDetails";
import FlightSuccessScreen from "../screens/travel/FlightSucess";
import CancelBookingScreen from "../screens/travel/CancelBookingScreen";
import Booking from "../screens/travel/Booking";
import BookingDetails from "../screens/travel/BookingDetails";
import NewEventScreen from "../screens/travel/NewEvent";
import EventResultsScreen from "../screens/travel/EventResult";
import EventDetailsScreen from "../screens/travel/EventDetails";
import NewHotelScreen from "../screens/travel/NewHotel";
import HotelResultsScreen from "../screens/travel/HotelResult";
import HotelDetailsScreen from "../screens/travel/HotelDetails";
import HotelBooking from "../screens/travel/HotelBooking";
import HotelSuccess from "../screens/travel/HotelSuccess";
import NewCarRentalScreen from "../screens/travel/NewCar";
import CarRentalResultsScreen from "../screens/travel/CarResult";
import CarRentalDetailsScreen from "../screens/travel/CarDetails";
import FlightTicketPaymentScreen from "../screens/travel/FlightTicketPaymentScreen";

const Stack = createNativeStackNavigator();

const UserStack = () => {
  const [location, setLocation] = useRecoilState(LocationState);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      {/* Home */}
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="EditProfile" component={EditProfile} />

      {/* Features */}
      <Stack.Screen name="Airtime" component={Airtime} />
      <Stack.Screen name="AirtimeReviewOrder" component={AirtimeReviewOrder} />
      <Stack.Screen name="AirtimeCheckout" component={AirtimeCheckout} />
      <Stack.Screen name="Data" component={Data} />
      <Stack.Screen name="DataReviewOrder" component={DataReviewOrder} />
      <Stack.Screen name="Merchandise" component={Merchandise} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="ComingSoon" component={ComingSoon} />
      <Stack.Screen name="Cards" component={Card} />
      <Stack.Screen name="Offers" component={Offer} />
      <Stack.Screen name="LoadOffer" component={LoadOffer} />
      <Stack.Screen name="Rewards" component={Reward} />
      <Stack.Screen name="ScanQrCode" component={ScanQrCode} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="BillPayment" component={BillPayment} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="PinScreen" component={PinScreen} />

      {/* Travel / Booking */}
      <Stack.Screen name="SelectDate" component={SelectDate} />
      <Stack.Screen name="Travel" component={TravelScreen} />
      <Stack.Screen name="NewTravel" component={NewTravelScreen} />
      <Stack.Screen name="SearchTickets" component={SearchTickets} />
      <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} />
      <Stack.Screen name="FlightSuccess" component={FlightSuccessScreen} />
      <Stack.Screen name="Booking" component={Booking} />
      <Stack.Screen name="BookingDetails" component={BookingDetails} />
      <Stack.Screen name="FlightDetails" component={FlightDetailsScreen} />
      <Stack.Screen name="FlightPaymentScreen" component={FlightPaymentScreen } />
      <Stack.Screen name="FlightTicketPaymentScreen" component={FlightTicketPaymentScreen } />
      <Stack.Screen name="CancelBooking" component={CancelBookingScreen} />
      <Stack.Screen name="NewEvent" component={NewEventScreen} />
      <Stack.Screen name="EventResult" component={EventResultsScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="NewHotel" component={NewHotelScreen} />
      <Stack.Screen name="HotelResult" component={HotelResultsScreen} />
      <Stack.Screen name="HotelDetails" component={HotelDetailsScreen} />
      <Stack.Screen name="HotelBooking" component={HotelBooking} />
      <Stack.Screen name="HotelSuccess" component={HotelSuccess} />
      <Stack.Screen name="NewCar" component={NewCarRentalScreen} />
      <Stack.Screen name="CarResult" component={CarRentalResultsScreen} />
      <Stack.Screen name="CarDetails" component={CarRentalDetailsScreen} />

      {/* TV / Electricity */}
      <Stack.Screen name="TvSub" component={TvSub} />
      <Stack.Screen name="SubscriptionMain" component={SubscriptionMain} />
      <Stack.Screen name="CableReviewOrder" component={CableReviewOrder} />
      <Stack.Screen name="Electricity" component={Electricity} />
      <Stack.Screen name="ElectricityReviewOrder" component={ElectricityReviewOrder} />

      {/* Payments */}
      <Stack.Screen name="PaymentProcessing" component={PaymentProcessing} />
      <Stack.Screen name="CartScreen" component={Cart} />
      <Stack.Screen name="MerchandiseCheckout" component={MerchandiseCheckout} />

      {/* GiftCards */}
      <Stack.Screen name="GiftCardStack" component={GiftCardStack} />
    </Stack.Navigator>
  );
};

export default UserStack;
