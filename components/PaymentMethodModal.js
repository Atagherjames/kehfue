import React, { useState } from "react";
import AppModal from "./AppModal";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";
import { useRecoilState } from "recoil";
import { UserData } from "../recoil/UserData";
import { FontAwesome } from "@expo/vector-icons";
import { AppDefaultInput } from "./AppInput";
import AppButton from "./AppButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BackButton from "./BackButton";

const PaymentMethodModal = ({
  airtime,
  visible,
  setVisible,
  amount,
  onContinue,
  activeType,
  setActiveType,
  points,
  setPoints,
}) => {
  const [userData, _] = useRecoilState(UserData);
  const types = [
    "Use points only",
    "use points and debit card transaction",
    "No points, debit card transaction only",
  ];
  const [input, setInput] = useState("");
  return (
    <AppModal
      visible={visible}
      onClose={() => setVisible(false)}
      modalStyles={{
        height: "100%",
        width: "100%",
      }}
    >
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingVertical: 20,
            gap: 20,
          }}
        >
          <View
            style={{
              height: 4,
              backgroundColor: Colors.primary,
            }}
          />
          <BackButton onPress={() => setVisible(false)} />

          <Text
            style={{
              fontSize: 16,
              fontFamily: "Medium",
            }}
          >
            Payment Method
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Medium",
            }}
          >
            Available points balance: {userData.points} KPS
          </Text>

          <View
            style={{
              gap: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Medium",
              }}
            >
              How to would you like to pay?
            </Text>
            {types.map((item, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setActiveType(i);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <FontAwesome
                  name={activeType == i ? "dot-circle-o" : "circle-o"}
                  size={24}
                  color={activeType == i ? Colors.primary : Colors.labelColor}
                />
                <Text
                  style={{
                    fontFamily: "Regular",
                    color: Colors.labelColor,
                    flex: 1,
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={{
              gap: 15,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Medium",
              }}
            >
              {activeType == 0
                ? `You will be paying ${amount / 10} points for your purchase`
                : activeType == 1
                ? "Enter the amount of points and/or cash you to use for the total price"
                : `You are about to make a transaction of ₦${amount}`}
            </Text>

            {/* return to 1 if therell be a mix of points and cash */}

            {activeType == 1 && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 20,
                  alignItems: "center",
                }}
              >
                <AppDefaultInput
                  label={"Points"}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                  }}
                  onChangeText={setPoints}
                />
                <AppDefaultInput
                  label={"Credit Card Amount (#)"}
                  keyboardType="numeric"
                  style={{}}
                  editable={false}
                  placeholder={(points * 10).toString() || "0.00"}
                />
              </View>
            )}
          </View>
          <AppButton btnText={"Continue"} onPress={onContinue} />
        </View>
      </KeyboardAwareScrollView>
    </AppModal>
  );
};

export default PaymentMethodModal;
