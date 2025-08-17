import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Create1 from "../screens/partner/promotion/Create1";
import CreatePromotion2 from "../screens/partner/promotion/CreatePromotion2";
import CreatePromotion3 from "../screens/partner/promotion/CreatePromotion3";
import CreatePromotion4 from "../screens/partner/promotion/CreatePromotion4";
import CreatePromotion5 from "../screens/partner/promotion/CreatePromotion5";

const Stack = createNativeStackNavigator();
const CreatePromotionStack = () => {
  
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: true, 
        gestureDirection: "horizontal", 
      }}
    >
      <Stack.Screen name="Create1" component={Create1} />
      <Stack.Screen name="CreatePromotion2" component={CreatePromotion2} />
      <Stack.Screen name="CreatePromotion3" component={CreatePromotion3} />
      <Stack.Screen name="CreatePromotion4" component={CreatePromotion4} />
      <Stack.Screen name="CreatePromotion5" component={CreatePromotion5} />



    </Stack.Navigator>
  );
};

export default CreatePromotionStack;
