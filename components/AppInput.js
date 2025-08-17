import React, { useState } from 'react'
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native'
import { Colors } from '../constants/colors'
import { FontAwesome } from '@expo/vector-icons';

export const AppDefaultInput = ({
    label,
    placeholder,
    labelStyle,
    value,
    onChangeText,
    inputStyles,
    style,
    ...props
}) => {
  return (
    <KeyboardAvoidingView
        style={{
            gap: 4,
            ...style
        }}
    >
        {label && <Text
            style={{
                fontSize: 14,
                color: Colors.labelColor,
                fontFamily: "Medium",
                ...labelStyle
            }}
        >{label}</Text>}
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            style={{
                backgroundColor: Colors.inputBg,
                borderWidth: 1,
                borderColor: Colors.inputBorder,
                paddingHorizontal: 16,
                paddingVertical: 10,
                fontSize: 14,
                fontFamily: "Medium",
                borderRadius: 8,
                ...inputStyles
            }}
            placeholderTextColor={Colors.placeholderColor}
            
            {...props}
        />
    </KeyboardAvoidingView>
  )
}