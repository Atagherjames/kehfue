import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useRecoilState } from "recoil";
import LocationState from "../recoil/Location";
import * as Location from 'expo-location';
import { AccessToken, PartnerAccessToken } from "../recoil/UserData";
import UserStack from "./UserStack";
import AuthStack from "./AuthStack";
import { View } from "react-native";
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
