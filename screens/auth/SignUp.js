import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/colors'
import AppHeader from '../../components/AppHeader'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign, Feather } from '@expo/vector-icons';
import { AppDefaultInput } from '../../components/AppInput'
import AppButton from '../../components/AppButton'
import { useGetVerificationCodeMutation, useUserRegisterMutation } from '../../services/routes/authRoute'
import AppLoader from '../../components/AppLoader'
import { useRecoilState } from 'recoil'
 import { AccessToken, UserData } from '../../recoil/UserData'

const Login = () => {
    const navigation =  useNavigation()
    const [userData, setUserData] = useRecoilState(UserData)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordHidden, setPasswordHidden] = useState(true)
    const [acceptTermsAndConditions, setAcceptTermsAndConditions] = useState(false)
    const [registerUser, {isLoading, isError, isSuccess}] = useUserRegisterMutation()
    const [getCode, {isLoading: isCodeLoading}] = useGetVerificationCodeMutation()

    const handleRegister = async () => {
        if (!email || !password || !firstName || !lastName) {
            Alert.alert("All fields are required")
            return
        }
        if (password !== confirmPassword) {
            Alert.alert("Password do not match")
            return
        }

        const payload = {
            firstName,
            lastName,
            email,
            password,
            acceptTermsAndConditions,
        privacy: true
        }

        try {
            const registerResult = await registerUser(payload).unwrap()     
         if (registerResult.success) {

    navigation.navigate("SignUpOtp", {
        token: registerResult.accessToken,
        email: registerResult.user.email
    });

    try {
        const result = await getCode(registerResult.user.email).unwrap();
setUserData(registerResult.user)
        if (result.success) {
            if (result.message) {
                Alert.alert("Success", result.message);
            }
        } else {
            Alert.alert(
                "OTP Error",
                result.message || "OTP could not be sent. Please try resending."
            );
        }
    } catch (error) {
        Alert.alert(
            "OTP Error",
            error?.message || error?.data?.message || "Failed to send OTP. Please try again."
        );
        console.log(error);
    }
}

        } catch (error) {
            Alert.alert("Error", error?.message || error?.data?.message || error?.error)
            console.log(error)
        }

    }

  return (
    <SafeAreaView
        style={{
            flex: 1,
            backgroundColor: Colors.white,
        }}
    >
        {(isLoading || isCodeLoading) && <AppLoader />}
        <AppHeader
            navigation={navigation}
        />

        <View
            style={{
                paddingHorizontal: 20,
                flex: 1,
                paddingVertical: 20
            }}
        >
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator = {false}
            >
                <View
                    style={{
                        gap: 10
                    }}
                >
            <Text
                style={{
                    fontSize: 24,
                    fontFamily: "Bold",
                    color: Colors.primary
                }}
            >
                Let’s get started!
            </Text>
            <Text
                style={{
                    fontSize: 16,
                    fontFamily: "Regular",
                    color: "rgba(40, 0, 91, 0.69)"
                }}
            >
                Sign up to enjoy exclusive benefits and rewards from Khefue.
            </Text>
            <View
                style={{
                    marginVertical: 10,
                    gap: 10
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 20
                    }}
                >
                    <AppDefaultInput
                        label={"First Name"}
                        placeholder={"Enter first name"}
                        onChangeText={setFirstName}
                        style={{
                            flex: 1
                        }}
                        />
                    <AppDefaultInput
                        label={"Last Name"}
                        placeholder={"Enter last name"}
                        onChangeText={setLastName}
                        style={{
                            flex: 1
                        }}
                    />
                </View>
                <AppDefaultInput
                    label={"Email"}
                    placeholder={"Enter email address"}
                    inputMode='email'
                    onChangeText={setEmail}
                />
                <View
                    
                >
                    <AppDefaultInput
                        label={"Password"}
                        placeholder={"Enter password"}
                        onChangeText={setPassword}
                        secureTextEntry={passwordHidden}
                    />
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 37,
                            right: 20,
                        }}
                        onPress={() => setPasswordHidden(!passwordHidden)}
                    >
                        <Feather name={passwordHidden ? "eye" : "eye-off"} size={20} color={Colors.labelColor}  />
                    </TouchableOpacity>
                </View>
                <View
                    
                >
                    <AppDefaultInput
                        label={"Confirm Password"}
                        placeholder={"Confirm password"}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={passwordHidden}
                    />
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 37,
                            right: 20,
                        }}
                        onPress={() => setPasswordHidden(!passwordHidden)}
                    >
                        <Feather name={passwordHidden ? "eye" : "eye-off"} size={20} color={Colors.labelColor}  />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        marginTop: 5
                    }}
                    onPress={() => setAcceptTermsAndConditions(!acceptTermsAndConditions)}
                >
                    <AntDesign name="checksquare" size={20} color={acceptTermsAndConditions ? Colors.primary : Colors.inputBorder} />
                    <View>
                        <Text
                            style={{
                                color: Colors.secondary,
                                fontFamily: "Medium",
                                fontSize: 14,
                                color: Colors.labelColor
                            }}
                        >
                            By clicking ‘Sign Up’, you agree to Khefue’s terms and conditions.
                        </Text>
                        <Text
                            style={{
                                color: Colors.secondary,
                                fontFamily: "Medium",
                                paddingVertical: 10,
                                fontSize: 14
                            }}
                        >
                            Terms and conditions.
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <AppButton
                btnText={"SIGN UP"}
                btnStyles={{
                    backgroundColor: Colors.secondary
                }}
                onPress={handleRegister}
                disabled={!acceptTermsAndConditions}
            />

            <Text
                style={{
                    textAlign: "center",
                    color: "rgba(13, 24, 51, 1)",
                    fontFamily: "Medium",
                    paddingVertical: 10,
                    fontSize: 14
                }}
                onPress={() => navigation.navigate("Login")}
            >
                Already have an account?{"  "}
                <Text style={{color: Colors.secondary}}>Log in</Text>
            </Text>
            </View>
            </KeyboardAwareScrollView>
        </View>
    </SafeAreaView>
  )
}

export default Login