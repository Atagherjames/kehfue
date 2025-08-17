import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Dimensions, Image, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Colors } from "../constants/colors";

// Icons
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import HomeIcon from "../assets/icons/home-icon.svg";
import OfferIcon from "../assets/icons/offer-icon.svg";
import RewardIcon from "../assets/icons/reward-icon.svg";
import CardIcon from "../assets/icons/card-icon.svg";
import Offer from "../screens/home/Offer.js";
import Card from "../screens/home/Card.js";
import Reward from "../screens/home/Reward.js";
import UserCard from "../screens/home/UserCard.js";
import Menu from "../screens/partner/Menu.js";
import Notifications from "../screens/partner/Notifications.js";
import Dashboard from "../screens/partner/Dashboard.js";
import StoreOverview from "../screens/partner/store/StoreOverview.js"
import PartnersSettings from "../screens/partner/Settings.js";

const Tab = createBottomTabNavigator();

const PartnersTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = focused ? (
              <AntDesign name="home" size={24} color={Colors.white} />
            ) : (
              <AntDesign name="home" size={24} color="#7D7399" />
            );
          } else if (route.name === "Menu") {
            iconName = focused ? (
              <Feather name="menu" size={24} color={Colors.white} />
            ) : (
              <Feather name="menu" size={24} color="#7D7399" />
            );
          } else if (route.name === "Notification") {
            iconName = focused ? (
              <Ionicons name="notifications" size={24} color={Colors.white} />
            ) : (
              <Ionicons name="notifications" size={24} color="#7D7399" />
            );
          } else if (route.name === "Card") {
            iconName = focused ? <CardIcon /> : <CardIcon />;
          } else if (route.name === "Settings") {
            iconName = focused ? (
              <Ionicons name="settings-sharp" size={24} color={Colors.white} />
            ) : (
              <Ionicons name="settings-sharp" size={24} color="#7D7399" />
            );
          } else {
            iconName = focused ? (
              <Feather name="user" size={24} color={Colors.white} />
            ) : (
              <Feather name="user" size={24} color={Colors.primary} />
            );
          }

          return iconName;
        },
        tabBarStyle: {
          height: Platform.OS == "ios" ? 65 : 60,
          backgroundColor: Colors.primary,
          paddingHorizontal: 15,
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
          borderTopEndRadius: 20,
          borderTopLeftRadius: 20,
        },
        tabBarActiveTintColor: Colors.white,
        tabBarLabelStyle: {
          fontFamily: "Medium",
          fontSize: 12,
          letterSpacing: 0.2,
        },
        tabBarInactiveTintColor: Colors.footerGrey,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarLabel: "Menu",
        }}
      />
      {/* <Tab.Screen 
        name="Reward" 
        component={Reward} 
        options={{
            tabBarLabel: "Reward"
        }}
      /> */}
      {/* <Tab.Screen 
        name="Offer" 
        component={Offer} 
        options={{
            tabBarLabel: "Offer"
        }}
      /> */}
      {/* <Tab.Screen 
        name="Card" 
        component={UserCard} 
        options={{
            tabBarLabel: "Card"
        }}
      /> */}
      <Tab.Screen
        name="Notification"
        component={Notifications}
        options={{
          tabBarLabel: "Notification",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={PartnersSettings}
        options={{
          tabBarLabel: "Settings",
        }}
      />

      {/* <Tab.Screen 
        name="Cards" 
        component={Card} 
        options={{
            tabBarLabel: "Cards"
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default PartnersTabs;
