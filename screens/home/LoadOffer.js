import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../components/AppHeader";
import BackButton from "../../components/BackButton";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { useGetLoadedOfferQuery } from "../../services/routes/offersRoute";
import { useRecoilState } from "recoil";
import { AccessToken } from "../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import { Colors } from "../../constants/colors";
import { convertTime } from "../../utils/Utilities";
import { useRoute } from "@react-navigation/native";

const LoadOffer = ({ navigation }) => {
  const [token, _] = useRecoilState(AccessToken);
  const route = useRoute();
  const { campaignId } = route.params;
  const {
    data: loadedOfferRes,
    isLoading,
    isError,
    error,
  } = useGetLoadedOfferQuery({ id: campaignId, token });

  console.log(loadedOfferRes);
  const toast = useToast();
  const offers = loadedOfferRes?.offers || [];

  useEffect(() => {
    if (isError) {
      toast.show(
        error?.message || error?.data?.message || "Someting went wrong",
        {
          type: "warning",
        }
      );
      console.log(error);
    }
  }, [isError]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      <AppHeader navigation={navigation} />
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 20,
          flex: 1,
          gap: 16,
        }}
      >
        <BackButton navigation={navigation} />

        <View
          style={{
            flex: 1,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                gap: 16,
                paddingBottom: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Bold",
                  textAlign: "center",
                  fontSize: 18,
                }}
              >
                Loaded Offer
              </Text>
              {isLoading && <ActivityIndicator color={Colors.primary} />}
              {offers.map((item, i) => {
                return (
                  <View
                    style={{
                      elevation: 5,
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: Colors.white,
                      width: "97%",
                      alignSelf: "center",
                    }}
                    key={i}
                  >
                    <Image
                      source={{ uri: item?.offerData?.thumbNail?.downloadUrl }}
                      style={{
                        width: "100%",
                        height: 200,
                        marginBottom: 20,
                        borderRadius: 10,
                      }}
                      resizeMode="cover"
                    />
                    <View
                      style={{
                        gap: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.labelColor,
                          fontSize: 20,
                          fontFamily: "Medium",
                        }}
                      >
                        {item?.offerData?.title}
                      </Text>
                      <Text
                        style={{
                          color: Colors.labelColor,
                          fontSize: 14,
                          fontFamily: "Regular",
                        }}
                      >
                        {item?.offerData?.description}
                      </Text>
                      <Text
                        style={{
                          color: Colors.labelColor,
                          fontSize: 14,
                          fontFamily: "Medium",
                        }}
                      >
                        Expiry Date:{" "}
                        {convertTime(item?.offerData?.expirationDate)}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontSize: 14,
                        textAlign: "center",
                        color: Colors.labelColor,
                        fontFamily: "Medium",
                        marginTop: 15,
                      }}
                    >
                      Loaded At: {convertTime(item?.loadedAt)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoadOffer;
