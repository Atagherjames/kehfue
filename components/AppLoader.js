import React from 'react'
import { ActivityIndicator, Dimensions, View } from 'react-native'
import { Colors } from '../constants/colors'

const AppLoader = () => {
  return (
    <View
        style={{
            height: "100%",
            width: Dimensions.get("window").width,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            position: 'absolute',
            top: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10
        }}
    >
        <ActivityIndicator
            color={Colors.primary}
            size="large"
        />
    </View>
  )
}

export default AppLoader