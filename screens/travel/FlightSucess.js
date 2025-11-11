import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../constants/colors";
import AppHeader from "../../components/AppHeader";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useGenerateFlightTicketMutation } from "../../services/routes/travelRoute";
import { AccessToken } from "../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import { useRoute } from "@react-navigation/native";
import { useRecoilState, useRecoilValue } from "recoil";
import AppLoader from "../../components/AppLoader";
import { FlightBookingInfoState } from "../../recoil/flightBookingInfoState";
import { PaxInfoState } from "../../recoil/paxInfo";

export default function FlightSuccessScreen({ navigation }) {
  const route = useRoute();
  const { bookingResponse } = route.params;
  const paxInfo = useRecoilValue(PaxInfoState);
  const flightBookingInfo = useRecoilValue(FlightBookingInfoState);
  const toast = useToast();
  const [accessToken] = useRecoilState(AccessToken);
  const [generateTicket, { isLoading }] = useGenerateFlightTicketMutation();
  const [ticketResponse, setTicketResponse] = useState(null);
  const [ticketError, setTicketError] = useState(null);

  useEffect(() => {
    async function autoGenerateTicket() {
      try {
        const bookingId = bookingResponse?.BookingId;
        if (!bookingId) {
          setTicketError("Booking ID not found.");
          toast.show("Booking ID not found.", { type: "danger" });
          return;
        }
        const response = await generateTicket({
          token: accessToken,
          bookingId,
          flightBookingInfo,
          paxInfo
        }).unwrap();
        setTicketResponse(response);
        setTicketError(null);
        toast.show("Ticket generated successfully!", { type: "success" });
      } catch (error) {
        setTicketError(error?.data?.message || "Failed to generate ticket.");
        toast.show(error?.data?.message || "Failed to generate ticket.", {
          type: "danger",
        });
      }
    }
    autoGenerateTicket();
  }, []);

  const handleCheckTicket = () => {
    if (ticketResponse) {
      navigation.navigate("FlightTicketPaymentScreen", {
        ticketData: ticketResponse,
      });
    } else if (ticketError) {
      // Optional: manual retry
      setTicketError(null);
      setTicketResponse(null);
      // Trigger ticket generation again
      (async () => {
        toast.show("Retrying ticket generation...", { type: "info" });
        try {
          const bookingId = bookingResponse?.BookingId;
          const response = await generateTicket({
            token: accessToken,
            bookingId,
            flightBookingInfo,
            paxInfo
          }).unwrap();
          setTicketResponse(response);
          toast.show("Ticket generated successfully!", { type: "success" });
        } catch (error) {
          setTicketError(error?.data?.message || "Failed to generate ticket.");
          toast.show(error?.data?.message || "Failed to generate ticket.", {
            type: "danger",
          });
        }
      })();
    }
  };

  const handleBackHome = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <ScreenWrapper>
      {(isLoading || (!ticketResponse && !ticketError)) && (
        <AppLoader message={"Generating your ticket..."} />
      )}
      {ticketError && (
        <AppLoader error message={ticketError}>
          <TouchableOpacity onPress={handleCheckTicket}>
            <Text style={{ color: Colors.primary, marginTop: 10, fontWeight: '700' }}>
              Retry
            </Text>
          </TouchableOpacity>
        </AppLoader>
      )}
      <AppHeader />
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/flightpaymentsucess.png")} 
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Your Payment Has Been Completed!</Text>
        <Text style={styles.subtitle}>
          You can check your e-Ticket by clicking the button below.
        </Text>
        {/* The button is only enabled after ticket is ready */}
        <TouchableOpacity
          style={[styles.primaryBtn, !ticketResponse && { backgroundColor: "#D2D2D4" }]}
          onPress={handleCheckTicket}
          disabled={!ticketResponse}
        >
          <Text style={styles.primaryBtnText}>Check E-Ticket</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={handleBackHome}>
          <Text style={styles.secondaryBtnText}>Back to home</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: Colors.white,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.darkBlue,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textGrey,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryBtnText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryBtn: {
    backgroundColor: "#F5F5F5",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: Colors.darkBlue,
    fontWeight: "600",
    fontSize: 15,
  },
});
