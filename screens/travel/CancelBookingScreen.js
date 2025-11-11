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

// Default mock steps and info (used if no data passed)
const defaultRefundSteps = [
  {
    key: "submitted",
    label: "Submitted",
    date: "March 12, 2024, 10:30 AM",
    icon: "radio-button-checked",
    active: true,
  },
  {
    key: "processing",
    label: "Request is being processed",
    date: "March 12, 2024, 10:30 AM",
    icon: "radio-button-checked",
    active: true,
  },
  {
    key: "canceled",
    label: "Canceled",
    date: "March 13, 2024, 10:30 AM",
    icon: "radio-button-checked",
    active: true,
  },
  {
    key: "sent",
    label: "Booking cancelled and refund sent",
    date: "March 12, 2024, 12:00 PM",
    icon: "radio-button-checked",
    active: true,
    showButton: true,
  },
];
const defaultRefundInfo = {
  refundValue: "₦1,200,000",
  reason: "Family emergency",
};

const bookingTypeLabels = {
  flight: "Booking cancelled and refund sent",
  hotel: "Hotel cancelled and refund sent",
  car: "Rental cancelled and refund sent"
};

const CancelBookingScreen = ({ route, navigation }) => {
  const {
    cancelType = "flight", 
    refundSteps = defaultRefundSteps,
    refundInfo = defaultRefundInfo
  } = route?.params || {};

  return (
    <ScreenWrapper>
      <View style={styles.main}>
        <AppHeader />
        <BackArrow onPress={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.scrollArea}>
          <View style={styles.card}>
            {/* Title and Book Again action */}
            <Text style={styles.titleText}>
              {bookingTypeLabels[cancelType] || bookingTypeLabels.flight}
            </Text>
            <Text style={styles.subText}>
              The time it takes to receive your refund varies depending on your bank or card issuer.
            </Text>
            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => navigation.navigate("NewTravel")}
            >
              <Text style={styles.bookBtnText}>Book again</Text>
            </TouchableOpacity>

            {/* Refund Status Progress Steps */}
            <Text style={styles.sectionHeader}>Refund status</Text>
            <View style={styles.progressWrapper}>
              {refundSteps.map((step, idx) => (
                <React.Fragment key={step.key}>
                  <View style={styles.progressRow}>
                    {/* Vertical Connector Above except for 1st */}
                    {idx > 0 && <View style={styles.verticalLineAbove} />}
                    {/* Icon */}
                    <View style={styles.iconCircle}>
                      <MaterialIcons
                        name={step.icon}
                        size={20}
                        color={step.active ? "#178436" : "#CED7E0"}
                      />
                    </View>
                    {/* Connector Below except last */}
                    {idx < refundSteps.length - 1 && (
                      <View style={styles.verticalLineBelow} />
                    )}
                    {/* Step details */}
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.stepTitle}>{step.label}</Text>
                      <Text style={styles.stepDate}>{step.date}</Text>
                      {step.showButton && (
                        <TouchableOpacity style={styles.detailsBtn}>
                          <Text style={styles.detailsBtnText}>Refund details</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </React.Fragment>
              ))}
            </View>

            {/* Refund Info */}
            <Text style={styles.sectionHeader}>Refund Info</Text>
            <Text style={styles.infoLabel}>
              Refund:
              <Text style={styles.infoText}>
                {" "} {refundInfo.refundValue} will be refunded to your bank
              </Text>
            </Text>

            {/* Reason for cancellation */}
            <Text style={styles.sectionHeader}>Reason for cancellation</Text>
            <Text style={styles.infoText}>{refundInfo.reason}</Text>
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
    marginHorizontal: 12,
    marginVertical: 14,
    borderRadius: 14,
    padding: 18,
    elevation: 2,
    shadowOpacity: 0.06,
    shadowColor: "#000",
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "rgba(40, 0, 91, 1)",
    marginBottom: 6,
    marginTop: 4,
  },
  subText: {
    fontSize: 12,
    color: "#7A789D",
    marginBottom: 16,
  },
  bookBtn: {
    backgroundColor: "rgba(40, 0, 91, 1)",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
    alignSelf: "flex-start",
    marginBottom: 18,
    marginTop: 2,
  },
  bookBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1A2954",
    marginBottom: 12,
    marginTop: 12,
  },
  progressWrapper: {
    marginBottom: 16,
    marginTop: -2,
    minWidth: "80%",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 52,
    marginBottom: 2,
    position: "relative",
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f4f8",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    marginRight: 2,
    marginTop: 0,
  },
  verticalLineAbove: {
    position: "absolute",
    left: 14,
    top: -30,
    width: 2.5,
    height: 30,
    backgroundColor: "#e0e3e7",
    zIndex: 1,
    borderRadius: 2,
  },
  verticalLineBelow: {
    position: "absolute",
    left: 14,
    top: 30,
    width: 2.5,
    height: 30,
    backgroundColor: "#e0e3e7",
    zIndex: 1,
    borderRadius: 2,
  },
  stepTitle: { fontWeight: "bold", color: "#42495D", fontSize: 14 },
  stepDate: { color: "#7A789D", fontSize: 12, marginTop: 2 },
  detailsBtn: {
    backgroundColor: "#ededf3",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 7,
    alignSelf: "flex-start",
  },
  detailsBtnText: {
    color: "rgba(40, 0, 91, 1)",
    fontWeight: "bold",
    fontSize: 13,
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#7B8399",
    marginTop: 8,
    marginBottom: 3,
  },
  infoText: {
    fontSize: 14,
    color: "#1A2954",
    fontWeight: "bold",
    marginTop: 2,
    marginBottom: 5,
  },
});

export default CancelBookingScreen;
