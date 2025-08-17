import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import AppHeader from "../../../components/AppHeader";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { AppDefaultInput } from "../../../components/AppInput";
import * as ImagePicker from "expo-image-picker";
import DefaultDropdown from "../../../components/DefaultDropdown";
import AppButton from "../../../components/AppButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerComp from "../../../components/DateTimePicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  useCreateNewOfferMutation,
  useGenerateUploadUrlMutation,
} from "../../../services/routes/offersRoute";
// import mime from "mime";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../../../components/AppLoader";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { apiSlice } from "../../../services/apiSlice";
import { useDispatch } from "react-redux";

const CreateOffers = ({ navigation }) => {
  const dispatch = useDispatch()
  const [token, _] = useRecoilState(PartnerAccessToken);
  const [selectedOfferType, setSelectedOfferType] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showOfferTypeDropdown, setShowOfferTypeDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date"); // Mode can be 'date' or 'time'
  const [show, setShow] = useState(false);
  let bodyFormData = new FormData();
  const [createNewOffer, { isLoading }] = useCreateNewOfferMutation();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [shopLink, setShopLink] = useState("");
  const [category, setCategory] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadImage, { isLoading: isImageLoading }] =
    useGenerateUploadUrlMutation();

  const offerType = ["shoppable", "loadable"];
  const categories = ["Travel", "Groceries", "Dining", "Fitness", "Events", "Pharmacy", "Hotel", "Movies", "Shopping", "Air Tickets"];

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    console.log(currentDate)
    setShow(Platform.OS === "ios"); // For iOS, keep the picker open after selection
    setShow(Platform.OS === "android" && false);
    setDate(currentDate); // Update the selected date/time
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
        console.log(result);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleCreateNewOffer = async () => {
    if (!selectedImage) {
      toast.show("Please select an image to upload", {
        type: "danger",
      })
      return
    }
    try {
      setLoading(true)
      const uploadUrl =
        "https://khefue-backend.azurewebsites.net/khefue/api/v1/offers/partner/create"; // Replace with your server URL
      const response = await FileSystem.uploadAsync(uploadUrl, selectedImage.uri, {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "thumbNail", // The name of the form field your server expects
        parameters: {
          title: title.toString(),
          description: desc.toString(),
          offerType: selectedOfferType.toString(),
          expirationDate: date.toDateString(),
          category: category.toString(),
          shopLink: shopLink.toString()
        },
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
      // console.log(response)

      if (response.status == 200 || response.status == 201) {
        setLoading(false)
        console.log("File uploaded successfully:", response.body);
        dispatch(apiSlice.util.invalidateTags(["offers"]))
        navigation.pop()
      } else {
        setLoading(false)
        // console.error("Upload failed:", response.body);
        const error = JSON.parse(response.body)
        console.log(error.message)
        toast.show(
            error?.message ||
            error?.data?.message ||
            "Something went wrong",
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
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      {(isLoading || loading || isImageLoading) && <AppLoader />}
      <AppHeader navigation={navigation} />

      <View
        style={{
          flex: 1,
        }}
      >
        <KeyboardAwareScrollView>
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
              Create New Offer
            </Text>

            <View
              style={{
                gap: 20,
              }}
            >
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
                  Select Image
                </Text>

                <TouchableOpacity
                  style={{
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    borderWidth: 0.3,
                    borderRadius: 5,
                    borderColor: Colors.borderColor,
                  }}
                  onPress={pickImage}
                >
                  {!selectedImage ? (
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Medium",
                        color: Colors.placeholderColor,
                      }}
                    >
                      Click to select image
                    </Text>
                  ) : (
                    <View>
                      <Image
                        source={{ uri: selectedImage?.uri }}
                        style={{
                          width: "100%",
                          height: 200,
                        }}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: "Medium",
                          color: Colors.placeholderColor,
                        }}
                      >
                        {selectedImage?.fileName}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <AppDefaultInput
                label={"Offer Title"}
                placeholder={"Title"}
                onChangeText={setTitle}
              />
              <AppDefaultInput
                label={"Offer Description"}
                placeholder={"Description"}
                onChangeText={setDesc}
              />
              <DefaultDropdown
                data={offerType}
                label={"Selcet Offer Type"}
                placeholder={"Select Offer Type"}
                showModal={showOfferTypeDropdown}
                setShowModal={setShowOfferTypeDropdown}
                setValue={setSelectedOfferType}
                value={selectedOfferType}
              />
              <AppDefaultInput
                label={"Shop Link"}
                placeholder={"https:/www.khefue.com"}
                onChangeText={setShopLink}
              />
              {/* <AppDefaultInput
                label={"Category"}
                placeholder={"category"}
                onChangeText={setCategory}
              /> */}
              <DefaultDropdown
                data={categories}
                label={"Selcet Category"}
                placeholder={"Select Category"}
                showModal={showCategoryDropdown}
                setShowModal={setShowCategoryDropdown}
                setValue={setCategory}
                value={category}
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
                  Select Expiry Date
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
                      color: Colors.placeholderColor,
                    }}
                  >
                    {date.toDateString()}
                  </Text>
                </TouchableOpacity>
              </View>

              <AppButton
                btnText={"Create Offer"}
                onPress={handleCreateNewOffer}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
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

export default CreateOffers;
