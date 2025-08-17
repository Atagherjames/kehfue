import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AppHeader from "../../../components/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Entypo from "@expo/vector-icons/Entypo";
import AppButton from "../../../components/AppButton";
import { AppDefaultInput } from "../../../components/AppInput";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";

const RenderDropdown = ({ item, value }) => {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 0.5,
          marginBottom: 10,
          paddingVertical: 5,
        }}
      >
        <Text style={{ fontSize: 16, fontFamily: "Medium" }}>{item}</Text>
        {!open ? (
          <Entypo name="chevron-small-down" size={24} color="black" />
        ) : (
          <Entypo name="chevron-small-up" size={24} color="black" />
        )}
      </TouchableOpacity>
      {open && (
        <Text
          style={{
            fontFamily: "Medium",
            fontSize: 14,
            color: Colors.labelColor,
          }}
        >
          {value}
        </Text>
      )}
    </View>
  );
};

const GiftCardDetails = ({ route }) => {
  const navigation = useNavigation();
  const { data } = route?.params;
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [eventName, setEventName] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
        setActiveImage(-1);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <AppHeader navigation={navigation} />

      <KeyboardAwareScrollView>
        <View style={{ paddingHorizontal: 20 }}>
          <Image
            source={require("../../../assets/images/giftcard-header1.png")}
            style={{ width: "100%", height: 100 }}
            resizeMode="contain"
          />
        </View>

        <View style={{ paddingHorizontal: 20, gap: 16, paddingBottom: 20 }}>
          <Image
            source={{ uri: data?.imageUrl }}
            style={{ width: "100%", height: 200, borderRadius: 20 }}
            resizeMode="cover"
          />
          <Text
            style={{
              fontSize: 18,
              color: Colors.black,
              fontFamily: "Medium",
            }}
          >
            {data?.name}
          </Text>

          <RenderDropdown
            item={"Description"}
            value={data?.description || "No description available"}
          />

          <RenderDropdown
            item={"Redemption Details"}
            value={
              Array.isArray(data?.redemptionDetails) &&
              data.redemptionDetails.length > 0
                ? data.redemptionDetails
                    .map((item) => `• ${item.Detail}`)
                    .join("\n\n")
                : "No redemption details available"
            }
          />

          <RenderDropdown
            item={"Redemption Location"}
            value={
              Array.isArray(data?.StoreLocations) &&
              data.StoreLocations.length > 0
                ? data.StoreLocations.map(
                    (item, i) => `• ${item.Location}`
                  ).join("\n\n")
                : "No physical store available"
            }
          />

          <AppDefaultInput
            label={"Enter events name"}
            placeholder={"Happy birthday"}
            onChangeText={setEventName}
          />

          <View>
            <Image
              source={{
                uri:
                  activeImage >= 0
                    ? data?.StorePictures?.[activeImage]?.Picture
                    : selectedImage?.uri,
              }}
              style={{ width: "100%", height: 200, borderRadius: 20 }}
            />
          </View>

          <View style={{ gap: 10 }}>
            <Text style={{ fontFamily: "Medium", color: Colors.labelColor }}>
              Pick or upload custom image
            </Text>
            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                gap: 16,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {Array.isArray(data?.StorePictures) &&
                data.StorePictures.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      setActiveImage(i);
                      setSelectedImage(null);
                    }}
                  >
                    <Image
                      source={{ uri: item.Picture }}
                      style={{ width: 150, height: 80, borderRadius: 10 }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}

              <TouchableOpacity
                onPress={pickImage}
                style={{
                  backgroundColor: "#F8F8F8",
                  width: 150,
                  height: 80,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="upload-cloud" size={40} color="#8A9099" />
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={{ gap: 10 }}>
            <AppDefaultInput
              label={"Amount"}
              keyboardType="numeric"
              placeholder={"200,000"}
              onChangeText={setAmount}
            />
            <Text style={{ fontFamily: "Medium", color: Colors.black }}>
              Minimum Price: ₦{data?.MinimumPrice}
            </Text>
          </View>

          <AppDefaultInput
            label={"Quantity:"}
            keyboardType="numeric"
            placeholder={"0"}
            onChangeText={setQuantity}
          />

          <AppButton
            btnText={"Continue"}
            disabled={amount < data?.MinimumPrice || quantity < 1 || !eventName}
            onPress={() =>
              navigation.navigate("GiftCardDelivery", {
                data,
                amount,
                quantity,
                eventName,
                imageUri:
                  activeImage >= 0
                    ? data?.StorePictures?.[activeImage]?.Picture
                    : selectedImage?.uri,
              })
            }
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default GiftCardDetails;
