import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import { storeFormState } from "../../recoil/StoreForm";

type FormFields =
  | "businessLogo"
  | "businessBanner"
  | "CAC_StatusReport"
  | "CertificateOfIncorporation"
  | "ProofOfBusinessAddress"
  | "TaxIdentificationDocument";

interface FileData {
  uri: string;
  name: string;
  type: "image" | "document";
  blob?: Blob; 
}

const StoreFormStepTwo = () => {
  const [form, setForm] = useRecoilState(storeFormState);

  const pickFile = async (field: FormFields) => {
    try {
      let fileObj: FileData | null = null;

      if (field === "businessLogo" || field === "businessBanner") {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Permission Required", "Please allow access to media library.");
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          const response = await fetch(asset.uri);
          const blob = await response.blob();

          fileObj = {
            uri: asset.uri,
            name: asset.fileName || asset.uri.split("/").pop() || "image.jpg",
            type: "image",
            blob,
          };
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });

        if (!result.canceled && "assets" in result && result.assets.length > 0) {
          const file = result.assets[0];
          const response = await fetch(file.uri);
          const blob = await response.blob();

          fileObj = {
            uri: file.uri,
            name: file.name,
            type: "document",
            blob,
          };
        }
      }

      if (fileObj) {
        setForm((prevForm) => ({
          ...prevForm,
          [field]: fileObj,
        }));
      }
    } catch (err) {
      console.error("File selection error:", err);
      Alert.alert("Error", "Failed to select file. Please try again.");
    }
  };

  const removeFile = (field: FormFields) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: null,
    }));
  };

  const renderPreview = (file: FileData | null, fieldName: FormFields) => {
    if (!file) return null;
    if (file.type === "image") {
      return (
        <>
          <Image source={{ uri: file.uri }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFile(fieldName)}
          >
            <Ionicons name="close-circle" size={20} color="#fff" />
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <View style={styles.documentPreview}>
          <Ionicons name="document-text-outline" size={24} color="#28005B" />
          <Text style={styles.documentName}>{file.name}</Text>
          <TouchableOpacity onPress={() => removeFile(fieldName)}>
            <Ionicons name="close-circle" size={20} color="#ff4d4d" />
          </TouchableOpacity>
        </View>
      );
    }
  };

  const fields: { key: FormFields; label: string }[] = [
    { key: "businessBanner", label: "Store Banner" },
    { key: "businessLogo", label: "Store Logo" },
    { key: "CAC_StatusReport", label: "CAC Status Report" },
    { key: "CertificateOfIncorporation", label: "Certificate of Incorporation" },
    { key: "ProofOfBusinessAddress", label: "Proof of Business Address" },
    { key: "TaxIdentificationDocument", label: "Tax Identification Document" },
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>Store Information</Text>
      {fields.map((field) => (
        <View key={field.key} style={{ marginBottom: 20 }}>
          <Text style={styles.label}>{field.label}</Text>
          <View style={styles.uploadBox}>
            {form[field.key] ? (
              renderPreview(form[field.key], field.key)
            ) : (
              <>
                <Text style={styles.dragText}>Upload your file</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => pickFile(field.key)}
                >
                  <Text style={styles.selectButtonText}>SELECT</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#364A63", marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "500", marginBottom: 6, color: "#364A63" },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 6,
    backgroundColor: "#fff",
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  dragText: { color: "#8094AE", fontSize: 14, marginBottom: 8 },
  selectButton: { backgroundColor: "#28005B", paddingVertical: 8, paddingHorizontal: 24, borderRadius: 6 },
  selectButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  previewImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    padding: 2,
  },
  documentPreview: { flexDirection: "row", alignItems: "center", gap: 8 },
  documentName: { fontSize: 14, color: "#364A63", flexShrink: 1 },
});

export default StoreFormStepTwo;
