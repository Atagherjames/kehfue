import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import AppHeader from "../../components/AppHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View, Text, TouchableOpacity, Alert, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo, AntDesign, Feather } from "@expo/vector-icons";
import { AppDefaultInput } from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import { usePartnerLoginMutation } from "../../services/routes/authRoute";
import AppLoader from "../../components/AppLoader";
import { useRecoilState } from "recoil";
import { PartnerAccessToken, UserData } from "../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";

const PartnerLogin = () => {
  const navigation = useNavigation();
  const [activeType, setActiveType] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [loginPartner, { isLoading }] = usePartnerLoginMutation();
  const [userData, setUserData] = useRecoilState(UserData);
  const [accessToken, setAccessToken] = useRecoilState(PartnerAccessToken);
  const toast = useToast();
  const url = "https://khefuefrontend.azurewebsites.net/partner-enlist";

  const openUrl = async () => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      toast.show("Can't open url: " + url);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please fill in all fields to continue");
      return;
    }

    const payload = { email, password };
    try {
      const loginResult = await loginPartner(payload).unwrap();

      if (loginResult.success) {
        setUserData(loginResult.partner);
        setAccessToken(loginResult.accessToken);

        if (loginResult.partner.isVerified) {
          if (!loginResult.partner.hasStore) {
    navigation.replace("CreateStore");
  } else {
    navigation.replace("PartnerDashboard");
  }
        } else {
          navigation.navigate("SignUpOtp", {
            token: loginResult.accessToken,
          });
        }
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error?.message || error?.data?.message || error?.error
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {isLoading && <AppLoader />}
      <AppHeader navigation={navigation} />

      <View style={{ paddingHorizontal: 20, flex: 1, paddingVertical: 20 }}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={{ gap: 10 }}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Bold",
                color: Colors.primary,
              }}
            >
              Log in
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Regular",
                color: "rgba(40, 0, 91, 0.69)",
              }}
            >
              Login as a partner
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View
                style={{
                  alignItems: "center",
                  gap: 6,
                  paddingVertical: 16,
                  paddingHorizontal: 19,
                  backgroundColor: Colors.grey,
                  borderRadius: 20,
                }}
              >
                <Entypo name="users" size={28} color={Colors.primary} />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Medium",
                    color: Colors.primary,
                  }}
                >
                  Partner
                </Text>
                {activeType === 1 && (
                  <View style={{ position: "absolute", bottom: 0, right: -5 }}>
                    <AntDesign
                      name="checksquare"
                      size={20}
                      color={Colors.primary}
                    />
                  </View>
                )}
              </View>
            </View>

            <View style={{ marginVertical: 10, gap: 10 }}>
              <AppDefaultInput
                label="Email"
                placeholder="Enter email address"
                inputMode="email"
                onChangeText={setEmail}
              />
              <View>
                <AppDefaultInput
                  label="Password"
                  placeholder="Enter password"
                  onChangeText={setPassword}
                  secureTextEntry={passwordHidden}
                />
                <TouchableOpacity
                  style={{ position: "absolute", top: 37, right: 20 }}
                  onPress={() => setPasswordHidden(!passwordHidden)}
                >
                  <Feather
                    name={passwordHidden ? "eye" : "eye-off"}
                    size={20}
                    color={Colors.labelColor}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  textAlign: "center",
                  color: Colors.secondary,
                  fontFamily: "Medium",
                  paddingVertical: 10,
                  fontSize: 14,
                }}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                Forgot Password
              </Text>
            </View>

            <AppButton
              btnText="LOG IN"
              btnStyles={{ backgroundColor: Colors.secondary }}
              onPress={handleLogin}
            />

            <Text
              style={{
                textAlign: "center",
                color: "rgba(13, 24, 51, 1)",
                fontFamily: "Medium",
                paddingVertical: 10,
                fontSize: 14,
              }}
              onPress={openUrl}
            >
              <Text style={{ color: Colors.secondary }}>Become a Partner</Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PartnerLogin;
