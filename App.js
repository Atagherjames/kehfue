// import { NavigationContainer } from "@react-navigation/native";
// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, View } from "react-native";
// import MainStack from "./navigators/MainStack";
// import { useFonts } from "expo-font";
// import { Provider } from "react-redux";
// import { store } from "./services/store";
// import { RecoilRoot, useSetRecoilState } from "recoil";
// import { useCallback, useEffect, useState } from "react";
// import * as SplashScreen from "expo-splash-screen";
// import { ToastProvider } from "react-native-toast-notifications";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { UserData, AccessToken, PartnerAccessToken } from "./recoil/UserData";
// import "react-native-gesture-handler";

// SplashScreen.preventAutoHideAsync();

// function Initializer({ children, fontsLoaded, fontError }) {
//   const setUserData = useSetRecoilState(UserData);
//   const setAccessToken = useSetRecoilState(AccessToken);
//   const setPartnerAccessToken = useSetRecoilState(PartnerAccessToken);
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     const prepare = async () => {
//       try {
//         const user = await AsyncStorage.getItem("userData");
//         const token = await AsyncStorage.getItem("accessToken");

//         const partnerToken = await AsyncStorage.getItem("partnerAccessToken");
        

//         if (token) {
//           setAccessToken(token);
//           if (user) setUserData(JSON.parse(user));
//         } else {
//           await AsyncStorage.multiRemove([
//             "accessToken",
//             "userData",
//           ]);
//         }

//         if (partnerToken) {
//           setPartnerAccessToken(partnerToken);
//         } else {
//           await AsyncStorage.multiRemove([
//             "partnerAccessToken",
//                  "userData",
//           ]);
//         }

//       } catch (e) {
//         console.log("Initializer error:", e);
//       } finally {
//         if (fontsLoaded || fontError) {
//           setReady(true);
//           await SplashScreen.hideAsync();
//         }
//       }
//     };

//     prepare();
//   }, [fontsLoaded, fontError]);

//   if (!ready) return null;
//   return children;
// }


// export default function App() {
//   const [fontsLoaded, fontError] = useFonts({
//     Bold: require("./assets/fonts/Poppins-Bold.ttf"),
//     SemiBold: require("./assets/fonts/Poppins-SemiBold.ttf"),
//     Medium: require("./assets/fonts/Poppins-Medium.ttf"),
//     Regular: require("./assets/fonts/Poppins-Regular.ttf"),
//   });

//   return (
//     <RecoilRoot>
//       <Initializer fontsLoaded={fontsLoaded} fontError={fontError}>
//         <NavigationContainer>
//           <ToastProvider>
//             <Provider store={store}>
//               <StatusBar style="dark" />
//               <View style={styles.container}>
//                 <MainStack />
//               </View>
//             </Provider>
//           </ToastProvider>
//         </NavigationContainer>
//       </Initializer>
//     </RecoilRoot>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
// });


// Persistent State for Testing purpose only
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
        const partnerToken = await AsyncStorage.getItem("partnerAccessToken");

        if (token) {
          setAccessToken(token);
          if (user) setUserData(JSON.parse(user));
        } else {
          await AsyncStorage.multiRemove(["accessToken", "userData"]);
        }

        if (partnerToken) {
          setPartnerAccessToken(partnerToken);
        } else {
          await AsyncStorage.multiRemove(["partnerAccessToken", "userData"]);
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

  // 👇 State for navigation persistence
  const [initialNavState, setInitialNavState] = useState();
  const [isNavReady, setIsNavReady] = useState(false);
  const NAV_STATE_KEY = "NAVIGATION_STATE";

  useEffect(() => {
    const restoreNavState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(NAV_STATE_KEY);
        if (savedState) {
          setInitialNavState(JSON.parse(savedState));
        }
      } catch (e) {
        console.log("Failed to load navigation state:", e);
      } finally {
        setIsNavReady(true);
      }
    };

    restoreNavState();
  }, []);

  if (!isNavReady) return null;

  return (
    <RecoilRoot>
      <Initializer fontsLoaded={fontsLoaded} fontError={fontError}>
        <NavigationContainer
          initialState={initialNavState}
          onStateChange={(state) =>
            AsyncStorage.setItem(NAV_STATE_KEY, JSON.stringify(state))
          }
        >
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
