import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import AppHeader from "../../components/AppHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign, Feather } from "@expo/vector-icons";
import { AppDefaultInput } from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import {
  useGetVerificationCodeMutation,
  useUserLoginMutation,
} from "../../services/routes/authRoute";
import AppLoader from "../../components/AppLoader";
import { useRecoilState } from "recoil";
import { AccessToken, UserData } from "../../recoil/UserData";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Login = () => {
  const navigation = useNavigation();
  const [activeType, setActiveType] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [loginUser, { isLoading, isSuccess, isError }] = useUserLoginMutation();
  const [getCode, { isLoading: isCodeLoading }] =
    useGetVerificationCodeMutation();
  const [userData, setUserData] = useRecoilState(UserData);
  const [accessToken, setAccessToken] = useRecoilState(AccessToken);


  const loginType = [
    {
      id: 1,
      text: "Admin",
      icon: <FontAwesome5 name="user-alt" size={28} color={Colors.primary} />,
    },
    {
      id: 2,
      text: "Partner",
      icon: <Entypo name="users" size={28} color={Colors.primary} />,
    },
  ];

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please fill in all fields to continue");
      return;
    }
    


    const payload = {
      email,
      password,
    };

    try {
      const loginResult = await loginUser(payload).unwrap();
      if (loginResult.success) {
        setUserData(loginResult?.user);
          await AsyncStorage.setItem("userData", JSON.stringify(loginResult?.user));
        if (loginResult?.user?.isVerified) {
          setAccessToken(loginResult?.accessToken);
          await AsyncStorage.setItem("accessToken", loginResult?.accessToken);
        } else {
          try {
            const result = await getCode(loginResult.accessToken).unwrap();
            if (result.success) {
              navigation.navigate("SignUpOtp", {
                token: loginResult.accessToken,
              });
            }
          } catch (error) {
            Alert.alert(
              "Error",
              error?.message || error?.data?.message || error?.error
            );
          }
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      {(isLoading || isCodeLoading) && <AppLoader />}
      <AppHeader navigation={navigation} />

      <View
        style={{
          paddingHorizontal: 20,
          flex: 1,
          paddingVertical: 20,
        }}
      >
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              gap: 10,
            }}
          >
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
              Welcome back! Log in to continue enjoying our services.
            </Text>
            {/* <Text
                style={{
                    fontSize: 20,
                    fontFamily: "Medium",
                    color: Colors.primary
                }}
            >
                Choose Account Type
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    gap: 10,
                }}
            >
                {
                    loginType.map((item, i) => (
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                gap: 6,
                                paddingVertical: 16,
                                paddingHorizontal: 19,
                                backgroundColor: Colors.grey,
                                borderRadius: 20
                            }}
                            onPress = {() => setActiveType(item.id)}
                        >
                            {item.icon}
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontFamily: "Medium",
                                    color: Colors.primary
                                }}
                            >
                                {item.text}
                            </Text>
                            {activeType == item.id && (<View
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: -5
                                }}
                            >
                                <AntDesign name="checksquare" size={20} color={Colors.primary} />
                            </View>)}
                        </TouchableOpacity>
                    ))
                }
            </View> */}
            <View
              style={{
                marginVertical: 10,
                gap: 10,
              }}
            >
              <AppDefaultInput
                label={"Email"}
                placeholder={"Enter email address"}
                inputMode="email"
                onChangeText={setEmail}
              />
              <View>
                <AppDefaultInput
                  label={"Password"}
                  placeholder={"Enter password"}
                  onChangeText={setPassword}
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
              btnText={"LOG IN"}
              btnStyles={{
                backgroundColor: Colors.secondary,
              }}
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
              onPress={() => navigation.navigate("SignUp")}
            >
              Don’t have an account?{"  "}
              <Text style={{ color: Colors.secondary }}>Sign Up</Text>
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: Colors.secondary,
                fontFamily: "Medium",
                paddingVertical: 10,
                fontSize: 14,
              }}
              onPress={() => navigation.navigate("PartnerLogin")}
            >
              Login as a partner
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Login;
