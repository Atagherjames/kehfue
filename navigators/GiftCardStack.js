import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GiftCard from "../screens/features/giftcard/GiftCard";
import GiftCardDetails from "../screens/features/giftcard/GiftCardDetails";
import GiftCardPayment from "../screens/features/giftcard/GiftCardPayment";
import MyGiftCards from "../screens/features/giftcard/MyGiftCards";
import GiftCardDelivery from "../screens/features/giftcard/GiftCardDelivery";
import ViewGiftCard from "../screens/features/giftcard/ViewGiftCard";

const Stack = createNativeStackNavigator();
const GiftCardStack = () => {
  
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: true, 
        gestureDirection: "horizontal", 
      }}
    >
      {/* <Stack.Screen name="MyGiftCards" component={MyGiftCards} /> */}
      <Stack.Screen name="GiftCard" component={GiftCard} />
      <Stack.Screen name="GiftCardDetails" component={GiftCardDetails} />
      <Stack.Screen name="GiftCardDelivery" component={GiftCardDelivery} />
      <Stack.Screen name="GiftCardPayment" component={GiftCardPayment} />
      <Stack.Screen name="ViewGiftCard" component={ViewGiftCard} />



    </Stack.Navigator>
  );
};

export default GiftCardStack;
