import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/colors'
import AppHeader from '../../components/AppHeader'
import { Image, ScrollView, View, Text, TouchableOpacity, Switch } from 'react-native'
import person from "../../assets/images/person.png";
import { useRecoilState } from 'recoil'
import { AccessToken, UserData } from '../../recoil/UserData'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from "expo-location"
import AppButton from '../../components/AppButton'


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

const Settings = ({
    navigation
}) => {
    const [userData, _] = useRecoilState(UserData)
    const [token, setToken] = useRecoilState(AccessToken)
    const [notificationActive, setNotificationActive] = useState(false)
    const [locationActive, setLocationActive] = useState(false)

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
        <AppHeader
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
                            source = {userData?.profilePicture ? {uri: userData?.profilePicture?.downloadUrl} :person}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20
                            }}
                        />

                        <View>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontFamily: "Medium"
                                }}
                            >
                                {userData?.firstName + " " + userData?.lastName}
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
                                onPress={() => navigation.navigate("User")}
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
                        onPress={() => setToken("")}
                    />
                </View>
            </ScrollView>
        </View>
    </SafeAreaView>
  )
}

export default Settings