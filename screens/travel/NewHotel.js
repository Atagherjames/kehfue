import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Platform,
  Keyboard,
  FlatList,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppHeader from "../../components/AppHeader";
import {
  useLazyGetCitiesQuery,
  useGetCitySearchQuery,
} from "../../services/routes/travelRoute";
import { AccessToken } from "../../recoil/UserData";
import { useRecoilState } from "recoil";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DefaultDropdown from "../../components/DefaultDropdown";
import { currencyCodes } from "../../constants/currency";

export default function NewHotelScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [accessToken] = useRecoilState(AccessToken);

  // Infinite scroll states for cities
  const batchSize = 50;
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [cities, setCities] = useState([]); 
  const [batchIndex, setBatchIndex] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // For search bar filter
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Lazy query for paginated city batches
  // triggerGetCities(args) -> manually fetch { token, from, to }
  const [
    triggerGetCities,
    {
      data: citiesData,
      isLoading: loadingCities,
      isFetching: isFetchingCities,
      isError: citiesError,
    },
  ] = useLazyGetCitiesQuery();

  // Backend search (server-side). This auto-fetches whenever debouncedSearch changes
  const {
    data: searchData,
    isLoading: loadingSearch,
    isError: searchError,
  } = useGetCitySearchQuery(
    { token: accessToken, term: debouncedSearch },
    {
      skip:
        !accessToken ||
        !cityModalVisible ||
        debouncedSearch === "" ||
        debouncedSearch.length < 2,
    }
  );

  // Debounce the search input (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    if (cityModalVisible) {
      setBatchIndex(1);
      setCities([]);
      setIsFetchingMore(false);
      setSearchQuery("");
      setDebouncedSearch("");
      if (accessToken) {
        triggerGetCities({
          token: accessToken,
          from: 1,
          to: batchSize,
        });
      }
    }
  }, [cityModalVisible, accessToken, triggerGetCities]);


  useEffect(() => {
    if (!cityModalVisible) return;
    if (!accessToken) return;
    if (debouncedSearch && debouncedSearch.length >= 2) return;
    if (batchIndex === 1) return;

    // Trigger next batch
    triggerGetCities({
      token: accessToken,
      from: 1 + (batchIndex - 1) * batchSize,
      to: batchIndex * batchSize,
    });
  }, [batchIndex, cityModalVisible, accessToken, debouncedSearch, triggerGetCities]);


  useEffect(() => {
    if (!citiesData?.result) return;
    if (debouncedSearch && debouncedSearch.length >= 2) return;

    setCities((prev) => {
      if (batchIndex === 1) return citiesData.result;
      const ids = new Set(prev.map((c) => c.id));
      return [...prev, ...citiesData.result.filter((c) => !ids.has(c.id))];
    });
    setIsFetchingMore(false);
  }, [citiesData, batchIndex, debouncedSearch]);

  // When server-side search returns, replace displayed list with results
  useEffect(() => {
    if (debouncedSearch && (searchData?.result?.length || 0) >= 0) {
      // Use server results directly
      setCities(searchData?.result || []);
      setIsFetchingMore(false);
    } else {
      // if search cleared, we keep previously loaded aggregated cities (no reset)
      // optional: you might want to reset to first page; current behavior keeps loaded batches
    }
  }, [searchData, debouncedSearch]);

  // Client-side search filter when no server-side search term (still useful for quick filtering)
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim() || (debouncedSearch && debouncedSearch.length >= 2))
      return cities;
    const term = searchQuery.trim().toLowerCase();
    return cities.filter(
      (city) =>
        city.city_name.toLowerCase().includes(term) ||
        city.country_name.toLowerCase().includes(term)
    );
  }, [searchQuery, cities, debouncedSearch]);

  // Choose which list to display:
  // - if debouncedSearch active (>=2 chars) we show server results (cities already set in effect)
  // - else we show filteredCities (client side)
  const displayedCities = useMemo(() => {
    return filteredCities;
  }, [filteredCities]);

  // Location selection handlers
  const [selectedLocation, setSelectedLocation] = useState({
    city_name: "Select Location",
    country_name: "",
    id: null,
  });

  const handleLocationSelect = (city) => {
    setSelectedLocation(city);
    setCityModalVisible(false);
    setSearchQuery("");
    setDebouncedSearch("");
    Keyboard.dismiss();
  };

  const closeLocationModal = () => {
    setCityModalVisible(false);
    setSearchQuery("");
    setDebouncedSearch("");
    Keyboard.dismiss();
  };

  // Dates, guests, currency state (unchanged)
  const initialCheckInDate = new Date();
  const initialCheckOutDate = new Date();
  initialCheckOutDate.setDate(initialCheckInDate.getDate() + 1);

  const [checkInDate, setCheckInDate] = useState(initialCheckInDate);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOutDate);
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    rooms: 1,
    childAges: [],
  });
  const [currency, setCurrency] = useState("NGN");
  const [showCurrencyModal, setCurrencyModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [guestsVisible, setGuestsVisible] = useState(false);

  // Date handlers
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(null);
    if (selectedDate) {
      if (showDatePicker === "checkin") {
        setCheckInDate(selectedDate);
        if (checkOutDate <= selectedDate) {
          const nextDay = new Date(selectedDate);
          nextDay.setDate(nextDay.getDate() + 1);
          setCheckOutDate(nextDay);
        }
      } else if (showDatePicker === "checkout") {
        if (selectedDate > checkInDate) {
          setCheckOutDate(selectedDate);
        } else {
          alert("Checkout date must be after Check-in date.");
        }
      }
    }
  };

  // Search submit
  const formatDate = (date) => date.toISOString().split("T")[0];
  const handleSearch = () => {
    const { adults, children, rooms, childAges } = guests;
    if (selectedLocation.id === null) {
      alert("Please select a location");
      return;
    }
    if (checkOutDate <= checkInDate) {
      alert("Check-out date must be after Check-in date.");
      return;
    }
    const occupancy = [
      {
        room_no: 1,
        adult: adults,
        child: children,
        child_age: childAges,
      },
    ];
    navigation.navigate("HotelResult", {
      searchParams: {
        checkin: formatDate(checkInDate),
        checkout: formatDate(checkOutDate),
        city_name: selectedLocation.city_name,
        country_name: selectedLocation.country_name,
        occupancy,
        requiredCurrency: currency,
      },
    });
  };

  // onEndReached handler for infinite scroll (only when not searching)
  const handleEndReached = () => {
    // don't paginate while searching or if already fetching
    if (debouncedSearch && debouncedSearch.length >= 2) return;
    if (isFetchingCities || isFetchingMore) return;
    // if last batch length < batchSize we assume no more data
    if (citiesData?.result?.length < batchSize && batchIndex !== 1) return;

    // request next batch
    setIsFetchingMore(true);
    setBatchIndex((idx) => idx + 1);
    // actual fetch is triggered by the batchIndex useEffect
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{ paddingTop: insets.top, backgroundColor: "#fff" }}>
        <AppHeader />
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.contentScrollView}>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.hotelBox}>
            <Text style={styles.hotelTitle}>Find Your Perfect Stay</Text>
            <View style={styles.divider} />

            {/* Location */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setCityModalVisible(true)}
              >
                <FontAwesome name="map-marker" size={20} color="#28005B" />
                <Text style={styles.selectorText}>
                  {selectedLocation.id
                    ? `${selectedLocation.city_name}, ${selectedLocation.country_name}`
                    : selectedLocation.city_name}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color="#28005B"
                />
              </TouchableOpacity>
            </View>

            {/* Dates */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Check-in</Text>
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => setShowDatePicker("checkin")}
                >
                  <MaterialIcons name="date-range" size={20} color="#28005B" />
                  <Text style={styles.selectorText}>
                    {checkInDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Check-out</Text>
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => setShowDatePicker("checkout")}
                >
                  <MaterialIcons name="date-range" size={20} color="#28005B" />
                  <Text style={styles.selectorText}>
                    {checkOutDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Guests */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Guests & Rooms</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setGuestsVisible(true)}
              >
                <MaterialIcons name="people" size={20} color="#28005B" />
                <Text style={styles.selectorText}>
                  {guests.adults} Adult{guests.adults !== 1 ? "s" : ""},{" "}
                  {guests.children} Child{guests.children !== 1 ? "ren" : ""},{" "}
                  {guests.rooms} Room{guests.rooms !== 1 ? "s" : ""}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color="#28005B"
                />
              </TouchableOpacity>
            </View>

            {/* Currency */}
            <View style={styles.inputContainer}>
              <DefaultDropdown
                label="Currency"
                placeholder="Choose a Currency"
                showModal={showCurrencyModal}
                setShowModal={setCurrencyModal}
                value={currency}
                setValue={setCurrency}
                data={currencyCodes}
              />
            </View>

            {/* Search */}
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search Hotels</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Location Modal with infinite scroll, server + client search */}
      <Modal visible={cityModalVisible} animationType="slide">
        <View style={styles.modalFullScreen}>
          <View style={[styles.modalHeader, { paddingTop: insets.top }]}>
            <TouchableOpacity style={styles.backButton} onPress={closeLocationModal}>
              <MaterialIcons name="arrow-back" size={24} color="#28005B" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Location</Text>
          </View>

          {/* Search bar */}
          <View style={styles.searchBarContainer}>
            <FontAwesome name="search" size={20} color="#777" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a city or country"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={Platform.OS === "ios"}
            />
            {searchQuery !== "" && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setDebouncedSearch("");
                }}
              >
                <MaterialIcons name="close" size={20} color="#777" />
              </TouchableOpacity>
            )}
          </View>

          {/* Infinite scroll and filter */}
          {loadingCities && cities.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#28005B" />
              <Text style={{ marginTop: 10, color: "#28005B" }}>Loading city data...</Text>
            </View>
          ) : (citiesError && !debouncedSearch) || (searchError && debouncedSearch) ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                Failed to load cities. Please check your network or token.
              </Text>
            </View>
          ) : (
            <FlatList
              data={displayedCities}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.cityItem,
                    item.id === selectedLocation.id && { backgroundColor: "#f0eeff" },
                  ]}
                  onPress={() => handleLocationSelect(item)}
                >
                  <FontAwesome
                    name="map-marker"
                    size={20}
                    color="#28005B"
                    style={styles.cityIcon}
                  />
                  <View style={styles.cityTextContainer}>
                    <Text style={styles.cityName}>{item.city_name}</Text>
                    <Text style={styles.countryName}>{item.country_name}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>
                    {debouncedSearch && debouncedSearch.length >= 2
                      ? loadingSearch
                        ? "Searching..."
                        : `No results for "${debouncedSearch}"`
                      : "No results"}
                  </Text>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
              keyboardShouldPersistTaps="handled"
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.3}
              ListFooterComponent={
                (isFetchingMore || isFetchingCities || loadingSearch) ? (
                  <View style={{ padding: 16 }}>
                    <ActivityIndicator size="small" color="#28005B" />
                  </View>
                ) : null
              }
            />
          )}
        </View>
      </Modal>

      {/* Guests Modal */}
      <Modal visible={guestsVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Guests & Rooms</Text>
            {/* Adults */}
            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Adults</Text>
              <View style={styles.counter}>
                <TouchableOpacity
                  onPress={() =>
                    setGuests({ ...guests, adults: Math.max(1, guests.adults - 1) })
                  }
                >
                  <Text style={styles.counterButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{guests.adults}</Text>
                <TouchableOpacity
                  onPress={() => setGuests({ ...guests, adults: guests.adults + 1 })}
                >
                  <Text style={styles.counterButton}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Children */}
            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Children</Text>
              <View style={styles.counter}>
                <TouchableOpacity
                  onPress={() =>
                    setGuests({
                      ...guests,
                      children: Math.max(0, guests.children - 1),
                      childAges: guests.childAges.slice(0, -1),
                    })
                  }
                >
                  <Text style={styles.counterButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{guests.children}</Text>
                <TouchableOpacity
                  onPress={() =>
                    setGuests({
                      ...guests,
                      children: guests.children + 1,
                      childAges: [...guests.childAges, 0],
                    })
                  }
                >
                  <Text style={styles.counterButton}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Rooms */}
            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Rooms</Text>
              <View style={styles.counter}>
                <TouchableOpacity
                  onPress={() =>
                    setGuests({ ...guests, rooms: Math.max(1, guests.rooms - 1) })
                  }
                >
                  <Text style={styles.counterButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{guests.rooms}</Text>
                <TouchableOpacity
                  onPress={() => setGuests({ ...guests, rooms: guests.rooms + 1 })}
                >
                  <Text style={styles.counterButton}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Children ages */}
            {guests.children > 0 && (
              <View style={styles.childAgeContainer}>
                <Text style={styles.guestLabel}>Children Ages</Text>
                {Array.from({ length: guests.children }).map((_, i) => (
                  <View key={i} style={styles.ageInputContainer}>
                    <Text style={styles.ageLabel}>Child {i + 1} Age</Text>
                    <TextInput
                      style={styles.ageInput}
                      keyboardType="numeric"
                      value={guests.childAges[i]?.toString() || "0"}
                      onChangeText={(text) => {
                        const newAges = [...guests.childAges];
                        let age = parseInt(text) || 0;
                        age = Math.max(0, Math.min(17, age));
                        newAges[i] = age;
                        setGuests({ ...guests, childAges: newAges });
                      }}
                    />
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setGuestsVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={showDatePicker === "checkin" ? checkInDate : checkOutDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={
            showDatePicker === "checkout"
              ? new Date(checkInDate.getTime() + 86400000)
              : new Date()
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentScrollView: { flex: 1 },
  hotelBox: {
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
  hotelTitle: {
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
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  selectorText: { flex: 1, marginLeft: 10, fontSize: 16, color: "#333" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  searchButton: {
    backgroundColor: "#28005B",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  searchButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalFullScreen: { flex: 1, backgroundColor: "#fff" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  backButton: { marginRight: 15 },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28005B",
    flex: 1,
    textAlign: "center",
    marginRight: 24,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 8 },
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cityIcon: { marginRight: 15 },
  cityTextContainer: { flex: 1 },
  cityName: { fontSize: 16, fontWeight: "500", color: "#333" },
  countryName: { fontSize: 14, color: "#777", marginTop: 2 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noResultsContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  noResultsText: { fontSize: 16, color: "#777", textAlign: "center" },
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: "80%",
  },
  guestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  guestLabel: { fontSize: 16, color: "#333" },
  counter: { flexDirection: "row", alignItems: "center" },
  counterButton: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28005B",
    paddingHorizontal: 15,
  },
  counterValue: { fontSize: 16, fontWeight: "bold", color: "#333", width: 30, textAlign: "center" },
  childAgeContainer: { marginTop: 15 },
  ageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  ageLabel: { fontSize: 14, color: "#333" },
  ageInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
    width: 60,
    textAlign: "center",
  },
  modalCloseButton: {
    backgroundColor: "#28005B",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  modalCloseButtonText: { color: "#fff", fontWeight: "600" },
});
