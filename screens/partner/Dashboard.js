import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import Header from "../../components/partners/Header";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppButton from "../../components/AppButton";

const Dashboard = ({ navigation }) => {
  const [collapseLinks, setCollapseLinks] = useState(false);
  const quickLinks = [
    {
      text: "Redeem Point",
      onPress: () => navigation.navigate("ScanQrCode"),
    },
    {
      text: "CREATE NEW PROMOTION",
      onPress: () => navigation.navigate("CreatePromotionStack"),
    },
    {
      text: "manage members account",
      onPress: () => navigation.navigate("MembersPage"),
    },
    {
      text: "View Report",
      onPress: () => {},
    },
    {
      text: "Manage offers",
      onPress: () => navigation.navigate("MyOffers"),
    },
    {
      text: "manage campaign",
      onPress: () => navigation.navigate("Campaign"),
    },
    {
      text: "Manage business",
      onPress: () => navigation.navigate("AllProducts"),
    },
    {
      text: "point history",
      onPress: () => navigation.navigate("PointsDetails"),
    },
    {
      text: "configure emails",
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      <Header navigation={navigation} />

      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView>
          <View
            style={{
              flex: 1,
              padding: 20,

              gap: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: Colors.labelColor,
                fontFamily: "Bold",
              }}
            >
              Dashboard Overview
            </Text>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: Colors.labelColor,
                    fontFamily: "Bold",
                  }}
                >
                  Quick Links
                </Text>

                <TouchableOpacity
                  onPress={() => setCollapseLinks(!collapseLinks)}
                  style={{
                    padding: 10,
                  }}
                >
                  {collapseLinks ? (
                    <Ionicons name="chevron-collapse" size={24} color="black" />
                  ) : (
                    <Ionicons name="chevron-expand" size={24} color="black" />
                  )}
                </TouchableOpacity>
              </View>

              {!collapseLinks && (
                <View
                  style={{
                    gap: 20,
                    paddingHorizontal: 10,
                    marginVertical: 10,
                  }}
                >
                  {quickLinks.map((item, i) => (
                    <AppButton
                      btnText={item?.text?.toUpperCase()}
                      onPress={item.onPress}
                      key={i}
                    />
                  ))}
                </View>
              )}
            </View>
            <Text
              style={{
                backgroundColor: Colors.labelColor,
                paddingVertical: 10,
                textAlign: "center",
                backgroundColor: Colors.grey,
                fontFamily: "Regular",
              }}
            >
              KHUEFE. 2024 All Rights Reserved
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
