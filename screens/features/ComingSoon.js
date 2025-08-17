import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/colors'
import AppLogo from "../../assets/svg/applogo.svg";
import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ComingSoon = ({
    navigation
}) => {
  return (
    <SafeAreaView
        style={{
            flex: 1,
            backgroundColor: Colors.white
        }}
    >
        <View
            style={{
                padding: 15,
                flexDirection: 'row',
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: Colors.lightGrey,
                height: 70
            }}
        >
            <AppLogo width={140} />
            <TouchableOpacity
                onPress={() => navigation.pop()}
            >
                <FontAwesome name="close" size={30} color={Colors.primary} />
            </TouchableOpacity>
        </View>

        <View
            style={{
                backgroundColor: Colors.primary,
                padding: 30,
                flex: 1,
                width: "80%",
                alignSelf: "center",
                marginVertical: 20,
                borderRadius: 20,
                alignItems: 'center',
                gap: 80,
                justifyContent: 'center'
            }}
        >
            <Text
                style={{
                    fontFamily: "Medium",
                    color: Colors.white,
                    fontSize: 18
                }}
            >
            THIS REWARD IS 
            </Text>
            <Text
                style={{
                    fontFamily: "SemiBold",
                    color: Colors.white,
                    fontSize: 40,
                    textAlign: 'center'
                }}
            >
            COMNG SOON
            </Text>
            <Text
                style={{
                    fontFamily: "Medium",
                    color: Colors.white,
                    fontSize: 18
                }}
            >
            STAY TUNED!!!
            </Text>
        </View>
    </SafeAreaView>
  )
}

export default ComingSoon