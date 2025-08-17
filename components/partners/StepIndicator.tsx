import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const steps = [
  { label: "Intro", subtitle: "Name your Store" },
  { label: "Images", subtitle: "Upload Images" },
  { label: "Team Members", subtitle: "Select who can manage store" },
  { label: "Location", subtitle: "Looking for more information" },
  { label: "Completed", subtitle: "Review and Submit" },
];

const StepIndicator = ({ currentStep = 1, completedStep = 0 }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const stepIndex = index + 1;
        const isCompleted = completedStep >= stepIndex;
        const isActive = currentStep === stepIndex;

        return (
          <View key={index} style={styles.stepRow}>
            <View
              style={[
                styles.circle,
                isCompleted && styles.completedCircle,
                isActive && styles.activeCircle,
              ]}
            >
              {isCompleted && !isActive && stepIndex !== 5 ? (
                <Ionicons name="checkmark" size={16} color="#28005B" />
              ) : (
                <Text
                  style={[styles.circleText, isActive && styles.activeText]}
                >
                  {stepIndex}
                </Text>
              )}
            </View>
            <View>
              <Text style={styles.label}>{step.label}</Text>
              <Text style={styles.subtitle}>{step.subtitle}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EBEDFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  completedCircle: {
    backgroundColor: "#D9D9F3",
  },
  activeCircle: {
    backgroundColor: "#2d0150",
  },
  circleText: {
    color: "#2d0150",
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
  label: {
    fontSize: 14,
    color: "#364A63",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    color: "#A0AEC0",
  },
});

export default StepIndicator;
