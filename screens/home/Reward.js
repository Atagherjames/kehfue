import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/colors'
import AppHeader from '../../components/AppHeader'
import { useNavigation } from '@react-navigation/native'
import SP from "../../assets/images/sp.svg";
import PayBills from "../../assets/images/pay-bills.svg";
import Subscription from "../../assets/images/subscription.svg";
import Travel from "../../assets/images/travel.svg";
import Merchandise from "../../assets/images/merchandise.svg";
import { TouchableOpacity, View, Text, ScrollView, Image } from 'react-native'
import { TopUpModal } from '../../components/RewardModals'

const Reward = () => {
    const navigation = useNavigation()
    const [showTopupmodal, setShowTopupModal] = useState(false)
    const data = [
        {
            image: <SP width = {"100%"}/>,
            text: "Airtime/Data Top up",
            onPress: () => setShowTopupModal(true)
        },
        {
            image: <PayBills width = {"100%"}/>,
            text: "Pay Bills",
            onPress: () => navigation.navigate("Electricity")
        },
        {
            image: <Subscription width = {"100%"}/>,
            text: "Subscription",
            onPress: () => navigation.navigate("TvSub")
        },
        {
            image: <Travel width = {"100%"}/>,
            text: "Travel",
            onPress: () => navigation.navigate("TravelHome")
        },
        {
            image: <Merchandise width = {"100%"}/>,
            text: "Merchandise",
            onPress: () => navigation.navigate("Merchandise")
        },
    ]

    const iconData = [
        {
            icon: require("../../assets/icons/bills-icon.png"),
            text: "Pay Bills",
            onPress: () =>  navigation.navigate("BillPayment")
        },
        {
            icon: require("../../assets/icons/giftcard-icon.png"),
            text: "Gift Card",
            onPress: () =>  navigation.navigate("GiftCardStack")
        },
        {
            icon: require("../../assets/icons/travel-icon.png"),
            text: "Travel",
            onPress: () =>  navigation.navigate("ComingSoon")
        },
        {
            icon: require("../../assets/icons/merchandise-icon.png"),
            text: "Merchandise",
            onPress: () =>  navigation.navigate("Merchandise")
        },
        {
            icon: require("../../assets/icons/experience-icon.png"),
            text: "Experience",
            onPress: () =>  navigation.navigate("ComingSoon")
        },
        {
            icon: require("../../assets/icons/movie-icon.png"),
            text: "Movie",
            onPress: () =>  navigation.navigate("ComingSoon")
        },
        {
            icon: require("../../assets/icons/dining-icon.png"),
            text: "Dining",
            onPress: () =>  navigation.navigate("ComingSoon")
        },
        {
            icon: require("../../assets/icons/health-icon.png"),
            text: "Health",
            onPress: () =>  navigation.navigate("ComingSoon")
        },
        {
            icon: require("../../assets/icons/services-icon.png"),
            text: "Services",
            onPress: () =>  navigation.navigate("ComingSoon")
        },
        {
            icon: require("../../assets/icons/partners-icon.png"),
            text: "Partners",
            onPress: () =>  navigation.navigate("ComingSoon")
        },
        {
            icon: require("../../assets/icons/donations-icon.png"),
            text: "Donations",
            onPress: () =>  navigation.navigate("ComingSoon")
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
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        paddingHorizontal: 20,
                        marginVertical: 20,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: 'space-between',
                        rowGap: 20
                    }}
                >
                    
                  {
                        iconData.map((item, i) => (
                            <TouchableOpacity key={i}
                                style={{
                                    gap: 5,
                                    alignItems: 'center',
                                    width: "22%"
                                }}
                                onPress={item.onPress}
                            >
                                <Image
                                    source={item.icon}
                                    style={{width: 50, height: 50}}
                                    resizeMode='contain'
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontFamily: "Regular",
                                        textAlign: "center",
                                        color: "#080B30"
                                    }}
                                >{item.text}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </ScrollView>
        </View>
        <TopUpModal
            visible={showTopupmodal}
            setVisible={setShowTopupModal}
            navigation={navigation}
        />  
    </SafeAreaView>
  )
}

export default Reward