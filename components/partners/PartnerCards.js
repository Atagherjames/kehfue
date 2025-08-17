import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Colors } from "../../constants/colors";

const PartnerCards = () => {
  return (
    <View style={{ gap: 10 }}>
      <TouchableOpacity style={{ ...styles.card }}>
        <ImageBackground
          source={require("../../assets/images/balance-card.png")}
          style={{ height: "100%" }}
          resizeMode="cover"
        >
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 18,
                color: Colors.white,
                fontFamily: "SemiBold",
              }}
            >
              Balance:
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: Colors.white,
                fontFamily: "Medium",
              }}
            >
              400,000.00
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity style={{ ...styles.card }}>
        <ImageBackground
          source={require("../../assets/images/audiece-card.png")}
          style={{ height: "100%" }}
          resizeMode="cover"
        >
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 20,
                color: Colors.white,
                fontFamily: "Medium",
              }}
            >
              857.6K <Text style={{ fontSize: 12 }}>( 12.4% )</Text>
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.white,
                fontFamily: "SemiBold",
              }}
            >
              Total Audience
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity style={{ ...styles.card }}>
        <ImageBackground
          source={require("../../assets/images/transaction-card.png")}
          style={{ height: "100%" }}
          resizeMode="cover"
        >
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 20,
                color: Colors.white,
                fontFamily: "Medium",
              }}
            >
              9.3K <Text style={{ fontSize: 12 }}>( 12.4% )</Text>
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: Colors.white,
                fontFamily: "SemiBold",
              }}
            >
              Transaction
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity style={{ ...styles.card }}>
        <ImageBackground
          source={require("../../assets/images/reward-card.png")}
          style={{ height: "100%" }}
          resizeMode="cover"
        >
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 20,
                color: Colors.white,
                fontFamily: "Medium",
              }}
            >
              175.2K <Text style={{ fontSize: 12 }}>( 12.4% )</Text>
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: Colors.white,
                fontFamily: "SemiBold",
              }}
            >
              Rewards
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

export default PartnerCards;

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    height: 170,
  },
});
