// TicketDetailsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../components/Header";
import AppHeader from "../../components/AppHeader";
import ScreenWrapper from "../../components/ScreenWrapper";

const TicketDetailsScreen = ({ route, navigation }) => {
  const {
    flight,
    passengers,
    flightClass,
    sessionId,
    journeyType,
    fare_source_code,
  } = route.params || {};

  // --- Defensive data checks ---
  const fare = flight?.AirItineraryFareInfo?.ItinTotalFares || {};
  const segments =
    flight?.OriginDestinationOptions?.[0]?.OriginDestinationOption || [];

  const firstSegment = segments[0] || {};
  const lastSegment = segments[segments.length - 1] || {};

  const airlineName =
    firstSegment?.FlightSegment?.MarketingAirlineName || "Unknown Airline";
  const flightNumber = firstSegment?.FlightSegment?.FlightNumber || "--";

  const formatTime = (dateTime) => {
    if (!dateTime) return "--";
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return "--";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatPrice = (amount) => {
    if (!amount) return "₦0.00";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getFlightSummary = (segments) => {
    let totalDurationMinutes = 0;
    let layovers = [];

    segments.forEach((segment, index) => {
      const duration = parseInt(segment?.FlightSegment?.JourneyDuration || 0);
      totalDurationMinutes += duration;

      if (index < segments.length - 1) {
        const arrivalTime = new Date(
          segment?.FlightSegment?.ArrivalDateTime || 0
        );
        const departureTimeNext = new Date(
          segments[index + 1]?.FlightSegment?.DepartureDateTime || 0
        );
        const layoverMinutes = Math.floor(
          (departureTimeNext - arrivalTime) / (1000 * 60)
        );
        if (!isNaN(layoverMinutes)) {
          layovers.push({
            city: segment?.FlightSegment?.ArrivalAirportLocationCode || "--",
            duration: layoverMinutes,
          });
          totalDurationMinutes += layoverMinutes;
        }
      }
    });

    return {
      totalDuration: formatDuration(totalDurationMinutes),
      layovers,
    };
  };

  const flightSummary = getFlightSummary(segments);

  // --- Passenger details state ---
  const totalAdultPassengers = passengers?.adults || 0;

  const [passengerDetails, setPassengerDetails] = useState(
    Array.from({ length: totalAdultPassengers }, () => ({
      title: "",
      firstName: "",
      lastName: "",
      dob: "",
      gender: "",
      nationality: "",
      passportNumber: "",
      passportExpiry: "",
      passportIssueCountry: "",
      email: "",
      phone: "",
    }))
  );

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerFor, setDatePickerFor] = useState(null); // 'dob' or 'passportExpiry'
  const [datePickerIndex, setDatePickerIndex] = useState(null);

  const handleChange = (index, field, value) => {
    const updated = [...passengerDetails];
    updated[index][field] = value;
    setPassengerDetails(updated);
  };

  const showDatePicker = (field, index) => {
    setDatePickerFor(field);
    setDatePickerIndex(index);
    setDatePickerVisible(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setDatePickerVisible(Platform.OS === "ios");
    if (event.type === "set") {
      const formattedDate = currentDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      handleChange(datePickerIndex, datePickerFor, formattedDate);
    }
  };

  const allFieldsFilled = () => {
    return passengerDetails.every(
      (p) =>
        p.firstName &&
        p.lastName &&
        p.nationality &&
        p.passportNumber &&
        p.dob &&
        p.gender &&
        p.email &&
        p.phone
    );
  };

  const [loading, setLoading] = useState(false);

  const handleBookFlight = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("FlightBooking", {
        flightDetails: flight,
        passengerDetails,
        passengers,
        totalAmount: fare?.TotalFare?.Amount || 0,
        sessionId,
        journeyType,
        fare_source_code,
        searchParams: {
          adults: passengers?.adults || 0,
          children: passengers?.children || 0,
          infants: passengers?.infants || 0,
        },
      });
    }, 1000);
  };

  return (
    <ScreenWrapper>
    <View style={styles.container}>
      <AppHeader/>

      {/* Flight Ticket Preview */}
      <View style={styles.ticketPreviewContainer}>
        <View style={styles.ticketPreview}>
          <View style={styles.flightHeader}>
            <Text style={styles.airlineText}>
              {airlineName} #{flightNumber}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>
                {formatPrice(fare?.TotalFare?.Amount)}
              </Text>
              <Text style={styles.refundableText}>
                {flight?.AirItineraryFareInfo?.IsRefundable === "Yes"
                  ? "Refundable"
                  : "Non-refundable"}
              </Text>
            </View>
          </View>

          <View style={styles.flightRoute}>
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>
                {firstSegment?.FlightSegment?.DepartureAirportLocationCode ||
                  "--"}
              </Text>
              <Text style={styles.timeText}>
                {formatTime(firstSegment?.FlightSegment?.DepartureDateTime)}
              </Text>
            </View>

            <View style={styles.durationContainer}>
              <MaterialIcons name="flight" size={24} color="#28005B" />
              <Text style={styles.durationText}>
                {flightSummary.totalDuration}
              </Text>
            </View>

            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>
                {lastSegment?.FlightSegment?.ArrivalAirportLocationCode || "--"}
              </Text>
              <Text style={styles.timeText}>
                {formatTime(lastSegment?.FlightSegment?.ArrivalDateTime)}
              </Text>
            </View>
          </View>

          <View style={styles.flightFooter}>
            <Text style={styles.stopsText}>
              {segments.length === 1
                ? "Direct"
                : `${segments.length - 1} stop${
                    segments.length - 1 !== 1 ? "s" : ""
                  }`}
            </Text>
            <Text style={styles.classText}>Class: {flightClass}</Text>
            <Text style={styles.passengerText}>
              Passengers: {passengers?.adults || 0} Adult
              {(passengers?.adults || 0) !== 1 ? "s" : ""},{" "}
              {passengers?.children || 0} Child
              {(passengers?.children || 0) !== 1 ? "ren" : ""},{" "}
              {passengers?.infants || 0} Infant
              {(passengers?.infants || 0) !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      </View>

      {/* Passenger Form */}
      <ScrollView style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Passenger Information</Text>

        {passengerDetails.map((p, index) => (
          <View key={index}>
            <Text style={styles.passengerType}>Passenger {index + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder="Title (Mr/Mrs/Ms)"
              value={p.title}
              onChangeText={(text) => handleChange(index, "title", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={p.firstName}
              onChangeText={(text) => handleChange(index, "firstName", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={p.lastName}
              onChangeText={(text) => handleChange(index, "lastName", text)}
            />
            <TouchableOpacity
              onPress={() => showDatePicker("dob", index)}
              style={styles.dateInput}
            >
              <Text style={p.dob ? styles.dateText : styles.datePlaceholder}>
                {p.dob || "Date of Birth (DD/MM/YYYY)"}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Gender (Male/Female)"
              value={p.gender}
              onChangeText={(text) => handleChange(index, "gender", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Nationality"
              value={p.nationality}
              onChangeText={(text) => handleChange(index, "nationality", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Passport Number"
              value={p.passportNumber}
              onChangeText={(text) =>
                handleChange(index, "passportNumber", text)
              }
            />
            <TouchableOpacity
              onPress={() => showDatePicker("passportExpiry", index)}
              style={styles.dateInput}
            >
              <Text
                style={
                  p.passportExpiry
                    ? styles.dateText
                    : styles.datePlaceholder
                }
              >
                {p.passportExpiry || "Passport Expiry (DD/MM/YYYY)"}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Passport Issue Country"
              value={p.passportIssueCountry}
              onChangeText={(text) =>
                handleChange(index, "passportIssueCountry", text)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={p.email}
              onChangeText={(text) => handleChange(index, "email", text)}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={p.phone}
              onChangeText={(text) => handleChange(index, "phone", text)}
              keyboardType="phone-pad"
            />
          </View>
        ))}
      </ScrollView>

      {/* Date Picker Modal/View */}
      {datePickerVisible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Book Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Flights</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bookButton,
            !allFieldsFilled() && styles.bookButtonDisabled,
          ]}
          onPress={handleBookFlight}
          disabled={!allFieldsFilled() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.bookButtonText}>Book Now</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  ticketPreviewContainer: {
    backgroundColor: "#28005B",
    padding: 20,
    paddingBottom: 30,
  },
  ticketPreview: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  flightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  airlineText: { fontSize: 20, fontWeight: "bold", color: "#333" },
  priceContainer: { alignItems: "flex-end" },
  priceText: { fontSize: 22, fontWeight: "bold", color: "#28005B" },
  refundableText: { fontSize: 12, color: "#666" },
  flightRoute: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  locationContainer: { flex: 1 },
  locationText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  timeText: { fontSize: 16, color: "#666", marginTop: 5 },
  durationContainer: { alignItems: "center", paddingHorizontal: 10 },
  durationText: { fontSize: 14, color: "#666", marginTop: 5 },
  flightFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  stopsText: { fontSize: 14, color: "#666" },
  classText: { fontSize: 14, color: "#666" },
  passengerText: { fontSize: 14, color: "#666" },
  formContainer: { flex: 1, padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28005B",
    marginBottom: 15,
  },
  passengerType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  datePlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
  },
  backButton: {
    borderWidth: 1,
    borderColor: "#28005B",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  backButtonText: {
    color: "#28005B",
    fontWeight: "bold",
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: "#28005B",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
  },
  bookButtonDisabled: { backgroundColor: "#cccccc" },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 5,
  },
});

export default TicketDetailsScreen;