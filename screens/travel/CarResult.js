import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import AppHeader from "../../components/AppHeader";
import { useSearchCarsMutation } from "../../services/routes/travelRoute";
import { useRecoilValue } from "recoil";
import { AccessToken } from "../../recoil/UserData";
import { Colors } from "../../constants/colors";

// --- NEW CarCard Component ---
const CarCard = ({ car, onPress, formatPrice }) => {
  const imageUrl = car.carDetails.carImage || "https://via.placeholder.com/300";
  const carModel = car.carDetails.carModel;
  const sizeName = car.carDetails.sizeName;
  const rating = car.vendor.reviewsOverall || "N/A";
  const price = formatPrice(car.fees.rateTotalAmount);

  return (
    <View
      key={car.referenceId}
      style={styles.carCard}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.carImage}
        resizeMode="cover"
      />

      <View style={styles.cardContent}>
        <Text style={styles.carTitle}>{carModel}</Text>
        <Text style={styles.carSub}>{sizeName}</Text>

        {/* Rating Row */}
<View style={styles.ratingRow}>
  {[...Array(5).keys()].map((index) => {
    let iconName = "star-border";
    const numericRating = Number(rating) || 0;

    if (numericRating >= index + 1) {
      iconName = "star";
    } else if (numericRating > index && numericRating < index + 1) {
      iconName = "star-half";
    }

    return (
      <MaterialIcons
        key={index}
        name={iconName}
        size={16}
        color="#FFD700"
        style={{ marginRight: 2 }}
      />
    );
  })}
  <Text style={styles.ratingText}>
    {isNaN(Number(rating)) ? "N/A" : Number(rating).toFixed(1)}
  </Text>
</View>


        {/* Price and View Deal Row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{price}</Text>
          <TouchableOpacity style={styles.dealButton}   onPress={onPress}>
            <Text style={styles.dealText}>View deal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const CarRentalResultsScreen = ({ route, navigation }) => {
  const accessToken = useRecoilValue(AccessToken);

  const {
    pickup_id,
    dropoff_id,
    pickup_date,
    pickup_time,
    dropoff_date,
    dropoff_time,
    country_res,
    currency,
    driver_age,
  } = route.params;

  // 🔹 RTK Query mutation hook
  const [searchCars, { data, isLoading, isError, error }] = useSearchCarsMutation();


  useEffect(() => {
    searchCars({
      token: accessToken,
      searchParams: {
        pickup_id,
        dropoff_id,
        pickup_date,
        pickup_time,
        dropoff_date,
        dropoff_time,
        country_res,
        currency,
        driver_age,
      },
    });
  }, [route.params]);

  const cars = data?.cars || [];
  const sessionId = data?.sessionId || "";

  const handleSelectCar = (car) => {
    navigation.navigate("CarDetails", {
      car,
      searchParams: route.params,
      sessionId,
    });
  };

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      minimumFractionDigits: 2,
    }).format(amount);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#28005B" />
          <Text style={styles.loadingText}>
            Searching for available cars...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#FF0000" />
          <Text style={styles.errorText}>
            {error?.data?.message || "Failed to fetch cars"}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              searchCars({
                token: accessToken,
                searchParams: {
                  pickup_id,
                  dropoff_id,
                  pickup_date,
                  pickup_time,
                  dropoff_date,
                  dropoff_time,
                  country_res,
                  currency,
                  driver_age,
                },
              })
            }
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      {/* Purple header */}
      <View style={styles.headerSection}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerDetails}>
          <Text style={styles.headerLocation}>
            {cars[0]?.pickup?.locationName || "Selected Location"}
          </Text>
          <Text style={styles.headerDates}>
            {pickup_date} - {dropoff_date}
          </Text>
        </View>

        <MaterialIcons
          name="person-outline"
          size={20}
          color="#fff"
          style={{ marginLeft: 10 }}
        />
        <Text style={{ color: "#fff", fontSize: 13 }}>1</Text>
      </View>

      {/* Filter bar */}
      <View style={styles.filterBar}>
        <Text style={styles.resultsText}>{cars.length} results</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <MaterialIcons name="filter-list" size={18} color={Colors.primary} />
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortText}>Sort</Text>
            <MaterialIcons name="arrow-drop-down" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Car list */}
      <ScrollView style={styles.carsContainer}>
        {cars.map((car) => (
          <CarCard
            key={car.referenceId}
            car={car}
            formatPrice={formatPrice}
            onPress={() => handleSelectCar(car)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  headerSection: {
    backgroundColor: "#28005B",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: "hidden",
  },

  backButton: { marginRight: 10, padding: 5 },
  headerDetails: { flex: 1 },
  headerLocation: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  headerDates: { fontSize: 13, color: "#ddd", marginTop: 4 },

  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultsText: { fontSize: 14, color: "#333" },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: { fontSize: 13, color: "#28005B" },

  carsContainer: { padding: 15 },

  // Styles for the new CarCard component
  carCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    overflow: "hidden",
  },
  carImage: { width: "100%", height: 140, backgroundColor: "#EDEDED" },
  cardContent: { padding: 15 },
  carTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  carSub: { fontSize: 13, color: "#666", marginVertical: 5 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  ratingText: { marginLeft: 5, fontSize: 13, color: "#333" },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontSize: 16, fontWeight: "bold", color: "#28005B" },
  dealButton: {
    backgroundColor: "#28005B",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  dealText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { marginTop: 10, color: "#555" },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: { marginTop: 10, color: "#333", textAlign: "center" },
  retryButton: {
    backgroundColor: "#28005B",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 15,
  },
  retryText: { color: "#fff", fontWeight: "600" },
});

 export default CarRentalResultsScreen;