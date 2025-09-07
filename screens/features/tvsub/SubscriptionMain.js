import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { ScrollView, Text, View } from "react-native";
import AppLogo from "../../../assets/svg/applogo.svg";
import TvDropdownModal from "../../../components/TvDropdownModal";
import { AppDefaultInput } from "../../../components/AppInput";
import AppButton from "../../../components/AppButton";
import {
  useGetBillerPackageMutation,
  useGetCableBillerQuery,
  usePurchaseBillMutation,
  usePurchaseCableMutation,
  useVerfyIucMutation,
} from "../../../services/routes/vtuRoutes";
import { useRecoilState } from "recoil";
import { AccessToken } from "../../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../../../components/AppLoader";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PaymentMethodModal from "../../../components/PaymentMethodModal";
import AppHeader from "../../../components/AppHeader";
import DefaultDropdown from "../../../components/DefaultDropdown";

const SubscriptionMain = ({ navigation, route }) => {
  // const {provider, logo, data} = route?.params

  const provider = route?.params?.provider;
  const logo = route?.params?.logo;
  const data = route?.params?.data;
  // console.log(data)
  const [showModal, setShowModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [verified, setVerified] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedBouquet, setSelectedBouquet] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [cableNo, setCableNo] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifyIuc, { isLoading }] = useVerfyIucMutation();
  const [token, _] = useRecoilState(AccessToken);
  const {
    data: getBillerData,
    isLoading: isGettingBiller,
    isError,
    error,
  } = useGetCableBillerQuery(token);
  const toast = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeType, setActiveType] = useState(0);
  const [points, setPoints] = useState(0);
  const [purchaseCable, { isLoading: isPurchaseLoading }] =
    usePurchaseBillMutation();
  const [getBillerPackage, { isLoading: isPackageLoading }] =
    useGetBillerPackageMutation();
  //   console.log(selectedProvider);
  const handleGetPackages = async () => {
    const body = {
      biller: "cableTv", // electricity | cableTv
      itemId: selectedProvider.id,
    };
    try {
      const res = await getBillerPackage({ token, body }).unwrap();
      if (res?.success) {
        setPackages(res.data);
        // console.log(res)
      } else {
        toast.show(res?.message || "Something went wrong", {
          type: "danger",
        });
      }
    } catch (error) {
      toast.show(
        error?.message || error?.data?.message || "Something went wrong",
        {
          type: "danger",
        }
      );
    }
  };

  useEffect(() => {
    if (selectedProvider) {
      setSelectedBouquet(null);
      handleGetPackages();
    }
  }, [selectedProvider]);

  const handleVerifyIuc = async () => {
    const body = {
      iuc: cableNo,
      cable: provider,
    };
    console.log(body);
    try {
      const res = await verifyIuc({ token, body }).unwrap();
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
      toast.show(error?.message || error?.data?.message, {
        type: "warning",
      });
    }
  };

  useEffect(() => {
    if (cableNo.length == 10) {
      //   handleVerifyIuc();
    }
  }, [cableNo]);

  const handleCablePayment = async () => {
    const body = {
      biller: "cableTv",
      billerId: selectedProvider.id,
      smartCardNumber: cableNo,
      bouquetId: selectedBouquet?.itemId,
      phoneNumber,
      paymentMethod:
        activeType == 0
          ? "points"
          : activeType == 1
          ? "card_and_points"
          : "card",
    };
    const pointBody = {
      biller: "cableTv",
      billerId: selectedProvider.id,
      smartCardNumber: cableNo,
      bouquetId: selectedBouquet?.itemId,
      phoneNumber,
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
      const res = await purchaseCable({
        token,
        body: activeType != 1 ? body : pointBody,
      }).unwrap();
      console.log(res);
      if (res?.success) {
        navigation.navigate("CableReviewOrder", {
          data: res?.order,
          plan: selectedBouquet,
          name: username,
          iuc: cableNo,
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
      {(isLoading || isPurchaseLoading || isGettingBiller) && <AppLoader />}
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
              paddingHorizontal: 20,
            }}
          >
            {/* {logo({width: 150})} */}
          </View>
          <View
            style={{
              gap: 20,
              paddingVertical: 10,
            }}
          >
            <DefaultDropdown
              label={"Select Provider"}
              data={getBillerData?.data || []}
              showModal={showProviderModal}
              setShowModal={setShowProviderModal}
              value={selectedProvider?.name}
              setValue={setSelectedProvider}
              placeholder={"Select Provider"}
            />
            <TvDropdownModal
              label={"Select Bouquet"}
              data={packages || []}
              showModal={showModal}
              setShowModal={setShowModal}
              value={selectedBouquet}
              setValue={setSelectedBouquet}
              placeholder={"Select Bouquet"}
            />
            <View
              style={{
                gap: 10,
              }}
            >
              <AppDefaultInput
              label={selectedProvider?.name ? `${selectedProvider.name} Smart Card Number` : 'Smart Card Number'}
                value={cableNo}
                onChangeText={(val) => {
                  setCableNo(val);
                  setVerified(false);
                }}
                placeholder={"Enter Card Number"}
                // maxLength={10}
                keyboardType={"numeric"}
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
              placeholder={selectedBouquet?.amount || "Select Bouquet"}
              onChangeText={setCableNo}
              editable={false}
            />
            <AppButton
              btnText={"CONTINUE"}
              disabled={!selectedBouquet}
              onPress={() => setShowPaymentModal(true)}
            />
          </View>
        </ScrollView>
      </View>

      <PaymentMethodModal
        visible={showPaymentModal}
        setVisible={setShowPaymentModal}
        amount={selectedBouquet?.amount}
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
          handleCablePayment();
        }}
      />
    </SafeAreaView>
  );
};

export default SubscriptionMain;
