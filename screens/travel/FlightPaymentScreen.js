import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import AppHeader from "../../components/AppHeader";
import { Colors } from "../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation,useRoute } from "@react-navigation/native";
import { AccessToken } from "../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import { useRecoilState } from "recoil";
import { useInitiateVpayPurchaseMutation } from "../../services/routes/vtuRoutes";
import { formatCurrency } from "../../constants/travel";
import VpayModal from "../../components/VpayModal";

const RadioButton = ({ label, selected, onPress }) => (
  <Pressable style={styles.radioContainer} onPress={onPress}>
    <View style={styles.radioCircle}>
      {selected && <View style={styles.radioDot} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </Pressable>
);

const { width } = Dimensions.get("window");

export default function FlightPaymentScreen() {
  const router = useNavigation();
  const route = useRoute();
  const [accessToken] = useRecoilState(AccessToken);
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState("");
  const [ref, setRef] = useState("");
  const toast = useToast();
  const { bookingResponse, bookingPayload } = route.params;
  const [initiateVpayPurchase, { isLoading }] = useInitiateVpayPurchaseMutation();

  const handleVPayPurchase = async () => {
    try {
      const fareInfo = bookingPayload?.fareItenary?.FareItinerary?.AirItineraryFareInfo;
      const originDestOptions = bookingPayload?.fareItenary?.FareItinerary?.OriginDestinationOptions?.[0]?.OriginDestinationOption?.[0];
      const totalFare = parseFloat(fareInfo?.ItinTotalFares?.TotalFare?.Amount ?? 0);
      const airlineName =
        originDestOptions?.FlightSegment?.OperatingAirline?.Name ??
        originDestOptions?.FlightSegment?.MarketingAirlineName ??
        "Flight Booking";
      const productId = bookingResponse?.BookingId;
      const paymentBody = {
        price: totalFare,
        context: "flight",
        productId,
        name: airlineName,
      };
      const response = await initiateVpayPurchase({
        token: accessToken,
        body: paymentBody,
      }).unwrap();
      const redirectUrl = response?.paymentInfo?.redirect_url;
      const transactionRef = response?.paymentInfo?.txRef;
      if (redirectUrl && transactionRef) {
        setUrl(redirectUrl);
        setRef(transactionRef);
        setShowModal(true);
      } else {
        toast.show("Failed to initialize payment", { type: "danger" });
      }
    } catch (err) {
      toast.show("Error initiating payment", { type: "danger" });
    }
  };

  const [paymentOption, setPaymentOption] = useState("Card Only");
  const [pointsToUse, setPointsToUse] = useState("12101");

  // Build dynamic order data
  const fareInfo = bookingPayload?.fareItenary?.FareItinerary?.AirItineraryFareInfo;
  const currencyCode = fareInfo?.ItinTotalFares?.TotalFare?.CurrencyCode || "NGN";
  const originDest = bookingPayload?.fareItenary?.FareItinerary?.OriginDestinationOptions?.[0]?.OriginDestinationOption?.[0];

  const ORDER_DATA = {
    orderNumber: bookingResponse?.BookingId || "N/A",
    product:
      originDest?.FlightSegment?.OperatingAirline?.Name ??
      originDest?.FlightSegment?.MarketingAirlineName ??
      "Flight Booking",
    type: originDest?.FlightSegment?.FlightNumber
      ? `Flight ${originDest.FlightSegment.FlightNumber}`
      : "Flight Ticket",
    date:
      originDest?.FlightSegment?.DepartureDateTime
        ? new Date(originDest.FlightSegment.DepartureDateTime).toDateString()
        : "Date Unavailable",
    cost: {
      subtotal: fareInfo?.ItinTotalFares?.TotalFare?.Amount ?? "0.00",
      baggage: "0.00",
      insurance: "0.00",
      totalRemainingNaira: fareInfo?.ItinTotalFares?.TotalFare?.Amount ?? "0.00",
      convertedPoints: (parseFloat(fareInfo?.ItinTotalFares?.TotalFare?.Amount ?? 0) * 0.25).toFixed(2),
    },
  };

  const costItems = [
    { label: "Total", value: ORDER_DATA.cost.subtotal, sign: "" },
    // { label: "Baggage", value: ORDER_DATA.cost.baggage, sign: "+" },
    // { label: "Insurance", value: ORDER_DATA.cost.insurance, sign: "+" },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.screen}
      >
        <View style={styles.fixedHeader}>
          <View style={styles.headerBar}>
            <TouchableOpacity
              style={styles.back}
              onPress={() => router.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Payment</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            <Text style={styles.orderNumberText}>
              Booking ID:{" "}
              <Text style={styles.orderNumberValue}>
                {ORDER_DATA.orderNumber}
              </Text>
            </Text>

            <Text style={styles.sectionTitle}>Review Your Order</Text>

            {/* Product Card */}
            <View style={styles.productCard}>
              <Text style={styles.productTitle}>{ORDER_DATA.product}</Text>
              <Text style={styles.productDetail}>{ORDER_DATA.type}</Text>
              <Text style={styles.productDetail}>{ORDER_DATA.date}</Text>
            </View>

            {/* Cost Section */}
            <Text style={styles.costTitle}>Cost</Text>
            <View style={styles.costContainer}>
              {costItems.map((item) => (
                <View key={item.label} style={styles.costRow}>
                  <Text style={styles.costLabel}>{item.label}</Text>
                  <Text style={styles.costValue}>
                    {item.sign}
                    {formatCurrency(Number(item.value), currencyCode)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            {/* Converted Points */}
            <View style={styles.convertedContainer}>
              <View style={styles.convertedRow}>
                <Text style={styles.convertedLabel}>Converted To Points:</Text>
                <Text style={styles.convertedValue}>
                  {ORDER_DATA.cost.convertedPoints} KPT
                </Text>
              </View>

              {paymentOption !== "Points Only" && (
                <View style={[styles.convertedRow, { marginTop: 8 }]}>
                  <Text style={styles.totalLabel}>Total Remaining in Naira:</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(Number(ORDER_DATA.cost.totalRemainingNaira), currencyCode)}
                  </Text>
                </View>
              )}
            </View>

            {/* Payment Options */}
            <Text style={styles.payOptionsTitle}>How would you like to pay?</Text>
            <View style={styles.radioGroup}>
              <RadioButton
                label="Points Only"
                selected={paymentOption === "Points Only"}
                onPress={() => setPaymentOption("Points Only")}
              />
              <RadioButton
                label="Points and Card"
                selected={paymentOption === "Points and Card"}
                onPress={() => setPaymentOption("Points and Card")}
              />
              <RadioButton
                label="Card Only"
                selected={paymentOption === "Card Only"}
                onPress={() => setPaymentOption("Card Only")}
              />
            </View>

            {paymentOption === "Points and Card" && (
              <View style={{ marginTop: 16 }}>
                <Text style={styles.inputLabel}>Points to be Used:</Text>
                <TextInput
                  style={styles.pointsInput}
                  value={pointsToUse}
                  onChangeText={setPointsToUse}
                  keyboardType="numeric"
                  placeholder="Enter KPS points"
                  placeholderTextColor={Colors.placeholderColor}
                />
              </View>
            )}

            {/* Scrolls naturally with content */}
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={handleVPayPurchase}
              disabled={isLoading}
            >
              <Text style={styles.continueText}>
                {isLoading ? "Processing..." : "Checkout"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <VpayModal
          visible={showModal}
          setVisible={setShowModal}
          url={url}
          your_ref={ref}
          onSuccess={({ reference } = {}) => {
            setShowModal(false);
            router.replace("FlightSuccess", {
              bookingResponse,
              bookingPayload,
              transactionRef: reference || ref,
            });
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  screen: { flex: 1, backgroundColor: Colors.white },

  fixedHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerBar: {
    paddingTop: Platform.OS === "android" ? 24 : 12,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  back: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },

  scrollContent: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 40 },
  contentContainer: { paddingVertical: 12 },

  orderNumberText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 12,
  },
  orderNumberValue: { fontWeight: "700", color: "#111827"},
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 10,
    color: "#6B7280",
    fontSize: 16,
  },

  productCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#E5E7EB",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },

  divider: {
  height: 1,
  backgroundColor: Colors.grey,
  marginVertical: 10,
  opacity: 0.5,
},

  productTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  productDetail: { fontSize: 13, color: Colors.textGrey, marginBottom: 2 },
  productDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.grey,
  },

  costTitle: {
    fontWeight: "700",
    marginBottom: 10,
    color: Colors.primary,
    fontSize: 16,
  },
  costContainer: { marginBottom: 16 },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  costLabel: { fontSize: 14, color: Colors.textGrey, fontWeight: "500" },
  costValue: { fontSize: 14, color: Colors.black, fontWeight: "600" },

  convertedContainer: {
    paddingBottom: 16,
    marginBottom: 16,
   
  },
  convertedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  convertedLabel: { fontSize: 14, color: Colors.primary, fontWeight: "500" },
  convertedValue: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "700",
  },
  totalLabel: { fontSize: 16, color: Colors.primary, fontWeight: "600" },
  totalValue: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "800",
  },

  payOptionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 12,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "48%",
    minWidth: 100,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioLabel: { fontSize: 13, color: Colors.black },

  inputLabel: {
    fontSize: 14,
    color: Colors.labelColor,
    fontWeight: "500",
    marginBottom: 4,
  },
  pointsInput: {
    backgroundColor: Colors.lightGrey,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    borderRadius: 8,
    fontSize: 14,
    color: Colors.black,
  },

  continueBtn: {
    backgroundColor: Colors.primary,
    width: width - 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    alignSelf: "center",
  },
  continueText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
});
