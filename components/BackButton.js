import React from "react";
import { Text, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
const BackButton = ({ onPress, style }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        width: 50,
        ...style,
      }}
      onPress={() => {
        if (onPress) {
          onPress();
        } else {
          navigation.pop();
        }
      }}
    >
      {/* <AntDesign name="left" size={24} color={Colors.primary} />
      <Text
        style={{
          color: Colors.primary,
          fontSize: 16,
          fontFamily: "Medium",
        }}
      >
        Back
      </Text> */}
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default BackButton;
