import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, View, Text, TouchableOpacity, Image, Switch } from 'react-native'
import { useRecoilState } from 'recoil'
import { AccessToken, UserData } from '../../recoil/UserData'
import { Colors } from '../../constants/colors'
import AppHeader from '../../components/AppHeader'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Entypo from '@expo/vector-icons/Entypo'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import person from "../../assets/images/person.png"
import * as Location from "expo-location"
import AppButton from '../../components/AppButton'
import BackArrow from '../../components/BackArrow'

const SettingsLink = ({ icon, text, onPress }) => (
  <TouchableOpacity
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderColor: '#E9E9EA',
    }}
    onPress={onPress}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      {icon}
      <Text style={{ fontSize: 15, color: '#4A4A4A', fontFamily: 'Medium' }}>{text}</Text>
    </View>
    <Entypo name="chevron-small-right" size={22} color="#7D7399" />
  </TouchableOpacity>
)

const SettingsToggle = ({ icon, text, isEnabled, toggleSwitch }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderColor: '#E9E9EA',
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      {icon}
      <Text style={{ fontSize: 15, color: '#4A4A4A', fontFamily: 'Medium' }}>{text}</Text>
    </View>
    <Switch
      trackColor={{ false: '#ccc', true: Colors.primary }}
      thumbColor={isEnabled ? Colors.white : '#f4f3f4'}
      onValueChange={toggleSwitch}
      value={isEnabled}
    />
  </View>
)

const Section = ({ title, children }) => (
  <View style={{ backgroundColor: '#F4F4F5', marginTop: 20 }}>
    <Text
      style={{
        fontSize: 15,
        fontFamily: 'Bold',
        color: '#555',
        paddingVertical: 10,
        paddingHorizontal: 20,
      }}
    >
      {title}
    </Text>
    <View style={{ paddingHorizontal: 20, backgroundColor: Colors.white }}>
      {children}
    </View>
  </View>
)

const Settings = ({ navigation }) => {
  const [userData] = useRecoilState(UserData)
  const [token, setToken] = useRecoilState(AccessToken)
  const [notificationActive, setNotificationActive] = useState(false)
  const [locationActive, setLocationActive] = useState(false)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setLocationActive(false)
        return
      }
      await Location.getCurrentPositionAsync({})
      setLocationActive(true)
    })()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <AppHeader navigation={navigation} />
       <BackArrow onPress={() => navigation.goBack()} />

      <ScrollView style={{ flex: 1 }}>
        {/* Profile at the top-left */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 20,
            paddingTop: 15,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderColor: '#EAEAEA',
          }}
        >
          <Image
            source={userData?.profilePicture ? { uri: userData?.profilePicture?.downloadUrl } : person}
            style={{ width: 45, height: 45, borderRadius: 22 }}
          />
          <View>
            <Text style={{ fontSize: 15, fontFamily: 'Bold' }}>
              {userData?.firstName + ' ' + userData?.lastName}
            </Text>
            <Text style={{ fontSize: 13, color: '#666', fontFamily: 'Regular' }}>
              {userData?.email}
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.primary,
                  fontFamily: 'Medium',
                  marginTop: 2,
                }}
              >
                View Tier
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sections */}
        <Section title="Account">
          <SettingsLink
            icon={<FontAwesome6 name="circle-user" size={18} color="#7D7399" />}
            text="Profile"
            onPress={() => navigation.navigate("EditProfile", { data: userData })}
          />
          <SettingsLink icon={<SimpleLineIcons name="settings" size={18} color="#7D7399" />} text="Settings"   onPress={() => navigation.navigate("PinScreen")}/>
          <SettingsLink icon={<MaterialIcons name="history" size={18} color="#7D7399" />} text="Activity"     onPress={() => navigation.navigate("Cards")} />
          <SettingsLink icon={<Ionicons name="people-outline" size={18} color="#685f80ff" />} text="Referrals" />
          <SettingsLink icon={<FontAwesome name="heart-o" size={18} color="#7D7399" />} text="Favourites" />
          <SettingsLink icon={<FontAwesome6 name="wallet" size={18} color="#7D7399" />} text="Wallet" />
          <SettingsLink icon={<FontAwesome6 name="location-dot" size={18} color="#7D7399" />} text="Location" />
        </Section>

        <Section title="Help & Support">
          <SettingsLink icon={<Ionicons name="help-circle-outline" size={18} color="#7D7399" />} text="FAQ" />
          <SettingsLink icon={<Ionicons name="chatbubbles-outline" size={18} color="#7D7399" />} text="Chat" />
          <SettingsLink icon={<MaterialIcons name="support-agent" size={18} color="#7D7399" />} text="Contact us" />
        </Section>

        <Section title="Our Policies">
          <SettingsLink icon={<MaterialIcons name="policy" size={18} color="#7D7399" />} text="Accessibility" />
          <SettingsLink icon={<SimpleLineIcons name="docs" size={18} color="#7D7399" />} text="Terms & Conditions" />
          <SettingsLink icon={<Ionicons name="lock-closed-outline" size={18} color="#7D7399" />} text="Privacy" />
          <SettingsLink icon={<MaterialIcons name="security" size={18} color="#7D7399" />} text="Security" />
        </Section>

        <View style={{ padding: 20 }}>
          <AppButton btnText="Logout" onPress={() => setToken("")} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Settings
