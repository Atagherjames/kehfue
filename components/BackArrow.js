// components/BackArrow.js
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const BackArrow = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <Icon name="arrow-back" size={25} color="#1A2954"  />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

export default BackArrow;
