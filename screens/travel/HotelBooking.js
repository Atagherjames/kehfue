import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import AppHeader from "../../components/AppHeader";
import AppLoader from "../../components/AppLoader";
import {
  useBookHotelRoomMutation,
  useInitiateHotelPaymentMutation,
  useCheckHotelRoomRateMutation,
} from "../../services/routes/travelRoute";
import { useRecoilState } from "recoil";
import { useToast } from "react-native-toast-notifications";
import { AccessToken } from "../../recoil/UserData";
import VpayModal from "../../components/VpayModal";

const BookingScreen = ({ route, navigation }) => {
  const { hotel, room, searchParams, sessionId } = route.params;
  const [accessToken] = useRecoilState(AccessToken);
  const toast = useToast();

  const [
    checkHotelRoomRate,
    {
      data: checkRateData,
      isLoading: checkRateLoading,
      isError: checkRateError,
      error: checkRateErrorObj,
    },
  ] = useCheckHotelRoomRateMutation();

  const [initiateHotelPayment] = useInitiateHotelPaymentMutation();
  const [bookHotelRoom] = useBookHotelRoomMutation();

  const nights = Math.ceil(
    (new Date(searchParams.checkout) - new Date(searchParams.checkin)) /
      (1000 * 60 * 60 * 24)
  );

  const validatedRoom =
    checkRateData?.roomRates?.result || checkRateData?.roomRates || room;

  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookingNote, setBookingNote] = useState("");
  const [paxDetails, setPaxDetails] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentRedirectUrl, setPaymentRedirectUrl] = useState(null);
  const [txRef, setTxRef] = useState(null);

  // True if both payment and booking have succeeded (to disable the button)
  const [completed, setCompleted] = useState(false);

  const totalPrice =
    validatedRoom && validatedRoom.netPrice
      ? parseFloat(validatedRoom.netPrice) * nights
      : 0;

  useEffect(() => {
    checkHotelRoomRate({
      token: accessToken,
      rateBasisId: room.rateBasisId,
      productId: room.productId,
      tokenId: hotel.tokenId,
      sessionId,
    });
  }, [room, hotel, sessionId, accessToken]);

  useEffect(() => {
    let details = [];
    if (
      Array.isArray(searchParams.occupancy) &&
      searchParams.occupancy.length > 0
    ) {
      details = searchParams.occupancy.map((occ) => ({
        room_no: occ.room_no,
        adults: Array.from({ length: occ.adult || 1 }, () => ({
          title: "Mr",
          firstName: "",
          lastName: "",
        })),
        children: Array.from({ length: occ.child || 0 }, () => ({
          title: "Mr",
          firstName: "",
          lastName: "",
        })),
      }));
    } else {
      const occupancy = searchParams.occupancy?.[0] || {};
      const adults = Number(searchParams.adults || occupancy.adult || 1);
      const children = Number(searchParams.children || occupancy.child || 0);
      details = [
        {
          room_no: 1,
          adults: Array.from({ length: adults }, () => ({
            title: "Mr",
            firstName: "",
            lastName: "",
          })),
          children: Array.from({ length: children }, () => ({
            title: "Mr",
            firstName: "",
            lastName: "",
          })),
        },
      ];
    }
    setPaxDetails(details);
  }, [searchParams]);

  const handlePaxChange = (roomIdx, type, field, value, guestIdx) => {
    const newPaxDetails = [...paxDetails];
    const roomPax = newPaxDetails[roomIdx];
    if (type === "adult") {
      roomPax.adults[guestIdx][field] = value;
    } else if (type === "child") {
      roomPax.children[guestIdx][field] = value;
    }
    setPaxDetails(newPaxDetails);
  };

  const getErrorMessage = () =>
    checkRateErrorObj?.data?.message ||
    (checkRateData?.remark && typeof checkRateData.remark === "string"
      ? checkRateData.remark
      : null) ||
    "Could not validate the latest room rate. Please try again.";

  if (checkRateLoading) {
    return (
      <ScreenWrapper>
        <AppHeader />
        <AppLoader message="Validating room, price & availability..." />
      </ScreenWrapper>
    );
  }
  if (checkRateError || !validatedRoom) {
    return (
      <ScreenWrapper>
        <AppHeader />
        <AppLoader message={getErrorMessage()} error>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back to Room Selection</Text>
          </TouchableOpacity>
        </AppLoader>
      </ScreenWrapper>
    );
  }

  const displayRemark =
    checkRateData?.remark ||
    validatedRoom?.remark ||
    validatedRoom?.cancellationPolicy ||
    "";

  const handleInitiatePayment = async () => {
    if (
      !customerEmail ||
      !customerPhone ||
      paxDetails.some((room) =>
        room.adults.some((p) => !p.firstName || !p.lastName)
      )
    ) {
      toast.show("Please fill in all required fields.", { type: "danger" });
      return;
    }

    setIsProcessing(true);
    try {
      const payload = {
        price: Number(totalPrice),
        context: "hotel",
        productId: validatedRoom.productId,
      };
      const response = await initiateHotelPayment({
        token: accessToken,
        payload,
      }).unwrap();
      if (response.success) {
        setTxRef(response.paymentInfo.txRef);
        setPaymentRedirectUrl(response.paymentInfo.redirect_url);
        setPaymentModalVisible(true);
      } else {
        toast.show(response.message || "Failed to initiate payment.", {
          type: "danger",
        });
      }
    } catch (error) {
      toast.show("Failed to connect to the payment server. Please try again.", {
        type: "danger",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Called IMMEDIATELY after payment success
  const handleBooking = async () => {
    setIsProcessing(true);
    try {
      const payloadPaxDetails = paxDetails.map((roomPax, i) => {
        let obj = {
          room_no: roomPax.room_no,
          adult: {
            title: roomPax.adults.map((p) => p.title),
            firstName: roomPax.adults.map((p) => p.firstName),
            lastName: roomPax.adults.map((p) => p.lastName),
          },
        };
        if (roomPax.children.length > 0) {
          obj.child = {
            title: roomPax.children.map((p) => p.title),
            firstName: roomPax.children.map((p) => p.firstName),
            lastName: roomPax.children.map((p) => p.lastName),
          };
        }
        return obj;
      });

      const bookingPayload = {
        sessionId: sessionId,
        productId: validatedRoom.productId,
        tokenId: hotel.tokenId,
        rateBasisId: validatedRoom.rateBasisId,
        clientRef: `BOOK-${Date.now()}`,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        bookingNote: bookingNote,
        paxDetails: payloadPaxDetails,
      };

      const response = await bookHotelRoom({
        token: accessToken,
        bookingPayload,
      }).unwrap();

      if (response.success) {
        toast.show("Hotel booking successful!", { type: "success" });
        setCompleted(true);
        navigation.replace("BookingHistoryScreen");
      } else {
        toast.show(response.message || "Failed to complete booking.", {
          type: "danger",
        });
      }
    } catch (error) {
      toast.show(
        "Failed to complete the booking. Please contact support.",
        { type: "danger" }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppHeader />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hotel & Room Details</Text>
            <Text style={styles.detailText}>Hotel: {hotel.hotelName}</Text>
            <Text style={styles.detailText}>
              Room: {validatedRoom.roomType?.split("|")[0] || ""}
            </Text>
            <Text style={styles.detailText}>
              Stay: {nights} night{nights !== 1 ? "s" : ""}
            </Text>
            <Text style={styles.priceText}>
              Total Price: {validatedRoom.currency} {totalPrice.toLocaleString()}
            </Text>
            {displayRemark ? (
              <Text style={{ color: "#b01732", marginTop: 5 }}>
                {displayRemark}
              </Text>
            ) : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Contact Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              value={customerEmail}
              onChangeText={setCustomerEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={customerPhone}
              onChangeText={setCustomerPhone}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Booking Note (optional)"
              multiline
              value={bookingNote}
              onChangeText={setBookingNote}
            />
          </View>

          {paxDetails.map((roomPax, roomIdx) => (
            <View style={styles.card} key={`room-${roomIdx}`}>
              <Text style={styles.cardTitle}>
                Traveler Information{" "}
                {paxDetails.length > 1 ? `(Room ${roomPax.room_no})` : ""}
              </Text>
              {roomPax.adults.map((pax, index) => (
                <View key={`adult-${index}`} style={styles.paxContainer}>
                  <Text style={styles.paxTitle}>Adult {index + 1}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={pax.firstName}
                    onChangeText={(text) =>
                      handlePaxChange(roomIdx, "adult", "firstName", text, index)
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={pax.lastName}
                    onChangeText={(text) =>
                      handlePaxChange(roomIdx, "adult", "lastName", text, index)
                    }
                  />
                </View>
              ))}
              {roomPax.children.map((pax, index) => (
                <View key={`child-${index}`} style={styles.paxContainer}>
                  <Text style={styles.paxTitle}>Child {index + 1}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={pax.firstName}
                    onChangeText={(text) =>
                      handlePaxChange(roomIdx, "child", "firstName", text, index)
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={pax.lastName}
                    onChangeText={(text) =>
                      handlePaxChange(roomIdx, "child", "lastName", text, index)
                    }
                  />
                </View>
              ))}
            </View>
          ))}

          <TouchableOpacity
            style={styles.button}
            onPress={handleInitiatePayment}
            disabled={isProcessing || completed}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Initiate Payment</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        <VpayModal
          visible={paymentModalVisible}
          setVisible={setPaymentModalVisible}
          url={paymentRedirectUrl}
          your_ref={txRef}
          onSuccess={() => {
            toast.show("Payment Successful! Processing booking...", {
              type: "success",
            });
          navigation.replace("BookingHistoryScreen");
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#28005B",
  },
  detailText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28005B",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  paxContainer: {
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#28005B",
    paddingLeft: 10,
  },
  paxTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#28005B",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BookingScreen;
