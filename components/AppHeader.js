import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import AppLogo from "../assets/svg/applogo.svg";
import AppMenuIcon from "../assets/svg/app-menu-icon.svg";
import { Colors } from "../constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRecoilState } from "recoil";
import { AccessToken, UserData } from "../recoil/UserData";
import person from "../assets/images/person.png";
import NotificationIcon from "../assets/icons/notification-icon.svg";
import CartIcon from "../assets/icons/cart-icon.svg";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useGetCartItemQuery } from "../services/routes/productRoutes";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native"

const AppHeader = ({ showMenu = true, showBackIcon }) => {
  const navigation = useNavigation()
  const [openMenu, setOpenMenu] = useState(false);
  const [accessToken, setAccessToken] = useRecoilState(AccessToken);
  const [userData, _] = useRecoilState(UserData);
  const { data, isLoading, isError } = useGetCartItemQuery({
    token: accessToken,
  });

  const cartSize = data?.cart?.data?.length;
  const menuButtons = [
    {
      text: accessToken ? "Sign out" : "Sign In",
      onPress: () => {
        if (accessToken) {
          setAccessToken("");
        }
        navigation.navigate("Login");
      },
    },
    {
      text: "Home",
      onPress: () => {},
    },
    {
      text: "Rewards",
      onPress: () => {},
    },
    {
      text: "Offers",
      onPress: () => {},
    },
    {
      text: "Cards",
      onPress: () => {},
    },
    {
      text: "Help",
      onPress: () => {},
    },
  ];

  return (
    <View
      style={{
        height: 70,
        width: Dimensions.get("window").width,
        backgroundColor: Colors.white,
      }}
    >
      <View
        style={{
          padding: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: Colors.lightGrey,
          height: 70,
        }}
      >
        <AppLogo width={140} />
        {showBackIcon && (
          <TouchableOpacity onPress={() => navigation.pop()}>
            <FontAwesome name="close" size={30} color={Colors.primary} />
          </TouchableOpacity>
        )}

        {!showBackIcon && accessToken && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("Notifications")}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={Colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
              {cartSize > 0 && (
                <Text
                  style={{
                    fontSize: 10,
                    backgroundColor: Colors.primary,
                    paddingVertical: 3,
                    paddingHorizontal: 6,
                    borderRadius: 10,
                    color: Colors.white,
                    textAlign: "center",
                    position: "absolute",
                    right: -3,
                    top: -10,
                  }}
                >
                  {cartSize}
                </Text>
              )}
              <AntDesign name="shoppingcart" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
              <Image
                source={
                  userData?.profilePicture
                    ? { uri: userData?.profilePicture?.downloadUrl }
                    : person
                }
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 18,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default AppHeader;
