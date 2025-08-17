import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Onboarding from "../screens/auth/Onboarding"; 
import Login from "../screens/auth/Login";
import PartnerLogin from "../screens/auth/PartnerLogin";
import SignUp from "../screens/auth/SignUp";
import SignUpOtp from "../screens/auth/SignUpOtp";
import ForgotPassword from "../screens/auth/ForgotPassword";
import ChangePassword from "../screens/auth/ChangePassword";
import AppLoader from "../components/AppLoader";

const Stack = createNativeStackNavigator();

const ONBOARDING_KEY = "hasOnboarded";

const AuthStack = () => {
  const [hasOnboarded, setHasOnboarded] = useState(null); 

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasOnboarded(value === "true");
      } catch (e) {
        setHasOnboarded(false);
      }
    };
    checkOnboarding();
  }, []);

  if (hasOnboarded === null) {
    return <AppLoader />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
      initialRouteName={hasOnboarded ? "Login" : "Onboarding"}
    >
      {!hasOnboarded && (
        <Stack.Screen name="Onboarding" component={Onboarding} />
      )}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="PartnerLogin" component={PartnerLogin} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignUpOtp" component={SignUpOtp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;
