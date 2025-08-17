import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { Image, Text, View } from "react-native";
import AppButton from "../../components/AppButton";
import PaymentModal from "../../components/PaymentModal";
import { useToast } from "react-native-toast-notifications";
import { useReloadAppMutation } from "../../services/routes/productRoutes";
import { useDispatch } from "react-redux";
import { apiSlice } from "../../services/apiSlice";

const PaymentProcessing = ({ navigation, route }) => {
  // const {url} = route?.params
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();

  const invalidatesTags = () => {
    dispatch(
      apiSlice.util.invalidateTags(["user", "product", "vtu", "offers"])
    );
  };

  useEffect(() => {
    invalidatesTags();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        gap: 20,
        paddingBottom: 50
      }}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 20 }}>
        <Image
          source={require("../../assets/illustrations/success-trans.png")}
          style={{ width: 150, height: 150 }}
        />
        <Text
          style={{
            fontSize: 18,
            color: Colors.black,
            fontFamily: "Bold",
          }}
        >
          Your Payment Has Been Completed!
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: Colors.black,
            fontFamily: "Medium",
            textAlign: "center",
          }}
        >
          Your transaction is successful and will be delivered soon
        </Text>
      </View>

      <View
        style={{
          gap: 10,
          width: "100%",
        }}
      >
        {/* <AppButton btnText={"Pay Again"} onPress={() => setShowModal(true)} /> */}
        <AppButton
          btnText={"Go Home"}
          onPress={() => {
            invalidatesTags();
            navigation.navigate("HomeTabs");
          }}
        //   btnStyles={{
        //     backgroundColor: "#F3F4F6",
        //   }}
        //   btnTextStyles={{
        //     color: "#111827",
        //   }}
        />
      </View>

      {/* <PaymentModal
            visible={showModal}
            setVisible={setShowModal}
            url={url}
            onBackPress={() => {
                toast.show("Your transaction is being processed")
            }}
        /> */}
    </SafeAreaView>
  );
};

export default PaymentProcessing;
