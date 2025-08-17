import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../../constants/colors'
import AppHeader from '../../../components/AppHeader'
import Header from '../../../components/partners/Header'
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from "expo-image-picker";
import AppButton from '../../../components/AppButton'
import { AppDefaultInput } from '../../../components/AppInput'
import DefaultDropdown from '../../../components/DefaultDropdown'

const CreatePromotion2 = ({
    navigation,
    route
}) => {
    const {image} = route?.params
    const [showTypeModal, setShowTypeModal] = useState(false)
    const [title, setTitle] = useState("")
    const [details, setDetails] = useState("")
    const [selectedType, setSelectedType] = useState("")
    const promotionTypes = ["Reward", "Offer"]

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
                    <Text
                        style={{
                            fontSize: 24,
                            color: Colors.labelColor,
                            fontFamily: "Bold"
                        }}
                    >
                        Create New Promotion
                    </Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <AntDesign name="left" size={18} color={Colors.labelColor} />
                        <Text
                            style={{
                                fontSize: 18,
                                color: Colors.black,
                                fontFamily: "Medium",
                                textAlign: 'center',
                                flex: 1
                            }}
                        >
                            Step 2 of 5
                        </Text>
                        <AntDesign name="right" size={18} color={Colors.labelColor} />
                    </View>

                    <Text
                        style={{
                            fontSize: 18,
                            color: Colors.black,
                            fontFamily: "Medium",
                        }}
                    >
                        Promotion Info
                    </Text>

                    <View
                        style={{
                            gap: 20
                        }}
                    >
                        <AppDefaultInput
                            label={"Promotion Title"}
                            placeholder={"Enter title"}
                            onChangeText={setTitle}
                        />
                        <AppDefaultInput
                            label={"Promotion Details"}
                            placeholder={"Enter details"}
                            onChangeText={setDetails}
                            multiLine
                            inputStyles={{
                                maxHeight: 150
                            }}
                        />
                        <DefaultDropdown
                            data={promotionTypes}
                            label={"Promotion type"}
                            showModal={showTypeModal}
                            setShowModal={setShowTypeModal}
                            placeholder={"Select Type"}
                            value={selectedType}
                            setValue={setSelectedType}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 20,
                            justifyContent: 'space-between'
                        }}
                    >
                        <AppButton
                            btnText={"Back"}
                            btnStyles={{
                                backgroundColor: Colors.white,
                                borderColor: Colors.primary,
                                borderWidth: 1
                            }}
                            btnTextStyles={{
                                color: Colors.primary
                            }}
                            onPress={() => navigation.pop()}
                        />
                        <AppButton
                            btnText={"Continue"}
                            onPress={() => navigation.navigate("CreatePromotion3", {
                                image,
                                title,
                                details,
                                type: selectedType
                            })}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    </SafeAreaView>
  )
}

export default CreatePromotion2