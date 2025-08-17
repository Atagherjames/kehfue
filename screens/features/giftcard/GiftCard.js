import React, { useEffect, useState } from "react";
import AppHeader from "../../../components/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetGiftCardsQuery } from "../../../services/routes/giftcardRoute";
import { useRecoilState } from "recoil";
import { AccessToken } from "../../../recoil/UserData";
import AppLoader from "../../../components/AppLoader";
import { useToast } from "react-native-toast-notifications";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import AppButton from "../../../components/AppButton";

const GiftCard = () => {
  const navigation = useNavigation();
  const [token, _] = useRecoilState(AccessToken);
  const [activeFilter, setActiveFilter] = useState(0);
  const toast = useToast();
  const filter = ["All"];
  const { data, isLoading, isError, isSuccess, error } =
    useGetGiftCardsQuery(token);
  const giftCardData = data?.result?.docs || [];

  console.log(giftCardData[0]);

  useEffect(() => {
    if (isSuccess) {
      toast.show(data?.message, {
        type: "success",
      });
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isError) {
      toast.show(
        error?.message || error?.data?.message || "Something went wrong",
        {
          type: "success",
        }
      );
    }
  }, [isError]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <AppHeader navigation={navigation} />
      {isLoading && <AppLoader />}

      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginVertical: 10,
          gap: 20
        }}
      >
        {filter.map((item, i) => (
          <TouchableOpacity onPress={() => setActiveFilter(i)}
            style={{
                borderBottomWidth: 1,
                borderBottomColor: activeFilter == i ? "#1F48AA" : "#E5E7EB",
                padding: 10,
                flex: 1
            }}
          >
            <Text
              style={{
                color: activeFilter == i ? "#1F48AA" : "#6B7280",
                fontSize: 14,
                fontFamily: "Bold",
                textAlign: "center"
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
        <AppButton btnText={"My Gift Cards"} btnTextStyles={{fontSize: 12}} onPress={() => navigation.navigate("MyGiftCards")}/>
      </View> */}

      <FlatList
        data={giftCardData}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{
              alignItems: "center",
              gap: 10,
              borderBottomWidth: 1,
              borderColor: Colors.footerGrey,
              paddingBottom: 10,
            }}
            onPress={() =>
              navigation.navigate("GiftCardDetails", { data: item })
            }
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: "100%", height: 200, borderRadius: 20 }}
              resizeMode="cover"
            />
            <Text
              style={{
                textAlign: "left",
                width: "100%",
                fontFamily: "Bold",
                color: Colors.labelColor,
                fontSize: 18,
              }}
            >
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{
          gap: 20,
          paddingTop: 20,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      />
    </SafeAreaView>
  );
};

export default GiftCard;
