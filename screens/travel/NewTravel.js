import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
  FlatList,
  Keyboard,
} from "react-native";
import { Platform } from "react-native";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import AppHeader from "../../components/AppHeader";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets, SafeAreaProvider } from "react-native-safe-area-context";
import { AccessToken } from "../../recoil/UserData";
import { useRecoilState } from "recoil";
import {  AIRPORT_LIST } from "../../constants/airport-list";


export default function NewTravelScreen({ navigation }) {
  const [accessToken] = useRecoilState(AccessToken);
  const insets = useSafeAreaInsets();
const airportIndexRef = useRef(null);

  // --- Flight Search States ---
  const [fromVisible, setFromVisible] = useState(false);
  const [toVisible, setToVisible] = useState(false);
  const [departVisible, setDepartVisible] = useState(false);
  const [returnVisible, setReturnVisible] = useState(false);
  const [classVisible, setClassVisible] = useState(false);
  const [passengerVisible, setPassengerVisible] = useState(false);

  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [departDate, setDepartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [selectedClass, setSelectedClass] = useState("Economy");
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [isRoundTrip, setIsRoundTrip] = useState(true);

 
  const [airportList, setAirportList] = useState(AIRPORT_LIST); 
  const [filteredAirports, setFilteredAirports] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  
useEffect(() => {
  if (!airportList || airportList.length === 0) return;

  if (!airportIndexRef.current) {
    const index = new Map();
    for (const airport of airportList) {
      const keys = [
        (airport.AirportName || "").toLowerCase(),
        (airport.City || "").toLowerCase(),
        (airport.AirportCode || "").toLowerCase(),
      ];
      for (const key of keys) {
        if (!key) continue;
        if (!index.has(key)) index.set(key, []);
        index.get(key).push(airport);
      }
    }
    airportIndexRef.current = index;
  }
}, [airportList]);

// --- Debounced Search---
useEffect(() => {
  const debounceTimer = setTimeout(() => {
    if (!airportList || airportList.length === 0) {
      setFilteredAirports([]);
      return;
    }

    if (searchQuery && searchQuery.trim() !== "") {
      const lower = searchQuery.toLowerCase();
      const results = [];

      // Exact or partial
      if (airportIndexRef.current.has(lower)) {
        setFilteredAirports(airportIndexRef.current.get(lower));
      } else {
        for (const [key, airports] of airportIndexRef.current.entries()) {
          if (key.includes(lower)) {
            results.push(...airports);
          }
        }
        setFilteredAirports(results);
      }
    } else {
      setFilteredAirports(airportList);
    }
  }, 300); 

  return () => clearTimeout(debounceTimer);
}, [searchQuery, airportList]);

  
  // --- Handlers ---
  const handleAirportSelect = (airport, type) => {
    if (type === "from") {
      setSelectedFrom(airport);
      setFromVisible(false);
    } else {
      setSelectedTo(airport);
      setToVisible(false);
    }
    setSearchQuery("");
    Keyboard.dismiss();
  };

  const handleDateChange = (event, selectedDate) => {
    if (activeModal === "depart") {
      setDepartVisible(false);
    } else if (activeModal === "return") {
      setReturnVisible(false);
    }

    if (selectedDate) {
      if (activeModal === "depart") {
        setDepartDate(selectedDate);
        if (returnDate && returnDate <= selectedDate) {
          setReturnDate(null);
        }
      } else if (activeModal === "return") {
        setReturnDate(selectedDate);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Select Date";
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // --- Passenger helpers with ---
  const MAX_TOTAL_PASSENGERS = 10;

  const incrementPassenger = (type) => {
    setPassengers((prev) => {
      const total = prev.adults + prev.children + prev.infants;
      if (total >= MAX_TOTAL_PASSENGERS) return prev; 

      switch (type) {
        case "adults":
          return { ...prev, adults: prev.adults + 1 };
        case "children":
          return { ...prev, children: prev.children + 1 };
        case "infants":
          if (prev.infants >= prev.adults) return prev;
          return { ...prev, infants: prev.infants + 1 };
        default:
          return prev;
      }
    });
  };

const decrementPassenger = (type) => {
  setPassengers((prev) => {
    switch (type) {
      case "adults": {
        const newAdults = Math.max(1, prev.adults - 1); 
        const newInfants = Math.min(prev.infants, newAdults); 
        return { ...prev, adults: newAdults, infants: newInfants };
      }
      case "children":
        return { ...prev, children: Math.max(0, prev.children - 1) };
      case "infants":
        return { ...prev, infants: Math.max(0, prev.infants - 1) }; 
      default:
        return prev;
    }
  });
};



  // --- Validation helpers ---
  const isDepartInPast = () => {
    if (!departDate) return false;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return departDate < todayStart;
  };

  const isReturnInvalid = () => {
    if (!isRoundTrip) return false;
    if (!returnDate) return true; 
    return returnDate <= departDate;
  };

  const isSearchDisabled =
    !selectedFrom ||
    !selectedTo ||
    !departDate ||
    isDepartInPast() ||
    (isRoundTrip && (!returnDate || isReturnInvalid())) ||
    passengers.adults < 1 ||
    passengers.infants > passengers.adults ||
    (selectedFrom && selectedTo && selectedFrom.AirportCode === selectedTo.AirportCode);

  const handleSearch = () => {
    if (!selectedFrom || !selectedTo) {
      alert("Please select origin and destination airports.");
      return;
    }
    if (selectedFrom.AirportCode === selectedTo.AirportCode) {
      alert("Origin and destination airports cannot be the same.");
      return;
    }
    if (!departDate) {
      alert("Please select a departure date.");
      return;
    }
    if (isDepartInPast()) {
      alert("Departure date cannot be in the past.");
      return;
    }
    if (isRoundTrip) {
      if (!returnDate) {
        alert("Please select a return date.");
        return;
      }
      if (returnDate <= departDate) {
        alert("Return date must be after departure date.");
        return;
      }
    }
    if (passengers.adults < 1) {
      alert("At least 1 adult is required.");
      return;
    }
    if (passengers.infants > passengers.adults) {
      alert("Each infant must be accompanied by an adult.");
      return;
    }

    // Build payload
   const formattedDepartDate = departDate.toISOString().split("T")[0];

const originDestinationInfo = [
  {
    departureDate: formattedDepartDate,
    airportOriginCode: selectedFrom.AirportCode,
    airportDestinationCode: selectedTo.AirportCode,
    ...(isRoundTrip && { returnDate: returnDate.toISOString().split("T")[0] }), 
  },
];

const classMap = {
  "Economy": "Economy",
  "Premium Economy": "PremiumEconomy",
  "Business": "Business",
  "First Class": "First",
};

const searchData = {
  requiredCurrency: "NGN",
  journeyType: isRoundTrip ? "Return" : "OneWay",
  OriginDestinationInfo: originDestinationInfo,
 class: classMap[selectedClass],
  adults: passengers.adults,
  childs: passengers.children,
  infants: passengers.infants,
};

 navigation.navigate("SearchTickets", searchData);
  };

  const AirportItem = ({ airport, onPress }) => (
    <TouchableOpacity style={styles.airportItem} onPress={onPress} activeOpacity={1}>
      <View style={styles.airportIcon}>
        <FontAwesome name="plane" size={20} color="#28005B" />
      </View>
      <View style={styles.airportInfo}>
        <Text style={styles.airportName}>
          {airport.City} ({airport.AirportCode})
        </Text>
        <Text style={styles.airportLocation}>
          {airport.AirportName}, {airport.Country}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Container with Safe Area Insets */}
      <View style={{ paddingTop: insets.top, backgroundColor: "#fff" }}>
        <AppHeader />
      </View>

      <ScrollView style={styles.contentScrollView}>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.flightBox}>
            <Text style={styles.flightTitle}>Flight Search</Text>
            <View style={styles.divider} />

            {/* FROM */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>From</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => {
                  setFromVisible(true);
                  setActiveModal("from");
                }}
                activeOpacity={1}
              >
                <FontAwesome name="plane" size={20} color="#28005B" />
                <Text style={styles.selectorText}>
                  {selectedFrom ? `${selectedFrom.City} (${selectedFrom.AirportCode})` : "Select Origin"}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="#28005B" />
              </TouchableOpacity>
            </View>

            {/* TO */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>To</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => {
                  setToVisible(true);
                  setActiveModal("to");
                }}
                activeOpacity={1}
              >
                <FontAwesome name="map-marker" size={20} color="#28005B" />
                <Text style={styles.selectorText}>
                  {selectedTo ? `${selectedTo.City} (${selectedTo.AirportCode})` : "Select Destination"}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="#28005B" />
              </TouchableOpacity>
            </View>

            {/* DATES  */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Depart Date</Text>
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => {
                    setDepartVisible(true);
                    setActiveModal("depart");
                  }}
                  activeOpacity={1}
                >
                  <MaterialIcons name="date-range" size={20} color="#28005B" />
                  <Text style={styles.selectorText}>{formatDate(departDate)}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={24} color="#28005B" />
                </TouchableOpacity>
              </View>

              {isRoundTrip && (
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.label}>Return Date</Text>
                  <TouchableOpacity
                    style={styles.selector}
                    onPress={() => {
                      setReturnVisible(true);
                      setActiveModal("return");
                    }}
                    activeOpacity={1}
                  >
                    <MaterialIcons name="date-range" size={20} color="#28005B" />
                    <Text style={styles.selectorText}>{formatDate(returnDate)}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={24} color="#28005B" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* CLASS & PASSENGERS */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Class</Text>
                <TouchableOpacity style={styles.selector} onPress={() => setClassVisible(true)} activeOpacity={1}>
                  <Ionicons name="business" size={20} color="#28005B" />
                  <Text style={styles.selectorText}>{selectedClass}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={24} color="#28005B" />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Passengers</Text>
                <TouchableOpacity style={styles.selector} onPress={() => setPassengerVisible(true)} activeOpacity={1}>
                  <FontAwesome name="users" size={18} color="#28005B" />
                  <Text style={styles.selectorText}>
                    {passengers.adults} Adult{passengers.adults !== 1 ? "s" : ""}
                    {passengers.children > 0 && `, ${passengers.children} Child${passengers.children !== 1 ? "ren" : ""}`}
                    {passengers.infants > 0 && `, ${passengers.infants} Infant${passengers.infants !== 1 ? "s" : ""}`}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={24} color="#28005B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* TOGGLE */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>Round Trip</Text>
              <Switch
                value={isRoundTrip}
                onValueChange={setIsRoundTrip}
                trackColor={{ false: "#767577", true: "#28005B" }}
                thumbColor={isRoundTrip ? "#fff" : "#f4f3f4"}
              />
            </View>

            {/* SEARCH BUTTON  */}
            <TouchableOpacity
              style={[styles.searchButton, isSearchDisabled && styles.searchButtonDisabled]}
              onPress={handleSearch}
              disabled={isSearchDisabled}
              activeOpacity={1}
            >
              <Text style={styles.searchButtonText}>Search Flights</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Airport Selection Modal*/}
      <Modal
        visible={fromVisible || toVisible}
        animationType="none"
        onRequestClose={() => {
          setFromVisible(false);
          setToVisible(false);
          setSearchQuery("");
        }}
      >
        <SafeAreaProvider>
          <View style={styles.modalFullScreen}>
            <View style={[styles.modalHeader, { paddingTop: insets.top }]}>
              <TouchableOpacity
                style={styles.modalBackButton}
                onPress={() => {
                  setFromVisible(false);
                  setToVisible(false);
                  setSearchQuery("");
                }}
                activeOpacity={1}
              >
                <MaterialIcons name="arrow-back" size={24} color="#28005B" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {activeModal === "from" ? "Select Origin Airport" : "Select Destination Airport"}
              </Text>
            </View>

            <View style={styles.searchBarContainer}>
              <FontAwesome name="search" size={20} color="#777" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by city or airport"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              {searchQuery !== "" && (
                <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={1}>
                  <MaterialIcons name="close" size={20} color="#777" />
                </TouchableOpacity>
              )}
            </View>

         

      {/* Airport list  */}
              <FlatList
                data={filteredAirports} 
             keyExtractor={(item, index) =>
  `${item.AirportCode || "no-code"}-${item.City || "no-city"}-${item.AirportName || "no-name"}-${index}`
}

                renderItem={({ item }) => (
                  <AirportItem airport={item} onPress={() => handleAirportSelect(item, activeModal)} />
                )}
                ListEmptyComponent={
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>
                        {searchQuery ? `No airports found matching "${searchQuery}"` : "Start typing to search or scroll to load more."}
                    </Text>
                  </View>
                }
                contentContainerStyle={styles.airportList}
                keyboardShouldPersistTaps="handled"
                onEndReachedThreshold={0.5} 
              />
        
          </View>
        </SafeAreaProvider>
      </Modal>

      {/* Date Picker*/}
      {(departVisible || returnVisible) && (
        <DateTimePicker
          value={activeModal === "depart" ? departDate || new Date() : returnDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={activeModal === "return" ? (departDate ? new Date(departDate.getTime() + 86400000) : new Date()) : new Date()}
        />
      )}

      {/* Class Selection Modal */}
      <Modal visible={classVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Flight Class</Text>
            <ScrollView>
              {["Economy", "Premium Economy", "Business", "First Class"].map((fc) => (
                <TouchableOpacity
                  key={fc}
                  style={styles.classItem}
                  onPress={() => {
                    setSelectedClass(fc);
                    setClassVisible(false);
                  }}
                  activeOpacity={1}
                >
                  <Text style={styles.classText}>{fc}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setClassVisible(false)} activeOpacity={1}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Passenger Selection Modal */}
      <Modal visible={passengerVisible} transparent animationType="none">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Passengers</Text>

            {/* Adults */}
            <View style={styles.passengerRow}>
              <Text style={styles.passengerLabel}>Adults</Text>
              <View style={styles.counter}>
                <TouchableOpacity onPress={() => decrementPassenger("adults")} activeOpacity={1}>
                  <Text style={styles.counterButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{passengers.adults}</Text>
                <TouchableOpacity onPress={() => incrementPassenger("adults")} activeOpacity={1}>
                  <Text style={styles.counterButton}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Children */}
            <View style={styles.passengerRow}>
              <Text style={styles.passengerLabel}>Children</Text>
              <View style={styles.counter}>
                <TouchableOpacity onPress={() => decrementPassenger("children")} activeOpacity={1}>
                  <Text style={styles.counterButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{passengers.children}</Text>
                <TouchableOpacity onPress={() => incrementPassenger("children")} activeOpacity={1}>
                  <Text style={styles.counterButton}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Infants */}
            <View style={styles.passengerRow}>
              <Text style={styles.passengerLabel}>Infants</Text>
              <View style={styles.counter}>
                <TouchableOpacity onPress={() => decrementPassenger("infants")} activeOpacity={1}>
                  <Text style={styles.counterButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{passengers.infants}</Text>
                <TouchableOpacity onPress={() => incrementPassenger("infants")} activeOpacity={1}>
                  <Text style={styles.counterButton}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setPassengerVisible(false)} activeOpacity={1}>
              <Text style={styles.modalCloseButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentScrollView: { flex: 1 },
  flightBox: {
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
  flightTitle: {
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
  selectorText: { flex: 1, fontSize: 16, color: "#333", marginLeft: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  toggleLabel: { fontSize: 16, color: "#333" },
  searchButton: {
    backgroundColor: "#28005B",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },

  searchButtonDisabled: {
    backgroundColor: "#A68CBD", 
  },


  searchButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalContent: { backgroundColor: "#fff", borderRadius: 12, padding: 20, width: "100%", maxHeight: "80%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#28005B", textAlign: "center" },
  modalCloseButton: { marginTop: 20, backgroundColor: "#28005B", padding: 12, borderRadius: 8, alignItems: "center" },
  modalCloseButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  classItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  classText: { fontSize: 16, color: "#333" },

  passengerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  passengerLabel: { fontSize: 16, fontWeight: "500", color: "#333" },
  counter: { flexDirection: "row", alignItems: "center" },
  counterButton: { fontSize: 20, fontWeight: "bold", color: "#28005B", paddingHorizontal: 15 },
  counterValue: { fontSize: 16, fontWeight: "bold", color: "#333", width: 30, textAlign: "center" },

  modalFullScreen: { flex: 1, backgroundColor: "#fff" },
  modalHeader: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#eee", backgroundColor: "#fff" },
  modalBackButton: { marginRight: 15, marginBottom: 20 },
  modalTitleSmall: { fontSize: 18, fontWeight: "600" },
  searchBarContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 8 },
  cityListContainer: { flex: 1 },
  airportList: { paddingBottom: 40 },
  airportItem: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  airportIcon: { marginRight: 15 },
  airportInfo: { flex: 1 },
  airportName: { fontSize: 16, fontWeight: "500", color: "#333" },
  airportLocation: { fontSize: 14, color: "#777", marginTop: 2 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 20 },
  noResultsContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  noResultsText: { fontSize: 16, color: "#777", textAlign: "center" },
});