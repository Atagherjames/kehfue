import React, { useEffect, useRef, useState } from "react";
import AppModal from "./AppModal";
import socketIOClient from "socket.io-client";
import { WebView } from "react-native-webview";
import { TouchableWithoutFeedback } from "react-native";
import { useToast } from "react-native-toast-notifications";
import BackButton from "./BackButton";
import { SOCKET_URL } from "../services/apiSlice";

const VpayModal = ({ visible, setVisible, url, your_ref, onSuccess }) => {
  const [transData, setTransData] = useState(null);
  const socketRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (!visible || !your_ref) {
      return;
    }

    // Initialize socket connection to your backend
    const socket = socketIOClient(SOCKET_URL, {
      transports: ["websocket"],
      forceNew: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", { connectionId: "flight" });
      console.log('joined socket')
    });

    socket.on("sendAlert", (responseData) => {
      try {
        const dataObj = typeof responseData === "string"
          ? JSON.parse(responseData)
          : responseData;
        setTransData(dataObj);
console.log('alet is being setn')
        const txn = dataObj.transaction || {};
        const status = txn.status || dataObj.status;
        const success = txn.success !== undefined ? txn.success : dataObj.success;
        const isConfirmed = txn.isPaymentConfirmed !== undefined ? txn.isPaymentConfirmed : dataObj.isPaymentConfirmed;

        const isTxnSuccessful =
          ["completed", "SUCCESS"].includes(status) ||
          success === true ||
          isConfirmed === true;

        if (isTxnSuccessful) {
          toast.show("Payment successful!", { type: "success" });
          setVisible(false);
          setTimeout(() => {
            onSuccess?.(dataObj);
            console.log("[VpayModal] Called onSuccess handler after success");
          }, 350);
        } else {
          console.log(`[VpayModal] Payment failed or error: ${dataObj?.message}`);
          toast.show(dataObj?.message || "Payment failed.", { type: "danger" });
          setVisible(false);
        }
      } catch (err) {
        console.error("[VpayModal] Error parsing backend response:", err);
        toast.show("Error processing payment update.", { type: "danger" });
      }
    });

    socket.on("error", (err) => {
      toast.show("Error establishing connection.", { type: "danger" });
    });

    socket.on("connect_error", (err) => {
      console.warn("[VpayModal] Socket connect_error event:", err);
      toast.show("Connection error. Retrying...", { type: "warning" });
    });

    return () => {
      if (socketRef.current) {
        console.log("[VpayModal] Disconnecting socket on modal unmount/close.");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [your_ref, visible]);

  return (
    <AppModal
      visible={visible}
      onClose={() => {
        setVisible(false);
      }}
      modalStyles={{
        height: "100%",
        padding: 0,
        width: "100%",
      }}
    >
      <BackButton onPress={() => {
        setVisible(false);
      }} />
      <TouchableWithoutFeedback style={{ flex: 1 }}>
        <WebView source={{ uri: url }} style={{ flex: 1 }} />
      </TouchableWithoutFeedback>
    </AppModal>
  );
};

export default VpayModal;
