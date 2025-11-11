import React, { useEffect, useRef, useState } from "react";
import { TouchableWithoutFeedback } from "react-native";
import { WebView } from "react-native-webview";
import { useToast } from "react-native-toast-notifications";
import { io } from "socket.io-client";
import AppModal from "../AppModal";
import BackButton from "../BackButton";

const TravelVpayModal = ({ visible, setVisible, url, your_ref, onSuccess }) => {
  const [transData, setTransData] = useState(null);
  const toast = useToast();
  const socketRef = useRef(null);
  const navigationTriggered = useRef(false);

  useEffect(() => {
    if (!visible) return;

    // Ensure navigation flag resets
    navigationTriggered.current = false;

    const sandbox_socket_url = "https://zander.vpay.africa";
    socketRef.current = io(sandbox_socket_url, {
      transports: ["websocket"],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      if (your_ref) {
        socket.emit(
          "NEW_TRANSACTION_REF",
          JSON.stringify({ transactionref: your_ref })
        );
      }
    });

    socket.on("connect_error", () => {
      toast.show("Connection error. Please try again.", { type: "danger" });
    });

    socket.on("TRANSACTION_STATUS", (data) => {
      if (navigationTriggered.current) return; // Prevent double actions

      let dataObj;
      try {
        dataObj = typeof data === "string" ? JSON.parse(data) : data;

        const isSuccess = dataObj.code === "00";
        toast.show(dataObj?.message || (isSuccess ? "Transaction successful!" : "Transaction failed."), {
          type: isSuccess ? "success" : "danger",
        });
        setVisible(false);
        navigationTriggered.current = true;
        if (isSuccess && onSuccess) {
          setTimeout(() => onSuccess(), 350); // Make sure modal closes first
        }
      } catch (err) {
        console.error("Failed to parse transaction data:", err);
      }
    });

    return () => {
      if (socketRef.current) {
        console.log("🛑 Disconnecting socket...");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [your_ref, visible]);

  const handleBack = () => {
    setVisible(false);
  };

  return (
    <AppModal
      visible={visible}
      onClose={handleBack}
      modalStyles={{
        height: "100%",
        padding: 0,
        width: "100%",
      }}
    >
      <BackButton onPress={handleBack} />
      <TouchableWithoutFeedback style={{ flex: 1 }}>
        <WebView
          source={{ uri: url }}
          style={{ flex: 1 }}
        />
      </TouchableWithoutFeedback>
    </AppModal>
  );
};

export default TravelVpayModal;
