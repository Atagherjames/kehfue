import React from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppModal from "./AppModal";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

const ElectricityDropdownModal = ({
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
          }}
        >
          {value?.name || placeholder}
        </Text>
        <Entypo name="chevron-down" size={24} color={Colors.placeholderColor} />
      </TouchableOpacity>

      <AppModal
        modalStyles={{ maxHeight: "80%", gap: 5 }}
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <Text
          style={{ fontFamily: "Medium", fontSize: 18, textAlign: "center" }}
        >
          Select Disco
        </Text>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                setValue(item);
              }}
              style={{
                paddingVertical: 10,
                backgroundColor: Colors.lightGrey,
                paddingHorizontal: 10,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: "Medium",
                  fontSize: 18,
                }}
              >
                {item?.name}
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={<View style={{ height: 5 }} />}
          showsVerticalScrollIndicator={false}
        />
      </AppModal>
    </View>
  );
};

export default ElectricityDropdownModal;
