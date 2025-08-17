import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { Colors } from "../constants/colors";
import AppLogo from "../assets/svg/applogo.svg";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRecoilState, useRecoilValue } from "recoil";
import LoggedIn from "../recoil/LoggedIn";
import { PartnerAccessToken, UserData } from "../recoil/UserData";

const { width, height } = Dimensions.get("window");

const RenderItem = ({ icon, text, onPress, showForward, iconComp, disabled }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center", gap: 10, opacity: disabled ? 0.5 : 1 }}
      onPress={onPress}
      disabled={disabled}
    >
      {iconComp || <Image source={icon} style={{ width: 20, height: 20, tintColor: disabled ? '#ccc' : undefined }} />}
      <Text
        style={{
          fontSize: 14,
          color: disabled ? "#ccc" : "#8091A7",
          fontFamily: "Medium",
          flex: 1,
        }}
      >
        {text}
      </Text>
      {showForward && (
        <Entypo name="chevron-small-right" size={24} color={disabled ? "#ccc" : "black"} />
      )}
    </TouchableOpacity>
  );
};

const CustomDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-width * 0.7)).current;
  const navigation = useNavigation();
  const [openStoreDrop, setOpenStoreDrop] = useState(false);
  const [openRewardDrop, setOpenRewardDrop] = useState(false);
  const [isLoggedIn, setIsLoggedin] = useRecoilState(LoggedIn);
  const [token, setToken] = useRecoilState(PartnerAccessToken);
  const userData = useRecoilValue(UserData);

  const hasStore = userData?.hasStore;

  const toggleDrawer = () => {
    if (drawerOpen) {
      Animated.timing(drawerAnim, {
        toValue: -width * 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerOpen(false));
    } else {
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerOpen(true));
    }
  };

  // Handles press for protected screens
  const handleNavigation = (screen) => {
    toggleDrawer();
    if (hasStore) {
      navigation.navigate(screen);
    } else {
      navigation.navigate("CreateStore");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.hamburgerButton}>
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <AppLogo width={140} />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color={Colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            backgroundColor: Colors.primary,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("PartnerProfile")}
        >
          <Feather name="user" size={16} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: drawerAnim }] },
        ]}
      >
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          <RenderItem
            icon={require("../assets/icons/partner-dashboard-icon.png")}
            text={"Dashboard"}
            onPress={() => {
              toggleDrawer();
              navigation.navigate("PartnerDashboard");
            }}
          />
          <Text
            style={{
              fontFamily: "Medium",
              color: "#8091A7",
              fontSize: 16,
            }}
          >
            Pages
          </Text>

          <RenderItem
            icon={require("../assets/icons/campaign-icon.png")}
            text={"Campaign"}
            onPress={() => handleNavigation("ViewCampaigns")}
            disabled={!hasStore}
          />
          <RenderItem
            icon={require("../assets/icons/customer-icon.png")}
            text={"Customer"}
            onPress={() => handleNavigation("MembersPage")}
            disabled={!hasStore}
          />
          <RenderItem
            icon={require("../assets/icons/store-icon.png")}
            text={"Store Management"}
            onPress={() => setOpenStoreDrop(!openStoreDrop)}
            showForward
            disabled={!hasStore}
          />
          {openStoreDrop && (
            <View style={{ gap: 10 }}>
              {[
                {
                  text: "Overview",
                  onPress: () => handleNavigation("StoreOverview"),
                  disabled: !hasStore,
                },
                {
                  text: "Orders",
                  onPress: () => handleNavigation("PartnerOrders"),
                  disabled: !hasStore,
                },
                {
                  text: "Setup Store",
                  onPress: () => {
                    toggleDrawer();
                    navigation.navigate("CreateStore");
                  },
                  disabled: false,
                },
              ].map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={item.onPress}
                  disabled={item.disabled}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      paddingLeft: 25,
                      color: item.disabled ? "#ccc" : "#8091A7",
                      fontFamily: "Medium",
                    }}
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <RenderItem
            icon={require("../assets/icons/reward-icon.png")}
            text={"Reward Management"}
            onPress={() => setOpenRewardDrop(!openRewardDrop)}
            showForward
            disabled={!hasStore}
          />
          {openRewardDrop && (
            <View style={{ gap: 10 }}>
              {[
                {
                  text: "Checkout",
                  onPress: () => handleNavigation("ScanQrCode"),
                  disabled: !hasStore,
                },
                {
                  text: "Product",
                  onPress: () => handleNavigation("ViewProducts"),
                  disabled: !hasStore,
                },
              ].map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={item.onPress}
                  disabled={item.disabled}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      paddingLeft: 25,
                      color: item.disabled ? "#ccc" : "#8091A7",
                      fontFamily: "Medium",
                    }}
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <RenderItem
            icon={require("../assets/icons/moderation-icon.png")}
            text={"Moderation General"}
            onPress={() => handleNavigation("ModerationGeneral")}
            disabled={!hasStore}
          />
          <RenderItem
            iconComp={<MaterialIcons name="logout" size={24} color="red" />}
            text={"Log Out"}
            onPress={() => setToken("")}
          />
        </ScrollView>
      </Animated.View>
      {drawerOpen && (
        <Pressable
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            height,
            width,
            opacity: 1,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
          onPress={toggleDrawer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    zIndex: 1,
  },
  header: {
    width: "100%",
    height: 60,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
    zIndex: 3,
    gap: 10,
    borderBottomWidth: 0.5,
  },
  hamburgerButton: {},
  hamburgerIcon: {
    fontSize: 24,
    color: Colors.black,
  },
  drawer: {
    position: "absolute",
    width: width * 0.7,
    height: "100%",
    backgroundColor: Colors.white,
    padding: 20,
    paddingTop: 80,
    zIndex: 2,
    height,
  },
});

export default CustomDrawer;
