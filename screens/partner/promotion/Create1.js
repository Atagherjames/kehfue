import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../../constants/colors'
import AppHeader from '../../../components/AppHeader'
import Header from '../../../components/partners/Header'
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from "expo-image-picker";
import AppButton from '../../../components/AppButton'

const Create1 = ({
    navigation
}) => {
    const [selectedImage, setSelectedImage] = useState(null)
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            });

            if (!result.canceled) {
            setSelectedImage(result.assets[0])
            }
        } catch (err) {
            console.log(err.message)
        }
    };

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
                        <Text
                            style={{
                                fontSize: 18,
                                color: Colors.black,
                                fontFamily: "Medium",
                                textAlign: 'center',
                                flex: 1
                            }}
                        >
                            Step 1 of 5
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
                        Upload Image
                    </Text>

                    <TouchableOpacity
                        onPress={pickImage}
                        style={{
                            padding: 20,
                            alignItems: 'center',
                            justifyContent: 'center',borderRadius: 10,
                            borderWidth: 1,
                            height: 200
                        }}
                    >
                        {selectedImage ? <Image
                            source={{uri: selectedImage?.uri}}
                            style={{
                                width:"100%",
                                height: "100%"
                            }}
                        />: <Text
                            style={{
                                fontFamily: "Bold",
                                fontSize: 18,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 10,
                                borderWidth: 1
                            }}
                        >
                            Choose Image
                        </Text>}
                    </TouchableOpacity>

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
                            onPress={() => navigation.navigate("CreatePromotion2", {
                                image: selectedImage
                            })}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    </SafeAreaView>
  )
}

export default Create1