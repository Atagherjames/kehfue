import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppHeader from "../../components/AppHeader";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useSearchFlightsMutation } from "../../services/routes/travelRoute";
import { FlightCard } from "../../components/flight/FlightCard";
import { Colors } from "../../constants/colors";
import { AccessToken } from "../../recoil/UserData";
import { useRecoilState } from "recoil";
import { formatTime, formatDuration,formatPointsPrice, formatCurrency} from "../../constants/travel";

/* ------------------------------ FILTER BAR ------------------------------ */
const FlightFilterBar = ({ journeyType }) => {
  const apiToTab = {
    OneWay: "One-way",
    Return: "Round-trip"
  };
  const currentTab = apiToTab[journeyType] || "One-way";

  return (
    <View style={filterStyles.container}>
      <View style={[filterStyles.tab, filterStyles.activeTab, { alignSelf: "flex-start" }]}>
        <Text style={[filterStyles.tabText, filterStyles.activeTabText]}>
          {currentTab}
        </Text>
      </View>
    </View>
  );
};



/* ------------------------------ MAIN SCREEN ------------------------------ */
const SearchTicketsScreen = ({ route, navigation }) => {
  const {
    requiredCurrency,
    journeyType,
    OriginDestinationInfo,
    class: flightClass,
    adults,
    childs,
    infants,
  } = route.params;

  const [accessToken] = useRecoilState(AccessToken);
  const [flights, setFlights] = useState([]);
 

  const [searchFlights, { data, error, isLoading, isError, isSuccess }] =
    useSearchFlightsMutation();

  
  useEffect(() => {
  if (accessToken && route?.params) {
    const { childs, infants, ...rest } = route.params;

    // Only include non-zero passengers
    const searchParams = {
      ...rest,
      ...(childs > 0 ? { childs } : {}),
      ...(infants > 0 ? { infants } : {}),
    };

    searchFlights({ token: accessToken, searchParams });
  }
}, [accessToken, route?.params]);

  


  useEffect(() => {
    if (data?.AirSearchResult?.FareItineraries?.length > 0) {
      setFlights(
        data.AirSearchResult.FareItineraries.map(
          (item) => item.FareItinerary
        )
      );
    }
  }, [data]);


  const getFlightSummary = (segments) => {
    const first = segments[0];


    const duration = formatDuration(first.FlightSegment.JourneyDuration);
    return { totalDuration: duration };
  };

  const handleSelectTicket = (flight, fareSourceCode) => {
    navigation.navigate("FlightDetails", {
      flight,
         session_id: data?.session_id,
      passengers: { adults, childs, infants },
      flightClass,
      journeyType,
      fare_source_code: fareSourceCode,
    });
  };

  /* ------------------------------ CONDITIONAL UI ------------------------------ */
  if (isLoading) {
    return (
      <ScreenWrapper>
        <AppHeader />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Searching for flights...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper>
        <AppHeader />
        <View style={styles.centerContainer}>
          <MaterialIcons name="error-outline" size={48} color="red" />
          <Text style={styles.errorText}>
            {error?.data?.message || "Something went wrong"}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              searchFlights({ token: accessToken, searchParams: route.params })
            }
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  // ✅ Only show "No flights found" AFTER data is confirmed and no flights exist
  if (isSuccess && data && !data.AirSearchResult?.FareItineraries?.length) {
    return (
      <ScreenWrapper>
        <AppHeader />
        <View style={styles.centerContainer}>
          <MaterialIcons name="flight" size={48} color="#6A3EA6" />
          <Text style={styles.emptyText}>No flights found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search criteria
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  /* ------------------------------ MAIN UI ------------------------------ */
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppHeader />

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerRoute}>
            {OriginDestinationInfo[0].airportOriginCode} →{" "}
            {OriginDestinationInfo[0].airportDestinationCode}
          </Text>
          <Text style={styles.bannerDetails}>
            {OriginDestinationInfo[0].departureDate} • {flightClass} •{" "}
            {adults > 0 && `${adults} Adult${adults !== 1 ? "s" : ""}`}
            {childs > 0 && `, ${childs} Child${childs !== 1 ? "ren" : ""}`}
            {infants > 0 && `, ${infants} Infant${infants !== 1 ? "s" : ""}`}
          </Text>
        </View>

        {/* Filter Bar */}
        <FlightFilterBar  journeyType={journeyType}/>

        {/* Flight List */}
        <ScrollView
          style={styles.flightsContainer}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {flights.map((flight, index) => {


const fare = flight.AirItineraryFareInfo.ItinTotalFares;
const segments =
  flight.OriginDestinationOptions[0].OriginDestinationOption;
const first = segments[0];
const last = segments[segments.length - 1];
const airline = first.FlightSegment.MarketingAirlineName;
const fareSourceCode = flight.AirItineraryFareInfo.FareSourceCode;
const summary = getFlightSummary(segments);

const depCode = first.FlightSegment.DepartureAirportLocationCode;
const arrCode = last.FlightSegment.ArrivalAirportLocationCode;
const stopsText =
    segments.length === 1
      ? "Direct"
      : `${segments.length - 1} stop${
          segments.length > 2 ? "s" : ""
        }`;

const displayCabinClass =
  first.FlightSegment.CabinClassText ||
  first.FlightSegment.CabinClass ||
  flightClass ||
  "Economy";


const hasBaggage = flight.AirItineraryFareInfo.FareBreakdown?.[0]?.Baggage?.length > 0;
const flightTags = [
  { name: displayCabinClass, icon: "event-seat" },
  { name: stopsText, icon: "north-east" },
];

if (hasBaggage) {
  flightTags.push({ name: "Baggage", icon: "work" });
}

return (
  <TouchableOpacity
    key={index}
    activeOpacity={0.9}
    style={{ marginBottom: 12 }} 
    onPress={() => handleSelectTicket(flight, fareSourceCode)}
  >
    <FlightCard
      airline={airline}
     price={formatCurrency(
    fare.TotalFare.Amount,
    fare.TotalFare.CurrencyCode || "NGN"
  )}
      from={depCode}
      to={arrCode}
      depart={formatTime(first.FlightSegment.DepartureDateTime)}
      arrive={formatTime(last.FlightSegment.ArrivalDateTime)}
      duration={summary.totalDuration}
      tags={flightTags} 
    />
  </TouchableOpacity>
);
          })}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

/* ------------------------------ STYLES ------------------------------ */

const filterStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F2",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#D0D0D6",
  },
  activeTab: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B6B6B",
  },
  activeTabText: {
    color: "#fff",
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F6" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: { marginTop: 15, fontSize: 15, color: "#6A3EA6" },
  errorText: {
    fontSize: 15,
    color: "#C0392B",
    textAlign: "center",
    marginVertical: 12,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: "#6A3EA6",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "700" },
  emptyText: { fontSize: 18, fontWeight: "700", color: "#6A3EA6" },
  emptySubtext: { color: "#7A7A7A", marginTop: 6 },
  flightsContainer: { paddingHorizontal: 14, paddingTop: 14 },
  flightCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  topRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  airlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoWrapFinal: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#6A3EA6",
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  logoTextFinal: { color: "#fff", fontSize: 12, fontWeight: "700" },
  airlineTitleFinal: { fontSize: 13, fontWeight: "700", color: "#222" },
  fareBasisText: { fontSize: 11, color: "#7A7A7A", marginTop: 2 },
  pointsPriceNew: { color: "#6A3EA6", fontSize: 16, fontWeight: "800" },
  middleRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  codeBlockFinal: { alignItems: "center", width: 60 },
  codeTextFinal: { fontSize: 18, fontWeight: "800", color: "#222" },
  timeSmallFinal: { fontSize: 12, color: "#7A7A7A", marginTop: 2 },
  dashedWrapFinal: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    height: 40,
  },
  dashLineFinal: {
    position: "absolute",
    top: 10,
    width: "80%",
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C0C0C0",
  },
  durationFinal: {
    position: "absolute",
    bottom: 0,
    fontSize: 12,
    color: "#7A7A7A",
  },
  metaRowFinal: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F2",
    marginTop: 10,
    paddingTop: 8,
  },
  metaTextNew: { fontSize: 12, color: "#8A8A8A", marginHorizontal: 4 },
  dotNew: { color: "#C0C0C0", fontSize: 18, marginHorizontal: 4 },
  banner: {
    backgroundColor: "#28005B",
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  bannerRoute: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  bannerDetails: {
    color: "#E2DDF8",
    marginTop: 6,
    fontSize: 13,
  },
});

export default SearchTicketsScreen;
