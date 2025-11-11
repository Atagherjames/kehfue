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
import AppButton from "../../components/AppButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Entypo } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";
import { useUpdateProfileMutation } from "../../services/routes/authRoute";
import { apiSlice, PRODURL } from "../../services/apiSlice";  
import * as FileSystem from "expo-file-system";
import AppLoader from "../../components/AppLoader";
import BackArrow from "../../components/BackArrow";
 
import { useDispatch } from "react-redux";

const CustomColors = {
  ...Colors,
  background: "#E4E4E7",
  textPrimary: "#333333",
  textSecondary: "#666666",
  labelColor: "#444444",
  placeholderColor: "#999999",
  borderColor: "#DDDDDD",
  white: "#FFFFFF",
  lightGrey: "#F5F5F5",
};

const EditProfile = ({ route }) => {
  const navigation = useNavigation();
  const [token] = useRecoilState(AccessToken);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [userData] = useRecoilState(UserData);
  const [updateUser, { isLoading }] = useUpdateProfileMutation();
  const dispatch = useDispatch();

  const [newFirstName, setNewFirstName] = useState(userData?.firstName || "");
  const [newLastName, setNewLastName] = useState(userData?.lastName || "");
  const [newMiddleName, setNewMiddleName] = useState(userData?.middleName || "");
  const [newGender, setNewGender] = useState(userData?.gender);
  const [newEmail] = useState(userData?.email);
  const [newPhone, setNewPhone] = useState(userData?.phoneNumber);

  const [date, setDate] = useState(new Date(userData?.dob || Date.now()));
  const [show, setShow] = useState(false);

  const getInitials = () => {
    const first = newFirstName ? newFirstName[0] : "";
    const last = newLastName ? newLastName[0] : "";
    return (first + last).toUpperCase() || "U";
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
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
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const uploadUrl = `${PRODURL}/auth/update-profile`; 
      if (selectedImage) {
        setLoading(true);
        const response = await FileSystem.uploadAsync(
          uploadUrl,
          selectedImage.uri,
          {
            httpMethod: "PATCH",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: "thumbNail", 
            parameters: {
              // firstName: newFirstName?.toString(),
              // lastName: newLastName?.toString(),
              // middleName: newMiddleName?.toString(),
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


        if (response.status == 200 || response.status == 201) {
          setLoading(false);
          console.log("File uploaded successfully:", response.body);
          const body = JSON.parse(response.body);
          toast.show(body?.message || "Successful", { type: "success" });
          dispatch(apiSlice.util.invalidateTags(["user"]));
          navigation.pop();
        } else {
          setLoading(false);
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
          // firstName: newFirstName,
          // lastName: newLastName,
          // middleName: newMiddleName,
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
          if (updateRes.success || updateRes?.data?.success) {
            toast.show(
              updateRes.message ||
                updateRes?.data?.message ||
                "Profile Updated Successfully",
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

  const LoyaltyTierSection = () => (
    <View style={styles.loyaltyContainer}>
      <Text style={styles.loyaltyTitle}>Loyalty Tier</Text>
      <Text style={styles.loyaltySubtitle}>Earn more points to level up!</Text>

      <TouchableOpacity onPress={() => console.log("Learn More")}>
        <Text style={styles.loyaltyLink}>Learn more about tiers</Text>
      </TouchableOpacity>

      <View style={styles.tierStatusCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.tierStatusLabel}>Current tier</Text>
          <Text style={styles.tierStatusValue}>BASIC</Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.tierStatusLabel}>Your points</Text>
          <Text style={styles.tierStatusValue}>500</Text>
        </View>

        <View style={{ borderBottomWidth: 0.5, borderColor: CustomColors.borderColor, marginVertical: 8 }} />

        <Text style={[styles.tierStatusLabel, { marginTop: 10 }]}>Tier progress</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: "60%" }]} />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.progressText}>BASIC</Text>
            <Text style={styles.progressText}>900 Pts</Text>
          </View>
        </View>

        <View style={{ borderTopWidth: 0.5, borderColor: CustomColors.borderColor, marginTop: 10 }} />
      </View>

      <View style={styles.benefitsCard}>
        <Text style={styles.benefitsTitle}>Top benefits for Basic tier</Text>
        <Text style={styles.benefitsSubtitle}>You're currently on the basic plan</Text>

        {["Access to loyalty program", "Free monthly rewards", "Early access to sales"].map(
          (benefit, index) => (
            <View key={index} style={styles.benefitItem}>
             <Image
  source={require("../../assets/images/nearby.png")}
  style={{ width: 14, height: 14, marginRight: 8, tintColor: CustomColors.primary }}
  resizeMode="contain"
/>

              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          )
        )}

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => console.log("View All Tiers")}
        >
          <Text style={styles.viewAllButtonText}>View All Tiers & Benefits</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader navigation={navigation} />
          <BackArrow onPress={() => navigation.goBack()} />
      {(isLoading || loading) && <AppLoader />}

      <KeyboardAwareScrollView>
        <View style={styles.scrollContent}>
          <Text style={styles.sectionHeader}>Personal Info</Text>
          <Text style={styles.sectionSubHeader}>Update your personal details</Text>

          {/* Profile Photo Upload */}
          <View style={styles.imageUploadSection}>
            <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
              {selectedImage || userData?.profilePicture?.downloadUrl ? (
                <Image
                  source={{
                    uri: selectedImage?.uri || userData?.profilePicture?.downloadUrl,
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.initialsPlaceholder}>
                  <Text style={styles.initialsText}>{getInitials()}</Text>
                </View>
              )}
              <View style={styles.cameraOverlay}>
                <AntDesign name="camerao" size={24} color={CustomColors.white} />
              </View>
            </TouchableOpacity>

            <View style={styles.uploadTextContainer}>
              <TouchableOpacity onPress={pickImage}>
                <Text style={styles.uploadText}>Upload image</Text>
              </TouchableOpacity>
              <Text style={styles.uploadHint}>JPG, PNG, JPEG</Text>
            </View>
          </View>

          {/* Input Fields */}
          <View style={styles.inputSection}>
            <AppDefaultInput
              label={"First name"}
              placeholder={"First name"}
              value={newFirstName}
              onChangeText={setNewFirstName}
            />
            <AppDefaultInput
              label={"Last name"}
              placeholder={"Last name"}
              value={newLastName}
              onChangeText={setNewLastName}
            />
            <AppDefaultInput
              label={"Email"}
              placeholder={"Email (Read Only)"}
              value={userData?.email}
              editable={false}
            />
            <AppDefaultInput
              label={"Phone number"}
              placeholder={"Phone Number"}
              value={newPhone}
              onChangeText={setNewPhone}
              keyboardType="phone-pad"
              maxLength={11}
            />

            {/* Date of Birth Styled as Input */}
            <View style={styles.dateInputWrapper}>
              <Text style={styles.datePickerLabel}>Date of birth</Text>
              <TouchableOpacity
                style={styles.datePickerInput}
                onPress={showDatepicker}
                activeOpacity={0.8}
              >
                <Text style={styles.datePickerText}>
                  {date ? date.toLocaleDateString() : "Select date"}
                </Text>
                <AntDesign
                  name="calendar"
                  size={20}
                  color={CustomColors.placeholderColor}
                />
              </TouchableOpacity>

            </View>
          </View>

          <LoyaltyTierSection />

          <View style={{ marginTop: 20 }}>
            <AppButton btnText={"Update Profile"} onPress={handleUpdateProfile} />
          </View>
        </View>
      </KeyboardAwareScrollView>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
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
    backgroundColor: CustomColors.background,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: "Bold",
    color: CustomColors.textPrimary,
    marginBottom: 4,
  },
  sectionSubHeader: {
    fontSize: 14,
    fontFamily: "Regular",
    color: CustomColors.textSecondary,
    marginBottom: 16,
  },
  imageUploadSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImageContainer: {
    borderRadius: 30,
    overflow: "hidden",
    position: "relative",
    width: 60,
    height: 60,
    marginRight: 10,
    backgroundColor: CustomColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  initialsPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontSize: 24,
    fontFamily: "Bold",
    color: CustomColors.white,
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  uploadTextContainer: {
    justifyContent: "center",
  },
  uploadText: {
    fontSize: 14,
    fontFamily: "Medium",
    color: CustomColors.primary,
  },
  uploadHint: {
    fontSize: 12,
    fontFamily: "Regular",
    color: CustomColors.textSecondary,
  },
  inputSection: {
    gap: 16,
  },
  dateInputWrapper: {
    gap: 10,
  },
  datePickerLabel: {
    fontSize: 14,
    fontFamily: "Medium",
    color: CustomColors.labelColor,
  },
  datePickerInput: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 0.3,
    borderRadius: 5,
    borderColor: CustomColors.borderColor,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  datePickerText: {
    fontSize: 14,
    fontFamily: "Medium",
    color: CustomColors.placeholderColor,
  },
  loyaltyContainer: {
    gap: 10,
    marginTop: 10,
  },
  loyaltyTitle: {
    fontSize: 16,
    fontFamily: "Bold",
    color: CustomColors.textPrimary,
  },
  loyaltySubtitle: {
    fontSize: 12,
    fontFamily: "Regular",
    color: CustomColors.textSecondary,
  },
  loyaltyLink: {
    fontSize: 14,
    fontFamily: "Medium",
    color: Colors.primary,
    marginBottom: 16,
  },
  tierStatusCard: {
    padding: 16,
    backgroundColor: CustomColors.lightGrey,
    borderRadius: 8,
    gap: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tierStatusLabel: {
    fontSize: 12,
    fontFamily: "Regular",
    color: CustomColors.textSecondary,
  },
  tierStatusValue: {
    fontSize: 14,
    fontFamily: "Bold",
    color: CustomColors.textPrimary,
  },
  progressBarContainer: {
    marginTop: 4,
    gap: 4,
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: CustomColors.borderColor,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: CustomColors.primary,
  },
  progressText: {
    fontSize: 10,
    fontFamily: "Regular",
    color: CustomColors.textSecondary,
  },
  benefitsCard: {
    padding: 16,
    backgroundColor: CustomColors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CustomColors.borderColor,
    gap: 8,
  },
  benefitsTitle: {
    fontSize: 14,
    fontFamily: "Bold",
    color: CustomColors.textPrimary,
  },
  benefitsSubtitle: {
    fontSize: 12,
    fontFamily: "Regular",
    color: CustomColors.textSecondary,
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 12,
    fontFamily: "Regular",
    color: CustomColors.textPrimary,
  },
  viewAllButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: CustomColors.primary,
    borderRadius: 5,
    alignItems: "center",
  },
  viewAllButtonText: {
    fontSize: 14,
    fontFamily: "Medium",
    color: CustomColors.primary,
  },
});
