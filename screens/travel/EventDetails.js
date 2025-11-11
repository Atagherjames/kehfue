import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "../../components/Header";
import ScreenWrapper from "../../components/ScreenWrapper";

const EventDetailsScreen = ({ route, navigation }) => {
  const { event, searchParams } = route.params;

  // Key details data
  const keyDetails = [
    { icon: "event", label: "Type", value: event.type },
    { icon: "category", label: "Category", value: event.category },
    { icon: "schedule", label: "Duration", value: event.duration },
    { icon: "location-on", label: "Location", value: event.location },
    { icon: "date-range", label: "Date", value: `${searchParams.departDate} - ${searchParams.returnDate}` },
    { icon: "attach-money", label: "Price", value: event.price },
  ];

  // Additional info data
  const additionalInfo = [
    { label: "Organizer", value: "Event Management Inc." },
    { label: "Venue", value: "Convention Center" },
    { label: "Capacity", value: "500 people" },
    { label: "Language", value: "English" },
  ];

  return (
    <ScreenWrapper>
          <Header title={"Details"} />
    <View style={styles.container}>

      <ScrollView style={styles.content}>
        {/* Event Image */}
        <Image
          source={{ uri: event.image }}
          style={styles.eventImage}
          resizeMode="cover"
        />

        {/* Event Title */}
        <Text style={styles.eventTitle}>{event.title}</Text>

        {/* Event Description */}
        <Text style={styles.eventDescription}>
          Join us for an unforgettable experience at {event.title}. This {event.type.toLowerCase()} brings together the best in the industry for {event.duration} of learning, networking, and fun. Don't miss out on this opportunity!
        </Text>

        {/* Key Details */}
        <Text style={styles.sectionTitle}>Key Details</Text>
        <View style={styles.detailsGrid}>
          {keyDetails.map((detail, index) => (
            <View key={index} style={styles.detailCard}>
              <MaterialIcons name={detail.icon} size={24} color="#28005B" />
              <Text style={styles.detailLabel}>{detail.label}</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
            </View>
          ))}
        </View>

        {/* Additional Information */}
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <View style={styles.additionalInfoContainer}>
          {additionalInfo.map((info, index) => (
            <View key={index} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{info.label}:</Text>
              <Text style={styles.infoValue}>{info.value}</Text>
            </View>
          ))}
        </View>

        {/* Get Ticket Button */}
        <TouchableOpacity style={styles.ticketButton}>
          <Text style={styles.ticketButtonText}>Get Ticket</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingBottom: 20,
  },
  eventImage: {
    width: "100%",
    height: 200,
    marginBottom: 15,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#28005B",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 16,
    color: "#333",
    marginHorizontal: 15,
    marginBottom: 20,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28005B",
    marginHorizontal: 15,
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
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
    textAlign: "center",
  },
  additionalInfoContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  ticketButton: {
    backgroundColor: "#28005B",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
    marginTop: 10,
  },
  ticketButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default EventDetailsScreen;