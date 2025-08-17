import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/colors'
import AppHeader from '../../components/AppHeader'
import { Text, View } from 'react-native'
import { AppDefaultInput } from '../../components/AppInput'
import AppButton from '../../components/AppButton'
import { useForgetPasswordMutation } from '../../services/routes/authRoute'
import { useToast } from 'react-native-toast-notifications'
import AppLoader from '../../components/AppLoader'

const ForgotPassword = ({
    navigation
}) => {
    const [forgetPassword, {isSuccess, isError, isLoading}] = useForgetPasswordMutation()
    const [email, setEmail] = useState("")
    const toast = useToast()

    const handleForgetPassword = async () => {
        if (!email) {
            toast.show("Please input email to continue", {
                type: "warning"
            })
            return
        }
        const payload = {
            email
        }

        try {
            const forgetPasswordResult = await forgetPassword(payload).unwrap()
            console.log(forgetPasswordResult)
            if (forgetPasswordResult.success) {
                toast.show(forgetPasswordResult?.data?.message || forgetPasswordResult?.message, {
                    type: "success"
                })
                navigation.navigate("ChangePassword", {
                    email
                })
            }
        } catch (error) {
            toast.show(error?.data?.message || error?.message, {
                type: "warning"
            })
        }
    }
  return (
    <SafeAreaView
        style={{
            flex: 1,
            backgroundColor: Colors.white,
        }}
    >
        {isLoading && <AppLoader />}
        <AppHeader
            navigation = {navigation}
            showBackIcon={true}
        />

        <View
            style={{
                padding: 20,
                gap: 20
            }}
        >
            <Text
                style={{
                    fontFamily: "Bold",
                    fontSize: 24,
                    textAlign: "center",
                    color: Colors.primary
                }}
            >
                Forgot Password
            </Text>
            <Text
                style={{
                    fontFamily: "Regular",
                    fontSize: 16,
                    textAlign: "center",
                    color: Colors.primary
                }}
            >
                Please, enter your registered email below. 
            </Text>
            
            <AppDefaultInput
                inputStyles={{
                    backgroundColor: "rgba(217, 217, 217, 0.5)",
                    borderColor: Colors.primary
                }}
                onChangeText={setEmail}
            />
            <AppButton
                btnText={"DONE"}
                onPress={handleForgetPassword}
            />

        </View>
    </SafeAreaView>
  )
}

export default ForgotPassword