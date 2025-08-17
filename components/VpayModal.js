import React, { useEffect, useState } from "react";
import AppModal from "./AppModal";
import socketIOClient from "socket.io-client";
import { WebView } from "react-native-webview";
import { TouchableWithoutFeedback } from "react-native";
import { Colors } from "../constants/colors";
import { useToast } from "react-native-toast-notifications";
import BackButton from "./BackButton";

const VpayModal = ({ visible, setVisible, url, your_ref, onSuccess }) => {
    const [transData, setTransData] = useState(null)
    console.log(transData)
    const toast = useToast()
    // toast.show(transData.message)
    useEffect(() => {
        const init = async () => {
            const sandbox_socket_url = "https://zander.vpay.africa";
            //const live_socket_url = "https://kola.vpay.africa";
    
            const socket = socketIOClient(sandbox_socket_url, { transports: ["websocket"], forceNew: true });
            
            socket.on("connect", () => {
                if (your_ref) {
                    socket.emit("NEW_TRANSACTION_REF", JSON.stringify({ transactionref: your_ref }));
                }
            });
        
            socket.on("TRANSACTION_STATUS", (data) => {
                setTransData(data)
                setVisible(false)
                console.log(data)
                const dataObj = JSON.parse(data)
                toast.show(dataObj?.message, {type: "success"})
                if (dataObj.code == "00") {
                    onSuccess()
                }
            });
        };
        
        init();
        return () => {};
    }, [your_ref]);
  return (
    <AppModal
      visible={visible}
      onClose={() => setVisible(false)}
      modalStyles={{
        height: "100%",
        padding: 0,
        width: "100%"
      }}

    >
        <BackButton onPress={() => setVisible(false)}/>
      <TouchableWithoutFeedback style={{flex: 1,}}>
        <WebView source={{ uri: url }} style={{ flex: 1, }} />
      </TouchableWithoutFeedback>
    </AppModal>
  );
};

export default VpayModal;
