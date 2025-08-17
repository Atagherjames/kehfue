import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const SwiperSalesCard = ({
  icon,
  label,
  value,
  growth,
}: {
  icon: any;
  label: string;
  value: string;
  growth: string;
}) => {
  return (
    <View style={styles.salesCard}>
      <View style={styles.wrapper}>
        <View style={styles.coinBox}>
          <Image
            source={icon}
            style={{ width: 30, height: 30, borderRadius: 4 }}
            resizeMode="contain"
          />
        </View>
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
      <View style={styles.cardValueRow}>
        <Text style={styles.cardValue}>{value}</Text>
        <View style={styles.arrowWrapper}>
          <Feather name="arrow-up-right" size={14} color="#A4ABB8" />
        </View>
      </View>
      <View style={[styles.horizontalRule, styles.hRule]} />
      <View style={styles.cardGrowthRowSpaced}>
        <Text style={styles.growthPercentage}>
          <Feather name="arrow-up" size={12} color="#40C4AA" />
          <Text>{growth}</Text>
        </Text>
        <Text style={styles.cardGrowthNote}>from last period</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  salesCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    alignItems: "flex-start",
  },
  wrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DFE1E6",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  coinBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 14,
    color: "#666D80",
    marginTop: 20,
  },
  cardValueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0D0D12",
  },
  arrowWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "fff",
    borderWidth: 1.67,
    borderColor: "#A4ABB8",
    alignItems: "center",
    justifyContent: "center",
  },
  cardGrowthRowSpaced: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  growthPercentage: {
    fontSize: 12,
    fontWeight: "600",
    color: "#40C4AA",
    marginRight: 3,
  },
  cardGrowthNote: {
    fontSize: 13,
    color: "#666D80",
  },
  horizontalRule: {
    height: 1,
    backgroundColor: "#E5E7EB",
    alignSelf: "stretch",
    marginVertical: 10,
  },
  hRule: {
    marginHorizontal: -16,
  },
});

export default SwiperSalesCard;
