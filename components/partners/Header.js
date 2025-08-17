import React, { useState } from 'react'
import { Dimensions, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native'
import AppLogo from "../../assets/svg/applogo.svg";
import { Colors } from '../../constants/colors';
import { FontAwesome } from '@expo/vector-icons';
import { useRecoilState } from 'recoil';
import person from "../../assets/images/person.png";
import AntDesign from '@expo/vector-icons/AntDesign';
import { PartnerAccessToken } from '../../recoil/UserData';

const Header = ({
    navigation,
    showMenu = true,
    showBackIcon
}) => {
    const [openMenu, setOpenMenu] = useState(false)
    const [accessToken, setAccessToken] = useRecoilState(PartnerAccessToken)
    
  return (
    <View
        style={{
            height: 70,
            width: Dimensions.get("window").width,
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
            {showBackIcon &&
                <TouchableOpacity
                    onPress={() => navigation.pop()}
                >
                    <FontAwesome name="close" size={30} color={Colors.primary} />
                </TouchableOpacity>
            }

            {
                (!showBackIcon && accessToken) && 
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: 'center',
                            gap: 10
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.navigate("PartnerProfile")}
                        >
                            <Image
                                source={person}
                                style={{
                                    width: 35,
                                    height: 35
                                }}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    </View>
            }
        </View>
    </View>
  )
}

export default Header