import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useSearchHotelsMutation } from "../../services/routes/travelRoute";
import { AccessToken } from "../../recoil/UserData";
import AppHeader from "../../components/AppHeader";
import { useRecoilState } from "recoil";
import { Colors } from "../../constants/colors";

const HotelResultsScreen = ({ route, navigation }) => {
  const [accessToken] = useRecoilState(AccessToken);
  const { searchParams } = route.params;
  const [hotels, setHotels] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  const [searchHotels, { data, isLoading, isError, isFetching, error }] =
    useSearchHotelsMutation();

  // 🔹 Trigger search on mount
  useEffect(() => {
    if (accessToken && searchParams) {
      searchHotels({ token: accessToken, searchParams });
    }
  }, [accessToken, searchParams]);

  // 🔹 Update hotels when data changes
  useEffect(() => {
    if (data?.itineraries) {
      setHotels(data.itineraries);
      setSessionId(data?.status?.sessionId || null);
    }
  }, [data]);

  const handleSelectHotel = (hotel) => {
    navigation.navigate("HotelDetails", {
      hotel,
      searchParams,
      sessionId,
    });
  };

  // 🔹 Show loading until hotels are ready
  if (isLoading || (isFetching && hotels.length === 0)) {
    return (
      <ScreenWrapper>
        <AppHeader />
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#28005B" />
            <Text style={styles.loadingText}>Searching for hotels...</Text>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  // 🔹 Handle errors
  if (isError) {
    return (
      <ScreenWrapper>
        <AppHeader />
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error?.data?.message || "Failed to fetch hotels"}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.retryButtonText}>Modify Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader />
      <View style={styles.container}>
        {/* 🔹 Header section */}
        <View style={styles.searchHeader}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
              <MaterialIcons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.locationText}>
              {searchParams.city_name}, {searchParams.country_name}
            </Text>
          </View>
          <Text style={styles.detailsText}>
            {searchParams.checkin} - {searchParams.checkout} •{" "}
            {searchParams.occupancy[0].adult} Adult
            {searchParams.occupancy[0].adult !== 1 ? "s" : ""},{" "}
            {searchParams.occupancy.length} Room
            {searchParams.occupancy.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* 🔹 FlatList replaces ScrollView */}
        <FlatList
          data={hotels}
          keyExtractor={(item) => item.hotelId.toString()}
          contentContainerStyle={{ padding: 15, paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: hotel }) => (
            <TouchableOpacity
              style={styles.hotelCard}
              onPress={() => handleSelectHotel(hotel)}
            >
              <Image
                source={{ uri: hotel.thumbNailUrl }}
                style={styles.hotelImage}
                resizeMode="cover"
              />
              <View style={styles.hotelInfo}>
                <Text style={styles.hotelName}>{hotel.hotelName}</Text>

                <View style={styles.ratingContainer}>
                  {Array.from({ length: Math.round(hotel.hotelRating) }).map((_, i) => (
                    <MaterialIcons key={i} name="star" size={16} color="#FFD700" />
                  ))}
                  {hotel.tripAdvisorReview > 0 && (
                    <Text style={styles.reviewsText}>
                      ({hotel.tripAdvisorReview} reviews)
                    </Text>
                  )}
                </View>

                <Text style={styles.addressText}>{hotel.address}</Text>
                <Text style={styles.distanceText}>
                  {hotel.distanceValue} {hotel.distanceUnit} from city center
                </Text>

                <View style={styles.amenitiesContainer}>
                  {hotel.facilities.slice(0, 5).map((amenity, index) => (
                    <View key={index} style={styles.amenityTag}>
                      <Text style={styles.amenityText}>{amenity}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>
                    ₦{parseInt(hotel.total).toLocaleString()}
                  </Text>
                  <Text style={styles.perNightText}>
                    / {hotel.perNightArray.length} night(s)
                  </Text>
                </View>
                <Text style={styles.fareType}>{hotel.fareType}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No hotels found</Text>
              <Text style={styles.noResultsSubtext}>
                Try adjusting your search criteria
              </Text>
            </View>
          }
        />
      </View>
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#28005B",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#28005B",
    padding: 12,
    borderRadius: 8,
    width: 200,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
 searchHeader: {
  padding: 20,
  borderBottomWidth: 1,
  backgroundColor: "#28005B",
  color: Colors.white,
  borderBottomColor:Colors.white,
  borderBottomLeftRadius: 15, 
  borderBottomRightRadius: 15 
},

  locationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  detailsText: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
  hotelsContainer: {
    padding: 15,
  },
  hotelCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  hotelImage: {
    width: "100%",
    height: 180,
  },
  hotelInfo: {
    padding: 15,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
    marginRight: 10,
  },
  reviewsText: {
    fontSize: 14,
    color: "#666",
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  distanceText: {
    fontSize: 14,
    color: "#28005B",
    marginBottom: 10,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  amenityTag: {
    backgroundColor: "#f0e6ff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 12,
    color: "#28005B",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 5,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28005B",
  },
  perNightText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
    marginBottom: 2,
  },
  fareType: {
    fontSize: 14,
    color: "#4CAF50",
    marginTop: 5,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28005B",
    marginBottom: 10,
  },
  noResultsSubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default HotelResultsScreen;