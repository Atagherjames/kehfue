import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9; 

// Note: The 'onPress' prop is already being destructured here.
const ProductCard = ({ image, title, description, points, onRedeem, onPress}) => {
  return (
    // 1. Change the outer <View> to a <TouchableOpacity>
    // 2. Pass the onPress prop to it to make the entire card body clickable
    <TouchableOpacity 
      style={[{ width: CARD_WIDTH }, styles.card]}
      onPress={onPress} // This is the navigation handler from the parent (Dashboard)
      activeOpacity={0.8} // Provides visual feedback when pressed
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      </View>

      {/* Product Info */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        <Text style={styles.points}>{'\u20A6'}{points}</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={onRedeem}
          onStartShouldSetResponder={() => true}
        >
          <Text style={styles.buttonText}>Redeem Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    marginVertical: 12,
    alignSelf: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  image: {
    width: "95%",
    height: 160,
    borderRadius: 14,
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  points: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28005B",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#28005B",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});