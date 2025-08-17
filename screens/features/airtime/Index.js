import React, { act, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRecoilState } from "recoil";
import { AccessToken, UserData } from "../../../recoil/UserData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppDefaultInput } from "../../../components/AppInput";
import { Entypo } from "@expo/vector-icons";
import AppButton from "../../../components/AppButton";
import AppModal from "../../../components/AppModal";
import PaymentMethodModal from "../../../components/PaymentMethodModal";
import { usePurchaseAirtimeMutation } from "../../../services/routes/vtuRoutes";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../../../components/AppLoader";
import AppHeader from "../../../components/AppHeader";
import BackButton from "../../../components/BackButton";
import Header from "../../../components/Header";

const Airtime = ({ navigation }) => {
  const [userData, _] = useRecoilState(UserData);
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [points, setPoints] = useState(0);
  const [purchaseAirtime, { isLoading, isError }] =
    usePurchaseAirtimeMutation();
  const [token, __] = useRecoilState(AccessToken);

  const [activeType, setActiveType] = useState(0);
  const toast = useToast();
  const handleContinue = () => {
    setShowPaymentModal(true);
  };
  const providers = ["MTN", "GLO", "AIRTEL", "9MOBILE"];

  const handleAirtimePayment = async () => {
    const body = {
      network,
      amount: parseFloat(amount),
      phoneNumber: phone,
      paymentMethod:
        activeType == 0
          ? "points"
          : activeType == 1
          ? "card_and_points"
          : "card",
    };
    const pointBody = {
      network,
      amount: parseFloat(amount),
      phoneNumber: phone,
      paymentMethod:
        activeType == 0
          ? "points"
          : activeType == 1
          ? "card_and_points"
          : "card",
      point: points,
    };
    // console.log(body)

    try {
      const res = await purchaseAirtime({
        token,
        body: activeType != 1 ? body : pointBody,
      }).unwrap();
      console.log(res);
      if (res?.success) {
        navigation.navigate("AirtimeReviewOrder", {
          data: res?.order,
        });
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
      }}
    >
      {isLoading && <AppLoader />}
      <AppHeader navigation={navigation} />
      <View
        style={{
          flex: 1,
        }}
      >
        <KeyboardAwareScrollView
          style={{
            paddingHorizontal: 20,
          }}
        >
          {/* <Text
            style={{
              fontFamily: "SemiBold",
              marginTop: 30,
              marginBottom: 20,
              textAlign: "center",
              fontSize: 18,
            }}
          >
            Buy Airtime Online
          </Text> */}
          <Header title="Buy Airtime Online" style={{paddingVertical: 20, paddingRight: 50,}} />

          <View
            style={{
              gap: 20,
            }}
          >
            <TouchableOpacity
              style={{
                borderColor: Colors.inputBorder,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderWidth: 1,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                // backgroundColor: Colors.dropBg,
              }}
              onPress={() => setShowModal(true)}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: network ? Colors.black : Colors.placeholderColor,
                  fontFamily: "Medium",
                }}
              >
                {network || "Select Network"}
              </Text>
              <Entypo
                name="chevron-down"
                size={24}
                color={Colors.placeholderColor}
              />
            </TouchableOpacity>

            <AppDefaultInput
              placeholder={"Phone"}
              onChangeText={setPhone}
              keyboardType={"phone-pad"}
              inputStyles={{ backgroundColor: Colors.inputBg }}
            />
            <AppDefaultInput
              placeholder={"Amount (#)"}
              onChangeText={setAmount}
              keyboardType={"numeric"}
            />
            <AppButton
              btnText={"CONTINUE"}
              onPress={handleContinue}
              disabled={!network || !amount || !phone}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>

      {/* Provider Modal */}
      <AppModal
        style={{}}
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <View
          style={{
            gap: 5,
          }}
        >
          {providers.map((item, i) => (
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                setNetwork(item);
              }}
              key={i}
            >
              <Text
                style={{
                  fontFamily: "Medium",
                  fontSize: 18,
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </AppModal>

      <PaymentMethodModal
        airtime={true}
        visible={showPaymentModal}
        setVisible={setShowPaymentModal}
        amount={amount}
        activeType={activeType}
        setActiveType={setActiveType}
        points={points}
        setPoints={setPoints}
        onContinue={() => {
          setShowPaymentModal(false);
          /* navigation.navigate("AirtimeReviewOrder", {
                    network,
                    amount,
                    phone,
                    usePoints
                }) */
          handleAirtimePayment();
        }}
      />
    </SafeAreaView>
  );
};

export default Airtime;
