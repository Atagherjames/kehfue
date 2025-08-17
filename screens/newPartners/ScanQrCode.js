import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import NewPartnersDrawer from "../../navigators/NewPartnersDrawer";
import CustomDrawer from "../../components/CustomDrawer";
import { View, Text } from "react-native";
import { Colors } from "../../constants/colors";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import AppButton from "../../components/AppButton";
import AppLoader from "../../components/AppLoader";
import { useScanQrCodeMutation } from "../../services/routes/userRoutes";
import { useToast } from "react-native-toast-notifications";
import { useRecoilState } from "recoil";
import { AccessToken } from "../../recoil/UserData";
import { useNavigation } from "@react-navigation/native";

const ScanQrCode = () => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const toast = useToast();
  const [token, _] = useRecoilState(AccessToken);
  const [scanCode, { isLoading, isError }] = useScanQrCodeMutation();
  useEffect(() => {
    requestPermission();
  }, []);

  const handleScan = async (url) => {
    try {
      const result = await scanCode({ token, url }).unwrap();
      if (result?.success) {
        console.log(result.details);
        navigation.navigate("ScanPayment", { data: result.details });
        toast.show(result?.message || "Successful", {
          type: "success",
        });
        setScanned(false);
      } else {
        toast.show(result?.message || "something went wrong", {
          type: "danger",
        });
        setScanned(false);
      }
    } catch (error) {
      toast.show(
        error?.message || error?.data?.message || "something went wrong",
        {
          type: "danger",
        }
      );
      setScanned(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading && <AppLoader />}
      <CustomDrawer />

      {permission?.granted ? (
        <View style={{ flex: 1 }}>
          {!scanned && (
            <View style={{ flex: 1 }}>
              <CameraView
                facing="back"
                style={{ flex: 1 }}
                onBarcodeScanned={async (result) => {
                  setScanned(true);
                  handleScan(result.data);
                }}
              />
            </View>
          )}
          <View style={{ backgroundColor: Colors.white, padding: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "SemiBold",
              }}
            >
              Payment with QR Code
            </Text>
            <Text style={{ fontFamily: "Regular", fontSize: 14 }}>
              Hold the code inside the frame, it will be scanned automatically
            </Text>
          </View>
        </View>
      ) : (
        <View style={{ padding: 20 }}>
          <Text style={{ fontFamily: "Medium", textAlign: "center" }}>
            Grant Camera Access
          </Text>
          <AppButton
            onPress={requestPermission}
            btnText={"Request permission"}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ScanQrCode;
