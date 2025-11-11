import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AppDefaultInput } from "../AppInput";
import { styles } from "../../screens/travel/TravelDetails";
export const PassengerForm = ({
  group,
  idx,
  passenger,
  updatePassengerField,
  setDtPicker,
}) => {
  const label =
    group === "adult"
      ? `Adult ${idx + 1}`
      : group === "child"
      ? `Child ${idx + 1}`
      : `Infant ${idx + 1}`;

  return (
    <View
      key={`${group}-${idx}`}
      style={{
        marginBottom: 12,
        borderRadius: 10,
      }}
    >
      <Text style={{ fontWeight: "700", marginBottom: 8 }}>{label}</Text>

      <AppDefaultInput
        label="Title"
        value={passenger.title}
        onChangeText={(t) => updatePassengerField(group, idx, "title", t)}
        placeholder="Mr / Mrs / Miss / Master"
        style={{ marginBottom: 8 }}
      />

      <AppDefaultInput
        label="First name"
        value={passenger.firstName}
        onChangeText={(t) => updatePassengerField(group, idx, "firstName", t)}
        placeholder="First name"
        style={{ marginBottom: 8 }}
      />

      <AppDefaultInput
        label="Last name"
        value={passenger.lastName}
        onChangeText={(t) => updatePassengerField(group, idx, "lastName", t)}
        placeholder="Last name"
        style={{ marginBottom: 8 }}
      />

      <View style={{ marginBottom: 8 }}>
        <Text style={styles.inputLabel}>Date of Birth</Text>
        <Pressable
          style={styles.datePicker}
          onPress={() =>
            setDtPicker({
              visible: true,
              type: "dob",
              group,
              idx,
              date: passenger.dob ? new Date(passenger.dob) : new Date(),
            })
          }
        >
          <Text
            style={{
              fontSize: 14,
              color: passenger.dob ? "#333" : "#B9B9B9",
            }}
          >
            {passenger.dob || "Select Date"}
          </Text>
          <MaterialIcons name="calendar-today" size={20} color="#8A8A8A" />
        </Pressable>
      </View>

      <AppDefaultInput
        label="Nationality"
        value={passenger.nationality}
        onChangeText={(t) => updatePassengerField(group, idx, "nationality", t)}
        placeholder="IN"
        style={{ marginBottom: 8 }}
      />

      <AppDefaultInput
        label="Gender"
        value={passenger.gender}
        onChangeText={(t) => updatePassengerField(group, idx, "gender", t)}
        placeholder="Male / Female"
        style={{ marginBottom: 8 }}
      />

      <AppDefaultInput
        label="Passport Number"
        value={passenger.passportNo}
        onChangeText={(t) => updatePassengerField(group, idx, "passportNo", t)}
        placeholder="Passport number"
        style={{ marginBottom: 8 }}
      />

      <AppDefaultInput
        label="Passport Issue Country"
        value={passenger.passportIssueCountry}
        onChangeText={(t) =>
          updatePassengerField(group, idx, "passportIssueCountry", t)
        }
        placeholder="IN"
        style={{ marginBottom: 8 }}
      />

      <View style={{ marginBottom: 8 }}>
        <Text style={styles.inputLabel}>Passport Expiry</Text>
        <Pressable
          style={styles.datePicker}
          onPress={() =>
            setDtPicker({
              visible: true,
              type: "expiry",
              group,
              idx,
              date: passenger.passportExpiryDate
                ? new Date(passenger.passportExpiryDate)
                : new Date(),
            })
          }
        >
          <Text
            style={{
              fontSize: 14,
              color: passenger.passportExpiryDate ? "#333" : "#B9B9B9",
            }}
          >
            {passenger.passportExpiryDate || "Select Expiry Date"}
          </Text>
          <MaterialIcons name="calendar-today" size={20} color="#8A8A8A" />
        </Pressable>
      </View>

      <AppDefaultInput
        label="Email (optional)"
        value={passenger.email}
        onChangeText={(t) => updatePassengerField(group, idx, "email", t)}
        placeholder="email@example.com"
        style={{ marginBottom: 8 }}
      />

      <AppDefaultInput
        label="Contact number (optional)"
        value={passenger.contactNumber}
        onChangeText={(t) =>
          updatePassengerField(group, idx, "contactNumber", t)
        }
        placeholder="+234..."
        keyboardType="phone-pad"
        style={{ marginBottom: 8 }}
      />
    </View>
  );
};
