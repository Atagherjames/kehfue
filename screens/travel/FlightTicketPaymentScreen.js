import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import AppHeader from "../../components/AppHeader";

export default function FlightTicketPaymentScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION: Ticket Detail */}
        <Text style={styles.sectionTitle}>Ticket Detail</Text>

        {/* Ticket Container (Card) */}
        <View style={styles.ticketContainer}>
          {/* Top Row: Date/Time vs Duration/Airline */}
          <View style={styles.ticketTop}>
            <View>
              <Text style={styles.dateText}>Mon, 23 Oct 2023</Text>
              <Text style={styles.timeText}>05:30 - 07:00</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.durationText}>1 h 30m</Text>
              <Text style={styles.airlineText}>Lion Air</Text>
            </View>
          </View>

          {/* Full-width horizontal separator */}
          <View style={styles.fullWidthSeparator} />

          {/* Flight Route and QR Code Container */}
          <View style={styles.flightRouteAndQR}>
            {/* Left Column: Flight Route */}
            <View style={styles.flightRouteColumn}>
              <Text style={styles.cityText}>Surabaya (SUB)</Text>
              <Text style={styles.airportText}>Bandara Juanda</Text>

              <Text style={styles.cityText}>Jakarta (CGK)</Text>
              <Text style={styles.airportText}>Soekarno Hatta</Text>
            </View>

            {/* Right Column: QR Code */}
            <View style={styles.qrCodeBox}>
              <Ionicons name="qr-code-sharp" size={80} color={Colors.black} />
            </View>
          </View>

          {/* Full-width separator above badges */}
          <View style={styles.fullWidthSeparator} />

          {/* Badges (Baggage and Insurance) */}
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Ionicons
                name="bag-handle"
                size={12}
                color={"#1F48AA"}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.badgeText}>Baggage</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons
                name="shield-checkmark"
                size={12}
                color={"#1F48AA"}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.badgeText}>Insurance</Text>
            </View>
          </View>
        </View>

        {/* SECTION: Passenger Details */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Passenger Details
        </Text>

        {/* Passenger Card */}
        <View style={styles.passengerCard}>
          <Text style={styles.passengerHeaderText}>Passenger 1</Text>

          <View style={[styles.detailRow, { marginTop: 15 }]}>
            <View style={styles.detailColumn}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>James Brown</Text>
            </View>
            <View style={styles.detailColumn}>
              <Text style={styles.label}>Identity Number</Text>
              <Text style={styles.value}>728130281342</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailColumn}>
              <Text style={styles.label}>Ticket Number</Text>
              <Text style={styles.value}>14B214C</Text>
            </View>
            <View style={styles.detailColumn}>
              <Text style={styles.label}>Seat Number</Text>
              <Text style={styles.value}>F-3</Text>
            </View>
          </View>
        </View>

        {/* Download Button */}
        <TouchableOpacity style={styles.downloadBtn}>
          <Text style={styles.downloadText}>Download E-Ticket</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: Colors.white,
  },

  fullWidthSeparator: {
    height: 1,
    backgroundColor: Colors.lightGrey,
    marginHorizontal: -16,
    width: "auto",
  },

  ticketContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.darkBlue,
    marginBottom: 10,
  },

  ticketTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  dateText: { fontSize: 14, fontWeight: "600", color: Colors.darkBlue },
  timeText: { fontSize: 13, color: Colors.textGrey, marginTop: 2 },
  durationText: { fontSize: 13, fontWeight: "600", color: Colors.darkBlue },
  airlineText: { fontSize: 13, color: Colors.textGrey, marginTop: 2 },

  flightRouteAndQR: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 15,
  },
  flightRouteColumn: {
    flex: 1,
    marginRight: 10,
    justifyContent: "space-between",
  },
  qrCodeBox: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  cityText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 5,
  },
  airportText: {
    fontSize: 12,
    color: Colors.textGrey,
    marginBottom: 15,
  },

  badgeContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 15,
  },
  badge: {
    backgroundColor:"#F0F6FA",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 8,
  },
  badgeText: { color: "#1F48AA", fontSize: 12, fontWeight: "600" },

  passengerCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop: 8,
    padding: 0,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },

  passengerHeaderText: {
    fontSize: 13,
    fontWeight: "600",
    color:"#111827",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#E5E7EB",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  detailColumn: { width: "48%" },
  label: { fontSize: 13, color: Colors.textGrey },
  value: { fontSize: 15, fontWeight: "700", color: Colors.black, marginTop: 2 },

  downloadBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  downloadText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
});
