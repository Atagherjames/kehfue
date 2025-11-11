import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import ScreenWrapper from "../../components/ScreenWrapper";

const CarRentalDetailsScreen = ({ route, navigation }) => {
  const { car, searchParams, sessionId } = route.params;
  const insets = useSafeAreaInsets();

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: searchParams.currency || "NGN",
      minimumFractionDigits: 2,
    }).format(amount);

  const calculateDuration = () => {
    const start = new Date(
      `${searchParams.pickup_date}T${searchParams.pickup_time}`
    );
    const end = new Date(
      `${searchParams.dropoff_date}T${searchParams.dropoff_time}`
    );
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const rentalDuration = calculateDuration();
  const basePrice = parseFloat(car.fees.rateTotalAmount);
  const insurance = basePrice * 0.1;
  const taxes = basePrice * 0.05;
  const total = basePrice + insurance + taxes;
  const rating = Number(car.vendor.reviewsOverall) || 0;

  const keyDetails = [
    { icon: "directions-car", label: "Model", value: car.carDetails.carModel },
    { icon: "category", label: "Type", value: car.carDetails.sizeName },
    { icon: "people", label: "Passengers", value: car.carDetails.passengerQuantity },
    { icon: "work", label: "Bags", value: car.carDetails.baggageQuantity },
    { icon: "attach-money", label: "Total Price", value: formatPrice(basePrice) },
    { icon: "date-range", label: "Duration", value: `${rentalDuration} days` },
  ];

  const specifications = [
    { label: "Transmission", value: car.carDetails.transmissionType },
    { label: "Fuel Type", value: car.carDetails.fuelType },
    { label: "AC", value: car.carDetails.ac === "true" ? "Yes" : "No" },
    { label: "Drive Type", value: car.carDetails.driveType },
    { label: "Doors", value: car.carDetails.vehicleDoor },
    {
      label: "Mileage",
      value: `${car.carDetails.rateDistance.quantity} ${car.carDetails.rateDistance.unit}/${car.carDetails.rateDistance.vehiclePeriodUnitName}`,
    },
  ];

  return (
    <ScreenWrapper style={styles.container}>
      {/* --- Image Header --- */}
      <View
        style={[
          styles.imageContainer,
          { paddingTop: insets.top }, 
        ]}
      >
        <Image
          source={{
            uri: car.carDetails.carImage || "https://via.placeholder.com/300",
          }}
          style={styles.carImage}
          resizeMode="cover"
        />

        {/* --- Back Button Overlay --- */}
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 10 }]} // 👈 dynamic positioning
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* --- Scrollable Content --- */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Car Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.carModel}>{car.carDetails.carModel}</Text>
          <Text style={styles.vendorName}>{car.vendor.name}</Text>

          {/* --- Dynamic Rating --- */}
          <View style={styles.ratingContainer}>
            {[...Array(5).keys()].map((i) => {
              let icon = "star-border";
              if (rating >= i + 1) icon = "star";
              else if (rating > i) icon = "star-half";
              return (
                <MaterialIcons
                  key={i}
                  name={icon}
                  size={20}
                  color="#FFD700"
                  style={{ marginRight: 2 }}
                />
              );
            })}
            <Text style={styles.ratingText}>
              {rating.toFixed(1)} ({car.vendor.reviewsTotal || 0} reviews)
            </Text>
          </View>
        </View>

        {/* Pickup & Dropoff */}
        <View style={styles.locationContainer}>
          {[{ type: "Pickup", data: car.pickup }, { type: "Dropoff", data: car.dropoff }].map(
            (loc, index) => (
              <View key={index} style={styles.locationItem}>
                <MaterialIcons name="location-on" size={20} color="#28005B" />
                <View style={styles.locationText}>
                  <Text style={styles.locationLabel}>{loc.type} Location</Text>
                  <Text style={styles.locationValue}>{loc.data.locationName}</Text>
                  <Text style={styles.locationAddress}>{loc.data.address}</Text>
                  <Text style={styles.locationTime}>
                    {searchParams[`${loc.type.toLowerCase()}_date`]} at{" "}
                    {searchParams[`${loc.type.toLowerCase()}_time`]}
                  </Text>
                </View>
              </View>
            )
          )}
        </View>

        {/* Rental Details */}
        <Text style={styles.sectionTitle}>Rental Details</Text>
        <View style={styles.detailsGrid}>
          {keyDetails.map((detail, index) => (
            <View key={index} style={styles.detailCard}>
              <MaterialIcons name={detail.icon} size={24} color="#28005B" />
              <Text style={styles.detailLabel}>{detail.label}</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
            </View>
          ))}
        </View>

        {/* Specifications */}
        <Text style={styles.sectionTitle}>Specifications</Text>
        <View style={styles.specsGrid}>
          {specifications.map((spec, index) => (
            <View key={index} style={styles.specItem}>
              <Text style={styles.specLabel}>{spec.label}</Text>
              <Text style={styles.specValue}>{spec.value}</Text>
            </View>
          ))}
        </View>

        {/* Rental Summary */}
        <View style={styles.priceSummary}>
          <Text style={styles.priceTitle}>Rental Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Base Price x {rentalDuration} days
            </Text>
            <Text style={styles.priceValue}>{formatPrice(basePrice)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Insurance</Text>
            <Text style={styles.priceValue}>{formatPrice(insurance)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Taxes & Fees</Text>
            <Text style={styles.priceValue}>{formatPrice(taxes)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        {/* Book Button */}
        <TouchableOpacity
          style={styles.bookButton}
          // onPress={() =>
          //   navigation.navigate("CarBooking", {
          //     car,
          //     searchParams,
          //     sessionId,
          //     totalPrice: total,
          //   })
          // }
        >
          <Text style={styles.bookButtonText}>Rent Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    zIndex: 1,
    overflow: "hidden",
  },
  carImage: { width: "100%", height: "100%" },
  backButton: {
    position: "absolute",
    left: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
    zIndex: 2,
  },
  scrollContent: { flex: 1, marginTop: 250 },
  scrollInner: { paddingBottom: 60 },

  headerInfo: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  carModel: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#28005B",
    marginBottom: 5,
  },
  vendorName: { fontSize: 16, color: "#666", marginBottom: 10 },
  ratingContainer: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 16, color: "#333", marginLeft: 5 },

  locationContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  locationItem: { flexDirection: "row", marginBottom: 15 },
  locationText: { marginLeft: 10, flex: 1 },
  locationLabel: { fontSize: 14, color: "#666", marginBottom: 2 },
  locationValue: { fontSize: 16, fontWeight: "600", color: "#333" },
  locationAddress: { fontSize: 14, color: "#666", marginTop: 2 },
  locationTime: {
    fontSize: 14,
    color: "#28005B",
    marginTop: 5,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28005B",
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 15,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  detailCard: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  detailLabel: { fontSize: 14, color: "#666", marginTop: 8 },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
    textAlign: "center",
  },

  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  specItem: { width: "50%", marginBottom: 15 },
  specLabel: { fontSize: 14, color: "#666" },
  specValue: { fontSize: 16, fontWeight: "600", color: "#333", marginTop: 4 },

  priceSummary: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28005B",
    marginBottom: 15,
  },
  priceRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  priceLabel: { fontSize: 14, color: "#666" },
  priceValue: { fontSize: 14, color: "#333", fontWeight: "600" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: { fontSize: 16, fontWeight: "bold", color: "#28005B" },
  totalValue: { fontSize: 16, fontWeight: "bold", color: "#28005B" },

  bookButton: {
    backgroundColor: "#28005B",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 50,
  },
  bookButtonText: { color: "white", fontWeight: "bold", fontSize: 18 },
});

export default CarRentalDetailsScreen;
