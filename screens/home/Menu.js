import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/colors'
import AppHeader from '../../components/AppHeader'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

const Menu = ({
    navigation
}) => {

    const tabs = [
        {
            name: "Offers",
            onPress: () => navigation.navigate("LoadOffer")
        },
        {
            name: "Rewards",
            onPress: () => navigation.navigate("Rewards")
        },
        {
            name: "Experience",
            onPress: () => navigation.navigate("Rewards")
        },
        {
            name: "Redeem",
            onPress: () => navigation.navigate("Merchandise")
        },
        {
            name: "Travel",
            onPress: () => navigation.navigate("TravelHome")
        },
    ]
  return (
    <SafeAreaView
        style={{
            flex: 1,
            backgroundColor: Colors.white,
        }}
    >
        <AppHeader
            navigation={navigation}
        />

        <View
            style={{
                flex: 1
            }}
        >
            <ScrollView>
                <View
                    style={{
                        padding: 20,
                        gap: 20
                    }}
                >
                    {
                        tabs.map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={item.onPress}
                                style={{
                                    paddingVertical: 20,
                                    backgroundColor: Colors.menuItemBg,
                                    paddingHorizontal: 10
                                }}
                            >
                                <Text
                                    style={{
                                        color: Colors.primary,
                                        fontFamily: "Medium",
                                        fontSize: 16
                                    }}
                                >{item.name}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </ScrollView>

        </View>
    </SafeAreaView>
  )
}

export default Menu