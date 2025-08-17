import React from "react";
import { Modal, View, Pressable, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

const AppModal = ({ visible, onClose, children, modalStyles, animationType, backdropStyles }) => {
  return (
    <Modal
      animationType= {animationType || "fade"}
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      
    >
      <Pressable onPress={onClose} style={[styles.modalBackdrop, backdropStyles]}>
        <Pressable
          onPress={() => {}}
          style={[styles.modalContainer, modalStyles]}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "90%",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
  },
});
