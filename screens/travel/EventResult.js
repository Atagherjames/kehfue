import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "../../components/Header";
import AppHeader from "../../components/AppHeader";
import ScreenWrapper from "../../components/ScreenWrapper";

const EventResultsScreen = ({ route, navigation }) => {
  const { location, departDate, returnDate, eventType, isInternational } =
    route.params;

  // Dummy event data
  const events = [
    {
      id: 1,
      title: "Tech Conference 2023",
      price: "$120",
      points: "1,200 pts",
      type: "Conference",
      category: "Technology",
      duration: "3 days",
      location: "New York",
      image: "https://example.com/tech-conf.jpg", // Replace with actual image URL
    },
    {
      id: 2,
      title: "Jazz Festival",
      price: "$85",
      points: "850 pts",
      type: "Festival",
      category: "Music",
      duration: "2 days",
      location: "New Orleans",
      image: "https://example.com/jazz-fest.jpg",
    },
    {
      id: 3,
      title: "Art Exhibition",
      price: "$45",
      points: "450 pts",
      type: "Exhibition",
      category: "Art",
      duration: "1 day",
      location: "Paris",
      image: "https://example.com/art-exhibit.jpg",
    },
  ];

  const handleSelectEvent = (event) => {
    navigation.navigate("EventDetails", {
      event,
      searchParams: route.params,
    });
  };

  return (
    <ScreenWrapper>
         <AppHeader/>
    <View style={styles.container}>
   

      <View style={styles.searchHeader}>
        <Text style={styles.locationText}>{location}</Text>
        <Text style={styles.detailsText}>
          {departDate} - {returnDate} • {eventType}
        </Text>
      </View>

      <ScrollView style={styles.eventsContainer}>
        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => handleSelectEvent(event)}
          >
            {/* Location and Price Row */}
            <View style={styles.locationPriceRow}>
              <View style={styles.locationContainer}>
                <MaterialIcons name="location-on" size={16} color="#28005B" />
                <Text style={styles.locationText}>{event.location}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>{event.price}</Text>
                <Text style={styles.pointsText}>{event.points}</Text>
              </View>
            </View>

            {/* Event Title */}
            <Text style={styles.eventTitle}>{event.title}</Text>

            {/* Event Details Row */}
            <View style={styles.eventDetailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{event.type}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>{event.category}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>{event.duration}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  searchHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  locationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28005B",
  },
  detailsText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  eventsContainer: {
    padding: 15,
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28005B",
  },
  pointsText: {
    fontSize: 14,
    color: "#666",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  eventDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});

export default EventResultsScreen;
