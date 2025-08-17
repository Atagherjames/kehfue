import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomDrawer from "../../components/CustomDrawer";
import { ScrollView, Text, View } from "react-native";
import { Colors } from "../../constants/colors";
import { AppDefaultInput } from "../../components/AppInput";
import AppButton from "../../components/AppButton";

const AddCustomer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  const handleAddCustomer = () => {};
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomDrawer />
      <View style={{ flex: 1, padding: 20 }}>
        <ScrollView
          contentContainerStyle={{
            backgroundColor: Colors.white,
            padding: 20,
            gap: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors.inputBorder,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontFamily: "SemiBold",
              fontSize: 20,
              color: Colors.darkBlue,
            }}
          >
            Add new Customer
          </Text>
          <AppDefaultInput label={"Customer Name"} onChangeText={setName} />
          <AppDefaultInput
            label={"Customer Email"}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <AppDefaultInput
            label={"Customer Phone Number"}
            onChangeText={setPhone}
            keyboardType={"phone-pad"}
          />
          <AppDefaultInput label={"Street Address"} onChangeText={setAddress} />
          <AppDefaultInput label={"City"} onChangeText={setCity} />
          <AppDefaultInput label={"State"} onChangeText={setState} />
          <AppDefaultInput label={"Country"} onChangeText={setCountry} />
          <AppButton
            btnStyles={{ alignSelf: "flex-start", width: 100 }}
            btnText={"Add"}
            onPress={handleAddCustomer}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddCustomer;
