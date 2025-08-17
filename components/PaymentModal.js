import React from 'react'
import AppModal from './AppModal'
import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { WebView } from 'react-native-webview';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Colors } from '../constants/colors';

const PaymentModal = ({
    visible,
    setVisible,
    url,
    onBackPress
}) => {
    // console.log(url)
  return (
    <AppModal
        modalStyles={{
            height: "100%",
            width: "100%"
        }}
        visible={visible}
        onClose={() => {}}
    >
        <View
            style={{
                flex: 1,
                gap: 10
            }}
        >
            <TouchableOpacity
                style={{

                }}
                onPress={() => {
                    onBackPress()
                    setVisible(false)
                }}
            >
                <AntDesign name="arrowleft" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableWithoutFeedback>
                <WebView source={{ uri: url }} style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
        </View>
    </AppModal>
  )
}

export default PaymentModal