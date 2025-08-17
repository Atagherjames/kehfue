import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Dimensions, StyleSheet, Text, View, Button } from "react-native";
import AppLoader from "../../components/AppLoader";
import { useScanQrCodeMutation } from "../../services/routes/userRoutes";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";

const ScanQrCode = () => {
  const navigation = useNavigation()
  const [permission, requestPermission] = useCameraPermissions();
  const [scanCode, {isLoading, isError}] = useScanQrCodeMutation()
  const [token, _] = useRecoilState(PartnerAccessToken)
  const toast = useToast()

  const handleScan = async (url) => {
    try {
      const result = await scanCode({token, url}).unwrap()
      if (result?.success) {
        navigation.navigate("ScanResult", {data: result.details})
        toast.show(result?.message || "Successful", {
          type: "success"
        })
      } else {
        toast.show(result?.message || "something went wrong", {
          type: "danger"
        })
      }
    } catch (error) {
      toast.show(error?.message || error?.data?.message || "something went wrong", {
        type: "danger"
      })
    }
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.black,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.black,
      }}
    >
      {isLoading && <AppLoader />}
      <CameraView
        style={{
          width: Dimensions.get("screen").width - 50,
          height: Dimensions.get("screen").width - 50,
        }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={(result) => {
          if (!isLoading) {
            handleScan(result?.data)
          }
        }}
      />
    </SafeAreaView>
  );
};

export default ScanQrCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
