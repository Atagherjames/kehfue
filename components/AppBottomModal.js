import React from "react";
import { Modal, View, Pressable, StyleSheet } from "react-native";

const AppBottomModal = ({ visible, onClose, children, modalStyles, animationType }) => {
  return (
    <Modal
      animationType= {animationType || "fade"}
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      
    >
      <Pressable onPress={onClose} style={styles.modalBackdrop}>
        <Pressable
          onPress={() => {}}
          style={[styles.modalContainer, modalStyles]}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export default AppBottomModal

const styles = StyleSheet.create({
    modalBackdrop: {
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: "#fff",
      width: "100%",
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 20,
      borderBottomEndRadius: 0,
      borderBottomLeftRadius: 0,
    },
  });