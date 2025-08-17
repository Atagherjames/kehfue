import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import AppHeader from "../../../components/AppHeader";
import Header from "../../../components/partners/Header";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import AppButton from "../../../components/AppButton";
import { AppDefaultInput } from "../../../components/AppInput";
import { useToast } from "react-native-toast-notifications";
import * as FileSystem from "expo-file-system";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../../recoil/UserData";
import AppLoader from "../../../components/AppLoader";
import { apiSlice } from "../../../services/apiSlice";
import { useDispatch } from "react-redux";

const CreatePromotion5 = ({ navigation, route }) => {
  const {
    image,
    title,
    type,
    details,
    target,
    ageRange,
    channel,
    customer,
    check,
    timeRange,
    duration,
  } = route.params;
  const dispatch = useDispatch()
  const [token, _] = useRecoilState(PartnerAccessToken);
  const [condition, setCondition] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  // console.log(ageRange)

  const handleSubmit = async () => {
    if (!condition || !discount) {
      toast.show("All fields are required", {
        type: "warning",
      });
      return;
    }
    try {
      setLoading(true);
      const uploadUrl =
        "https://khefue-backend.azurewebsites.net/khefue/api/v1/promotion/create"; // Replace with your server URL
      const response = await FileSystem.uploadAsync(uploadUrl, image.uri, {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "thumbNail", // The name of the form field your server expects
        parameters: {
          title: title.toString(),
          details: details.toString(),
          targetCustomers: target.toString(),
          ageRange: JSON.stringify(ageRange.split(" - ").map(Number)),
          channels: JSON.stringify([channel]),
          customer: customer.toString(),
          check: check.toString(),
          timeRange: timeRange.toString(),
          duration: JSON.stringify([new Date(), duration]),
          type: type.toString(),
          discount: discount.toString(),
          conditions: JSON.stringify([condition]),
        },
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      if (response.status == 200 || response.status == 201) {
        setLoading(false);
        console.log("File uploaded successfully:", response.body);
        dispatch(apiSlice.util.invalidateTags(["campaign"]))
        navigation.replace("Campaign")
      } else {
        setLoading(false);
        console.log("error uploading " + response);
        const error = JSON.parse(response.body);
        console.log(error.message);
        toast.show(
          error?.message || error?.data?.message || "Something went wrong",
          {
            type: "danger",
          }
        );
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.show(error?.body?.message, {
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
      {loading && <AppLoader />}
      <Header navigation={navigation} />

      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView>
          <View
            style={{
              padding: 20,
              gap: 20,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                color: Colors.labelColor,
                fontFamily: "Bold",
              }}
            >
              Create New Promotion
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign name="left" size={18} color={Colors.labelColor} />
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.black,
                  fontFamily: "Medium",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                Step 5 of 5
              </Text>
              <AntDesign name="right" size={18} color={Colors.labelColor} />
            </View>

            <Text
              style={{
                fontSize: 18,
                color: Colors.black,
                fontFamily: "SemiBold",
              }}
            >
              Rule
            </Text>

            <View
              style={{
                gap: 20,
              }}
            >
              <AppDefaultInput
                label={"Condition"}
                placeholder={"e.g when coupon is valid"}
                onChangeText={setCondition}
              />
              <AppDefaultInput
                label={"Discount(%)"}
                placeholder={"e.g 10%"}
                onChangeText={setDiscount}
                keyboardType="numeric"
              />
              {/* <DefaultDropdown
                data={availableRunLength}
                label={"Run Length"}
                showModal={showRunLengthModal}
                setShowModal={setShowRunLengthModal}
                placeholder={"Select Run Length"}
                value={selectedRunLength}
                setValue={setSelectedRunLength}
              /> */}
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                justifyContent: "space-between",
              }}
            >
              <AppButton
                btnText={"Back"}
                btnStyles={{
                  backgroundColor: Colors.white,
                  borderColor: Colors.primary,
                  borderWidth: 1,
                }}
                btnTextStyles={{
                  color: Colors.primary,
                }}
                onPress={() => navigation.pop()}
              />
              <AppButton btnText={"Submit"} onPress={handleSubmit} />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreatePromotion5;
