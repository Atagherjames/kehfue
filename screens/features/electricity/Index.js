import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppLogo from "../../../assets/svg/applogo.svg";
import { AppDefaultInput } from "../../../components/AppInput";
import AppButton from "../../../components/AppButton";
import {
  useGetBillerPackageMutation,
  useGetDiscoQuery,
  usePurchaseBillMutation,
  usePurchaseElectricityMutation,
  useVerfyMeterNoMutation,
} from "../../../services/routes/vtuRoutes";
import { useRecoilState } from "recoil";
import { AccessToken } from "../../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../../../components/AppLoader";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PaymentMethodModal from "../../../components/PaymentMethodModal";
import ElectricityDropdownModal from "../../../components/ElectricityDropdownModal";
import AppHeader from "../../../components/AppHeader";

const Electricity = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [verified, setVerified] = useState(false);
  const [selectedDisco, setSelectedDisco] = useState(null);
  const [meterNo, setMeterNo] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifyMeterNo, { isLoading }] = useVerfyMeterNoMutation();
  const [token, _] = useRecoilState(AccessToken);
  const toast = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeType, setActiveType] = useState(0);
  const [points, setPoints] = useState(0);
  const [amount, setAmount] = useState("");
  const [purchaseElectricity, { isLoading: isPurchaseLoading }] =
    usePurchaseBillMutation();
  const [getBiller, { isLoading: isBillerLoading }] =
    useGetBillerPackageMutation();
  const { data, isLoadingAccessToken, isGetDiscoLoading } =
    useGetDiscoQuery(token);
  const [meterTypes, setMeterTypes] = useState([]);
  const [activeMeterType, setActiveMeterType] = useState("");

  const allDisco = data?.data || [];

  const handleGetBillers = async () => {
    const body = {
      biller: "electricity", // electricity | cableTv
      itemId: selectedDisco?.id,
    };
    try {
      const response = await getBiller({ token, body }).unwrap();
      //   console.log(response);
      if (response?.data?.success || response?.success) {
        setMeterTypes(response.data);
        toast.show(response?.message || response?.data?.message, {
          type: "success",
        });
      } else {
        toast.show(response?.message || response?.data?.message, {
          type: "warning",
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (selectedDisco?.id) {
      handleGetBillers();
    }
  }, [selectedDisco]);

  const handleVerifyMeterNo = async () => {
    const body = {
      biller: "electricity",
      billerId: selectedDisco?.id,
      amount: selectedDisco,
      meter_type: activeMeterType,
    };
    try {
      const res = await verifyMeterNo({ token, body }).unwrap();
      if (res.success) {
        setVerified(true);
        setUsername(res?.data?.name);
        toast.show(res?.message || res?.data?.message, {
          type: "success",
        });
      } else {
        toast.show(res?.message || res?.data?.message, {
          type: "warning",
        });
      }
    } catch (error) {
      console.log(error);
      if (error.status == 422) {
        toast.show(error?.name || error?.data?.name, {
          type: "warning",
        });
        return;
      }
      toast.show(error?.message || error?.data?.message, {
        type: "warning",
      });
    }
  };

  useEffect(() => {
    if (meterNo.length == 13) {
      //   handleVerifyMeterNo();
    }
  }, [meterNo]);

  const handleElectricityPayment = async () => {
    const body = {
      biller: "electricity",
      billerId: selectedDisco?.id,
      meterNumber: meterNo,
      meterType: activeMeterType.itemName,
      amount,
      phoneNumber,
      paymentMethod:
        activeType == 0
          ? "points"
          : activeType == 1
          ? "card_and_points"
          : "card",
    };
    const pointBody = {
      biller: "electricity",
      billerId: selectedDisco?.id,
      meterNumber: meterNo,
      meterType: activeMeterType.itemName,
      amount,
      phoneNumber,
      paymentMethod:
        activeType == 0
          ? "points"
          : activeType == 1
          ? "card_and_points"
          : "card",
      point: points,
    };

    try {
      const res = await purchaseElectricity({
        token,
        body: activeType != 1 ? body : pointBody,
      }).unwrap();
      console.log(res);
      if (res?.success) {
        navigation.navigate("ElectricityReviewOrder", {
          data: res?.order,
          disco: selectedDisco,
          name: username,
          meterNo: meterNo,
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
      {(isLoading || isPurchaseLoading || isGetDiscoLoading) && <AppLoader />}
      {/* <View
        style={{
          padding: 20,
        }}
      >
        <AppLogo width={140} />
      </View> */}
      <AppHeader navigation={navigation} />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
        }}
      >
        <ScrollView>
          <View
            style={{
              marginVertical: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Bold",
              }}
            >
              Purchase Electricity
            </Text>
          </View>
          <View
            style={{
              gap: 20,
              paddingVertical: 10,
            }}
          >
            <ElectricityDropdownModal
              label={"Select Disco"}
              data={allDisco || []}
              showModal={showModal}
              setShowModal={setShowModal}
              value={selectedDisco}
              setValue={setSelectedDisco}
              placeholder={"Select Disco"}
            />
            {meterTypes.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 16,
                }}
              >
                {meterTypes.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setActiveMeterType(item)}
                    style={{
                      backgroundColor:
                        activeMeterType == item ? Colors.primary : Colors.white,
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      borderWidth: 0.5,
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color:
                          activeMeterType == item ? Colors.white : Colors.black,
                        fontFamily: "Medium",
                      }}
                    >
                      {item.itemName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {isBillerLoading && <ActivityIndicator />}

            <View
              style={{
                gap: 10,
              }}
            >
              <AppDefaultInput
                label={"Meter Number"}
                value={meterNo}
                onChangeText={(val) => {
                  setMeterNo(val);
                  setVerified(false);
                }}
                placeholder={
                  selectedDisco
                    ? "Enter Meter Number"
                    : "Please Select a disco to edit"
                }
                maxLength={13}
                keyboardType={"numeric"}
                editable={selectedDisco ? true : false}
              />
              {verified && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <MaterialIcons
                    name="verified-user"
                    size={20}
                    color={Colors.primary}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Medium",
                      color: Colors.primary,
                    }}
                  >
                    {username}
                  </Text>
                </View>
              )}
            </View>
            <AppDefaultInput
              label={"Phone Number"}
              placeholder={"Phone Number"}
              onChangeText={setPhoneNumber}
              keyboardType={"phone-pad"}
              maxLength={11}
            />
            <AppDefaultInput
              label={"Amount"}
              placeholder={"Enter Amount"}
              onChangeText={setAmount}
              keyboardType={"numeric"}
            />
            {(!selectedDisco || !phoneNumber || !amount || !selectedDisco?.id) && (
              <Text
                style={{
                  color: "#FF4444",
                  fontFamily: "Medium",
                }}
              >
                All fields are required to continue
              </Text>
            )}
            <AppButton
              btnText={"CONTINUE"}
              disabled={!selectedDisco?.id || !phoneNumber || !amount}
              onPress={() => setShowPaymentModal(true)}
            />
          </View>
        </ScrollView>
      </View>

      <PaymentMethodModal
        visible={showPaymentModal}
        setVisible={setShowPaymentModal}
        amount={amount}
        activeType={activeType}
        setActiveType={setActiveType}
        points={points}
        setPoints={setPoints}
        onContinue={() => {
          setShowPaymentModal(false);
          /* navigation.navigate("DataReviewOrder", {
                    plan,
                    phone,
                    usePoints
                }) */
          handleElectricityPayment();
        }}
      />
    </SafeAreaView>
  );
};

export default Electricity;
