import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import AppHeader from "../../components/AppHeader";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import userBg from "../../assets/images/user-bg.png";
import person from "../../assets/images/person.png";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRecoilState } from "recoil";
import { AccessToken, UserData } from "../../recoil/UserData";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BackButton from "../../components/BackButton";
import AppButton from "../../components/AppButton";

const DetailsItem = ({ icon, title, value }) => (
  <View
    style={{
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderColor: "#E1E1E1",
    }}
  >
    <Text
      style={{
        fontFamily: "SemiBold",
        fontSize: 16,
        color: "#323232",
      }}
    >
      {title}
    </Text>
    <Text
      style={{
        fontFamily: "Medium",
        fontSize: 14,
        color: "#545454",
      }}
    >
      {value}
    </Text>
  </View>
);

const InputBox = ({ label, value, onChangeText, ...props }) => (
  <View
    style={{
      gap: 5,
    }}
  >
    <Text
      style={{
        fontFamily: "Medium",
        color: Colors.black,
        fontSize: 12,
      }}
    >
      {label}
    </Text>
    <TextInput
      style={{
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontFamily: "Medium",
      }}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={Colors.black}
      {...props}
    />
  </View>
);

const User = ({ navigation }) => {
  const [userData, _] = useRecoilState(UserData);
  const { firstName, lastName, middleName, gender, phoneNumber, email, dob } =
    userData;
  const [__, setToken] = useRecoilState(AccessToken)

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
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
            }}
          >
            <BackButton navigation={navigation} />
            <View
              style={{
                height: 180,
                marginTop: 16,
              }}
            >
              <Image
                source={userBg}
                style={{
                  width: "100%",
                  height: 130,
                  borderRadius: 14,
                }}
                resizeMode="cover"
              />
              <Image
                source={
                  userData?.profilePicture
                    ? { uri: userData?.profilePicture?.downloadUrl }
                    : person
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  position: "absolute",
                  bottom: 0,
                  alignSelf: "center",
                }}
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity
              style={{
                width: 70,
                backgroundColor: Colors.white,
                borderWidth: 1,
                borderColor: Colors.primary,
                borderRadius: 10,
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                padding: 5,
                justifyContent: "center",
                marginVertical: 20,
              }}
              onPress={() =>
                navigation.navigate("EditProfile", { data: userData })
              }
            >
              <MaterialIcons name="edit" size={20} color={Colors.primary} />
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.primary,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>

            <View
              style={{
                gap: 10,
              }}
            >
              <DetailsItem title={"First Name"} value={firstName} />
              <DetailsItem title={"Last Name"} value={lastName} />
              <DetailsItem
                title={"Middle Name"}
                value={middleName || "Edit to add"}
              />
              <DetailsItem title={"Gender"} value={gender || "Edit to add"} />
              <DetailsItem
                title={"Phone Number"}
                value={phoneNumber || "Edit to add"}
              />
              <DetailsItem
                title={"Email Address"}
                value={email || "Edit to add"}
              />
              <DetailsItem
                title={"Date of birth"}
                value={dob || "Edit to add"}
              />
            </View>

            <AppButton btnText={"Logout"} onPress={() => setToken("")} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default User;
