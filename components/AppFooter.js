import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import FooterLogo from "../assets/svg/footer-logo.svg";
import { Colors } from '../constants/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const AppFooter = () => {
    const quickLinks = [
        {
            text: "Accessibilty",
            onPress: () => {}
        },
        {
            text: "Help",
            onPress: () => {}
        },
        {
            text: "Legal",
            onPress: () => {}
        },
        {
            text: "Offers",
            onPress: () => {}
        },
        {
            text: "Reward Activity",
            onPress: () => {}
        },
    ]

    const company = [
        {
            text: "About Us",
            onPress: () => {}
        },
        {
            text: "Privacy & Security",
            onPress: () => {}
        },
        {
            text: "Terms and Conditions",
            onPress: () => {}
        },
        {
            text: "Business Opportunities",
            onPress: () => {}
        },
    ]

    const contact = [
        {
            icon: <FontAwesome5 name="twitter" size={20} color={Colors.footerGrey} />,
            text: "Twitter",
            onPress: () => {}
        },
        {
            icon: <FontAwesome5 name="instagram" size={20} color={Colors.footerGrey} />,
            text: "Instagram",
            onPress: () => {}
        },
        {
            icon: <AntDesign name="linkedin-square" size={20} color={Colors.footerGrey} />,
            text: "LinkedIn",
            onPress: () => {}
        },
        {
            icon: <AntDesign name="facebook-square" size={20} color={Colors.footerGrey} />,
            text: "Facebook",
            onPress: () => {}
        },
    ]


  return (
    <View
        style={{
            padding: 20,
            backgroundColor: Colors.primary,
            gap: 30
        }}
    >
        <FooterLogo width= {150} />

        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 50,
                paddingHorizontal: 20
            }}
        >
            <View>
                <Text
                    style={{
                        color: Colors.white,
                        fontSize: 16,
                        fontFamily:"SemiBold",
                        marginBottom: 10
                    }}
                >
                    Quick Links
                </Text>
                {
                    quickLinks.map((item, i) => (
                        <Text
                            style={{
                                color: Colors.footerGrey,
                                paddingVertical: 8,
                                fontSize: 14,
                            }}
                            key={i}
                        >
                            {item.text}
                        </Text>
                    ))
                }
            </View>

            <View>
                <Text
                    style={{
                        color: Colors.white,
                        fontSize: 16,
                        fontFamily:"SemiBold",
                        marginBottom: 10
                    }}
                >
                    Company
                </Text>
                {
                    company.map((item, i) => (
                        <Text
                            style={{
                                color: Colors.footerGrey,
                                paddingVertical: 8,
                                fontSize: 14,
                            }}
                            key={i}
                        >
                            {item.text}
                        </Text>
                    ))
                }
            </View>

            <View>
                <Text
                    style={{
                        color: Colors.white,
                        fontSize: 16,
                        fontFamily:"SemiBold",
                        marginBottom: 10
                    }}
                >
                    Contact
                </Text>
                {
                    contact.map((item, i) => (
                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                                paddingVertical: 8
                            }}
                            key={i}
                        >
                            {item.icon}
                            <Text
                                style={{
                                    color: Colors.footerGrey,
                                    fontSize: 14,
                                }}
                            >
                                {item.text}
                            </Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>

        <Text
            style={{
                fontFamily: "Medium",
                textAlign: "center",
                marginVertical: 10,
                color: Colors.white,
            }}
        >KHEFUE. 2024 All Rights Reserved</Text>
    </View>
  )
}

export default AppFooter