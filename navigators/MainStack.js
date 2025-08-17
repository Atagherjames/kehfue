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
import * as Location from 'expo-location';
import SelectDate from "../screens/travel/SelectDate";
import LoadOffer from "../screens/home/LoadOffer";
import { AccessToken, PartnerAccessToken } from "../recoil/UserData";
import UserStack from "./UserStack";
import AuthStack from "./AuthStack";
import { View } from "react-native";
import PartnerStack from "./PartnerStack";
import NewPartnersDrawer from "./NewPartnersDrawer";

const Stack = createNativeStackNavigator();
const MainStack = () => {
  const [token, _] = useRecoilState(AccessToken)
  const [partnerToken, __] = useRecoilState(PartnerAccessToken)
  const [___, setLocation] = useRecoilState(LocationState)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
}, []);
  
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {token ? <UserStack /> : (partnerToken ? <NewPartnersDrawer /> : <AuthStack />)}

      </View>
  );
};

export default MainStack;
