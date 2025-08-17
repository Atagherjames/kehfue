import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../components/AppHeader";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../../../components/BackButton";
import { useGetMyGiftCardsQuery } from "../../../services/routes/giftcardRoute";
import { useRecoilState } from "recoil";
import { AccessToken } from "../../../recoil/UserData";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "../../../constants/colors";
import AppButton from "../../../components/AppButton";

const MyGiftCards = () => {
  const navigation = useNavigation();
  const [token, _] = useRecoilState(AccessToken);
  const { data, isLoading, isError } = useGetMyGiftCardsQuery(token);
  const giftCardData = data?.giftCards?.data || [];
  // console.log(giftCardData)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <AppHeader navigation={navigation} />
      <View
        style={{
          padding: 10,
          marginBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BackButton navigation={navigation} />
        <AppButton
          btnText={"View all giftcards"}
          btnTextStyles={{
            fontSize: 12,
          }}
          onPress={() => navigation.navigate("GiftCard")}
        />
      </View>
      {isLoading && (
        <ActivityIndicator
          color={Colors.primary}
          style={{ alignSelf: "center" }}
        />
      )}

      <FlatList
        data={giftCardData}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 20 }}
        renderItem={({ item, i }) => {
          const imgUrl = JSON.parse(item.imgUrl);
          return (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 16,
                alignItems: "center",
                backgroundColor: Colors.lightGrey,
                padding: 10,
                borderRadius: 10,
              }}
              onPress={() =>
                navigation.navigate("ViewGiftCard", { data: item })
              }
            >
              <Image
                source={{ uri: imgUrl.downloadUrl }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
                resizeMode="cover"
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Medium",
                    fontSize: 18,
                  }}
                >
                  {item.eventName}
                </Text>
                <Text
                  style={{
                    fontFamily: "Medium",
                    fontSize: 14,
                    color: Colors.textGrey,
                  }}
                >
                  Ref: {item.OrderReference}
                </Text>
              </View>
              <AntDesign name="right" size={16} color="black" />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <Text
            style={{
              fontSize: 16,
              color: Colors.primary,
              textAlign: "center",
              fontFamily: "Medium",
            }}
          >
            You dont have any gift card yet!
          </Text>
        )}
      />
    </SafeAreaView>
  );
};

export default MyGiftCards;
