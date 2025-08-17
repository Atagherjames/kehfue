import React from "react";
import { View, Text } from "react-native";
import BackButton from "./BackButton";

const Header = ({ title, style }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        ...style,
      }}
    >
      <BackButton />
      <Text
        style={{
          flex: 1,
          textAlign: "center",
          fontFamily: "SemiBold",
          fontSize: 18,
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default Header;
