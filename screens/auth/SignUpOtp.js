import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { Alert, Dimensions, Text, View, TouchableOpacity } from 'react-native';
import { PinInput } from "@pakenfit/react-native-pin-input";
import AppButton from '../../components/AppButton';
import { useVerifyOtpMutation, useGetVerificationCodeMutation } from '../../services/routes/authRoute';
import { useRecoilState } from 'recoil';
import { AccessToken, UserData } from '../../recoil/UserData';

const SignUpOtp = ({ route }) => {
    const navigation = useNavigation();
    const { token,  email } = route.params;

    const [code, setCode] = useState("");
    const [success, setSuccess] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);


    const [userData, setUserData] = useRecoilState(UserData);
    const [accessToken, setAccessToken] = useRecoilState(AccessToken);

    const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
    const [getCode, { isLoading: isResending }] = useGetVerificationCodeMutation();

    // Countdown for Resend
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    // Handle OTP verification
    const handleVerifyOtp = async () => {
        try {
            const payload = { otp: code , email};
            const result = await verifyOtp({ payload, token }).unwrap();
            console.log(result)

            if (result.success) {
                setSuccess(true);
             navigation.navigate("Login")
        
            } else {
                Alert.alert("OTP Failed", result.message || "Invalid OTP");
            }
        } catch (error) {
            Alert.alert("Error", error?.message || error?.data?.message || "Failed to verify OTP");
            console.log(error);
        }
    };

    // Handle Resend OTP
    const handleResend = async () => {
        if (!canResend) return;

        try {
            const result = await getCode(email).unwrap();
            if (result.success) {
                Alert.alert("Success", result.message || "OTP sent again");
                setResendTimer(30);
                setCanResend(false);
            } else {
                Alert.alert("Error", result.message || "Failed to resend OTP");
            }
        } catch (error) {
            Alert.alert("Error", error?.message || "Failed to resend OTP");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
            <AppHeader navigation={navigation} />

            <View style={{ flex: 1, justifyContent: 'center', padding: 20, gap: 20 }}>
                <View>
                    <Text style={{ fontFamily: "SemiBold", textAlign: 'center', fontSize: 20, color: Colors.primary }}>
                        Authentication
                    </Text>
                    <Text style={{ fontFamily: "Regular", textAlign: 'center', fontSize: 16, color: Colors.primary }}>
                        We've sent a code to the email address provided. Enter the code in that message to continue.
                    </Text>
                    <Text style={{ fontFamily: "SemiBold", textAlign: 'center', fontSize: 16, color: Colors.primary }}>
                        Do not share the code with anyone!
                    </Text>
                </View>

                <View>
                    <PinInput
                        length={6}
                        inputStyle={{
                            borderWidth: 1,
                            borderColor: Colors.inputBorder,
                            backgroundColor: Colors.menuItemBg,
                            borderRadius: 10,
                            flex: 1,
                            height: 60,
                            fontSize: 24,
                            fontFamily: "Regular"
                        }}
                        onFillEnded={setCode}
                        autoFocus={true}
                        containerStyle={{ paddingVertical: 20 }}
                    />

                    <TouchableOpacity onPress={handleResend} disabled={!canResend}>
                        <Text style={{
                            fontFamily: "Regular",
                            textAlign: 'right',
                            fontSize: 12,
                            color: canResend ? Colors.secondary : Colors.primary
                        }}>
                            {canResend ? "Resend code" : `Resend code (${resendTimer})`}
                        </Text>
                    </TouchableOpacity>
                </View>

                <AppButton
                    btnText={"DONE"}
                    btnStyles={{ backgroundColor: Colors.secondary }}
                    disabled={code.length < 6}
                    onPress={handleVerifyOtp}
                />

                {(isVerifying || isResending) && (
                    <View style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: Dimensions.get("window").width,
                        height: "100%",
                        zIndex: 1,
                        backgroundColor: Colors.white,
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 20,
                        paddingHorizontal: 20
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary }} />
                            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.menuItemBg }} />
                        </View>
                        <Text style={{ fontFamily: "SemiBold", textAlign: 'center', fontSize: 20, color: Colors.primary }}>
                            {isVerifying ? "Authenticating" : "Resending OTP"}
                        </Text>
                    </View>
                )}

                {success && (
                    <View style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: Dimensions.get("window").width,
                        height: "100%",
                        zIndex: 1,
                        backgroundColor: Colors.white,
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 20,
                        paddingHorizontal: 20
                    }}>
                        <Text style={{ fontFamily: "Medium", textAlign: 'center', fontSize: 20, color: Colors.primary }}>
                            Authentication Successful!
                        </Text>
                        <Text style={{ fontFamily: "Regular", textAlign: 'center', fontSize: 16, color: Colors.primary }}>
                            Thank you for creating an account with Khefue.
                            To complete your account registration, click the button below.
                        </Text>
                        <AppButton
                            btnText={"LET’S GO"}
                            btnStyles={{ backgroundColor: Colors.secondary, width: "100%" }}
                            onPress={() => navigation.navigate("HomeTabs")}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default SignUpOtp;
