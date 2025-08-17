import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import AppHeader from "../../components/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppDefaultInput } from "../../components/AppInput";
import { useRecoilState } from "recoil";
import { AccessToken, UserData } from "../../recoil/UserData";
import DefaultDropdown from "../../components/DefaultDropdown";
import AppButton from "../../components/AppButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import { apiSlice, PRODURL } from "../../services/apiSlice";
import { useToast } from "react-native-toast-notifications";
import { useUpdateProfileMutation } from "../../services/routes/authRoute";
import AppLoader from "../../components/AppLoader";
import * as FileSystem from "expo-file-system";
import { useDispatch } from "react-redux";

const EditProfile = ({ route }) => {
  const navigation = useNavigation();
  const [token, __] = useRecoilState(AccessToken);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [userData, _] = useRecoilState(UserData);
  const [updateUser, { isLoading }] = useUpdateProfileMutation();
  const dispatch = useDispatch();
  const [newFirstName, setNewFirstName] = useState(userData?.firstName);
  const [newLastName, setNewLastName] = useState(userData?.lastName);
  const [newMiddleName, setNewMiddleName] = useState(userData?.middleName);
  const [newGender, setNewGender] = useState(userData?.gender);
  const [newPhone, setNewPhone] = useState(userData?.phoneNumber);
  // const [newDob, setNewDob] = useState(userData?.dob);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date"); // Mode can be 'date' or 'time'
  const [show, setShow] = useState(false);

  // Modal
  const [showGenderModal, setShowGenderModal] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    console.log(currentDate);
    setShow(Platform.OS === "ios"); // For iOS, keep the picker open after selection
    setShow(Platform.OS === "android" && false);
    setDate(currentDate); // Update the selected date/time
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
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

  const handleUpdateProfile = async () => {
    try {
      const uploadUrl = `${PRODURL}/auth/update-profile`; // Replace with your server URL
      if (selectedImage) {
        setLoading(true);
        const response = await FileSystem.uploadAsync(
          uploadUrl,
          selectedImage.uri,
          {
            httpMethod: "PATCH",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: "thumbNail", // The name of the form field your server expects
            parameters: {
              firstName: newFirstName?.toString(),
              lastName: newLastName?.toString(),
              middleName: newMiddleName?.toString(),
              phoneNumber: newPhone?.toString(),
              gender: newGender?.toString(),
              dob: date?.toDateString(),
            },
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response);

        if (response.status == 200 || response.status == 201) {
          setLoading(false);
          console.log("File uploaded successfully:", response.body);
          const body = JSON.parse(response.body);
          toast.show(body?.message || "Successful", { type: "success" });
          dispatch(apiSlice.util.invalidateTags(["user"]));
          navigation.pop();
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
        const body = {
          firstName: newFirstName,
          lastName: newLastName,
          middleName: newMiddleName,
          gender: newGender,
          dob: date.toDateString(),
          phoneNumber: newPhone,
          uploadInfo: {
            fileSize: userData?.profilePicture?.metadata?.size,
            url: userData?.profilePicture?.downloadUrl,
          },
        };
        try {
          const updateRes = await updateUser({
            token,
            body,
          }).unwrap();
          console.log(updateRes);
          if (updateRes.success || updateRes?.data?.success) {
            toast.show(
              updateRes.message ||
                updateRes?.data?.message ||
                "Offer Updated Successfully",
              {
                type: "success",
              }
            );
            navigation.pop();
          } else {
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
    <SafeAreaView style={styles.container}>
      <AppHeader navigation={navigation} />
      {(isLoading || loading) && <AppLoader />}
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView>
          <View style={{ padding: 16, gap: 16 }}>
            <TouchableOpacity
              onPress={pickImage}
              style={{
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
                overflow: "hidden",
              }}
            >
              <Image
                source={
                  selectedImage || userData?.profilePicture
                    ? {
                        uri:
                          selectedImage?.uri ||
                          userData?.profilePicture?.downloadUrl,
                      }
                    : require("../../assets/images/person.png")
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  alignSelf: "center",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  zIndex: 1,
                  width: 100,
                  height: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
              >
                <AntDesign name="camerao" size={24} color={Colors.white} />
              </View>
            </TouchableOpacity>
            <AppDefaultInput
              label={"Edit First Name"}
              placeholder={"First name"}
              value={newFirstName}
              onChangeText={setNewFirstName}
            />
            <AppDefaultInput
              label={"Edit Last Name"}
              placeholder={"Last name"}
              value={newLastName}
              onChangeText={setNewLastName}
            />
            <AppDefaultInput
              label={"Edit Middle Name"}
              placeholder={"Middle name"}
              value={newMiddleName}
              onChangeText={setNewMiddleName}
            />
            <AppDefaultInput
              label={"Edit Phone Number"}
              placeholder={"Phone Number"}
              value={newPhone}
              onChangeText={setNewPhone}
              keyboardType="phone-pad"
              maxLength={11}
            />
            <DefaultDropdown
              label={"Edit Gender"}
              data={["MALE", "FEMALE", "OTHERS"]}
              value={newGender}
              setValue={setNewGender}
              showModal={showGenderModal}
              setShowModal={setShowGenderModal}
              placeholder={"Select Gender"}
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
                Select Date of Birth
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
              btnText={"Update Profile"}
              onPress={handleUpdateProfile}
            />
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
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
