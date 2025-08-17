import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomDrawer from "../../components/CustomDrawer";
import {
  View,
  Text,
  Image,
  TextInput,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Colors } from "../../constants/colors";
import AppButton from "../../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const ScanPaymentSuccess = () => {
  const navigation = useNavigation();
  const route = useRoute();

  console.log(route.params);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomDrawer />
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../../assets/images/scan-payment-bg.png")}
        resizeMode="cover"
      >
        <View style={{ flex: 1, padding: 20 }}>
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              backgroundColor: Colors.white,
              borderRadius: 20,
              gap: 16,
            }}
          >
            <Image
              source={require("../../assets/images/success.png")}
              style={{ width: 70, height: 70, alignSelf: "center" }}
            />
            <Text
              style={{
                textAlign: "center",
                fontFamily: "SemiBold",
                fontSize: 18,
              }}
            >
              Payment Success
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Medium",
                fontSize: 14,
                color: Colors.textGrey,
              }}
            >
              Your payment for {route.params.fullName} has been successfully
              done
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Medium",
                fontSize: 14,
                color: Colors.textGrey,
              }}
            >
              Total Payment
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "SemiBold",
                fontSize: 24,
                color: Colors.black,
              }}
            >
              {route.params.totalPayment}KPT
            </Text>
            <View style={{ height: 0.5, backgroundColor: Colors.black }} />

            <View style={{ gap: 10 }}>
              <Text style={{ fontFamily: "Medium" }}>Payment for</Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  backgroundColor: Colors.grey,
                  padding: 20,
                  borderRadius: 20,
                }}
              >
                <Image
                  source={require("../../assets/images/scan-image.png")}
                  style={{ width: 40, height: 40 }}
                />
                <View>
                  <Text style={{ fontSize: 16, fontFamily: "SemiBold" }}>
                    {route.params.fullName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Medium",
                      color: Colors.textGrey,
                    }}
                  >
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(route.params.paymentDate))}{" "}
                    •{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }).format(new Date(route.params.paymentDate))}
                  </Text>
                </View>
              </View>
            </View>
            <AppButton btnText={"Done"} onPress={() => navigation.popToTop()} />
            <AppButton
              btnText={"Pay again"}
              btnStyles={{ backgroundColor: Colors.white }}
              btnTextStyles={{ color: Colors.primary }}
              onPress={() => navigation.navigate("ScanQrCode")}
            />
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ScanPaymentSuccess;
