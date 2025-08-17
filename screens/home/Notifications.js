import React, { useCallback } from 'react'
import { FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppHeader from '../../components/AppHeader'
import { Colors } from '../../constants/colors'
import { useGetNotificationsQuery } from '../../services/routes/userRoutes'
import { useRecoilState } from 'recoil'
import { AccessToken } from '../../recoil/UserData'
import AppLoader from '../../components/AppLoader'
import { convertTime } from '../../utils/Utilities'
import { useFocusEffect } from "@react-navigation/native";

const Notifications = ({
    navigation
}) => {
    const [token, _] = useRecoilState(AccessToken)
    const {
        data,
        isLoading,
        refetch
    } = useGetNotificationsQuery(token)
    const notificationData = data?.cart?.data || []

    const reloadData = useCallback(() => {
        refetch()
    }, [])

    useFocusEffect(() => {
       reloadData()
    })

  return (
    <SafeAreaView
        style={{
            flex: 1,
            backgroundColor: Colors.white,
        }}
    >
        {isLoading && <AppLoader />}
        <AppHeader
            navigation={navigation}
        />
        <Text
            style={{
                fontFamily: "Bold",
                fontSize: 18,
                textAlign: "center",
                paddingVertical: 10
            }}
        >
            Notifications
        </Text>
        
        <View
            style={{
                flex: 1,
                paddingHorizontal: 20
            }}
        >

           {notificationData.length > 0 ? <FlatList
                data={notificationData}
                renderItem={({item}) => (
                    <View
                        style={{
                            marginBottom: 12,
                            borderRadius: 12,
                            backgroundColor: Colors.white,
                            borderWidth: 1,
                            gap: 5,
                            paddingVertical: 10,
                            paddingHorizontal: 10
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                fontFamily: "Medium",
                                color: Colors.primary
                            }}
                        >{item?.title}</Text>
                        <Text
                            style={{
                                fontSize: 12,
                                fontFamily: "Regular",
                                color: Colors.black
                            }}
                        >{item?.body}</Text>
                        <Text
                            style={{
                                fontSize: 12,
                                fontFamily: "Regular",
                                color: Colors.primary,
                                textAlign: "right"
                            }}
                        >{convertTime(item?.createdAt)}</Text>
                    </View>
                )}
            /> : <Text
                style={{
                    fontSize: 14,
                    fontFamily: "Medium",
                    color: Colors.primary,
                    textAlign: 'center'
                }}
            >No notifications available!!!</Text>}
        </View>
    </SafeAreaView>
  )
}

export default Notifications