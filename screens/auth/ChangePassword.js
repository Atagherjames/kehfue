import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import AppHeader from "../../components/AppHeader";
import { Text, TouchableOpacity, View } from "react-native";
import { AppDefaultInput } from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useChangePasswordMutation } from "../../services/routes/authRoute";
import { useToast } from "react-native-toast-notifications";
import { AntDesign, Feather } from "@expo/vector-icons";
import AppLoader from "../../components/AppLoader";
import { encryptPassword } from "../../utils/Utilities";

const ChangePassword = ({ navigation, route }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [changePassword, { isLoading, isError }] = useChangePasswordMutation();
  const { email } = route.params;
  const toast = useToast();

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.show("Passsword is not confirmed", {
        type: "warning",
      });
      return;
    }

     const encryptedPassword = encryptPassword(newPassword)
    
    


    const payload = {
      email,
      password: encryptedPassword,
      otpCode: otp,
    };

    try {
      const changePasswordRes = await changePassword(payload).unwrap();
      console.log(changePasswordRes);
      if (changePasswordRes.success) {
        toast.show(
          changePasswordRes?.data?.message || changePasswordRes?.message,
          {
            type: "success",
          }
        );
        navigation.navigate("Login");
      }
    } catch (error) {
      toast.show(error?.data?.message || error?.message, {
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
      {isLoading && <AppLoader />}
      <AppHeader navigation={navigation} showBackIcon={true} />

      <View
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        <KeyboardAwareScrollView>
          <View
            style={{
              gap: 16,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Bold",
                color: Colors.primary,
              }}
            >
              Change Password
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Regular",
                color: Colors.primary,
              }}
            >
              Please enter the OTP sent to your gmail and your new password to
              continue.
            </Text>

            <AppDefaultInput
              label={"OTP Code"}
              keyboardType={"numeric"}
              maxLength={6}
              onChangeText={setOtp}
              placeholder={"OTP code"}
            />

            <View>
              <AppDefaultInput
                label={"New Password"}
                placeholder={"Enter new password"}
                onChangeText={setNewPassword}
                secureTextEntry={passwordHidden}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 37,
                  right: 20,
                }}
                onPress={() => setPasswordHidden(!passwordHidden)}
              >
                <Feather
                  name={passwordHidden ? "eye" : "eye-off"}
                  size={20}
                  color={Colors.labelColor}
                />
              </TouchableOpacity>
            </View>
            <View>
              <AppDefaultInput
                label={"Confirm New Password"}
                placeholder={"Confirm new password"}
                onChangeText={setConfirmPassword}
                secureTextEntry={passwordHidden}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 37,
                  right: 20,
                }}
                onPress={() => setPasswordHidden(!passwordHidden)}
              >
                <Feather
                  name={passwordHidden ? "eye" : "eye-off"}
                  size={20}
                  color={Colors.labelColor}
                />
              </TouchableOpacity>
            </View>

            <AppButton btnText={"SUBMIT"} onPress={handleSubmit} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
