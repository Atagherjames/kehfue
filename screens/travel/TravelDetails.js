import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; 
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { AppDefaultInput } from "../../components/AppInput";
import { FlightCard } from "../../components/flight/FlightCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { formatTime, formatDuration, formatPointsPrice } from "../../constants/travel";
import { useValidateFareMutation, useBookFlightMutation } from "../../services/routes/travelRoute";
import AppLoader from "../../components/AppLoader";
import { AccessToken } from "../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import { PassengerForm } from "../../components/flight/PassengerForm";
import { formatCurrency } from "../../constants/travel";
import { PaxInfoState } from "../../recoil/paxInfo";
import { FlightBookingInfoState } from "../../recoil/flightBookingInfoState";
import { useRecoilState } from "recoil";

const { width } = Dimensions.get("window");
const CARD_PADDING = 16;

// --- Color Constants ---
const DARK_PURPLE = Colors.primary;
const ACCENT_PURPLE = Colors.primary;
const OFF_WHITE = "#FAFAFA";
const TEXT_GRAY = "#8D8D8D";
const STEPPER_INACTIVE_GRAY = "#D9D9D9";
const SEAT_INACTIVE = "#D1D5DB";

export default function FlightDetailsScreen() {
  const router = useNavigation();
  const route = useRoute();
  const toast = useToast();
  const [accessToken] = useRecoilState(AccessToken);
  const [paxInfo, setPaxInfo] = useRecoilState(PaxInfoState);
  const [flightBookingInfo, setFlightBookingInfo] = useRecoilState(FlightBookingInfoState);

  // params (expected from navigation)
  const params = route.params || {};
  const {
    flight,
    session_id,
    fare_source_code,
    flightClass,
    journeyType,
    adults: paramAdults,
    children: paramChildren,
    infants: paramInfants,
  } = params;

  // API hooks
  const [validateFare, { data: validateResponse, isLoading: isValidating }] = useValidateFareMutation();
  const [bookFlight, { isLoading: isBooking }] = useBookFlightMutation();

  const [selectedFacilities, setSelectedFacilities] = useState({
  baggage: true,
  insurance: true,
  meals: true,
  wifi: true,
});

const toggleFacility = (key) => {
  setSelectedFacilities((prev) => ({
    ...prev,
    [key]: !prev[key],
  }));
};

const facilities = [
  {
    key: "baggage",
    icon: "work",
    title: "Baggage",
    desc: "It's cheaper in app!",
  },
  {
    key: "insurance",
    icon: "security",
    title: "Insurance",
    desc: "Make your travels no worries",
  },
  {
    key: "meals",
    icon: "restaurant",
    title: "In-flight Meals",
    desc: "In case you are hungry",
  },
  {
    key: "wifi",
    icon: "wifi",
    title: "Wi-Fi",
    desc: "Keep entertained in plane",
  },
];


// 🧭 Fare Validation
  useEffect(() => {
    const runValidation = async () => {
      if (!accessToken || !session_id || !fare_source_code) return;
      try {
        const response = await validateFare({
          token: accessToken,
          validationParams: { session_id, fare_source_code },
        }).unwrap();

        toast.show("Fare validated successfully ✅", {
          type: "success",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      } catch (err) {
        const errorMessage =
          err?.data?.message ||
          err?.message ||
          "Failed to validate fare. Please try again.";
        toast.show(errorMessage, {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    };
    runValidation();
  }, []);

 
  const getCountsFromFare = () => {
    const fb =
      validateResponse?.result?.AirRevalidateResponse?.AirRevalidateResult?.FareItineraries?.FareItinerary
        ?.AirItineraryFareInfo?.FareBreakdown ||
      flight?.AirItineraryFareInfo?.FareBreakdown ||
      [];
    const counts = { adults: 0, children: 0, infants: 0 };
    fb.forEach((item) => {
      const code = item?.PassengerTypeQuantity?.Code;
      const qty = Number(item?.PassengerTypeQuantity?.Quantity || 0);
      if (code === "ADT") counts.adults += qty;
      else if (code === "CHD") counts.children += qty;
      else if (code === "INF") counts.infants += qty;
    });
    return counts;
  };

  const getValidatedFareItinerary = () => {
  const itineraries =
    validateResponse?.result?.AirRevalidateResponse?.AirRevalidateResult?.FareItineraries || [];

  if (!itineraries) return null;

  return itineraries || null;
};

  const fallbackCounts = getCountsFromFare();
  const adultsCount = Number(paramAdults ?? fallbackCounts.adults ?? 1) || 1;
  const childrenCount = Number(paramChildren ?? fallbackCounts.children ?? 0) || 0;
  const infantsCount = Number(paramInfants ?? fallbackCounts.infants ?? 0) || 0;

  

  // const rawExtraServices = validateResponse?.result?.AirRevalidateResponse?.AirRevalidateResult?.ExtraServices.Services||[];

  // passenger shape factory
  const createPassenger = () => ({
    title: "",
    firstName: "",
    lastName: "",
    dob: "", 
    nationality: "",
    gender: "",
    passportNo: "",
    passportIssueCountry: "",
    passportExpiryDate: "", 
    ExtraServiceOutbound: [], 
    ExtraServiceInbound: [],
    email: "",
    contactNumber: "",
  });

  // create arrays based on counts
  const [adults, setAdults] = useState(() => Array.from({ length: adultsCount }, () => createPassenger()));
  const [children, setChildren] = useState(() => Array.from({ length: childrenCount }, () => createPassenger()));
  const [infants, setInfants] = useState(() => Array.from({ length: infantsCount }, () => createPassenger()));

  // contact + booking
  const [clientRef] = useState(`REF${Date.now()}`);
  const [postCode, setPostCode] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookingNote, setBookingNote] = useState("");

  // stepper 1..3 (1 = details, 2 = seats, 3 = facilities & submit)
  const [step, setStep] = useState(1);
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ y: 0, animated: false });
  }, [step]);

  // date picker state global
  const [dtPicker, setDtPicker] = useState({ visible: false, type: null, group: null, idx: -1, date: new Date() });

  // passenger updates
  const updatePassengerField = (group, idx, field, value) => {
    const setter = group === "adult" ? setAdults : group === "child" ? setChildren : setInfants;
    setter((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  

  // seat selection (kept from your original)
  const unavailableSeats = [
    { row: 1, col: "A" },
    { row: 1, col: "B" },
    { row: 2, col: "C" },
    { row: 4, col: "F" },
    { row: 5, col: "D" },
  ];
const [selectedSeat, setSelectedSeat] = useState({ row: 1, col: "C" });


  const seatCols = ["A", "B", "C", "D", "E", "F"];
  const seatRows = [1, 2, 3, 4, 5, 6, 7];
  const isSeatUnavailable = (r, c) => unavailableSeats.some((s) => s.row === r && s.col === c);
  const handleSeatSelect = (r, c) => {
    if (!isSeatUnavailable(r, c)) setSelectedSeat({ row: r, col: c });
  };

  // booking payload builder (matches your sample)
  const buildBookingPayload = () => {
    const pack = (arr) => {
      if (!arr || !arr.length) return null;
      return {
        title: arr.map((p) => p.title || ""),
        firstName: arr.map((p) => p.firstName || ""),
        lastName: arr.map((p) => p.lastName || ""),
        dob: arr.map((p) => p.dob || ""),
        nationality: arr.map((p) => p.nationality || ""),
        passportNo: arr.map((p) => p.passportNo || ""),
        passportIssueCountry: arr.map((p) => p.passportIssueCountry || ""),
        passportExpiryDate: arr.map((p) => p.passportExpiryDate || ""),
        ...(arr.some((p) => p.ExtraServiceOutbound?.length) && {
          ExtraServiceOutbound: arr.map((p) => (p.ExtraServiceOutbound && p.ExtraServiceOutbound.length ? p.ExtraServiceOutbound : [])),
        }),
        ...(arr.some((p) => p.ExtraServiceInbound?.length) && {
          ExtraServiceInbound: arr.map((p) => (p.ExtraServiceInbound && p.ExtraServiceInbound.length ? p.ExtraServiceInbound : [])),
        }),
      };
    };

    const paxDetailsItem = {};
    const adultObj = pack(adults);
    const childObj = pack(children);
    const infantObj = pack(infants);
    if (adultObj) paxDetailsItem.adult = adultObj;
    if (childObj) paxDetailsItem.child = childObj;
    if (infantObj) paxDetailsItem.infant = infantObj;

    const paxInfo = {
      clientRef,
      postCode,
      customerEmail,
      customerPhone,
      bookingNote,
      paxDetails: [paxDetailsItem],
    };

  const bookingInfo = {
    flight_session_id: session_id,
    fare_source_code: fare_source_code,
    IsPassportMandatory: flight?.IsPassportMandatory || false,
    fareType: flight?.FareType || "WebFare",
    areaCode: "2",
    countryCode: "NG",
    fare_source_code_inbound: null
  };

// storing in recoil state so that it will be available in ticket screen
  setFlightBookingInfo(bookingInfo);
  setPaxInfo(paxInfo);

    return { paxInfo,   fareItenary: getValidatedFareItinerary(), };
  };

  // validation (basic presence checks)
  const validateAll = () => {
    if (!customerEmail || !customerPhone) {
      toast.show("Please enter customer email and phone.", { type: "danger" });
      return false;
    }

    const checkArr = (arr, label) => {
      for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        if (!p.firstName || !p.lastName) {
          toast.show(`${label} ${i + 1}: Enter first and last name.`, { type: "danger" });
          return false;
        }
        if (!p.dob) {
          toast.show(`${label} ${i + 1}: Enter date of birth.`, { type: "danger" });
          return false;
        }
        if (String(flight?.IsPassportMandatory) === "true") {
          if (!p.passportNo) {
            toast.show(`${label} ${i + 1}: Enter passport number.`, { type: "danger" });
            return false;
          }
          if (!p.passportIssueCountry) {
            toast.show(`${label} ${i + 1}: Enter passport issue country.`, { type: "danger" });
            return false;
          }
          if (!p.passportExpiryDate) {
            toast.show(`${label} ${i + 1}: Enter passport expiry date.`, { type: "danger" });
            return false;
          }
        }
      }
      return true;
    };

    if (!checkArr(adults, "Adult")) return false;
    if (!checkArr(children, "Child")) return false;
    if (!checkArr(infants, "Infant")) return false;
    return true;
  };

  // submit booking
  const submitBooking = async () => {
    if (!validateAll()) return;
    const payload = buildBookingPayload();
    try {
      const res = await bookFlight({ token: accessToken, bookingParams: payload }).unwrap();
       toast.show(res.message ||"Booking successful!", { type: "success" });
       console.log("booking response", res)
      router.navigate("FlightPaymentScreen", { bookingResponse: res, bookingPayload: payload});
    } catch (err) {
      const msg = err?.data?.message || err?.message || "Booking failed";
      toast.show(msg, { type: "danger" });
    }
  };

 
  // Date change handler
 const onDateChange = (event, selectedDate) => {
  if (event.type === "dismissed") {
    setDtPicker((prev) => ({ ...prev, visible: false }));
    return;
  }

  if (event.type === "set" && selectedDate) {
    const { type, group, idx } = dtPicker;

    setDtPicker((prev) => ({ ...prev, visible: false }));

    const iso = selectedDate.toISOString().split("T")[0];
    if (type === "dob") {
      updatePassengerField(group, idx, "dob", iso);
    } else if (type === "expiry") {
      updatePassengerField(group, idx, "passportExpiryDate", iso);
    }
  }
};



  // flight summary and tags (kept)
  const fare = flight?.AirItineraryFareInfo?.ItinTotalFares || {};
  const segments = flight?.OriginDestinationOptions?.[0]?.OriginDestinationOption || [];
  const first = segments?.[0] || {};
  const last = segments?.[segments.length - 1] || first;
  const airline = first?.FlightSegment?.MarketingAirlineName || "";
  const summary = getFlightSummary(segments);
  const depCode = first?.FlightSegment?.DepartureAirportLocationCode || "";
  const arrCode = last?.FlightSegment?.ArrivalAirportLocationCode || "";
  const stopsText = segments?.length === 1 ? "Direct" : `${segments.length - 1} stop${segments.length > 2 ? "s" : ""}`;
  const displayCabinClass = first?.FlightSegment?.CabinClassText || first?.FlightSegment?.CabinClass || flightClass || "Economy";
  const hasBaggage = flight?.AirItineraryFareInfo?.FareBreakdown?.[0]?.Baggage?.length > 0;
  const flightTags = [{ name: displayCabinClass, icon: "event-seat" }, { name: stopsText, icon: "north-east" }];
  if (hasBaggage) flightTags.push({ name: "Baggage", icon: "work" });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        {(isValidating || isBooking) && <AppLoader message={isBooking ? "Completing booking..." : "Validating fare details..."} />}

        <View style={styles.fixedHeader}>
          <View style={styles.headerBar}>
            <TouchableOpacity style={styles.back} onPress={() => router.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Details</Text>
          </View>

          <FlightCard
            airline={airline}
  price={formatCurrency(
    Number(fare?.TotalFare?.Amount ?? "0"),
    fare?.TotalFare?.CurrencyCode || "NGN"
  )}
            from={depCode}
            to={arrCode}
            depart={formatTime(first?.FlightSegment?.DepartureDateTime)}
            arrive={formatTime(last?.FlightSegment?.ArrivalDateTime)}
            duration={summary.totalDuration}
            tags={flightTags}
          />
        </View>

        {/* Stepper: 1=Details, 2=Seats, 3=Facilities/Book */}
        <View style={styles.stepperContainer}>
          {["Details", "Seats", "Facilities"].map((label, idx) => {
            const i = idx + 1;
            const isLast = i === 3;
            return (
              <React.Fragment key={label}>
                <Pressable style={styles.stepItem} onPress={() => setStep(i)}>
                  <View style={getStepCircleStyle(i, step, ACCENT_PURPLE)}>
                    <Text style={[styles.stepNumber, step >= i ? { color: "#fff" } : { color: "#4A4A4A" }]}>{i}</Text>
                  </View>
                  <Text style={[styles.stepLabel, step === i ? styles.stepLabelActive : styles.stepLabelInactive]}>{label}</Text>
                </Pressable>
                {!isLast && <View style={getStepLineStyle(i, step, STEPPER_INACTIVE_GRAY, ACCENT_PURPLE)} />}
              </React.Fragment>
            );
          })}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} ref={scrollRef} showsVerticalScrollIndicator={false}>
          <View style={step === 1 ? styles.contentAreaStep1 : styles.contentAreaSteps23}>
            {/* Step 1: Passenger Details (all groups visible here) */}
            {step === 1 && (
              <View style={styles.form}>
                {/* <Text style={styles.sectionTitle}>Contact Details</Text> */}
                <AppDefaultInput label="Customer Email" value={customerEmail} onChangeText={setCustomerEmail} placeholder="email@example.com" style={{ marginBottom: 12 }} />
                <AppDefaultInput label="Customer Phone" value={customerPhone} onChangeText={setCustomerPhone} placeholder="+234..." keyboardType="phone-pad" style={{ marginBottom: 12 }} />
                <AppDefaultInput label="Postcode" value={postCode} onChangeText={setPostCode} placeholder="Postcode" style={{ marginBottom: 12 }} />
                <AppDefaultInput label="Booking Note" value={bookingNote} onChangeText={setBookingNote} placeholder="Enter booking note" style={{ marginBottom: 12 }} />
 <Text style={styles.sectionTitle}>Adults</Text>
                {adults.map((p, i) => (
                  <PassengerForm
                    key={`adult-${i}`}
                    group="adult"
                    idx={i}
                    passenger={p}
                    updatePassengerField={updatePassengerField}
                    setDtPicker={setDtPicker}
                  />
                ))}

                {children.length > 0 && <Text style={styles.sectionTitle}>Children</Text>}
                {children.map((p, i) => (
                  <PassengerForm
                    key={`child-${i}`}
                    group="child"
                    idx={i}
                    passenger={p}
                    updatePassengerField={updatePassengerField}
                    setDtPicker={setDtPicker}
                  />
                ))}

                {infants.length > 0 && <Text style={styles.sectionTitle}>Infants</Text>}
                {infants.map((p, i) => (
                  <PassengerForm
                    key={`infant-${i}`}
                    group="infant"
                    idx={i}
                    passenger={p}
                    updatePassengerField={updatePassengerField}
                    setDtPicker={setDtPicker}
                  />
                ))}
              </View>
            )}

            {/* Step 2: Seats */}
            {step === 2 && (
              <View style={styles.seats}>
                <View style={styles.seatHeader}>
                  <View style={{ width: 28 }} />
                  {seatCols.map((c) => (
                    <Text key={c} style={styles.seatColLabel}>
                      {c}
                    </Text>
                  ))}
                </View>
                <View style={{ marginTop: 8 }}>
                  {seatRows.map((r) => (
                    <View key={r} style={styles.seatRow}>
                      <Text style={styles.rowNumber}>{r}</Text>
                      {seatCols.map((c) => {
                        const isSelected = selectedSeat.row === r && selectedSeat.col === c;
                        const isUnavailable = isSeatUnavailable(r, c);
                        return (
                          <Pressable key={`${r}${c}`} onPress={() => handleSeatSelect(r, c)} disabled={isUnavailable} style={[styles.seatBox, isSelected && styles.seatBoxActive, isUnavailable && styles.seatBoxUnavailable]} />
                        );
                      })}
                    </View>
                  ))}
                </View>
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendSquare, { backgroundColor: "#5481C4" }]} />
                    <Text style={styles.legendText}>Selected</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendSquare, { backgroundColor: "#D1D5DB" }]} />
                    <Text style={styles.legendText}>Available</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendSquare, styles.seatBoxUnavailable]} />
                    <Text style={styles.legendText}>Taken</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Step 3: Facilities (global toggles) + submit */}
           {step === 3 && (
    <View style={styles.facilities}>
      {facilities.map((fac) => (
        <View key={fac.key} style={styles.facilityCard}>
          <View style={styles.facL}>
            <View style={styles.iconCircle}>
              <MaterialIcons name={fac.icon} size={20} color={ACCENT_PURPLE} />
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.facTitle}>{fac.title}</Text>
              <Text style={styles.facDesc}>{fac.desc}</Text>
            </View>

            <Switch
              trackColor={{ false: "#E9E9EA", true: ACCENT_PURPLE }}
              thumbColor="#fff"
              ios_backgroundColor="#E9E9EA"
              value={selectedFacilities[fac.key]}
              onValueChange={() => toggleFacility(fac.key)}
            />
          </View>
        </View>
      ))}
    </View>
  )}
          </View>

          <View style={{ height: 50 }} />

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() => {
                if (step < 3) setStep((s) => s + 1);
                else submitBooking();
              }}
            >
              <Text style={styles.continueText}>{step === 3 ? "Complete Booking" : "Continue"}</Text>
            </TouchableOpacity>
          </View>

          {/* DateTimePicker */}
          {dtPicker.visible && (
            <DateTimePicker
              value={dtPicker.date || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "calendar"}
              maximumDate={new Date(2100, 11, 31)}
              onChange={onDateChange}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ---------- helpers & styles ---------- */

function getFlightSummary(segments) {
  const first = segments?.[0];
  const duration = first?.FlightSegment?.JourneyDuration ? formatDuration(first.FlightSegment.JourneyDuration) : "";
  return { totalDuration: duration };
}

const getStepCircleStyle = (i, currentStep, accent) => {
  const isActive = currentStep === i;
  const isCompleted = currentStep > i;
  return [styles.stepCircle, isCompleted || isActive ? { backgroundColor: accent, borderColor: accent } : { backgroundColor: "#fff", borderColor: STEPPER_INACTIVE_GRAY }];
};
const getStepLineStyle = (i, currentStep, inactiveGray, accent) => {
  const isCompleted = currentStep > i;
  const isActive = currentStep === i + 1;
  return [styles.stepperLine, isCompleted || isActive ? styles.stepperLineActive : styles.stepperLineInactive];
};

 export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DARK_PURPLE },
  screen: { flex: 1, backgroundColor: OFF_WHITE },

  fixedHeader: {
    backgroundColor: DARK_PURPLE,
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
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600", marginLeft: 8 },

  scrollContent: { paddingHorizontal: 16, paddingTop: 0 },

  // Stepper
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 4,
  },
  stepItem: { alignItems: "center", width: (width - 64) / 3, zIndex: 1 },
  stepCircle: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 6, borderWidth: 1 },
  stepNumber: { color: "#4A4A4A", fontWeight: "700", fontSize: 13 },
  stepLabel: { fontSize: 13 },
  stepLabelActive: { color: ACCENT_PURPLE, fontWeight: "600" },
  stepLabelInactive: { color: TEXT_GRAY, fontWeight: "500" },
  stepperLine: { flex: 1, height: 1, position: "absolute", top: 12, left: ((width - 32) / 3) / 2 + 16, right: ((width - 32) / 3) / 2 + 16, zIndex: 0 },
  stepperLineActive: { backgroundColor: ACCENT_PURPLE },
  stepperLineInactive: { backgroundColor: STEPPER_INACTIVE_GRAY },

  contentAreaStep1: { paddingBottom: 20 },
  contentAreaSteps23: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: CARD_PADDING,
    paddingBottom: 20,
    minHeight: 260,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },

  form: {},
  sectionTitle: { fontWeight: "700", marginBottom: 16, color: "#222", fontSize: 16 },
  inputLabel: { fontSize: 14, color: Colors.labelColor, fontFamily: "Medium", marginBottom: 4 },
  datePicker: { backgroundColor: Colors.inputBg, borderWidth: 1, borderColor: Colors.inputBorder, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  phoneInputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.inputBg, borderWidth: 1, borderColor: Colors.inputBorder, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  phoneCode: { fontSize: 14, fontWeight: "700", color: "#333" },
  phoneDivider: { fontSize: 16, color: TEXT_GRAY, marginHorizontal: 8 },
  phoneInput: { flex: 1, fontSize: 14, color: "#333", padding: 0 },

  // Seats
  seatHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  seatColLabel: { flex: 1, textAlign: "center", fontWeight: "600", color: "#888" },
  seatRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  rowNumber: { width: 28, textAlign: "center", color: "#7B7B7B", fontSize: 12 },
  seatBox: { flex: 1, height: 40, backgroundColor: SEAT_INACTIVE, borderRadius: 8, marginHorizontal: 4, justifyContent: "center", alignItems: "center" },
  seatBoxActive: { backgroundColor: "#5481C4", borderWidth: 1, borderColor: "#5481C4" },
  seatBoxUnavailable: { backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#F3F4F6" },
  legendContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 20, paddingHorizontal: 20 },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendSquare: { width: 16, height: 16, borderRadius: 4, marginRight: 6, borderWidth: 1, borderColor: SEAT_INACTIVE },
  legendText: { fontSize: 12, color: "#666" },

  // Facilities
  facilities: {},
  facilityCard: { backgroundColor: "#FBFBFD", borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#F0F0F3" },
  facL: { flexDirection: "row", alignItems: "center" },
  iconCircle: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "#F0F0F3" },
  facTitle: { fontWeight: "700", fontSize: 14 },
  facDesc: { color: "#8A8A8A", fontSize: 12 },

  // Footer
  footer: {
    bottom: 22,
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
      android: { elevation: 8 },
    }),
  },
  continueBtn: { backgroundColor: ACCENT_PURPLE, width: width - 32, paddingVertical: 14, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  continueText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
