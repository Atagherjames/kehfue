import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/colors'
import AppHeader from '../../components/AppHeader'
import BackButton from '../../components/BackButton'
import { Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
import { useRecoilState } from 'recoil'
import Location from '../../recoil/Location'

const TravelHome = ({
    navigation
}) => {
    const [location, _] = useRecoilState(Location)
    const [mapRegion, setMapRegion] = useState({
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
    })

    const openMap = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${location?.coords?.latitude},${location?.coords?.longitude}`;
        Linking.openURL(url);
    };

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
            <KeyboardAwareScrollView>
                <View
                    style={{
                        padding: 20,
                        gap: 16
                    }}
                >
                    <BackButton
                        navigation={navigation}
                    />

                    <Text
                        style={{
                            fontSize: 24,
                            textAlign: 'center',
                            color: Colors.labelColor,
                            fontFamily: "Bold"
                        }}
                    >
                        Search for cheap airline tickets
                    </Text>

                    <View
                        style={{
                            elevation: 3,
                            backgroundColor: Colors.white,
                            padding: 5,
                            gap: 5,
                            borderRadius: 5
                        }}
                    >
                        <TouchableOpacity
                            style={{
                              padding: 5  
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Medium",
                                    color: Colors.textGrey
                                }}
                            >To</Text>
                        </TouchableOpacity>
                        <View
                            style={{
                                height: 1,
                                backgroundColor: Colors.textGrey,
                            }}
                        />
                        <TouchableOpacity
                            style={{
                              padding: 5  
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Medium",
                                    color: Colors.textGrey
                                }}
                            >From</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Filter Buttons */}

                    <View
                        style={{
                            flexDirection: "row",
                            gap: 20,
                            flexWrap: 'wrap'
                        }}
                    >
                        <TouchableOpacity
                            style={styles.filterBtn}
                            onPress={() => navigation.navigate("SelectDate")}
                        >
                            <FontAwesome5 name="calendar" size={20} color={Colors.white} />
                            <Text
                                style={{
                                    color: Colors.textGrey
                                }}
                            >
                                Choose Date
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.filterBtn}
                        >
                            <FontAwesome name="user" size={20} color={Colors.white} />
                            <Text
                                style={{
                                    color: Colors.textGrey
                                }}
                            >
                                0
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.filterBtn}
                        >
                            <Text
                                style={{
                                    color: Colors.white
                                }}
                            >
                                Filter
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            gap: 10
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: Colors.labelColor,
                                    fontFamily: "Bold"
                                }}
                            >Your Current Loction</Text>

                            <Text
                                style={{
                                    fontFamily: "Medium",
                                    color: Colors.lightPurple
                                }}
                                onPress={openMap}
                            >
                                Open
                            </Text>
                        </View>

                        {/* location?.coords ? <MapView 
                            style={styles.map}
                            region={mapRegion}
                            onLongPress={(e) => console.log(e.nativeEvent)}
                        >
                            <Marker
                                coordinate={mapRegion}
                                title='Your current location'
                            />
                        </MapView> : <MapView style={styles.map}/> */}

                    </View>

                </View>
            </KeyboardAwareScrollView>

        </View>

    </SafeAreaView>
  )
}

export default TravelHome

const styles = StyleSheet.create({
    filterBtn: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        borderRadius: 5
    },
    map: {
        width: '100%',
        height: 300,
    },
})