import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/partners/Header";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { Colors } from "../../constants/colors";
import { AppDefaultInput } from "../../components/AppInput";
import AppButton from "../../components/AppButton";

const RenderItem = ({ item, value }) => (
  <View style={{ borderBottomWidth: 0.7, paddingVertical: 10 }}>
    <Text
      style={{
        fontSize: 16,
        fontFamily: "Medium",
      }}
    >
      {item}:
    </Text>
    <Text
      style={{
        fontSize: 18,
        fontFamily: "Bold",
      }}
    >
      {value}
    </Text>
  </View>
);

const ScanResult = ({ route }) => {
  const navigation = useNavigation();
  const { data } = route.params;
  const [amount, setAmount] = useState("");
  const handleRedeemPoints = () => {

  }
  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />

      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <ScrollView>
          <View>
            <RenderItem item={"User"} value={data?.name} />
            <RenderItem item={"Points"} value={data?.point} />
            <RenderItem item={"Points Value"} value={data?.value} />

            <View
              style={{
                marginTop: 20,
                gap: 20,
              }}
            >
              {/* <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Medium",
                }}
              >
                Enter Amount of point to redeem
              </Text> */}
              <AppDefaultInput
                keyboardType="numeric"
                onChangeText={setAmount}
                label={"Enter Amount of points to redeem"}
              />
              <AppButton btnText={"Redeem Points"} onPress={handleRedeemPoints} />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ScanResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
