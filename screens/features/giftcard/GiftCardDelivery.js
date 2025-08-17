import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../components/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../../constants/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View, Image, Text } from "react-native";
import { AppDefaultInput } from "../../../components/AppInput";
import AppButton from "../../../components/AppButton";

const GiftCardDelivery = ({ route }) => {
  const { data, amount, quantity, imageUri, eventName } = route?.params;
  // console.log(imageUri)
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <AppHeader navigation={navigation} />

      <KeyboardAwareScrollView>
        <View style={{ paddingHorizontal: 20, gap: 20 }}>
          <Image
            source={require("../../../assets/images/giftcard-header2.png")}
            style={{ width: "100%", height: 80 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 16, fontFamily: "Medium" }}>
            Enter your details
          </Text>
          <AppDefaultInput
            label={"Full Name"}
            placeholder={"John Doe"}
            onChangeText={setName}
          />
          <AppDefaultInput
            label={"Email Address"}
            placeholder={"someone@gmail.com"}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <AppDefaultInput
            label={"Phone Number"}
            placeholder={"Phone number"}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <View
            style={{
              flexDirection: "row",
              gap: 20,
              justifyContent: "space-between",
            }}
          >
            <AppButton
              btnText={"Previous"}
              onPress={() => navigation.pop()}
              btnStyles={{
                backgroundColor: "transparent",
                borderWidth: 1,
              }}
              btnTextStyles={{
                color: Colors.primary,
              }}
            />
            <AppButton
              btnText={"Continue"}
              onPress={() => navigation.navigate("GiftCardPayment", {
                data,
                amount,
                quantity,
                imageUri,
                eventName,
                userDetails: {name, email, phone}
              })}
              disabled={!name || !email || !phone}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default GiftCardDelivery;
