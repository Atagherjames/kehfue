import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { ScrollView, Text, View } from "react-native";
import AppButton from "../../../components/AppButton";
import {
  useCheckoutMutation,
  useConfirmPaymentMutation,
} from "../../../services/routes/vtuRoutes";
import { useRecoilState } from "recoil";
import { AccessToken } from "../../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../../../components/AppLoader";
import PaymentModal from "../../../components/PaymentModal";
import { useMakePaymentMutation } from "../../../services/routes/productRoutes";
import BackButton from "../../../components/BackButton";

const ListItem = ({ text, value }) => (
  <Text
    style={{
      fontSize: 16,
      fontFamily: "Medium",
      color: Colors.black,
    }}
  >
    {text + "  "}
    <Text
      style={{
        color: Colors.primary,
      }}
    >
      {value}
    </Text>
  </Text>
);

const MerchandiseCheckout = ({ route, navigation }) => {
  const [url, setUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { data } = route?.params;
  const [makePayment, { isLoading, isError }] = useMakePaymentMutation();
  const [confirm, { isLoading: isConfirmLoading }] =
    useConfirmPaymentMutation();

  const [token, _] = useRecoilState(AccessToken);
  const toast = useToast();
  // console.log(token)

  const handleCheckout = async () => {
    const body = {
      transactionId: data?.transaction?.id,
    };
    try {
      const res = await makePayment({ token, body }).unwrap();
      console.log(res);
      if (res?.success) {
        setUrl(res?.paymentInfo?.redirect_url);
        toast.show(res?.message);
        setShowModal(true);
      } else {
        toast.show(res?.message || res?.data?.message, {
          type: "warning",
        });
      }
    } catch (error) {
      console.log(error);
      if (error.status == 406) {
        toast.show(error?.message || error?.data?.message, {
          type: "success",
        });
        navigation.navigate("HomeTabs");
      } else {
        toast.show(error?.message || error?.data?.message, {
          type: "warning",
        });
      }
    }
  };

  const handleConfirm = async () => {
    const body = {
      transactionId: data?.orderId,
    };
    try {
      const res = await confirm({ token, body }).unwrap();
      console.log(res);
      if (res?.success) {
        toast.show(res?.message, {
          type: "success",
        });
        navigation.navigate("HomeTabs");
      } else {
        toast.show(res?.message || res?.data?.message, {
          type: "warning",
        });
      }
    } catch (error) {
      console.log(error);
      toast.show(error?.message || error?.data?.message, {
        type: "warning",
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: 20,
      }}
    >
      {(isLoading || isConfirmLoading) && <AppLoader />}
      <View
        style={{
          height: 3,
          backgroundColor: Colors.primary,
          marginVertical: 20,
        }}
      />

      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
              paddingBottom: 20,
              borderBottomWidth: 0.3,
              borderBottomColor: Colors.grey,
            }}
          >
            <BackButton />

            <Text
              style={{
                fontFamily: "Medium",
                fontSize: 20,
                color: Colors.primary,
              }}
            >
              CHECK OUT
            </Text>
          </View>

          <View
            style={{
              gap: 10,
            }}
          >
            <ListItem text={"Order ID:"} value={data?.transaction?.id} />
            <ListItem text={"Date:"} value={data?.timestamp} />
            <ListItem
              text={"Total amount(#) :"}
              value={
                data?.transaction?.txnDetails?.amount ||
                data?.transaction?.estimatedCost
              }
            />
            <ListItem
              text={"Points Used :"}
              value={`${data?.transaction?.txnDetails?.point} (${
                data.transaction.currency + data?.transaction?.txnDetails?.value
              })`}
            />
            <ListItem
              text={"Points To Earn :"}
              value={`${data?.transaction?.pointEarned} points`}
            />
            <ListItem
              text={"Payment method:"}
              value={data?.transaction?.paymentMethod}
            />
          </View>

          <Text
            style={{
              fontFamily: "Medium",
              fontSize: 16,
              marginVertical: 50,
            }}
          >
            Thank you for your order, please click the button below to process
            your order with Khefue
          </Text>

          <AppButton btnText={"Place Order"} onPress={handleCheckout} />
        </ScrollView>
      </View>

      <PaymentModal
        visible={showModal}
        setVisible={setShowModal}
        url={url}
        onBackPress={() => {
          navigation.replace("Cart", {
            url,
          });
        }}
      />
    </SafeAreaView>
  );
};

export default MerchandiseCheckout;
