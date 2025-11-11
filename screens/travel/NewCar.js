import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Platform,
  Alert,
  TextInput,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import AppHeader from "../../components/AppHeader";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useSafeAreaInsets, SafeAreaProvider } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { AccessToken } from "../../recoil/UserData";
import { useGetCarDestinationsQuery } from "../../services/routes/travelRoute";

function NewCarRentalScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [accessToken] = useRecoilState(AccessToken);
  const { data: locationsData, isLoading, isError: fetchError } = useGetCarDestinationsQuery(accessToken);

  // Initialize pickup & dropoff Date objects (with sensible default times)
  const initialPickup = new Date();
  initialPickup.setHours(9, 0, 0, 0); 
  const initialDropoff = new Date(initialPickup);
  initialDropoff.setDate(initialPickup.getDate() + 1);
  initialDropoff.setHours(17, 0, 0, 0); 

  const [pickupDate, setPickupDate] = useState(initialPickup);
  const [dropoffDate, setDropoffDate] = useState(initialDropoff);

  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);
  const [driverAge, setDriverAge] = useState("");

  const [locationVisible, setLocationVisible] = useState(false);
  const [selectingPickup, setSelectingPickup] = useState(true);

  const [carTypeVisible, setCarTypeVisible] = useState(false);
  const [selectedCarType, setSelectedCarType] = useState("Select Car Type");

  const locations = locationsData || [];

  // Used for iOS inline pickers
  const [activeModal, setActiveModal] = useState(null); 

  // ---------- Helpers ----------
  const formatDate = (d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const formatTime = (d) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const setDatePart = (baseDate, newDatePart) => {
    // replace year, month, day — keep time
    const next = new Date(baseDate);
    next.setFullYear(newDatePart.getFullYear(), newDatePart.getMonth(), newDatePart.getDate());
    return next;
  };

  const setTimePart = (baseDate, timeSource) => {
    const next = new Date(baseDate);
    next.setHours(timeSource.getHours(), timeSource.getMinutes(), 0, 0);
    return next;
  };

  // ---------- Picker change handling ----------
  const handlePickerChange = (event, selected, type) => {
    if (!selected || (event && event.type === "dismissed")) {
      if (Platform.OS === "ios") setActiveModal(null);
      return;
    }

    if (type === "pickupDate") {
      const newPickup = setDatePart(pickupDate, selected);
      setPickupDate(newPickup);
      if (dropoffDate <= newPickup) {
        const next = new Date(newPickup.getTime());
        next.setDate(next.getDate() + 1);
        setDropoffDate(next);
      }
    } else if (type === "dropoffDate") {
      const newDropoff = setDatePart(dropoffDate, selected);
      if (newDropoff <= pickupDate) {
        Alert.alert("Invalid Date", "Drop-off date must be after pick-up date.");
        if (Platform.OS === "ios") setActiveModal(null);
        return;
      }
      setDropoffDate(newDropoff);
    } else if (type === "pickupTime") {
      const newPickup = setTimePart(pickupDate, selected);
      setPickupDate(newPickup);
      if (dropoffDate <= newPickup) {
        const next = new Date(newPickup.getTime() + 60 * 60 * 1000);
        setDropoffDate(next);
      }
    } else if (type === "dropoffTime") {
      const newDropoff = setTimePart(dropoffDate, selected);
      if (newDropoff <= pickupDate) {
        Alert.alert("Invalid Time", "Drop-off time must be after pick-up time.");
        if (Platform.OS === "ios") setActiveModal(null);
        return;
      }
      setDropoffDate(newDropoff);
    }

    if (Platform.OS === "ios") setActiveModal(null);
  };

  // ---------- Show pickers ----------
  const showPicker = (type) => {
    const isDate = type.toLowerCase().includes("date");
    const currentValue =
      type === "pickupDate" || type === "pickupTime" ? pickupDate : dropoffDate;

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: currentValue,
        onChange: (event, selected) => handlePickerChange(event, selected, type),
        mode: isDate ? "date" : "time",
        minimumDate: isDate ? (type === "dropoffDate" ? pickupDate : new Date()) : undefined,
        is24Hour: false,
      });
    } else {
      setActiveModal(type);
    }
  };

  // ---------- Final payload & validation ----------
  const handleSearch = () => {
    if (!selectedPickup || !selectedDropoff) {
      Alert.alert("Missing Information", "Please select both pickup and drop-off locations.");
      return;
    }
    if (dropoffDate <= pickupDate) {
      Alert.alert("Invalid Date/Time", "Drop-off must be after pick-up.");
      return;
    }
    if (!driverAge) {
      Alert.alert("Missing Information", "Please enter driver age.");
      return;
    }

    const payload = {
      pickup_id: selectedPickup.id,
      dropoff_id: selectedDropoff.id,
      pickup_date: pickupDate.toISOString().split("T")[0],
      pickup_time: pickupDate.toISOString().split("T")[1].slice(0, 5), 
      dropoff_date: dropoffDate.toISOString().split("T")[0],
      dropoff_time: dropoffDate.toISOString().split("T")[1].slice(0, 5), 
      country_res: selectedPickup.country_code,
      currency: "NGN",
      driver_age: driverAge,
    };

    navigation.navigate("CarResult", payload);
  };

  const isSearchDisabled = !selectedPickup || !selectedDropoff || dropoffDate <= pickupDate || !driverAge;

  const LocationItem = React.memo(({ location, onPress }) => (
    <TouchableOpacity style={styles.airportItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.airportIcon}>
        <FontAwesome name="map-marker" size={20} color="#28005B" />
      </View>
      <View style={styles.airportInfo}>
        <Text style={styles.airportName}>{location.location_name}</Text>
        <Text style={styles.airportLocation}>
          {location.city}, {location.country_code}
        </Text>
      </View>
    </TouchableOpacity>
  ));

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top }}>
        <AppHeader />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}>
        <View style={styles.rentalBox}>
          <Text style={styles.rentalTitle}>Find Your Perfect Car</Text>
          <View style={styles.divider} />

          {/* Pickup */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pick-up Location</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => {
                setSelectingPickup(true);
                setLocationVisible(true);
              }}
              activeOpacity={0.9}
            >
              <FontAwesome name="map-marker" size={20} color="#28005B" />
              <Text style={styles.selectorText}>
                {selectedPickup ? selectedPickup.location_name : isLoading ? "Loading..." : "Select Pickup"}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="#28005B" />
            </TouchableOpacity>
          </View>

          {/* Drop-off */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Drop-off Location</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => {
                setSelectingPickup(false);
                setLocationVisible(true);
              }}
              activeOpacity={0.9}
            >
              <FontAwesome name="map-marker" size={20} color="#28005B" />
              <Text style={styles.selectorText}>
                {selectedDropoff ? selectedDropoff.location_name : isLoading ? "Loading..." : "Select Drop-off"}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="#28005B" />
            </TouchableOpacity>
          </View>

          {/* Pickup Date & Time */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Pick-up Date</Text>
              <TouchableOpacity style={styles.selector} onPress={() => showPicker("pickupDate")} activeOpacity={0.9}>
                <MaterialIcons name="date-range" size={20} color="#28005B" />
                <Text style={styles.selectorText}>{formatDate(pickupDate)}</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Pick-up Time</Text>
              <TouchableOpacity style={styles.selector} onPress={() => showPicker("pickupTime")} activeOpacity={0.9}>
                <MaterialIcons name="access-time" size={20} color="#28005B" />
                <Text style={styles.selectorText}>{formatTime(pickupDate)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dropoff Date & Time */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Drop-off Date</Text>
              <TouchableOpacity style={styles.selector} onPress={() => showPicker("dropoffDate")} activeOpacity={0.9}>
                <MaterialIcons name="date-range" size={20} color="#28005B" />
                <Text style={styles.selectorText}>{formatDate(dropoffDate)}</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Drop-off Time</Text>
              <TouchableOpacity style={styles.selector} onPress={() => showPicker("dropoffTime")} activeOpacity={0.9}>
                <MaterialIcons name="access-time" size={20} color="#28005B" />
                <Text style={styles.selectorText}>{formatTime(dropoffDate)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Driver Age */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Driver Age</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={driverAge}
              onChangeText={setDriverAge}
              placeholder="Enter your age"
              placeholderTextColor="#999"
            />
          </View>

          {/* Car Type */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Car Type</Text>
            <TouchableOpacity style={styles.selector} onPress={() => setCarTypeVisible(true)} activeOpacity={0.9}>
              <MaterialIcons name="directions-car" size={20} color="#28005B" />
              <Text style={styles.selectorText}>{selectedCarType}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="#28005B" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.searchButton, isSearchDisabled && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={isSearchDisabled}
          >
            <Text style={styles.searchButtonText}>Search Cars</Text>
          </TouchableOpacity>
        </View>

        {/* Location Modal */}
        <Modal visible={locationVisible} animationType="slide" onRequestClose={() => setLocationVisible(false)}>
          <View style={styles.modalFullScreen}>
            <View style={[styles.modalHeader, { paddingTop: insets.top }]}>
              <TouchableOpacity style={styles.modalBackButton} onPress={() => setLocationVisible(false)}>
                <MaterialIcons name="arrow-back" size={24} color="#28005B" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select {selectingPickup ? "Pick-up" : "Drop-off"} Location</Text>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#28005B" />
                <Text style={styles.noResultsText}>Fetching locations...</Text>
              </View>
            ) : fetchError ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>Failed to load locations.</Text>
                <Text style={styles.noResultsText}>Please check your connection.</Text>
              </View>
            ) : (
              <FlatList
                data={locations}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <LocationItem
                    location={item}
                    onPress={() => {
                      if (selectingPickup) setSelectedPickup(item);
                      else setSelectedDropoff(item);
                      setLocationVisible(false);
                    }}
                  />
                )}
                contentContainerStyle={styles.airportList}
              />
            )}
          </View>
        </Modal>

        {/* Car Type Modal */}
        <Modal visible={carTypeVisible} transparent animationType="none">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Car Type</Text>
              <ScrollView>
                {["Economy", "Compact", "Mid-size", "Full-size", "SUV", "Luxury"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.classItem}
                    onPress={() => {
                      setSelectedCarType(type);
                      setCarTypeVisible(false);
                    }}
                  >
                    <Text style={styles.classText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setCarTypeVisible(false)}>
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* iOS Inline Picker */}
        {Platform.OS === "ios" && activeModal && (
          <DateTimePicker
            value={
              activeModal === "pickupDate" || activeModal === "pickupTime" ? pickupDate : dropoffDate
            }
            mode={activeModal.toLowerCase().includes("date") ? "date" : "time"}
            display="spinner"
            onChange={(event, selected) => handlePickerChange(event, selected, activeModal)}
            minimumDate={activeModal === "dropoffDate" ? pickupDate : new Date()}
          />
        )}
      </ScrollView>
    </View>
  );
}

export default function CarRentalScreenWithSafeArea(props) {
  return (
    <SafeAreaProvider>
      <NewCarRentalScreen {...props} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  rentalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  rentalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#28005B",
    marginBottom: 15,
    textAlign: "center",
  },
  divider: { height: 2, backgroundColor: "#28005B", marginBottom: 20, borderRadius: 2 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginBottom: 5 },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    backgroundColor: "#F8F8F8",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    color: "#333",
  },
  selectorText: { flex: 1, fontSize: 16, color: "#333", marginLeft: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  searchButton: {
    backgroundColor: "#28005B",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  searchButtonDisabled: { backgroundColor: "#A68CBD" },
  searchButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  modalFullScreen: { flex: 1, backgroundColor: "#fff" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  modalBackButton: { marginRight: 10 },
  modalTitle: { fontSize: 18, fontWeight: "600", color: "#28005B" },

  airportList: { paddingBottom: 40 },
  airportItem: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  airportIcon: { marginRight: 15 },
  airportInfo: { flex: 1 },
  airportName: { fontSize: 16, fontWeight: "500", color: "#333" },
  airportLocation: { fontSize: 14, color: "#777", marginTop: 2 },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 20 },
  noResultsContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  noResultsText: { fontSize: 16, color: "#777", textAlign: "center" },

  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalContent: { backgroundColor: "#fff", borderRadius: 12, padding: 20, width: "100%", maxHeight: "80%" },
  classItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  classText: { fontSize: 16, color: "#333" },
  modalCloseButton: { marginTop: 20, backgroundColor: "#28005B", padding: 12, borderRadius: 8, alignItems: "center" },
  modalCloseButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
