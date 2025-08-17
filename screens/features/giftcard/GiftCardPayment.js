import React, { act, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../components/AppHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppDefaultInput } from "../../../components/AppInput";
import { useRecoilState } from "recoil";
import { AccessToken, UserData } from "../../../recoil/UserData";
import { Colors } from "../../../constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import AppButton from "../../../components/AppButton";
import { apiSlice, PRODURL } from "../../../services/apiSlice";
import * as FileSystem from "expo-file-system";
import AppLoader from "../../../components/AppLoader";
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from "react-redux";
import {
  useProcessGiftCardsMutation,
  useSendGiftCardsMailMutation,
} from "../../../services/routes/giftcardRoute";
import VpayModal from "../../../components/VpayModal";
import generateTransactionReference from "../../../services/generateRef";

const GiftCardPayment = ({ route }) => {
  const { data, amount, userDetails, quantity, imageUri, eventName } =
    route.params;
  const netAmount = amount * quantity;
  const navigation = useNavigation();
  const [userData, _] = useRecoilState(UserData);
  const [activeType, setActiveType] = useState(0);
  const [points, setPoints] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, __] = useRecoilState(AccessToken);
  const [processCard, { isLoading }] = useProcessGiftCardsMutation();
  const [sendMail, { isLoading: isSendMailLoading }] =
    useSendGiftCardsMailMutation();
  const toast = useToast();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const newRef = generateTransactionReference();
  const url = `https://dropinbutton-sandbox.vpay.africa/service/pay?amount=${
    activeType == 1 ? netAmount - points * 10 : netAmount
  }&email=${
    userDetails.email
  }&customer_logo=https://yourdomain.com/yourbusinesslogo&domain=sandbox&key=15cc69fa-7e6d-4296-8806-3e1908a70d4c&transactionref=${newRef}&customer_service_channel=support@vpay.africa,+2348191000800&txn_charge_type=percentage&txn_charge=0&currency=NGN`;
  const types = [
    "Points Only",
    "Points and Debit card transaction",
    "Debit card only",
  ];

  const handleSendMail = async (res) => {
    const body = {
      amount: "₦" + amount,
      Code: res?.result?.Data?.Voucher[0]?.Code || "",
      Pin: res?.result?.Data?.Voucher[0]?.Pin || "",
      ExpiryDate:
        new Date(res?.result?.Data?.Voucher[0]?.ExpiryDate).toDateString() ||
        "",
      email: userDetails?.email,
      fullName: userDetails?.name,
      message: eventName,
      storeName: data?.Name,
      imgUrl: res?.imgUrl?.downloadUrl,
    };

    try {
      const response = await sendMail({ token, body }).unwrap();
      console.log(response);
      if (response?.success) {
        toast.show(response?.message, { type: "success" });
        navigation.replace("PaymentProcessing");
      }
    } catch (error) {
      console.log(error);
      toast.show(
        error?.error?.data?.message ||
          error?.message ||
          error?.data?.message ||
          "Something went wrong",
        {
          type: "warning",
        }
      );
    }
  };

  const handleProcessGiftCard = async () => {
    if (imageUri.includes("https")) {
      const body = {
        merchantId: data?.StoreId.toString(),
        merchantName: data?.Name.toString(),
        merchantPicture: data?.Picture.toString(),
        eventName: eventName.toString(),
        amount: amount.toString(),
        quantity: quantity.toString(),
        imgUrl: imageUri,
      };
      try {
        const response = await processCard({ token, body }).unwrap();
        console.log(response);
        if (response.success) {
          // toast.show(response.message, { type: "success" });
          handleSendMail(response);
        }
      } catch (error) {
        console.log(error);
        toast.show(
          error.message || error.data.message || "Something went wrong",
          { type: "warning" }
        );
      }
    } else {
      try {
        setLoading(true);
        const uploadUrl = `${PRODURL}/gift-card/purchase`; // Replace with your server URL
        const response = await FileSystem.uploadAsync(uploadUrl, imageUri, {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "imgUrl", // The name of the form field your server expects
          parameters: {
            merchantId: data?.StoreId.toString(),
            merchantName: data?.Name.toString(),
            merchantPicture: data?.Picture.toString(),
            eventName: eventName.toString(),
            amount: amount.toString(),
            quantity: quantity.toString(),
          },
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        });

        if (response.status == 200 || response.status == 201) {
          setLoading(false);
          // console.log("File uploaded successfully:", response.body);
          dispatch(apiSlice.util.invalidateTags(["giftcard"]));
          // toast.show(response.message, { type: "success" });
          const res = JSON.parse(response.body);
          handleSendMail(res);
        } else {
          setLoading(false);
          // console.error("Upload failed:", response.body);
          const error = JSON.parse(response.body);
          console.log(error.message);
          toast.show(
            error?.message || error?.data?.message || "Something went wrong2",
            {
              type: "danger",
            }
          );
        }
      } catch (error) {
        console.log(error);
        toast.show(
          error?.error?.data?.message ||
            error?.message ||
            error?.data?.message ||
            "Something went wrong",
          {
            type: "warning",
          }
        );
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {(loading || isLoading) && <AppLoader />}
      <AppHeader navigation={navigation} />

      <KeyboardAwareScrollView>
        <View style={{ paddingHorizontal: 20 }}>
          <Image
            source={require("../../../assets/images/giftcard-header3.png")}
            style={{ width: "100%", height: 100 }}
            resizeMode="contain"
          />

          <AppDefaultInput
            placeholder={`Balance: ${userData.points} KPS`}
            editable={false}
            placeholderTextColor={Colors.black}
            label={"Available points balance"}
          />

          <View style={{ gap: 10, marginTop: 20 }}>
            <Text style={styles.heading}>How would you like to pay?</Text>
            {types.map((item, i) => (
              <TouchableOpacity
                onPress={() => {
                  setActiveType(i);
                }}
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  padding: 15,
                  backgroundColor: "#F8F8F8",
                  borderWidth: activeType == i ? 2 : 0,
                  borderColor: Colors.primary,
                  borderRadius: 10,
                }}
              >
                <FontAwesome
                  name={activeType == i ? "dot-circle-o" : "circle-o"}
                  size={24}
                  color={activeType == i ? Colors.primary : Colors.labelColor}
                />
                <Text
                  style={{
                    fontFamily: "Regular",
                    color: Colors.labelColor,
                    flex: 1,
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ marginTop: 20, gap: 16 }}>
            <Text style={styles.heading}>Review your order</Text>
            <View style={{ gap: 10 }}>
              <View style={styles.detailsItem}>
                <Text style={styles.item}>Subtotal:</Text>
                <Text style={styles.item}>₦{netAmount}</Text>
              </View>
              {activeType == 0 && (
                <View style={styles.detailsItem}>
                  <Text style={styles.item}>Points to use:</Text>
                  <Text style={styles.item}>{netAmount / 10}KPS</Text>
                </View>
              )}
              {activeType == 1 && (
                <View style={styles.detailsItem}>
                  <Text style={styles.item}>Points to use:</Text>
                  <TextInput
                    placeholder="0.00"
                    onChangeText={setPoints}
                    style={{
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      width: 100,
                      fontSize: 14,
                    }}
                    keyboardType="numeric"
                    value={points}
                  />
                </View>
              )}
              <View style={styles.detailsItem}>
                <Text style={styles.item}>Amount to pay:</Text>
                <Text style={styles.item}>
                  ₦
                  {activeType == 0
                    ? "0.00"
                    : activeType == 1
                    ? netAmount - points * 10
                    : netAmount}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 20,
              justifyContent: "space-between",
              marginVertical: 20,
            }}
          >
            <AppButton
              btnText={"Previous"}
              onPress={() => navigation.pop()}
              btnStyles={{
                backgroundColor: "transparent",
                borderWidth: 1,
              }}
              btnTextStyles={{
                color: Colors.primary,
              }}
            />
            <AppButton
              btnText={"Continue"}
              onPress={() => {
                if (activeType == 0) {
                  let points = netAmount / 10;
                  if (points > userData.points) {
                    toast.show("Insufficient point balance", {
                      type: "danger",
                    });
                  } else {
                    handleProcessGiftCard();
                  }
                } else if (activeType == 1) {
                  if (points > userData.points) {
                    toast.show("Insufficient point balance", {
                      type: "danger",
                    });
                  } else {
                    setShowModal(true);
                  }
                } else {
                  setShowModal(true);
                }
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      <VpayModal
        visible={showModal}
        setVisible={setShowModal}
        url={url}
        your_ref={newRef}
        onSuccess={handleProcessGiftCard}
      />
    </SafeAreaView>
  );
};

export default GiftCardPayment;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "Medium",
    color: Colors.black,
    fontSize: 18,
  },
  detailsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    color: Colors.labelColor,
    fontSize: 16,
    fontFamily: "Medium",
  },
});
