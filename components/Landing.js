import React from "react";
import { Dimensions, Image, Text, View, Alert, Linking, ScrollView, TouchableOpacity } from "react-native";
import { Colors } from "../constants/colors";
import landingBanner from "../assets/illustrations/landing-banner.png";
import AppButton from "./AppButton";
import LandingEvent1 from "../assets/images/landing-event-1.png";
import LandingEvent2 from "../assets/images/landing-event-2.png";
import LandingEvent3 from "../assets/images/landing-event-3.png";
import LandingOffer1 from "../assets/images/landing-offer-1.png";
import LandingOffer2 from "../assets/images/landing-offer-2.png";
import LandingOffer3 from "../assets/images/landing-offer-3.png";
import HowItWorksIcon1 from "../assets/svg/how-it-works-1.svg";
import HowItWorksIcon2 from "../assets/svg/how-it-works-2.svg";
import HowItWorksIcon3 from "../assets/svg/how-it-works-3.svg";
import HowItWorksIcon4 from "../assets/svg/how-it-works-4.svg";
import { convertTime } from "../utils/Utilities";
import { useLoadOfferMutation } from "../services/routes/offersRoute";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRecoilState } from "recoil";
import { AccessToken } from "../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import Swiper from "react-native-swiper";
import { useRoute } from "@react-navigation/native";

export const Banner = ({ navigation }) => {
  return (
    <View
      style={{
        paddingVertical: 40,
        backgroundColor: Colors.black,
        alignItems: "center",
      }}
    >
      <Image
        source={landingBanner}
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").width,
        }}
        resizeMode="cover"
      />

      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          fontFamily: "Medium",
          color: Colors.white,
          paddingHorizontal: 20,
          lineHeight: 32,
          marginBottom: 20,
        }}
      >
        Unlock a world of rewards! From recharging your phone data and shopping
        to events and travel Join today and start earning points with every
        purchase
      </Text>
      <AppButton
        btnText={"Join Now"}
        btnStyles={{
          backgroundColor: Colors.white,
        }}
        btnTextStyles={{
          color: Colors.primary,
        }}
        onPress={() => navigation.navigate("SignUp")}
      />
    </View>
  );
};

export const Events = () => {
  const data = [
    {
      title: "Europe Tour",
      text: "Quisque nec leo vel tellus porttitor finibus laoreet mollis mi. Aliquam urna turpis, elementum quis diam at, venenatis vulputate arcu.",
      image: LandingEvent1,
      onBtnPress: () => {},
    },
    {
      title: "Attend Events",
      text: "Quisque nec leo vel tellus porttitor finibus laoreet mollis mi. Aliquam urna turpis, elementum quis diam at, venenatis vulputate arcu.",
      image: LandingEvent2,
      onBtnPress: () => {},
    },
    {
      title: "Recharge",
      text: "Quisque nec leo vel tellus porttitor finibus laoreet mollis mi. Aliquam urna turpis, elementum quis diam at, venenatis vulputate arcu.",
      image: LandingEvent3,
      onBtnPress: () => {},
    },
  ];

  return (
    <View
      style={{
        gap: 50,
        paddingVertical: 50,
        paddingHorizontal: 20,
      }}
    >
      {data.map((item, i) => (
        <View
          style={{
            gap: 14,
          }}
          key={i}
        >
          <Image
            source={item.image}
            style={{
              width: "100%",
              height: 200,
              borderRadius: 20,
            }}
            resizeMode="cover"
          />
          <Text
            style={{
              fontSize: 24,
              fontFamily: "SemiBold",
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Medium",
            }}
          >
            {item.text}
          </Text>
          <AppButton btnText={"Explore"} onPress={item.onBtnPress} />
        </View>
      ))}
    </View>
  );
};

export const HowItWorks = () => {
  const data = [
    {
      icon: () => <HowItWorksIcon1 />,
      title: "1 sign up",
      text: "Quisque nec leo vel tellus porttitor finibus laoreet mollis mi. Aliquam urna turpis, elementum quis diam at, venenatis vulputate arcu.",
    },
    {
      icon: () => <HowItWorksIcon2 />,
      title: "Use your card",
      text: "Quisque nec leo vel tellus porttitor finibus laoreet mollis mi. Aliquam urna turpis, elementum quis diam at, venenatis vulputate arcu.",
    },
    {
      icon: () => <HowItWorksIcon3 />,
      title: "Watch for offers",
      text: "Quisque nec leo vel tellus porttitor finibus laoreet mollis mi. Aliquam urna turpis, elementum quis diam at, venenatis vulputate arcu.",
    },
    {
      icon: () => <HowItWorksIcon4 />,
      title: "Get great rewards",
      text: "Quisque nec leo vel tellus porttitor finibus laoreet mollis mi. Aliquam urna turpis, elementum quis diam at, venenatis vulputate arcu.",
    },
  ];
  return (
    <View
      style={{
        gap: 50,
        paddingVertical: 50,
        paddingHorizontal: 20,
        backgroundColor: Colors.lightGrey,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontFamily: "SemiBold",
          textAlign: "center",
        }}
      >
        How it Work?
      </Text>
      {data.map((item, i) => (
        <View
          style={{
            alignItems: "center",
            gap: 16,
            paddingHorizontal: 30,
          }}
          key={i}
        >
          {item.icon()}
          <Text
            style={{
              fontSize: 18,
              fontFamily: "SemiBold",
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Medium",
              textAlign: "center",
            }}
          >
            {item.text}
          </Text>
        </View>
      ))}
    </View>
  );
};

export const Offers = ({ offersData, navigation }) => {
  const [token] = useRecoilState(AccessToken);
  const [loadOffer] = useLoadOfferMutation();
  const [loadingId, setLoadingId] = React.useState(null);
  const toast = useToast();
  const route = useRoute();
  const isOffersScreen = route.name === "Offer";

  const handleLoadOffer = async (id) => {
    setLoadingId(id);
    try {
      const response = await loadOffer({ id, token }).unwrap();
      if (response.success) {
        toast.show(response?.message || response?.data?.message, {
          type: "success",
        });
        navigation.navigate("LoadOffer", { campaignId: id });
      } else {
        toast.show(
          response?.message || response?.data?.message || response?.error,
          { type: "warning" }
        );
      }
    } catch (error) {
      toast.show(error?.message || error?.data?.message || error?.error, {
        type: "warning",
      });
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleOpenShop = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Can't open shop link");
    }
  };

  const renderOfferItem = (item, i) => (
    <View
      style={{
        gap: 10,
        padding: 10,
        elevation: 5,
        backgroundColor: Colors.white,
        borderRadius: 14,
        marginHorizontal: 20,
        marginBottom: isOffersScreen ? 20 : 0,
      }}
      key={i}
    >
      <Image
        source={{ uri: item?.thumbNail?.downloadUrl }}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 14,
        }}
        resizeMode="cover"
      />
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Medium",
        }}
      >
        {item?.title}
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Medium",
        }}
      >
        {item?.details}
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Medium",
        }}
      >
        {item?.duration?.length === 2
          ? `Expires on ${new Date(item.duration[1]).toDateString()}`
          : "No expiry date"}
      </Text>
      <AppButton
        btnText={item?.type}
        onPress={() => {
          if (item.type === "Shop Now" && item.websiteURL) {
            handleOpenShop(item.websiteURL);
          } else {
            handleLoadOffer(item.id);
          }
        }}
        isLoading={loadingId === item.id}
      />
    </View>
  );

  return (
    <View
      style={{
        gap: 30,
        paddingVertical: 30,
        backgroundColor: Colors.White,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: isOffersScreen ? 24 : 15,
            fontFamily: isOffersScreen ? "Medium" : "SemiBold",
            textAlign: "left",
          }}
        >
          Shop Offers
        </Text>
        {!isOffersScreen && (
          <TouchableOpacity onPress={() => navigation.navigate("Offer")}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Medium",
                color: Colors.primary,
              }}
            >
              See more
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {offersData?.length > 0 && (
        <>
          {isOffersScreen ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {offersData.map(renderOfferItem)}
            </ScrollView>
          ) : (
            <Swiper
              style={{ height: 500 }}
              showsButtons={true}
              loop={false}
              autoplay={false}
              showsPagination={false}
              removeClippedSubviews={false}
               nextButton={
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={26}
                    color={Colors.primary}
                  />
                }
                prevButton={
                  <MaterialIcons
                    name="arrow-back-ios"
                    size={26}
                    color={Colors.primary}
                  />
                }
            >
              {offersData.map(renderOfferItem)}
            </Swiper>
          )}
        </>
      )}
    </View>
  );
};