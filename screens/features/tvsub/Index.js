import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../../constants/colors'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import AppLogo from "../../../assets/svg/applogo.svg";
import DSTVLogo from "../../../assets/images/dstv-logo.svg";
import GOTVLogo from "../../../assets/images/gotv-logo.svg";
import StartimesLogo from "../../../assets/images/startimes-logo.svg";
import { useGetTvPlansQuery } from '../../../services/routes/vtuRoutes';
import { useRecoilState } from 'recoil';
import { AccessToken } from '../../../recoil/UserData';
import AppLoader from '../../../components/AppLoader';

const TvSub = ({
    navigation
}) => {
    const [token, _] = useRecoilState(AccessToken)
    const {
        data,
        isLoading,
        isError
    } = useGetTvPlansQuery(token)

    // console.log(data?.dataPlans)

    const subPlans = data?.dataPlans?.docs || []
    const availableTv = [...new Set(subPlans.map(item => item.Cable))] || [];
  return (
    <SafeAreaView
        style={{
            flex: 1,
            backgroundColor: Colors.white,
        }}
    >
        {isLoading && <AppLoader />}
        <View
            style={{
                padding: 20,
            }}
        >
            <AppLogo width={140} />
        </View>

        <View
            style={{
                flex: 1
            }}
        >
            <ScrollView>
                <View
                    style={{
                        gap: 16
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontFamily: "Medium",
                            textAlign: 'center'
                        }}
                    >Easily Subcribe on Your cable/TV</Text>

                    <View
                        style={{
                            gap: 16,
                            paddingHorizontal: 20
                        }}
                    >
                        {
                            availableTv.map((item, i) => (
                                <TouchableOpacity
                                    style={{
                                        borderColor: Colors.inputBorder,
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        alignItems: 'center',
                                        paddingVertical: 10,
                                        height: 200,
                                        justifyContent: 'center',
                                    }}
                                    key={i}
                                    onPress={() => {
                                        if (item == "DSTV") {
                                            navigation.navigate("SubscriptionMain", {
                                                provider: item,
                                                logo: DSTVLogo,
                                                data: subPlans.filter(item => item.Cable == "DSTV")
                                            })
                                        }
                                        if (item == "GOTV") {
                                            navigation.navigate("SubscriptionMain", {
                                                provider: item,
                                                logo: GOTVLogo,
                                                data: subPlans.filter(item => item.Cable == "GOTV")
                                            })
                                        }
                                        if (item == "STARTIME") {
                                            navigation.navigate("SubscriptionMain", {
                                                provider: item,
                                                logo: StartimesLogo,
                                                data: subPlans.filter(item => item.Cable == "STARTIME")
                                            })
                                        }
                                    }}
                                >
                                    {item == "DSTV" && <DSTVLogo />}
                                    {item == "GOTV" && <GOTVLogo />}
                                    {item == "STARTIME" && <StartimesLogo />}

                                    <Text
                                        style={{
                                            fontFamily: "Medium",
                                            fontSize: 18,
                                            textAlign: "center",
                                            color: Colors.primary
                                        }}
                                    >
                                        Buy Subscription
                                    </Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
            </ScrollView>
        </View>

    </SafeAreaView>
  )
}

export default TvSub