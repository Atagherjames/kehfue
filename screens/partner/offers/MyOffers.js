import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import Header from "../../../components/partners/Header";
import { useNavigation } from "@react-navigation/native";
import { FlatList, TouchableOpacity, Text, View, Image } from "react-native";
import { useGetPartnerOffersQuery } from "../../../services/routes/offersRoute";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../../recoil/UserData";
import { convertTime } from "../../../utils/Utilities";
import AntDesign from "@expo/vector-icons/AntDesign";
import AppLoader from "../../../components/AppLoader";

const MyOffers = () => {
  const [token, _] = useRecoilState(PartnerAccessToken);
  const navigation = useNavigation();
  const { data, isLoading, isError } = useGetPartnerOffersQuery(token);
  const OffersData = data?.offers || [];
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      {isLoading && <AppLoader />}
      <Header navigation={navigation} />

      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <FlatList
          data={OffersData}
          ListHeaderComponent={() => (
            <View
              style={{
                paddingVertical: 16,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 20,
                  color: Colors.labelColor,
                  fontFamily: "SemiBold",
                }}
              >
                Manage Offers
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primary,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}
                onPress={() => navigation.navigate("CreateOffers")}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontFamily: "Medium",
                    fontSize: 12,
                  }}
                >
                  Create New Offer
                </Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginVertical: 5,
                paddingVertical: 10,
                elevation: 3,
                backgroundColor: Colors.white,
                marginHorizontal: 5,
                borderRadius: 5,
                paddingHorizontal: 5,
              }}
            >
              <Image
                source={{ uri: item?.thumbNail?.downloadUrl }}
                style={{ width: 150, height: "100%", borderRadius: 10 }}
                resizeMode="cover"
              />
              <View style={{ flex: 1, gap: 10 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "SemiBold",
                    color: Colors.primary,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "SemiBold",
                    color: Colors.black,
                  }}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Medium",
                    color: Colors.black,
                  }}
                  numberOfLines={2}
                >
                  Created at: {convertTime(item.createdAt)}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Medium",
                    color: Colors.black,
                  }}
                  numberOfLines={2}
                >
                  Created by: {item.PartnerModel.companyName}
                </Text>

                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.primary,
                    width: 30,
                    height: 30,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "flex-end",
                  }}
                  onPress={() => navigation.navigate("PreviewOffer", {
                    id: item.id
                  })}
                >
                  <AntDesign name="arrowright" size={16} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
        {!OffersData && 
          <Text
            style={{
              fontSize: 16,
              fontFamily: "SemiBold",
              textAlign: "center",
              flex: 2
            }}
          >
            You have not created an offer yet. Create an Offer to view now
          </Text>
        }
      </View>
    </SafeAreaView>
  );
};

export default MyOffers;
