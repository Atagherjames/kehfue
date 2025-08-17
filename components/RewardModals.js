import React from 'react'
import AppModal from './AppModal'
import { FontAwesome } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import Icon from "../assets/icons/coin-in-hand.svg";
import AppButton from './AppButton';

export const TopUpModal = ({
    visible,
    setVisible,
    navigation
}) => {
  return (
    <AppModal
        visible={visible}
        onClose={() => setVisible(false)}
        modalStyles={{
            gap: 10
        }}
    >
        <TouchableOpacity
            style={{
                alignSelf: 'flex-end'
            }}
            onPress={() => setVisible(false)}
        >
            <FontAwesome name="close" size={26} color={Colors.primary} />
        </TouchableOpacity>
        <Text
            style={{
                fontSize: 16,
                fontFamily: "Medium",
                color: Colors.primary,
                textAlign: 'center'
            }}
        >
            Top up Airtime/Data
        </Text>

        <TouchableOpacity
            style={{
                paddingVertical: 8,
                backgroundColor: "rgba(232, 227, 254, 1)",
                paddingHorizontal: 10,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10
            }}
            onPress={() => {
                setVisible(false)
                navigation.navigate("Airtime")
            }}
        >
            <Icon
                width = {30}
                height ={30}
            />
            <Text
                style={{
                    fontSize: 18,
                    fontFamily: "Medium",
                    color: Colors.primary,
                }}
            >
                Airtime
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={{
                paddingVertical: 5,
                backgroundColor: "rgba(232, 227, 254, 1)",
                paddingHorizontal: 10,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10
                
            }}
            onPress={() => {
                setVisible(false)
                navigation.navigate("Data")
            }}
        >
            <Icon
                width = {30}
                height ={30}
            />
            <Text
                style={{
                    fontSize: 16,
                    fontFamily: "Medium",
                    color: Colors.primary,
                }}
            >
                Data
            </Text>
        </TouchableOpacity>
    </AppModal>
  )
}
