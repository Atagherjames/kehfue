import React, { useEffect, useState } from "react";
import { TouchableWithoutFeedback } from "react-native";
import { WebView } from "react-native-webview";
import { useToast } from "react-native-toast-notifications";
import { io } from "socket.io-client"; 
import AppModal from "./AppModal";
import BackButton from "./BackButton";

const VTUVpayModal = ({ visible, setVisible, url, your_ref, onSuccess }) => {
  const [transData, setTransData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (!visible) return; 

    let socket;

    const init = async () => {
      const sandbox_socket_url = "https://zander.vpay.africa";
      // const live_socket_url = "https://kola.vpay.africa";

      socket = io(sandbox_socket_url, {
        transports: ["websocket"],
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      socket.on("connect", () => {
        if (your_ref) {
          socket.emit(
            "NEW_TRANSACTION_REF",
            JSON.stringify({ transactionref: your_ref })
          );
        }
      });

      socket.on("connect_error", (err) => {
        toast.show("Connection error. Please try again.", { type: "danger" });
      });

      socket.on("TRANSACTION_STATUS", (data) => {
        console.log("Received TRANSACTION_STATUS:", data);
        setTransData(data);

        try {
          const dataObj = JSON.parse(data);

          if (dataObj.code === "00") {
            onSuccess?.();
            toast.show(dataObj?.message || "Transaction successful!", {
              type: "success",
            });
            setVisible(false);
          } else {
            toast.show(dataObj?.message || "Transaction failed.", {
              type: "danger",
            });
          }
        } catch (err) {
          console.error("Failed to parse transaction data:", err);
        }
      });
    };

    init();

    // ✅ Proper cleanup
    return () => {
      if (socket) {
        console.log("🛑 Disconnecting socket...");
        socket.disconnect();
      }
    };
  }, [your_ref, visible]);

  return (
    <AppModal
      visible={visible}
      onClose={() => setVisible(false)}
      modalStyles={{
        height: "100%",
        padding: 0,
        width: "100%",
      }}
    >
      <BackButton onPress={() => setVisible(false)} />
      <TouchableWithoutFeedback style={{ flex: 1 }}>
        <WebView source={{ uri: url }} style={{ flex: 1 }} />
      </TouchableWithoutFeedback>
    </AppModal>
  );
};

export default VTUVpayModal;
