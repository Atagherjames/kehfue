import { useState, useMemo, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, TextInput, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AppButton from "../../components/AppButton";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../../components/AppLoader";
import { usePartnerPOSPaymentWithPointsMutation } from "../../services/routes/partnerRoute";
import { Colors } from "../../constants/colors";

const PinConfirmationScreen = () => {
  const toast = useToast();
  const [token] = useRecoilState(PartnerAccessToken);
  const navigation = useNavigation();
  const route = useRoute();
  const { paymentDetails } = route.params || {};

  const [pin, setPin] = useState("");

  const [partnerPOSPayment, { isLoading, isSuccess, isError, error }] =
    usePartnerPOSPaymentWithPointsMutation();

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

  useEffect(() => {
    if (isSuccess) {
      setPin("");
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "ScanPaymentSuccess",
            params: {
              totalPayment: paymentDetails?.price,
              fullName: paymentDetails?.fullName,
              paymentDate: new Date().toISOString(),
            },
          },
        ],
      });
    }

    if (isError) {
      toast.show(
        error?.data?.message ||
          "An unexpected error occurred. Please try again.",
        { type: "danger", duration: 4000 }
      );
    }
  }, [isSuccess, isError, error, navigation, paymentDetails, toast]);

  const handleConfirmPayment = async () => {
    if (!pin || pin.length !== 4 || isNaN(pin)) {
      Alert.alert("Invalid PIN", "Please enter a 4-digit numeric PIN.");
      return;
    }

    try {
      await partnerPOSPayment({
        token,
        body: {
          cardNumber: paymentDetails?.cardNumber,
          points: paymentDetails?.points,
          price: paymentDetails?.price,
          fullName: paymentDetails?.fullName,
          pin: pin,
        },
      }).unwrap();
    } catch (err) {}
  };

  if (!paymentDetails) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ fontSize: 16, color: "red" }}>
          Missing payment details.
        </Text>
      </SafeAreaView>
    );
  }

  const formattedPoints = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(paymentDetails.points);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      {isLoading && (
        <View style={StyleSheet.absoluteFillObject}>
          <AppLoader />
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Image
            source={require("../../assets/images/scan-image.png")}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.nameText}>{paymentDetails?.fullName}</Text>
        <Text style={styles.subText}>Payment on {paymentDate}</Text>

        <Text style={styles.amountText}>₦{paymentDetails?.price}</Text>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>Confirm Your Payment</Text>

        <View style={styles.pointsDisplayCard}>
          <Text style={styles.pointsDisplayLabel}>Points:</Text>
          <Text style={styles.pointsDisplayValue}>{formattedPoints} KPTS</Text>
        </View>

        <View style={styles.pinInputCard}>
          <Text style={styles.pinInputLabel}>Input Your Pin</Text>
          <TextInput
            placeholder="****"
            placeholderTextColor={Colors.textGrey}
            keyboardType="numeric"
            secureTextEntry={true}
            maxLength={4}
            value={pin}
            onChangeText={(val) => setPin(val || "")}
            style={styles.pinInputField}
          />
        </View>

        <AppButton
          btnText="Confirm"
          onPress={handleConfirmPayment}
          containerStyle={{ marginTop: 32 }}
          disabled={!pin || pin.length !== 4 || isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default PinConfirmationScreen;

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
  pointsDisplayCard: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  pointsDisplayLabel: {
    fontFamily: "SemiBold",
    fontSize: 14,
    color: Colors.textDark,
  },
  pointsDisplayValue: {
    fontFamily: "Regular",
    fontSize: 14,
    color: Colors.textDark,
  },
  pinInputCard: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 60,
    justifyContent: "center",
    marginBottom: 16,
  },
  pinInputLabel: {
    fontFamily: "SemiBold",
    fontSize: 12,
    color: Colors.textGrey,
    marginBottom: 2,
  },
  pinInputField: {
    fontFamily: "Regular",
    fontSize: 14,
    paddingTop: 2,
    color: Colors.textDark,
  },
});
