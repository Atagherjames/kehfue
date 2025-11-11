import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppLoader from "../../components/AppLoader";
import AppHeader from "../../components/AppHeader";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useRecoilState } from "recoil";
import { AccessToken } from "../../recoil/UserData";
import { useGetHotelContentQuery, useGetHotelRoomRatesMutation } from "../../services/routes/travelRoute";
import { Colors } from "../../constants/colors";
import RoomCard from "../../components/flight/HotelRoomCard";

const { width } = Dimensions.get('window');

const HotelDetailsScreen = ({ route, navigation }) => {
  const { hotel, searchParams, sessionId } = route.params;
  const [accessToken] = useRecoilState(AccessToken);
  const thumbUrl = hotel.thumbNailUrl;

  // ---- API LOGGING ----
  const {
    data: hotelContent,
    isLoading: contentLoading,
    isError: contentIsError,
    error: contentErrorObj,
  } = useGetHotelContentQuery(
    {
      token: accessToken,
      sessionId,
      hotelId: hotel?.hotelId,
      productId: hotel?.productId,
      tokenId: hotel?.tokenId,
    },
    { skip: !(accessToken && sessionId && hotel) }
  );

  const [getHotelRoomRates, {
    data: roomRates,
    isLoading: roomsLoading,
    isError: roomsIsError,
    error: roomsErrorObj,
  }] = useGetHotelRoomRatesMutation();

  useEffect(() => {
    if (hotel && sessionId && accessToken) {
      getHotelRoomRates({
        token: accessToken,
        sessionId,
        productId: hotel.productId,
        hotelId: hotel.hotelId,
        tokenId: hotel.tokenId,
      });
    }
  }, [hotel, sessionId, accessToken, getHotelRoomRates]);

  // Helper variables
  const contentSuccess = hotelContent && hotelContent.success === true && hotelContent.result;
  const roomsSuccess =
    roomRates &&
    roomRates.success === true &&
    roomRates.result &&
    roomRates.result.roomRates &&
    Array.isArray(roomRates.result.roomRates.perBookingRates);

  // ---- INVALID SESSION/GENERIC ERROR DETECTION ----
  const sessionError =
    hotelContent?.success === false && hotelContent?.message?.toLowerCase().includes("session") ||
    roomRates?.success === false && roomRates?.message?.toLowerCase().includes("session") ||
    roomsErrorObj?.data?.message?.toLowerCase().includes("session");

  const genericError =
    contentIsError || roomsIsError ||
    (hotelContent && hotelContent.success === false) ||
    (roomRates && roomRates.success === false);

  if (sessionError || genericError) {
    return (
      <ScreenWrapper>
        <AppHeader />
        <AppLoader
          message={
            sessionError
              ? "Session invalid or expired. Please start a new search."
              : hotelContent?.message ||
                roomRates?.message ||
                contentErrorObj?.data?.message ||
                roomsErrorObj?.data?.message ||
                "Failed to fetch hotel details"
          }
          error
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back to Results</Text>
          </TouchableOpacity>
        </AppLoader>
      </ScreenWrapper>
    );
  }

  if (contentLoading || roomsLoading || !contentSuccess || !roomsSuccess) {
    return (
      <ScreenWrapper>
        <AppHeader />
        <AppLoader message="Fetching hotel details..." />
      </ScreenWrapper>
    );
  }

  // Normal case: show hotel info and rooms!
  const contentResult = hotelContent.result;
  const availableRooms = roomRates.result.roomRates.perBookingRates;

  // --- IMAGE HANDLING: always put thumbUrl first! ---
  const detailImages = Array.isArray(contentResult.hotelImages)
    ? contentResult.hotelImages.map(imgObj =>
      typeof imgObj === "string"
        ? { url: imgObj }
        : imgObj
    )
    : [];
  const hasThumb = detailImages.some(img =>
    img.url?.replace(/\?.*$/,"") === thumbUrl?.replace(/\?.*$/,"")
  );
  const displayImages = (thumbUrl && !hasThumb)
    ? [{ url: thumbUrl }, ...detailImages]
    : detailImages;

  //--------------------------------------------------
  const checkInDate = new Date(searchParams.checkin);
  const checkOutDate = new Date(searchParams.checkout);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  const keyDetails = [
    { icon: "star", label: "Rating", value: `${hotel.hotelRating} Star${hotel.hotelRating !== 1 ? 's' : ''}` },
    { icon: "location-on", label: "Address", value: hotel.address || "Address not specified" },
    { icon: "phone", label: "Contact", value: contentResult.phone || "Not available" },
    { icon: "date-range", label: "Stay Duration", value: `${nights} night${nights !== 1 ? 's' : ''}` },
    { icon: "attach-money", label: "Price Type", value: hotel.fareType || "Standard" },
    { icon: "wifi", label: "Facilities", value: `${contentResult.facilities?.length || 0}+ amenities` },
  ];

  const displayedAmenities = contentResult.facilities?.slice(0, 10) || [];
  const hasMoreAmenities = (contentResult.facilities?.length || 0) > 10;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Banner with overlay back icon and swipable images */}
        <View style={styles.bannerContainer}>
          <FlatList
            data={displayImages}
            keyExtractor={(item, index) => item.url || index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.bannerFlatList}
            renderItem={({ item }) => (
              <Image source={{ uri: item.url }} style={styles.bannerImage} />
            )}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.bannerBackBtn}
          >
            <MaterialIcons name="arrow-back" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* --- Info, amenities and rooms --- */}
        <FlatList
          data={Array.isArray(availableRooms) ? availableRooms : []}
          keyExtractor={item => item.rateBasisId || item.id || String(Math.random())}
          renderItem={({ item }) => (
            <RoomCard
              room={item}
              onReserve={() =>
                navigation.navigate("HotelBooking", {
                  room: item,
                  hotel,
                  searchParams,
                  sessionId,
                })
              }
            />
          )}
          contentContainerStyle={styles.roomsList}
          ListHeaderComponent={
            <View>
              {/* Hotel Name and Rating */}
              <View style={styles.headerContainer}>
                <Text style={styles.hotelName}>{hotel.hotelName}</Text>
                <View style={styles.ratingContainer}>
                  {Array.from({ length: Math.round(hotel.hotelRating) }).map((_, i) => (
                    <MaterialIcons key={i} name="star" size={20} color="#FFD700" />
                  ))}
                  {contentResult.hotel_review?.num_reviews > 0 && (
                    <>
                      <Text style={styles.reviewsText}> | </Text>
                      <Text style={styles.reviewsText}>
                        {contentResult.hotel_review.rating}/5 ({contentResult.hotel_review.num_reviews} reviews)
                      </Text>
                    </>
                  )}
                </View>
                <Text style={styles.distanceText}>
                  {hotel.distanceValue} {hotel.distanceUnit} from city center
                </Text>
              </View>
              {/* Hotel Description */}
              {contentResult.description?.content && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>About this Hotel</Text>
                  <Text style={styles.descriptionText}>
                    {contentResult.description.content}
                  </Text>
                </View>
              )}
              {/* Key Details Grid */}
              <Text style={styles.sectionTitle}>Property Details</Text>
              <View style={styles.detailsGrid}>
                {keyDetails.map((detail, index) => (
                  <View key={index} style={styles.detailCard}>
                    <MaterialIcons
                      name={detail.icon}
                      size={24}
                      color="#28005B"
                      style={styles.detailIcon}
                    />
                    <Text style={styles.detailLabel}>{detail.label}</Text>
                    <Text
                      style={styles.detailValue}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {detail.value}
                    </Text>
                  </View>
                ))}
              </View>
              {/* Amenities Section */}
              <Text style={styles.sectionTitle}>Top Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {displayedAmenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <MaterialIcons name="check" size={16} color="#4CAF50" />
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
                {hasMoreAmenities && (
                  <Text style={styles.moreAmenitiesText}>
                    +{contentResult.facilities.length - 10} more amenities
                  </Text>
                )}
              </View>
              {/* Available Rooms Section Title */}
              <Text style={styles.sectionTitle}>Available Rooms</Text>
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
  // ---- Banner and Overlay ----
  bannerContainer: {
    position: "relative",
    width: "100%",
    height: 240,
    marginBottom: 20,
    backgroundColor: "#ddd"
  },
  bannerFlatList: {
    width: "100%",
    height: "100%"
  },
  bannerImage: {
    width: width,
    height: 240,
    resizeMode: "cover",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  bannerBackBtn: {
    position: "absolute",
    top: 32,
    left: 18,
    backgroundColor: Colors.darkBlue,
    padding: 6,
    borderRadius: 22,
    zIndex: 10,
  },
  headerContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#28005B",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 5,
  },
  reviewsText: {
    fontSize: 14,
    color: "#666",
  },
  distanceText: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28005B",
    marginTop: 20,
    marginBottom: 15,
  },
  section: {
    marginHorizontal: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  detailCard: {
    width: "48%",
    backgroundColor: "#f8f5ff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "flex-start",
  },
  detailIcon: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
  amenityItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  amenityText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  moreAmenitiesText: {
    fontSize: 14,
    color: "#28005B",
    marginTop: 5,
    width: "100%",
    textAlign: "center",
  },
  roomsList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    backgroundColor: "#28005B",
    padding: 12,
    borderRadius: 8,
    width: 200,
    alignItems: "center",
    marginTop: 16,
  },
  backButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default HotelDetailsScreen;
