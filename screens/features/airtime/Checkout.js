import { useState } from "react";
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
import VTUVpayModal from "../../../components/VTUVpayModal";

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

const Checkout = ({ route, navigation }) => {
  const [url, setUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { data } = route?.params;
  const [checkout, { isLoading, isError }] = useCheckoutMutation();
  const [confirm, { isLoading: isConfirmLoading }] =
    useConfirmPaymentMutation();
  const [ref, setRef] = useState("");
  const [token, _] = useRecoilState(AccessToken);
  const toast = useToast();

  const handleCheckout = async () => {
    try {
      const res = await checkout({ token, id: data?.orderId }).unwrap();
      if (res?.success) {
        setUrl(res?.paymentInfo?.redirect_url);
        setRef(res?.paymentInfo?.txRef);
        toast.show(res?.message);
        setShowModal(true);
      } else {
        toast.show(res?.message || res?.data?.message, {
          type: "warning",
        });
      }
    } catch (error) {
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
          <Text
            style={{
              fontFamily: "Medium",
              fontSize: 20,
              color: Colors.primary,
              paddingBottom: 20,
              borderBottomWidth: 0.3,
              borderBottomColor: Colors.grey,
              marginBottom: 20,
            }}
          >
            CHECK OUT
          </Text>

          <View
            style={{
              gap: 10,
            }}
          >
            <ListItem text={"Order ID:"} value={data?.sequenceId} />
            <ListItem text={"Date:"} value={data?.date} />
            <ListItem text={"Total amount(#) :"} value={data?.total} />
            <ListItem
              text={"Total amount (Points) :"}
              value={data?.paymentMethod == "card" ? "0" : 10}
            />
            <ListItem text={"Payment method:"} value={data?.paymentMethod} />
          </View>

          <Text
            style={{
              fontFamily: "Medium",
              fontSize: 16,
              marginVertical: 50,
            }}
          >
            Thank you for your order, please click the button below to top up
            airtime and get value instantly.
          </Text>

          <AppButton btnText={"Place Order"} onPress={handleCheckout} />
        </ScrollView>
      </View>

      {/* <PaymentModal
                visible={showModal}
                setVisible={setShowModal}
                url={url}
                onBackPress={() => {
                    navigation.replace("PaymentProcessing", {
                        url
                    })
                }}
            /> */}

      <VTUVpayModal
        visible={showModal}
        setVisible={setShowModal}
        url={url}
        your_ref={ref}
        onSuccess={() => {
          navigation.replace("PaymentProcessing");
        }}
      />
    </SafeAreaView>
  );
};

export default Checkout;
