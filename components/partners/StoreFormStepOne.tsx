import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { storeFormState } from "../../recoil/StoreForm";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const StoreFormStepOne = ({ preset }) => {
  const [form, setForm] = useRecoilState(storeFormState);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const categoryOptions = [
  ];

  const readOnlyFields = {
    websiteURL: preset?.websiteURL ?? null,
    description: preset?.description ?? null,
    category: preset?.sector ?? null,
  };

 
  useEffect(() => {
    if (preset) {
      setForm((oldForm) => ({
        ...oldForm,
        ...(preset.websiteURL ? { websiteURL: preset.websiteURL } : {}),
        ...(preset.description ? { description: preset.description } : {}),
        ...(preset.sector ? { category: preset.sector } : {}),
      }));
    }
  }, [preset, setForm]);

  const registrationOptions = [
    { label: "Sole Proprietorship", value: "soleOwner" },
    { label: "Limited Company", value: "limitedCompany" },
  ];

  // Only allow category selection if it's not preset (read-only)
  const handleCategorySelect = (category) => {
    if (!readOnlyFields.category) {
      setForm({ ...form, category });
      setIsModalVisible(false);
    }
  };

  // Only allow input change if field is not read-only
  const handleInputChange = (key, value) => {
    if (readOnlyFields[key]) return;
    setForm({ ...form, [key]: value });
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Store information</Text>

      {/* Store Name (always editable) */}
      <Text style={styles.label}>Store name</Text>
      <TextInput
        style={styles.input}
        value={form.storeName}
        onChangeText={(text) => handleInputChange("storeName", text)}
      />

      {/* Store Category */}
      <Text style={styles.label}>Store category</Text>
      <TouchableOpacity
        style={[
          styles.selectInput,
          readOnlyFields.category && { backgroundColor: "#fafafa" },
        ]}
        onPress={() => !readOnlyFields.category && setIsModalVisible(true)}
      >
        <Text
          style={form.category ? styles.selectTextActive : styles.selectText}
        >
          {form.category || "Select Category"}
        </Text>
        {!readOnlyFields.category && (
          <Ionicons name="chevron-down" size={20} color="#999" />
        )}
      </TouchableOpacity>

      {/* Category modal */}
      <Modal visible={isModalVisible} transparent animationType="none">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={categoryOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleCategorySelect(item)}
                  style={styles.modalItem}
                >
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.modalCancel}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Website URL */}
      <Text style={styles.label}>Website URL</Text>
      <TextInput
        style={[
          styles.input,
          readOnlyFields.websiteURL && { backgroundColor: "#fafafa" },
        ]}
        value={form.websiteURL}
        onChangeText={(text) => handleInputChange("websiteURL", text)}
        placeholder="https://www.example.com"
        placeholderTextColor="#8094AE"
        autoCapitalize="none"
        keyboardType="url"
        editable={!readOnlyFields.websiteURL}
      />

      {/* Store Description */}
      <Text style={styles.label}>Store description</Text>
      <TextInput
        style={[
          styles.input,
          styles.textarea,
          readOnlyFields.description && { backgroundColor: "#fafafa" },
        ]}
        multiline
        value={form.description}
        onChangeText={(text) => handleInputChange("description", text)}
        placeholder="Write Project Description"
        placeholderTextColor="#8094AE"
        editable={!readOnlyFields.description}
      />

      {/* Business Registration Type (always editable) */}
      <Text style={styles.sectionSubtitle}>Business Registration Type</Text>
      <View style={styles.radioGroup}>
        {registrationOptions.map(({ label, value }) => {
          const isSelected = form.businessRegistrationType === value;
          return (
            <TouchableOpacity
              key={value}
              style={styles.radioOption}
              onPress={() => handleInputChange("businessRegistrationType", value)}
            >
              <View
                style={[styles.radioOuter, !isSelected && styles.radioInactive]}
              >
                {isSelected && <View style={styles.radioHole} />}
              </View>
              <Text style={styles.radioLabel}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default StoreFormStepOne;

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
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 12,
    color: "#364A63",
  },
  radioGroup: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#DBDFEA",
    backgroundColor: "#28005B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioInactive: {
    backgroundColor: "#fff",
  },
  radioHole: {
    width: 5,
    height: 5,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  radioLabel: {
    fontSize: 14,
    color: "#526484",
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
