import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import MainStack from "./navigators/MainStack";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { store } from "./services/store";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { ToastProvider } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserData, AccessToken, PartnerAccessToken } from "./recoil/UserData";
import "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

function Initializer({ children, fontsLoaded, fontError }) {
  const setUserData = useSetRecoilState(UserData);
  const setAccessToken = useSetRecoilState(AccessToken);
  const setPartnerAccessToken = useSetRecoilState(PartnerAccessToken);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        const user = await AsyncStorage.getItem("userData");
        const token = await AsyncStorage.getItem("accessToken");
        const expiry = await AsyncStorage.getItem("tokenExpiry");

        const partnerToken = await AsyncStorage.getItem("partnerAccessToken");
        const partnerExpiry = await AsyncStorage.getItem("partnerTokenExpiry");

        if (token && expiry && Date.now() < parseInt(expiry, 10)) {
          setAccessToken(token);
          if (user) setUserData(JSON.parse(user));
        } else {
          await AsyncStorage.multiRemove([
            "accessToken",
            "userData",
            "tokenExpiry",
          ]);
        }

        if (partnerToken && partnerExpiry && Date.now() < parseInt(partnerExpiry, 10)) {
          setPartnerAccessToken(partnerToken);
        } else {
          await AsyncStorage.multiRemove([
            "partnerAccessToken",
                 "userData",
            "partnerTokenExpiry",
          ]);
        }

      } catch (e) {
        console.log("Initializer error:", e);
      } finally {
        if (fontsLoaded || fontError) {
          setReady(true);
          await SplashScreen.hideAsync();
        }
      }
    };

    prepare();
  }, [fontsLoaded, fontError]);

  if (!ready) return null;
  return children;
}


export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Bold: require("./assets/fonts/Poppins-Bold.ttf"),
    SemiBold: require("./assets/fonts/Poppins-SemiBold.ttf"),
    Medium: require("./assets/fonts/Poppins-Medium.ttf"),
    Regular: require("./assets/fonts/Poppins-Regular.ttf"),
  });

  return (
    <RecoilRoot>
      <Initializer fontsLoaded={fontsLoaded} fontError={fontError}>
        <NavigationContainer>
          <ToastProvider>
            <Provider store={store}>
              <StatusBar style="dark" />
              <View style={styles.container}>
                <MainStack />
              </View>
            </Provider>
          </ToastProvider>
        </NavigationContainer>
      </Initializer>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
