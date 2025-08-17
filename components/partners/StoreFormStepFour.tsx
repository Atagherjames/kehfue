import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { useGetCountriesWithStatesQuery } from "../../services/externalGeoApiSlice";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../AppLoader";
import { useRecoilState } from "recoil";
import { storeFormState } from "../../recoil/StoreForm";
import { Ionicons } from "@expo/vector-icons";

const StoreFormStepFour = ({ preset }) => {
  const toast = useToast();
  const [form, setForm] = useRecoilState(storeFormState);
  const [modalData, setModalData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalKey, setModalKey] = useState("country");

  // Only 'streetAddress' is read-only if preset.address exists
  const readOnlyFields = {
    streetAddress: !!preset?.address,
  };

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError,
  } = useGetCountriesWithStatesQuery(undefined);

  useEffect(() => {
    if (isError) {
      toast.show("Failed to load countries", { type: "danger" });
    }
  }, [isError]);

  // Initialize only streetAddress from preset
  useEffect(() => {
    if (preset?.address) {
      setForm((oldForm) => ({
        ...oldForm,
        streetAddress: preset.address,
      }));
    }
  }, [preset, setForm]);

  const getStatesForCountry = (countryName) => {
    const match = countriesData?.find((c) => c.name === countryName);
    return (
      match?.states?.map((s, index) => ({
        key: `${s.name}-${index}`,
        label: s.name,
      })) || []
    );
  };

  const openModal = (key) => {
    setModalKey(key);

    if (key === "country") {
      const countries =
        countriesData?.map((c, index) => ({
          key: `${c.name}-${index}`,
          label: c.name,
        })) || [];
      setModalData(countries);
    } else if (key === "state" && form.country) {
      setModalData(getStatesForCountry(form.country));
    }

    setModalVisible(true);
  };

  const handleSelect = (key, value) => {
    if (key === "country") {
      setForm((prev) => ({ ...prev, country: value, state: "" }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
    setModalVisible(false);
  };

  const handleInputChange = (key, value) => {
    if (readOnlyFields[key]) return;
    setForm({ ...form, [key]: value });
  };

  const toggleStoreType = (value) => {
    setForm({
      ...form,
      storeType: value === "Online Store" ? "online" : "physical",
    });
  };

  return (
    <View>
      {countriesLoading && <AppLoader />}

      <Text style={styles.sectionTitle}>More Info</Text>

      {/* Country dropdown */}
      <Text style={styles.label}>Country</Text>
      <TouchableOpacity style={styles.selectInput} onPress={() => openModal("country")}>
        <Text style={form.country ? styles.selectTextActive : styles.selectText}>
          {form.country || "Select Country"}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#999" />
      </TouchableOpacity>

      {/* State dropdown */}
      <Text style={styles.label}>State</Text>
      <TouchableOpacity
        style={[styles.selectInput, !form.country && { backgroundColor: "#f0f0f0" }]}
        disabled={!form.country}
        onPress={() => openModal("state")}
      >
        <Text style={form.state ? styles.selectTextActive : styles.selectText}>
          {form.state || "Select State"}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#999" />
      </TouchableOpacity>

      {/* City input */}
      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        value={form.city}
        onChangeText={(text) => handleInputChange("city", text)}
        placeholder="City"
      />

      {/* Street Address */}
      <Text style={styles.label}>Street Address</Text>
      <TextInput
        style={[styles.input, readOnlyFields.streetAddress && { backgroundColor: "#fafafa" }]}
        value={form.streetAddress}
        onChangeText={(text) => handleInputChange("streetAddress", text)}
        placeholder="Street Address"
        editable={!readOnlyFields.streetAddress}
      />

      {/* Store Type */}
      <Text style={styles.label}>Store Type</Text>
      <View style={styles.checkboxRow}>
        {["Online Store", "Physical Store"].map((type) => {
          const selectedValue = type === "Online Store" ? "online" : "physical";
          const isSelected = form.storeType === selectedValue;

          return (
            <TouchableOpacity key={type} style={styles.checkboxOption} onPress={() => toggleStoreType(type)}>
              <Ionicons
                name={isSelected ? "checkbox" : "square-outline"}
                size={20}
                color={isSelected ? "#28005B" : "#C4C4C4"}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.checkboxLabel}>{type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="none">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              style={{ maxHeight: 300 }}
              data={modalData}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => handleSelect(modalKey, item.label)}>
                  <Text style={styles.modalText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StoreFormStepFour;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#364A63",
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
    color: "#364A63",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  selectText: {
    fontSize: 14,
    color: "#8094AE",
  },
  selectTextActive: {
    fontSize: 14,
    color: "#364A63",
  },
  checkboxRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  checkboxOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#526484",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    maxHeight: "80%",
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalText: {
    fontSize: 14,
    color: "#333",
  },
  modalCancel: {
    marginTop: 12,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#5c27fe",
    fontWeight: "600",
  },
});
