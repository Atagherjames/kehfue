import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../components/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../../constants/colors";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Clipboard from "expo-clipboard";
import { useToast } from "react-native-toast-notifications";

const ViewGiftCard = ({ route }) => {
  const navigation = useNavigation();
  const { data } = route.params;
  const imgUrl = JSON.parse(data.imgUrl);
  const toast = useToast();
  const handleCopyVoucher = async (item) => {
    await Clipboard.setStringAsync(`Code: ${item.Code}
Pin: ${item.Pin}
Amount: ${data.amount}
Expiry Date: ${new Date(item.ExpiryDate).toDateString()}
        `);
        toast.show("Voucher copied successfully", {type: "success"})
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      <AppHeader navigation={navigation} />

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          gap: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "Bold",
            color: Colors.labelColor,
            textAlign: "center",
            fontSize: 20,
          }}
        >
          Gift Card Details
        </Text>
        <Image
          source={{ uri: imgUrl.downloadUrl }}
          style={{ width: "100%", height: 200, borderRadius: 20 }}
          resizeMode="cover"
        />
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: data?.merchantPicture }}
            style={{ width: 40, height: 40, borderRadius: 25 }}
          />
          <Text style={{ fontFamily: "Medium", fontSize: 16, flex: 1 }}>
            {data.merchantName}
          </Text>
        </View>

        <View>
          <Text style={{ fontFamily: "Medium", fontSize: 16, flex: 1 }}>
            Voucher details
          </Text>
          <View style={{ gap: 20 }}>
            {data?.Voucher.map((item, i) => (
              <View
                style={{
                  padding: 10,
                  backgroundColor: Colors.lightGrey,
                  borderRadius: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={{ fontFamily: "Medium" }}>
                    Code: {item?.Code}
                  </Text>
                  <Text style={{ fontFamily: "Medium" }}>Pin: {item?.Pin}</Text>
                  <Text style={{ fontFamily: "Medium" }}>
                    Amount: ₦{data?.amount}
                  </Text>
                  <Text style={{ fontFamily: "Regular", fontSize: 12 }}>
                    Expiry Date: {new Date(item?.ExpiryDate).toDateString()}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleCopyVoucher(item)}>
                  <FontAwesome6 name="copy" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewGiftCard;
