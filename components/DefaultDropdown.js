import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import AppModal from "./AppModal";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const DefaultDropdown = ({
  label,
  placeholder,
  showModal,
  setShowModal,
  value,
  setValue,
  data,
  labelStyle,
}) => {
  return (
    <View>
      {label && (
        <Text
          style={{
            fontSize: 14,
            color: Colors.labelColor,
            fontFamily: "Medium",
            ...labelStyle,
          }}
        >
          {label}
        </Text>
      )}

      <TouchableOpacity
        style={{
          borderColor: Colors.inputBorder,
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderWidth: 1,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onPress={() => setShowModal(true)}
      >
        <Text
          style={{
            fontSize: 14,
            color: value ? Colors.black : Colors.placeholderColor,
            fontFamily: "Medium",
            flexShrink: 1,
          }}
        >
          {value || placeholder}
        </Text>
        <Entypo name="chevron-down" size={24} color={Colors.placeholderColor} />
      </TouchableOpacity>

      <AppModal visible={showModal} onClose={() => setShowModal(false)}>
        <View
          style={{
            maxHeight: screenHeight * 0.5,
            width: screenWidth * 0.9,
            alignSelf: "center",
            padding: 16,
            backgroundColor: "white",
            borderRadius: 12,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {data.map((item, i) => (
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  setValue(item);
                }}
                style={{
                  paddingVertical: 10,
                }}
                key={i}
              >
                <Text
                  style={{
                    fontFamily: "Medium",
                    fontSize: 16,
                  }}
                >
                  {item.name || item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </AppModal>
    </View>
  );
};

export default DefaultDropdown;
