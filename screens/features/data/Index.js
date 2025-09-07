import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { ScrollView, Text, TouchableOpacity, View, FlatList } from "react-native";
import { useRecoilState } from "recoil";
import { AccessToken, UserData } from "../../../recoil/UserData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppDefaultInput } from "../../../components/AppInput";
import { Entypo } from "@expo/vector-icons";
import AppButton from "../../../components/AppButton";
import AppModal from "../../../components/AppModal";
import PaymentMethodModal from "../../../components/PaymentMethodModal";
import {
  useGetNewDataPlansMutation,
  usePurchaseDataMutation,
} from "../../../services/routes/vtuRoutes";
import AppLoader from "../../../components/AppLoader";
import { useToast } from "react-native-toast-notifications";
import AppHeader from "../../../components/AppHeader";
import Header from "../../../components/Header";

const Data = ({ navigation }) => {
  const [userData] = useRecoilState(UserData);
  const [token] = useRecoilState(AccessToken);

  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [plan, setPlan] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filteredPlans, setFilteredPans] = useState([]);
  const [points, setPoints] = useState(0);
  const [activeType, setActiveType] = useState(0);

  const [purchaseData, { isLoading: isPurchaseLoading }] =
    usePurchaseDataMutation();
  const [newPurchaseData, { isLoading: isNewPurchaseLoading }] =
    useGetNewDataPlansMutation();

  const toast = useToast();

  const handleContinue = () => setShowPaymentModal(true);

  const handlePurchase = async () => {
    const result = await newPurchaseData({ token, number: phone });
    console.log(result);

    if (result?.data?.success) {
      const plans = result.data.data.data;
      console.log("this is the plan", plans);
      if (Array.isArray(plans)) {
        setFilteredPans(plans);
        const productId = plans[0]?.productId?.toLowerCase();
        if (productId.includes("mtn")) setNetwork("MTN");
        else if (productId.includes("air")) setNetwork("AIRTEL");
        else if (productId.includes("glo")) setNetwork("GLO");
        else if (productId.includes("9mo")) setNetwork("9Mobile");
      } else {
        setFilteredPans([]);
      }
    }
  };

  useEffect(() => {
    if (phone.length === 11) {
      handlePurchase();
    } else if (phone.length < 11) {
      setPlan(null);
      setNetwork("");
      setFilteredPans([]);
    }
  }, [phone]);

  const handleDataPayment = async () => {
    const paymentMethod =
      activeType === 0
        ? "points"
        : activeType === 1
        ? "card_and_points"
        : "card";

    const baseBody = {
      dataPlan: plan?.dataBundle,
      productId: plan?.productId,
      phoneNumber: phone,
      paymentMethod,
    };

    const body = activeType === 1 ? { ...baseBody, point: points } : baseBody;

    try {
      const res = await purchaseData({ token, body }).unwrap();
      console.log(res)
      if (res?.success) {
        navigation.navigate("DataReviewOrder", { data: res?.order });
      } else {
        toast.show(res?.message || res?.data?.message, { type: "warning" });
      }
    } catch (error) {
      toast.show(error?.message || error?.data?.message, { type: "warning" });
    }
  };

  const providers = [
    ...new Set(
      filteredPlans
        .map((item) => {
          const id = item?.productId?.toLowerCase();
          if (id.includes("mtn")) return "MTN";
          if (id.includes("air")) return "AIRTEL";
          if (id.includes("glo")) return "GLO";
          if (id.includes("9mo")) return "9Mobile";
          return null;
        })
        .filter(Boolean)
    ),
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {(isPurchaseLoading || isNewPurchaseLoading) && <AppLoader />}

      <AppHeader navigation={navigation} />

      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView style={{ paddingHorizontal: 20 }}>
          <Header title={"Buy Data Online"} style={{ paddingVertical: 20 }} />

          <View style={{ gap: 20 }}>
            <AppDefaultInput
              placeholder={"Phone"}
              onChangeText={setPhone}
              keyboardType={"phone-pad"}
              value={phone}
              maxLength={11}
            />

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
            </TouchableOpacity>

            {network && (
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
                }}
                onPress={() => setShowPlanModal(true)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.black,
                    fontFamily: "Medium",
                  }}
                  numberOfLines={1}
                >
                  {plan
                    ? `${plan?.dataBundle} - ₦${plan?.amount} - ${plan?.validity}`
                    : "Select Plan"}
                </Text>
                <Entypo
                  name="chevron-down"
                  size={24}
                  color={Colors.placeholderColor}
                />
              </TouchableOpacity>
            )}

            <AppDefaultInput
              placeholder={plan ? plan?.amount?.toString() : "0.00"}
              onChangeText={setAmount}
              keyboardType={"numeric"}
              editable={false}
              placeholderColor={Colors.black}
            />

            <AppButton
              btnText={"CONTINUE"}
              onPress={handleContinue}
              disabled={!plan || !phone}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>

      {/* Provider Modal */}
      <AppModal visible={showModal} onClose={() => setShowModal(false)}>
        <View style={{ gap: 5 }}>
          {providers.map((item, i) => (
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                setNetwork(item);
              }}
              key={i}
            >
              <Text style={{ fontFamily: "Medium", fontSize: 18 }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </AppModal>

      {/* Plan Modal - Now using FlatList for better performance and unique keys */}
      <AppModal
        modalStyles={{ maxHeight: "80%" }}
        visible={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        backdropStyles={{ alignItems: "center" }}
      >
        <FlatList
          data={filteredPlans}
          keyExtractor={(item, index) => `${item?.productId}-${index}`}
          ListHeaderComponent={
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Bold",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Select Plan Type
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setShowPlanModal(false);
                setPlan(item);
              }}
              style={{ paddingVertical: 3 }}
            >
              <Text style={{ fontFamily: "Medium", fontSize: 18 }}>
                {item?.dataBundle} - ₦{item?.amount} - {item?.validity}
              </Text>
            </TouchableOpacity>
          )}
        />
      </AppModal>

      <PaymentMethodModal
        visible={showPaymentModal}
        setVisible={setShowPaymentModal}
        amount={plan?.amount}
        activeType={activeType}
        setActiveType={setActiveType}
        points={points}
        setPoints={setPoints}
        onContinue={() => {
          setShowPaymentModal(false);
          handleDataPayment();
        }}
      />
    </SafeAreaView>
  );
};

export default Data;
