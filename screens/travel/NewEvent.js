import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import AppHeader from "../../components/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";
// import DatePicker from "react-native-date-picker";

export default function NewEventScreen({ navigation }) {
  const [eventType, setEventType] = useState("international"); // 'international' or 'local'
  const [locationVisible, setLocationVisible] = useState(false);
  const [departVisible, setDepartVisible] = useState(false);
  const [returnVisible, setReturnVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [departDate, setDepartDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [selectedEventType, setSelectedEventType] =
    useState("Select Event Type");

  // Sample data
  const internationalCities = [
    "New York",
    "London",
    "Paris",
    "Tokyo",
    "Dubai",
    "Sydney",
  ];
  const localCities = [
    "Lagos",
    "Abuja",
    "Port Harcourt",
    "Kano",
    "Enugu",
    "Calabar",
  ];
  const eventTypes = [
    "Conference",
    "Concert",
    "Festival",
    "Exhibition",
    "Sports",
    "Workshop",
  ];

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setLocationVisible(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSearch = () => {
    navigation.navigate("EventResult", {
      location: selectedLocation,
      departDate: formatDate(departDate),
      returnDate: formatDate(returnDate),
      eventType: selectedEventType,
      isInternational: eventType === "international",
    });
  };

  return (
        <SafeAreaView style={styles.safeArea}> 
            <AppHeader/>
    <View style={styles.container}>
  
      <View style={{ padding: 20 }}>
        {/* Event Search Box */}
        <View style={styles.eventBox}>
          <Text style={styles.eventTitle}>Event Search</Text>
          <View style={styles.divider} />

          {/* International/Local Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                eventType === "international" && styles.activeToggle,
              ]}
              onPress={() => setEventType("international")}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  eventType === "international" && styles.activeToggleText,
                ]}
              >
                International
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                eventType === "local" && styles.activeToggle,
              ]}
              onPress={() => setEventType("local")}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  eventType === "local" && styles.activeToggleText,
                ]}
              >
                Local
              </Text>
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setLocationVisible(true)}
            >
              <FontAwesome name="map-marker" size={20} color="#28005B" />
              <Text style={styles.selectorText}>{selectedLocation}</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="#28005B"
              />
            </TouchableOpacity>
          </View>

          {/* Date Selection - Side by Side */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>From Date</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setDepartVisible(true)}
              >
                <MaterialIcons name="date-range" size={20} color="#28005B" />
                <Text style={styles.selectorText}>
                  {formatDate(departDate)}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color="#28005B"
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>To Date</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setReturnVisible(true)}
              >
                <MaterialIcons name="date-range" size={20} color="#28005B" />
                <Text style={styles.selectorText}>
                  {formatDate(returnDate)}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color="#28005B"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Event Type */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Event Type</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setTypeVisible(true)}
            >
              <Ionicons name="ios-calendar" size={20} color="#28005B" />
              <Text style={styles.selectorText}>{selectedEventType}</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="#28005B"
              />
            </TouchableOpacity>
          </View>

          {/* Search Button */}
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search Events</Text>
          </TouchableOpacity>
        </View>

        {/* Location Selection Modal */}
        <Modal visible={locationVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Select{" "}
                {eventType === "international" ? "International" : "Local"}{" "}
                Location
              </Text>
              <ScrollView>
                {(eventType === "international"
                  ? internationalCities
                  : localCities
                ).map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={styles.cityItem}
                    onPress={() => handleLocationSelect(city)}
                  >
                    <Text style={styles.cityText}>{city}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setLocationVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Event Type Selection Modal */}
        <Modal visible={typeVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Event Type</Text>
              <ScrollView>
                {eventTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.cityItem}
                    onPress={() => {
                      setSelectedEventType(type);
                      setTypeVisible(false);
                    }}
                  >
                    <Text style={styles.cityText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setTypeVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Date Pickers */}
        {/* <DatePicker
          modal
          open={departVisible}
          date={departDate}
          mode="date"
          minimumDate={new Date()}
          onConfirm={(date) => {
            setDepartDate(date);
            setDepartVisible(false);
          }}
          onCancel={() => {
            setDepartVisible(false);
          }}
        />

        <DatePicker
          modal
          open={returnVisible}
          date={returnDate}
          mode="date"
          minimumDate={departDate}
          onConfirm={(date) => {
            setReturnDate(date);
            setReturnVisible(false);
          }}
          onCancel={() => {
            setReturnVisible(false);
          }}
        /> */}
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  eventBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#28005B",
    marginBottom: 15,
    textAlign: "center",
  },
  divider: {
    height: 2,
    backgroundColor: "#28005B",
    marginBottom: 20,
    borderRadius: 2,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: "#28005B",
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  activeToggleText: {
    color: "#fff",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  selectorText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchButton: {
    backgroundColor: "#28005B",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#28005B",
  },
  cityItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cityText: {
    fontSize: 16,
    color: "#333",
  },
  modalCloseButton: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  modalCloseButtonText: {
    color: "#28005B",
    fontWeight: "600",
  },
});
