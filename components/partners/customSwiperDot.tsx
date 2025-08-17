// components/CustomSwiperDot.tsx
import React from "react";
import { View } from "react-native";

const CustomSwiperDot = ({ active = false }) => {
  return (
    <View
      style={{
        width: active ? 20 : 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: "#28005B",
      }}
    />
  );
};

export default CustomSwiperDot;
