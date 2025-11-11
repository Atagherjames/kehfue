import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppHeader from "../../components/AppHeader";
import ScreenWrapper from "../../components/ScreenWrapper";
import BackArrow from "../../components/BackArrow";

// Main Booking Details Screen, universal for hotel and flight
const flightIcons = [
  { key: "departure", icon: "place", iconColor: "#607D8B" },
  { key: "airborne", icon: "flight", iconColor: "#607D8B", rotate: "180deg" },
  { key: "arrival", icon: "place", iconColor: "#607D8B" },
];

const BookingDetailsScreen = ({ route, navigation }) => {
  const booking = route?.params?.booking;

  const isFlight =
    booking?.flightNumber ||
    booking?.bookFlightResult ||
    booking?.airline ||
    booking?.passenger;
  const isHotel = booking?.roomBookDetails;

  return (
    <ScreenWrapper>
      <View style={styles.main}>
        <AppHeader />
        <BackArrow onPress={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.scrollArea}>
          <View style={styles.card}>
            {/* ================= FLIGHT DETAILS ================= */}
            {isFlight && (
              <>
                <Text style={styles.sectionHeader}>Flight Details</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Booking ID:</Text>
                  <Text style={styles.value}>{booking.bookingId || booking.id}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Airline:</Text>
                  <Text style={styles.value}>{booking.airline}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Booking Date:</Text>
                  <Text style={styles.value}>{booking.bookingDate}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Flight Number:</Text>
                  <Text style={styles.value}>{booking.flightNumber}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Ticket Type:</Text>
                  <Text style={styles.value}>{booking.ticketType}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Status:</Text>
                  <Text style={styles.statusBadge}>{booking.status}</Text>
                </View>
                {/* Progress Steps (for flights) */}
                <View style={styles.progressWrapper}>
                  {flightIcons.map((step, idx) => (
                    <React.Fragment key={step.key}>
                      <View style={styles.progressRow}>
                        {idx > 0 && <View style={styles.verticalLineAbove} />}
                        <View style={styles.iconCircle}>
                          <MaterialIcons
                            name={step.icon}
                            size={22}
                            color={step.iconColor}
                            style={{
                              transform: [
                                { rotate: step.rotate ? step.rotate : "0deg" },
                              ],
                            }}
                          />
                        </View>
                        {idx < flightIcons.length - 1 && (
                          <View style={styles.verticalLineBelow} />
                        )}
                        {/* Label details */}
                        <View style={{ flex: 1, marginLeft: 8 }}>
                          {step.key === "departure" && (
                            <>
                              <Text style={styles.stepTitle}>
                                {booking.departureAirport || "Lagos (LOS)"}
                              </Text>
                              <Text style={styles.stepDesc}>
                                {booking.departureLocation ||
                                  "Murtala Muhammed International Airport"}
                              </Text>
                            </>
                          )}
                          {step.key === "airborne" && (
                            <Text style={styles.stepTitle}>
                              {booking.airline || "Airpeace"}
                            </Text>
                          )}
                          {step.key === "arrival" && (
                            <>
                              <Text style={styles.stepTitle}>
                                {booking.arrivalAirport || "Abuja (ABV)"}
                              </Text>
                              <Text style={styles.stepDesc}>
                                {booking.arrivalLocation ||
                                  "Nnamdi Azikiwe International Airport"}
                              </Text>
                            </>
                          )}
                        </View>
                      </View>
                    </React.Fragment>
                  ))}
                </View>
                {/* Passenger Info */}
                <Text style={[styles.sectionHeader, { marginTop: 24 }]}>
                  Passenger Information
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{booking.passenger?.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Seat:</Text>
                  <Text style={styles.value}>{booking.passenger?.seat}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Baggage Allowance:</Text>
                  <Text style={styles.value}>{booking.passenger?.baggage}</Text>
                </View>
                {/* Payment & Refund */}
                <Text style={[styles.sectionHeader, { marginTop: 24 }]}>
                  Payment & Refund Eligibility
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Total Fare:</Text>
                  <Text style={styles.value}>{booking.totalFare}</Text>
                </View>
                <View style={[styles.infoRow, { alignItems: "flex-start" }]}>
                  <Text style={[styles.label, { paddingTop: 2 }]}>Refund Policy:</Text>
                  <Text style={[styles.value, styles.refundPolicy]}>
                    {booking.refundPolicy}
                  </Text>
                </View>
                {/* Actions */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => navigation.navigate('CancelBooking')}
                  >
                    <Text style={styles.cancelBtnText}>Cancel booking</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.downloadBtn}>
                    <Text style={styles.downloadBtnText}>Download ticket</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* ================= HOTEL DETAILS ================= */}
            {isHotel && (
              <>
                <Text style={styles.sectionHeader}>Hotel Booking Details</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Booking ID:</Text>
                  <Text style={styles.value}>{booking.referenceNum || booking.id}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Hotel Name:</Text>
                  <Text style={styles.value}>{booking.roomBookDetails.hotelName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>City:</Text>
                  <Text style={styles.value}>{booking.roomBookDetails.city}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Country:</Text>
                  <Text style={styles.value}>{booking.roomBookDetails.country}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Check-In:</Text>
                  <Text style={styles.value}>{booking.roomBookDetails.checkIn}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Check-Out:</Text>
                  <Text style={styles.value}>{booking.roomBookDetails.checkOut}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Status:</Text>
                  <Text style={styles.statusBadge}>{booking.status}</Text>
                </View>
                {/* Actions for hotel bookings -- you may add refund, payment, etc. */}
             <View style={styles.actionsRow}>
  <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.navigate('CancelBooking')}>
    <Text style={styles.cancelBtnText}>Cancel booking</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.downloadBtn}>
    <Text style={styles.downloadBtnText}>Download receipt</Text>
  </TouchableOpacity>
</View>

              </>
            )}

            {/* Fallback if not recognized */}
            {!isFlight && !isHotel && (
              <Text style={{ textAlign: "center", margin: 24 }}>
                No booking details available.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: "#f7f8fa" },
  scrollArea: { paddingBottom: 40 },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginVertical: 16,
    borderRadius: 14,
    padding: 18,
    elevation: 2,
    shadowOpacity: 0.05,
    shadowColor: "#000",
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#1A2954",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
  },
  label: { fontSize: 14, color: "#7B8399", fontWeight: "bold", width: 120 },
  value: { fontSize: 15, color: "#1A2954", fontWeight: "bold", flexShrink: 1 },
  statusBadge: {
    backgroundColor: "#F8FFF4",
    color: "#178436",
    fontWeight: "bold",
    fontSize: 14,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  progressWrapper: {
    marginVertical: 16,
    paddingLeft: 3,
    minWidth: "80%",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 60,
    marginBottom: 2,
    position: "relative",
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f0f4f8",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    marginRight: 2,
    marginTop: 0,
  },
  verticalLineAbove: {
    position: "absolute",
    left: 16,
    top: -34,
    width: 2.5,
    height: 34,
    backgroundColor: "#e0e3e7",
    zIndex: 1,
    borderRadius: 2,
  },
  verticalLineBelow: {
    position: "absolute",
    left: 16,
    top: 34,
    width: 2.5,
    height: 34,
    backgroundColor: "#e0e3e7",
    zIndex: 1,
    borderRadius: 2,
  },
  stepTitle: { fontWeight: "bold", color: "#283593", fontSize: 15 },
  stepDesc: { color: "#5F6B7A", fontSize: 13 },
  refundPolicy: {
    fontSize: 14,
    flex: 1,
    flexWrap: "wrap",
    color: "#1A2954",
    paddingLeft: 0,
    paddingTop: 0,
    fontWeight: "bold",
    textAlign: "left",
    minWidth: 0,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#D32F2F",
    marginRight: 7,
    borderRadius: 8,
    padding: 14,
  },
  cancelBtnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  downloadBtn: {
    flex: 1,
    backgroundColor: "#283593",
    borderRadius: 8,
    padding: 14,
  },
  downloadBtnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default BookingDetailsScreen;
