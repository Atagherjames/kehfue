import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native'
import { Colors } from '../constants/colors'

const AppButton = ({
    onPress,
    btnText,
    btnStyles,
    btnTextStyles,
    disabled,
    isLoading
}) => {
  return (
    <TouchableOpacity
        style={{
            paddingVertical: 10,
            alignItems: "center",
            paddingHorizontal: 20,
            backgroundColor: Colors.primary,
            borderRadius: 8,
            opacity: disabled ? 0.3 : 1,
            ...btnStyles
        }}
        onPress={onPress}
        disabled={disabled || isLoading}
    >
        {!isLoading && <Text
            style={{
                fontSize: 16,
                color: Colors.white,
                fontFamily: "Medium",
                ...btnTextStyles
            }}
        >{btnText}</Text>}
        {isLoading && <ActivityIndicator color={Colors.white}/>}
    </TouchableOpacity>
  )
}

export default AppButton