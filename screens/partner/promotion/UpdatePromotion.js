import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/partners/Header";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { Colors } from "../../../constants/colors";
import * as ImagePicker from "expo-image-picker";
import { AppDefaultInput } from "../../../components/AppInput";
import DefaultDropdown from "../../../components/DefaultDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppButton from "../../../components/AppButton";
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from "react-redux";
import { apiSlice } from "../../../services/apiSlice";
import AppLoader from "../../../components/AppLoader";
import * as FileSystem from "expo-file-system";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../../recoil/UserData";
import { useUpdateCampaignMutation } from "../../../services/routes/offersRoute";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomDrawer from "../../../components/CustomDrawer";

const UpdatePromotion = ({ route }) => {
  const navigation = useNavigation();
  const { data } = route?.params;
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const [token, _] = useRecoilState(PartnerAccessToken);
  const [updateCampaign, { isLoading }] = useUpdateCampaignMutation();
  //   States
  const [selectedImage, setSelectedImage] = useState(null);
  const [newTitle, setnewTitle] = useState(data?.title);
  const [newDetails, setNewDetails] = useState(data?.details);
  const [newtype, setNewType] = useState(data?.type);
  const [newTarget, setNewTarget] = useState(data?.targetCustomers.toString());
  const [newChannel, setNewChannel] = useState(data?.channels[0]);
  const [newAgerange, setNewAgeRange] = useState(
    `${data?.ageRange[0]} - ${data?.ageRange[1]}`
  );
  const [newCustomers, setNewCustomers] = useState(data?.customer);
  const [newCheck, setNewCheck] = useState(data?.check);
  const [newTimeRange, setNewTimeRange] = useState(data?.timeRange);
  const [newConditions, setNewConditions] = useState(data?.conditions[0]);
  const [newDiscount, setNewDiscount] = useState(data?.discount);

  //   Modals
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showCustomersModal, setShowCustomersModal] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showTimeRangeModal, setShowTimeRangeModal] = useState(false);
  // Date picker
  const [date, setDate] = useState(new Date(data?.duration[1]));
  const [mode, setMode] = useState("date"); // Mode can be 'date' or 'time'
  const [show, setShow] = useState(false);
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // console.log(currentDate)
    setShow(Platform.OS === "ios"); // For iOS, keep the picker open after selection
    setShow(Platform.OS === "android" && false);
    setDate(currentDate); // Update the selected date/time
    setSelectedRunLength(
      `${currentDate.getFullYear().toString()}-${(
        currentDate.getMonth() + 1
      ).toString()}-${currentDate.getDate()}`
    );
    // console.log(selectedRunLength)
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const uploadUrl = `https://khefue-backend.azurewebsites.net/khefue/api/v1/promotion/update/${data.id}`; // Replace with your server URL
      if (selectedImage) {
        setLoading(true);
        const response = await FileSystem.uploadAsync(
          uploadUrl,
          selectedImage.uri,
          {
            httpMethod: "PUT",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: "thumbNail", // The name of the form field your server expects
            parameters: {
              title: newTitle.toString(),
              details: newDetails.toString(),
              targetCustomers: newTarget.toString(),
              ageRange: JSON.stringify(newAgerange.split(" - ").map(Number)),
              channels: JSON.stringify([newChannel]),
              customer: newCustomers.toString(),
              check: newCheck.toString(),
              timeRange: newTimeRange.toString(),
              duration: JSON.stringify([new Date(), date]),
              type: newtype.toString(),
              discount: newDiscount.toString(),
              conditions: JSON.stringify([newConditions]),
            },
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);

        if (response.status == 200 || response.status == 201) {
          setLoading(false);
          console.log("File uploaded successfully:", response.body);
          dispatch(apiSlice.util.invalidateTags(["campaign"]));
          navigation.navigate("Campaign");
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
      } else {
        setLoading(true);
        const body = {
          title: newTitle.toString(),
          details: newDetails.toString(),
          targetCustomers: newTarget.toString(),
          ageRange: JSON.stringify(newAgerange.split(" - ").map(Number)),
          channels: JSON.stringify([newChannel]),
          customer: newCustomers.toString(),
          check: newCheck.toString(),
          timeRange: newTimeRange.toString(),
          duration: JSON.stringify([new Date(), date]),
          type: newtype.toString(),
          discount: newDiscount.toString(),
          conditions: JSON.stringify([newConditions]),
          uploadInfo: {
            fileSize: data?.thumbNail?.metadata?.size,
            url: data?.thumbNail?.downloadUrl,
          },
        };
        try {
          const updateRes = await updateCampaign({
            token,
            id: data.id,
            body,
          }).unwrap();
          console.log(updateRes);
          if (updateRes.success || updateRes?.data?.success) {
            setLoading(false);
            toast.show(
              updateRes.message ||
                updateRes?.data?.message ||
                "Offer Updated Successfully",
              {
                type: "success",
              }
            );
            navigation.navigate("Campaign");
          } else {
            setLoading(false);
            toast.show(
              updateRes.message ||
                updateRes?.error?.data?.message ||
                "Something went wrong",
              {
                type: "danger",
              }
            );
          }
        } catch (error) {
          setLoading(false);
          console.log(error);
          toast.show(
            error?.body?.message ||
              error?.data?.message ||
              error?.message ||
              "Something went wrong",
            {
              type: "warning",
            }
          );
        }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {loading && <AppLoader />}
      {/* <Header navigation={navigation} /> */}
      <CustomDrawer />
      <View style={{ flex: 1 }}>
        <ScrollView showVerticalScrollIndicator={false}>
          <View style={{ padding: 16, gap: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 5,
                }}
                onPress={() => navigation.pop()}
              >
                <AntDesign name="arrowleft" size={24} color={Colors.primary} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  flex: 1,
                  textAlign: "center",
                  fontFamily: "SemiBold",
                  color: Colors.labelColor,
                }}
              >
                Edit Promotion
              </Text>
            </View>
            <TouchableOpacity
              onPress={pickImage}
              style={{
                padding: 20,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                borderWidth: 1,
                height: 200,
                gap: 5,
              }}
            >
              <Image
                source={{
                  uri: selectedImage
                    ? selectedImage?.uri
                    : data?.thumbNail?.downloadUrl,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
              <Text>Click to change image</Text>
            </TouchableOpacity>

            <AppDefaultInput
              label={"Edit title"}
              value={newTitle}
              onChangeText={setnewTitle}
              placeholder={"Change title"}
            />
            <AppDefaultInput
              label={"Edit details"}
              value={newDetails}
              onChangeText={setNewDetails}
              placeholder={"Change title"}
              multiline
              inputStyles={{ maxHeight: 150 }}
            />
            <DefaultDropdown
              data={["Reward", "Offer"]}
              value={newtype}
              setValue={setNewType}
              label={"Change Promotion type"}
              showModal={showTypeModal}
              setShowModal={setShowTypeModal}
            />
            <AppDefaultInput
              label={"Edit target customer"}
              value={newTarget}
              onChangeText={setNewTarget}
              placeholder={"Edit target"}
              keyboardType="numeric"
            />
            <DefaultDropdown
              data={["7 - 10", "10 - 15", "20 - 30", "50 - 70"]}
              value={newAgerange}
              setValue={setNewAgeRange}
              label={"Change Age Range"}
              showModal={showAgeModal}
              setShowModal={setShowAgeModal}
            />
            <DefaultDropdown
              data={["Email", "SMS"]}
              value={newChannel}
              setValue={setNewChannel}
              label={"Change Channel"}
              showModal={showChannelModal}
              setShowModal={setShowChannelModal}
            />
            <DefaultDropdown
              data={["All customers"]}
              value={newCustomers}
              setValue={setNewCustomers}
              label={"Change Customers"}
              showModal={showCustomersModal}
              setShowModal={setShowCustomersModal}
            />
            <DefaultDropdown
              data={["daily"]}
              value={newCheck}
              setValue={setNewCheck}
              label={"Change Check"}
              showModal={showCheckModal}
              setShowModal={setShowCheckModal}
            />
            <DefaultDropdown
              data={["Today"]}
              value={newTimeRange}
              setValue={setNewTimeRange}
              label={"Change Time Range"}
              showModal={showTimeRangeModal}
              setShowModal={setShowTimeRangeModal}
            />

            <View
              style={{
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Medium",
                  color: Colors.labelColor,
                }}
              >
                Select Run Length
              </Text>

              <TouchableOpacity
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  borderWidth: 0.3,
                  borderRadius: 5,
                  borderColor: Colors.borderColor,
                }}
                onPress={() => setShow(true)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Medium",
                    color: Colors.black,
                  }}
                >
                  {new Date(data?.duration[0]).toDateString()} -{" "}
                  {date.toDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            <AppDefaultInput
              label={"Edit condition"}
              value={newConditions}
              onChangeText={setNewConditions}
              placeholder={"Edit condition"}
            />
            <AppDefaultInput
              label={"Edit discount"}
              value={newDiscount}
              onChangeText={setNewDiscount}
              placeholder={"10%"}
              keyboardType="numeric"
            />

            <AppButton btnText={"Update Promotion"} onPress={handleSubmit} />
          </View>
        </ScrollView>
      </View>

      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
};

export default UpdatePromotion;
