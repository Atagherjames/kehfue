import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/colors'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Header from '../../components/partners/Header'

const Menu = ({
    navigation
}) => {

    const tabs = [
        {
            name: "Campaign",
            onPress: () => navigation.navigate("Campaign")
        },
        {
            name: "Customer Segmentation",
            onPress: () => navigation.navigate("")
        },
        {
            name: "Members",
            onPress: () => navigation.navigate("MembersPage")
        },
    ]
  return (
    <SafeAreaView
        style={{
            flex: 1,
            backgroundColor: Colors.white,
        }}
    >
        <Header
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