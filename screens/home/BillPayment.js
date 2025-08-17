import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import AppHeader from "../../components/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { Image, TouchableOpacity, View, Text } from "react-native";
import BackButton from "../../components/BackButton";
import Header from "../../components/Header";

const BillPayment = () => {
  const navigation = useNavigation();
  const data = [
    {
      icon: require("../../assets/icons/bill-airtime.png"),
      text: "Airtime",
      onPress: () => navigation.navigate("Airtime"),
    },
    {
      icon: require("../../assets/icons/bill-data.png"),
      text: "Data",
      onPress: () => navigation.navigate("Data"),
    },
    {
      icon: require("../../assets/icons/bill-cable.png"),
      text: "Cable Tv",
      onPress: () => navigation.navigate("SubscriptionMain"),
    },
    {
      icon: require("../../assets/icons/bill-education.png"),
      text: "Education",
      onPress: () => {},
    },
    {
      icon: require("../../assets/icons/bill-electricity.png"),
      text: "Electricity",
      onPress: () => navigation.navigate("Electricity"),
    },
    {
      icon: require("../../assets/icons/bill-internet.png"),
      text: "Internet",
      onPress: () => navigation.navigate("Data"),
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <AppHeader />
      {/* <BackButton style={{ marginLeft: 20, marginTop: 20 }} /> */}
      <Header
        style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 70 }}
        title={"Menu"}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          rowGap: 20,
          marginTop: 20,
        }}
      >
        {data.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={{
              width: "30%",
              alignItems: "center",
              gap: 5,
            }}
            onPress={item.onPress}
          >
            <Image
              source={item.icon}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: Colors.black,
                fontSize: 12,
                fontFamily: "Medium",
              }}
            >
              {item.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default BillPayment;
