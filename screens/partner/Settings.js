import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/colors'
import AppHeader from '../../components/AppHeader'
import { Image, ScrollView, View, Text, TouchableOpacity, Switch } from 'react-native'
import person from "../../assets/images/person.png";
import { useRecoilState } from 'recoil'
import { AccessToken, PartnerAccessToken, UserData } from '../../recoil/UserData'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from "expo-location"
import AppButton from '../../components/AppButton'
import Header from '../../components/partners/Header'
import { useLogoutMutation } from '../../services/routes/authRoute'
import AppLoader from '../../components/AppLoader'
import { useToast } from 'react-native-toast-notifications'


const SettingsQuickLink = ({
    icon,
    text,
    onPress
}) => (
    <TouchableOpacity
        style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            paddingVertical: 10,
        }}
        onPress={onPress}
    >
        {icon}
        <Text
            style={{
                flex: 1,
                fontSize: 14,
                fontFamily: "Medium",
                color: "#7D7399",
                marginTop: 3,
            }}
        >
            {text}
        </Text>
        <Entypo name="chevron-small-right" size={24} color="#7D7399" />
    </TouchableOpacity>
)

const SettingsQuickToggle = ({
    icon,
    text,
    toggleSwitch,
    isEnabled
}) => (
    <View
        style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            paddingVertical: 10
        }}
    >
        {icon}
        <Text
            style={{
                flex: 1,
                fontSize: 14,
                fontFamily: "Medium",
                color: "#7D7399",
                marginTop: 3,
            }}
        >
            {text}
        </Text>
        <Switch
            trackColor={{false: '#767577', true: Colors.primary}}
            thumbColor={isEnabled ? Colors.white : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
        />
    </View>
)

const PartnersSettings = ({
    navigation
}) => {
    const [userData, _] = useRecoilState(UserData)
    const [token, setToken] = useRecoilState(PartnerAccessToken)
    const [notificationActive, setNotificationActive] = useState(false)
    const [locationActive, setLocationActive] = useState(false)
    const [logout, {isLoading}] = useLogoutMutation()
    const toast = useToast()
    // setToken("")
    const handleLogout = async () => {
    try {
      const logoutRes = await logout(token).unwrap()
      if (logoutRes.success) {
        setToken("")
        toast.show(logoutRes.message, {
          type: "success"
        })
      } else {
        toast.show(logoutRes.message, {
          type: "warning"
        })

      }
    } catch (error) {
        console.log(error)
      toast.show(error?.message || error?.data?.message || "Something went wrong", {
        type: "danger"
      })
    }
  }

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setLocationActive(false)
          }
    
          let location = await Location.getCurrentPositionAsync({});
          console.log(location)
          setLocationActive(true);
        })();
    }, []);

  return (
    <SafeAreaView
        style={{
            flex: 1,
            backgroundColor: Colors.white,
        }}
    >
        {isLoading && <AppLoader />}
        <Header
            navigation={navigation}
        />

        <View
            style={{
                flex: 1,
            }}
        >
            <ScrollView
                style={{
                }}
            >
                {/* Main wrapper */}
                <View
                    style={{
                        padding: 20,
                        gap: 20,
                    }}
                >
                    {/* Top Box */}
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 15,
                            alignItems: "center"
                        }}
                    >
                        <Image
                            source = {person}
                            style={{
                                width: 40,
                                height: 40
                            }}
                        />

                        <View>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontFamily: "Medium"
                                }}
                            >
                                {userData?.companyName}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontFamily: "Regular"
                                }}
                            >
                                {userData?.email}
                            </Text>
                        </View>
                    </View>

                    {/* Account Box */}

                    <View
                        style={{
                            gap: 10
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontFamily: "Bold"
                            }}
                        >
                            Acounts
                        </Text>

                        <View
                            style={{
                                elevation: 5,
                                paddingHorizontal: 15,
                                paddingVertical: 10,
                                borderRadius: 10,
                                backgroundColor: Colors.white,
                            }}
                        >
                            <SettingsQuickLink
                                icon={<FontAwesome6 name="circle-user" size={16} color="#7D7399" />}
                                text={"Personal Info"}
                                onPress={() => navigation.navigate("Profile")}
                            />
                            <SettingsQuickLink
                                icon={<SimpleLineIcons name="globe" size={16} color="#7D7399" />}
                                text={"Language"}
                                onPress={() => {}}
                            />
                            <SettingsQuickLink
                                icon={<FontAwesome6 name="person" size={20} color="#7D7399" />}
                                text={"Accessibility"}
                                onPress={() => {}}
                            />
                        </View>
                    </View>

                    {/*Privacy & Security */}

                    <View
                        style={{
                            gap: 10
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontFamily: "Bold"
                            }}
                        >
                            Privacy & Security
                        </Text>

                        <View
                            style={{
                                elevation: 5,
                                paddingHorizontal: 15,
                                paddingVertical: 10,
                                borderRadius: 10,
                                backgroundColor: Colors.white,
                            }}
                        >
                            <SettingsQuickLink
                                icon={<MaterialIcons name="security-update-warning" size={16} color="#7D7399" />}
                                text={"Manage information"}
                                onPress={() => {}}
                            />
                            <SettingsQuickLink
                                icon={<FontAwesome name="lock" size={20} color="#7D7399" />}
                                text={"Password"}
                                onPress={() => {}}
                            />
                            <SettingsQuickToggle
                                icon={<Ionicons name="notifications-outline" size={16}  color="#7D7399" />}
                                text={"Notification"}
                                isEnabled={notificationActive}
                                toggleSwitch={setNotificationActive}
                            />
                        </View>
                    </View>

                    {/* Permission Box */}

                    <View
                        style={{
                            gap: 10
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontFamily: "Bold"
                            }}
                        >
                            Permission
                        </Text>

                        <View
                            style={{
                                elevation: 5,
                                paddingHorizontal: 15,
                                paddingVertical: 10,
                                borderRadius: 10,
                                backgroundColor: Colors.white,
                            }}
                        >
                            <SettingsQuickToggle
                                icon={<FontAwesome6 name="location-dot" size={16} color="#7D7399" />}
                                text={"Location"}
                                isEnabled={locationActive}
                                toggleSwitch={setLocationActive}
                            />
                            <SettingsQuickLink
                                icon={<FontAwesome6 name="circle-user" size={16} color="#7D7399" />}
                                text={"Friend Suggestion"}
                                onPress={() => {}}
                            />
                            <SettingsQuickLink
                                icon={<FontAwesome6 name="circle-user" size={16} color="#7D7399" />}
                                text={"Help"}
                                onPress={() => {}}
                            />
                        </View>
                    </View>

                    <AppButton
                        btnText={"Logout"}
                        onPress={handleLogout}
                    />
                </View>
            </ScrollView>
        </View>
    </SafeAreaView>
  )
}

export default PartnersSettings