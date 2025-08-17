import { View } from "react-native";
import React from "react";
import {Colors} from "../../constants/colors";

const AppSwiperDot = ({ active = false }) => {
  return (
    <View
      style={{
        backgroundColor: Colors.white,
        borderColor: Colors.white,
        borderWidth: active ? 2 : null,
        width: active ? 25 : 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
      }}
    />
  );
};

export default AppSwiperDot;
