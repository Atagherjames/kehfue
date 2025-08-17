import React, { useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomDrawer from "../../components/CustomDrawer";
import AppButton from "../../components/AppButton";
import { Colors } from "../../constants/colors";

const paymentOptions = [
  { name: "Points Only", value: "pointsOnly" },
  { name: "Earn Only", value: "earnOnly" },
  { name: "Points and Card Transaction", value: "pointsAndCard" },
];

const PaymentMethodDropdown = ({ options, selected, onSelect, balance }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item) => {
    onSelect(item.name);
    setModalVisible(false);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.sheetTitle}>Choose Payment Method</Text>
      <TouchableOpacity
        style={styles.dropdownWrapper}
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <View>
          <Text style={styles.dropdownMainText}>{selected}</Text>
          <Text style={styles.dropdownSubText}>Balance: {balance} KPTS</Text>
        </View>
        <Ionicons name="chevron-down" size={18} color={Colors.textGrey} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  <Text style={styles.modalItemSubText}>
                    Balance: {balance} KPTS
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Helper function to normalize spaces in names
const normalizeName = (name) => name?.trim().replace(/\s+/g, " ") || "";

const ScanPayment = ({ route }) => {
  const navigation = useNavigation();
  const { data } = route?.params || {};

  const [pointsToUse, setPointsToUse] = useState("");
  const [price, setPrice] = useState("");
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(
    paymentOptions[0].name
  );

  const isPointsOnly = selectedPaymentOption === "Points Only";
  const isEarnOnly = selectedPaymentOption === "Earn Only";

  const paymentDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Africa/Lagos",
      }).format(new Date()),
    []
  );

  const isButtonDisabled = useMemo(() => {
    const validPrice =
      price && !isNaN(parseFloat(price)) && parseFloat(price) > 0;
    const enteredPoints = parseFloat(pointsToUse);
    const validPoints =
      !isNaN(enteredPoints) &&
      enteredPoints >= 0 &&
      enteredPoints <= (data?.point || 0);
    const validPointsForMethod = isPointsOnly
      ? validPoints && enteredPoints > 0
      : true;

    return !(validPrice && validPointsForMethod);
  }, [price, pointsToUse, isPointsOnly, data?.point]);

  const handleProceed = () => {
    const enteredPrice = parseFloat(price);
    const enteredPoints = parseFloat(pointsToUse);

    if (!price || isNaN(enteredPrice) || enteredPrice <= 0) {
      return Alert.alert("Invalid Input", "Please enter a valid price.");
    }

    if (!isEarnOnly) {
      if (isNaN(enteredPoints) || enteredPoints < 0) {
        return Alert.alert("Invalid Input", "Points cannot be negative.");
      }

      if (enteredPoints > (data?.point || 0)) {
        return Alert.alert(
          "Insufficient Points",
          "You don't have enough points."
        );
      }

      if (isPointsOnly && enteredPoints <= 0) {
        return Alert.alert(
          "Invalid Input",
          "Please enter points greater than 0."
        );
      }

      if (!isPointsOnly && enteredPoints > enteredPrice) {
        return Alert.alert(
          "Invalid Points",
          "Points cannot exceed the total price."
        );
      }
    }

    const selected = paymentOptions.find(
      (o) => o.name === selectedPaymentOption
    )?.value;

    navigation.navigate("PinConfirmationScreen", {
      paymentDetails: {
        fullName: normalizeName(data?.name),
        cardNumber: data?.cardNumber,
        points: isEarnOnly ? 0 : enteredPoints || 0,
        price: enteredPrice,
        pin: "",
        selectedMethod: selected || "pointsOnly",
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <CustomDrawer />

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Image
            source={require("../../assets/images/scan-image.png")}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.nameText}>{normalizeName(data?.name)}</Text>
        <Text style={styles.subText}>Payment on {paymentDate}</Text>

        <Text style={styles.amountText}>{data?.value}</Text>
      </View>

      <View style={styles.sheet}>
        <PaymentMethodDropdown
          options={paymentOptions}
          selected={selectedPaymentOption}
          balance={data?.point || 0}
          onSelect={setSelectedPaymentOption}
        />

        {/* Always show price input */}
        <View style={styles.pointsCard}>
          <Text style={styles.pointsLabel}>Price</Text>
          <TextInput
            placeholder="Enter amount"
            placeholderTextColor={Colors.textGrey}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            style={styles.pointsInput}
          />
        </View>

        {/* Conditionally render points input (hide for Earn Only) */}
        {!isEarnOnly && (
          <View style={styles.pointsCard}>
            <Text style={styles.pointsLabel}>Points to be Used</Text>
            <TextInput
              placeholder="Enter points"
              placeholderTextColor={Colors.textGrey}
              keyboardType="numeric"
              value={pointsToUse}
              onChangeText={setPointsToUse}
              style={styles.pointsInput}
            />
          </View>
        )}

        <AppButton
          btnText="Continue"
          onPress={handleProceed}
          containerStyle={{ marginTop: 32 }}
          disabled={isButtonDisabled}
        />
      </View>
    </SafeAreaView>
  );
};

export default ScanPayment;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: Colors.primary,
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  nameText: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: "Medium",
  },
  subText: {
    color: "#FFAE58",
    opacity: 0.7,
    fontSize: 12,
    marginTop: 2,
    fontFamily: "Regular",
  },
  amountText: {
    color: Colors.white,
    fontSize: 32,
    marginTop: 16,
    fontFamily: "SemiBold",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    marginTop: -20,
    zIndex: 10,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: "SemiBold",
    marginBottom: 8,
  },
  dropdownWrapper: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
  },
  dropdownMainText: {
    fontFamily: "Medium",
    fontSize: 14,
    color: Colors.textDark,
  },
  dropdownSubText: {
    fontFamily: "Regular",
    fontSize: 12,
    color: Colors.textGrey,
    marginTop: 2,
  },
  pointsCard: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 60,
    justifyContent: "center",
    marginBottom: 16,
  },
  pointsLabel: {
    fontFamily: "SemiBold",
    fontSize: 12,
    color: Colors.textGrey,
    marginBottom: 2,
  },
  pointsInput: {
    fontFamily: "Regular",
    fontSize: 14,
    paddingTop: 2,
    color: Colors.textDark,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "SemiBold",
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  modalItemText: {
    fontFamily: "Medium",
    fontSize: 14,
    color: Colors.textDark,
  },
  modalItemSubText: {
    fontFamily: "Regular",
    fontSize: 12,
    color: Colors.textGrey,
  },
  modalCloseBtn: {
    marginTop: 16,
    alignItems: "center",
    paddingVertical: 12,
  },
  modalCloseText: {
    fontFamily: "SemiBold",
    color: Colors.primary,
  },
});
