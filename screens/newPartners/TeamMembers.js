import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomDrawer from "../../components/CustomDrawer";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { Colors } from "../../constants/colors";
import { AppDefaultInput } from "../../components/AppInput";
import AppLoader from "../../components/AppLoader";
import AppButton from "../../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import DefaultDropdown from "../../components/DefaultDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAddTeamMemberMutation } from "../../services/routes/partnerRoute";
import * as ImagePicker from "expo-image-picker";

const CreateTeamMember = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const [token] = useRecoilState(PartnerAccessToken);
  const [addTeamMember, { isLoading: isAddingMember }] =
    useAddTeamMemberMutation();
    
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  // UI states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);

  const genderOptions = ["MALE", "FEMALE", "OTHERS"];
  const departmentOptions = [
    "Sales",
    "Marketing",
    "Human Resources",
    "Finance",
    "Operations",
  ];
  const levelOptions = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === "ios");
    setDob(currentDate);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setProfilePicture(result.assets[0]);
      }
    } catch {
      toast.show("Something went wrong.", { type: "danger" });
    }
  };

  const handleCreate = async () => {

     if (!firstName || !lastName || !email || !phoneNumber || !gender || !department || !level) {
    toast.show("Please fill in all required fields.", { type: "warning" });
    return;
  }

  if (!profilePicture) {
    toast.show("Please upload a profile picture.", { type: "warning" });
    return;
  }
    try {
      const dobFormatted = dob.toISOString().split("T")[0];
      const address = { streetAddress, city, country };

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("dob", dobFormatted);
      formData.append("gender", gender);
      formData.append("department", department);
      formData.append("level", level);
      formData.append("address", JSON.stringify(address));

      if (profilePicture) {
        const response = await fetch(profilePicture.uri);
        const blob = await response.blob();

        formData.append("profilePicture", {
          uri: profilePicture.uri,
          name: profilePicture.fileName || "profile_picture.jpg",
          type: blob.type || "image/jpeg",
        });
      }

      await addTeamMember({ body: formData, token }).unwrap();

      toast.show("Team member created successfully!", { type: "success" });
      navigation.pop();
    } catch (err) {

  let message = "Something went wrong.";
  if (err?.data?.message) {
    message = err.data.message;
  } else if (err?.error) {
    message = err.error;
  }

  toast.show(message, { type: "danger" });

    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomDrawer />
      {isAddingMember && <AppLoader />}
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          backgroundColor: Colors.white,
          margin: 20,
          borderRadius: 20,
          gap: 20,
        }}
      >
        <Text style={styles.headerText}>Create New Team Member</Text>

        <AppDefaultInput
          label="First Name"
          placeholder="John"
          onChangeText={setFirstName}
          value={firstName}
        />
        <AppDefaultInput
          label="Last Name"
          placeholder="Doe"
          onChangeText={setLastName}
          value={lastName}
        />
        <AppDefaultInput
          label="Email Address"
          placeholder="john.doe@example.com"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
        />
        <AppDefaultInput
          label="Phone Number"
          onChangeText={setPhoneNumber}
          value={phoneNumber}
          keyboardType="phone-pad"
        />

        <DefaultDropdown
          label="Gender"
          placeholder="Select Gender"
          data={genderOptions}
          value={gender}
          setValue={setGender}
          showModal={showGenderModal}
          setShowModal={setShowGenderModal}
        />
        <DefaultDropdown
          label="Department"
          placeholder="Select Department"
          data={departmentOptions}
          value={department}
          setValue={setDepartment}
          showModal={showDepartmentModal}
          setShowModal={setShowDepartmentModal}
        />
        <DefaultDropdown
          label="Level"
          placeholder="Select Level"
          data={levelOptions}
          value={level}
          setValue={setLevel}
          showModal={showLevelModal}
          setShowModal={setShowLevelModal}
        />

        <View>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePickerButton}
          >
            <Text>{dob.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 5 }}>
          <Text style={styles.label}>Address</Text>
          <AppDefaultInput
            placeholder="Street Address"
            onChangeText={setStreetAddress}
            value={streetAddress}
          />
          <AppDefaultInput
            placeholder="City"
            onChangeText={setCity}
            value={city}
          />
          <AppDefaultInput
            placeholder="Country"
            onChangeText={setCountry}
            value={country}
          />
        </View>

        <View>
          <Text style={styles.label}>Profile Picture</Text>
          <TouchableOpacity onPress={pickImage} style={styles.imageCont}>
            {profilePicture && (
              <Image
                source={{ uri: profilePicture.uri }}
                style={{ width: "100%", height: "100%" }}
              />
            )}
            <Text style={{ position: "absolute", color: Colors.textGrey }}>
              Click to {profilePicture ? "change" : "upload"} image
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <AppButton
            btnStyles={{
              alignSelf: "flex-start",
              marginBottom: 20,
              backgroundColor: Colors.lightGrey,
              flex: 1,
            }}
            btnText="Cancel"
            onPress={() => navigation.pop()}
            btnTextStyles={{ color: Colors.primary }}
          />
          <AppButton
            btnStyles={{ alignSelf: "flex-start", marginBottom: 20, flex: 1 }}
            btnText="Create"
            onPress={handleCreate}
            disabled={isAddingMember}
          />
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          is24Hour
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
};

export default CreateTeamMember;

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "SemiBold",
    color: Colors.darkBlue,
    fontSize: 20,
  },
  label: {
    fontFamily: "Medium",
    fontSize: 14,
    color: Colors.labelColor,
    marginBottom: 5,
  },
  imageCont: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    height: 200,
    gap: 5,
    borderColor: Colors.inputBorder,
    overflow: "hidden",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});
