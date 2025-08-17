import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const StoreFormStepFive = ({onDashboard }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Successfully created!</Text>
      <Text style={styles.subtitle}>
        Your store has been successfully created and is now pending admin approval. 
        You will be notified once your store is approved.
      </Text>

      <Image
        source={require("../../assets/images/Frame.png")}
        style={styles.illustration}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={ onDashboard }
      >
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StoreFormStepFive;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: "#fff",
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#364A63",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#526484",
    textAlign: "center",
    marginBottom: 24,
  },
  illustration: {
    width: 220,
    height: 180,
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#28005B",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
