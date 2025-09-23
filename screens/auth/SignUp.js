import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { AppDefaultInput } from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { useUserRegisterMutation } from '../../services/routes/authRoute';
import AppLoader from '../../components/AppLoader';
import { useRecoilState } from 'recoil';
import { UserData } from '../../recoil/UserData';


const Login = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useRecoilState(UserData);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [acceptTermsAndConditions, setAcceptTermsAndConditions] = useState(false);
  
    const [registerUser, { isLoading }] = useUserRegisterMutation();
    
    const handleRegister = async () => {
        if (!email || !password || !firstName || !lastName) {
            Alert.alert("All fields are required");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match");
            return;
        }
        if (!acceptTermsAndConditions) {
            Alert.alert("Please agree to the terms and conditions");
            return;
        }

        
          

        const payload = {
            firstName,
            lastName,
            email,
            password,
            acceptTermsAndConditions,
            privacy: true
        };

        try {
            // Step 1: Attempt to register the user.
            const registerResult = await registerUser(payload).unwrap();

            // Step 2: If registration is successful, set user data and navigate.
            if (registerResult.success) {
                setUserData(registerResult.user);

                // The backend is responsible for sending the initial OTP.
                // We just need to navigate to the OTP verification screen.
                navigation.navigate("SignUpOtp", {
                    token: registerResult.accessToken,
                    email: registerResult.user.email,
                });
            } else {
                // This block handles cases where the API returns a success: false but no throw.
                Alert.alert("Registration Error", registerResult?.message || "Registration was not successful.");
            }
        } catch (error) {
            // Handle registration errors from the API (e.g., email already exists, 400 status codes).
            Alert.alert(
                "Registration Failed",
                error?.data?.message || "Something went wrong during registration. Please try again."
            );
            console.log(error);
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
                    showsVerticalScrollIndicator={false}
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
                            <View>
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
                                    <Feather name={passwordHidden ? "eye" : "eye-off"} size={20} color={Colors.labelColor} />
                                </TouchableOpacity>
                            </View>
                            <View>
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
                                    <Feather name={passwordHidden ? "eye" : "eye-off"} size={20} color={Colors.labelColor} />
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
                            Already have an account?{" "}
                            <Text style={{ color: Colors.secondary }}>Log in</Text>
                        </Text>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </SafeAreaView>
    );
};

export default Login;