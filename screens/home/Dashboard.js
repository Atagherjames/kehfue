import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import AppHeader from "../../components/AppHeader";
import { useNavigation } from "@react-navigation/native";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Offers } from "../../components/Landing";
import { useGetUserQuery } from "../../services/routes/authRoute";
import { useRecoilState } from "recoil";
import { AccessToken, UserData } from "../../recoil/UserData";
import { useGetOffersQuery } from "../../services/routes/offersRoute";
import OffersState from "../../recoil/Offers";
import { useDispatch } from "react-redux";
import { apiSlice } from "../../services/apiSlice";
import ProductCard from "../../components/ProductCard";
import {
  useGetProductsQuery,
  useAddToCartMutation,
} from "../../services/routes/productRoutes";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../../components/AppLoader";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Image } from "react-native";
import Swiper from "react-native-swiper";

const Dashboard = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useRecoilState(UserData);
  const [offersData, setOffersData] = useRecoilState(OffersState);
  const [accessToken] = useRecoilState(AccessToken);
  const toast = useToast();
  const [addItem, { isLoading: isAddingItem }] = useAddToCartMutation();

  const dispatch = useDispatch();

  const {
    data: userResponse,
    isLoading,
    isSuccess,
  } = useGetUserQuery(accessToken);

  const addToCart = async (id) => {
    try {
      const addRes = await addItem({ token: accessToken, id }).unwrap();
      if (addRes.success) {
        toast.show(addRes?.message || "Product added successfully", {
          type: "success",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    } catch (error) {
      toast.show(
        error?.data?.message || error?.message || "Something went wrong",
        {
          type: "warning",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        }
      );
    }
  };

  /**
   * Handler for navigating to the product details screen.
   * @param {string} productId The ID of the product to view.
   */
  const handleProductPress = (productId) => {
    navigation.navigate("ProductDetails", {
      id: productId,
      token: accessToken, // Pass the token for fetching details
    });
  };

  const {
    data: offers,
    isLoading: isOffersLoading,
    isSuccess: isOffersSuccess,
  } = useGetOffersQuery(accessToken);

  const { data, error, isLoading: isProductsLoading } = useGetProductsQuery(
    accessToken,
    { skip: !accessToken }
  );
  const products = data?.products?.data || [];

  useEffect(() => {
    if (isSuccess && userResponse?.user) {
      setUserData(userResponse.user);
    }
  }, [isSuccess, userResponse]);

  useEffect(() => {
    if (isOffersSuccess && offers?.result?.promotions?.data) {
      setOffersData(offers?.result?.promotions?.data);
    }
  }, [isOffersSuccess, offers]);

  const reloadApp = () => {
    dispatch(apiSlice.util.invalidateTags(["user", "offers", "product"]));
  };

  const quickLinksData = [
    {
      id: "1",
      title: "MTN",
      icon: require("../../assets/quickLinks/mtn.png"),
      screen: "Airtime",
    },
    {
      id: "2",
      title: "Flight",
      icon: require("../../assets/quickLinks/flight.png"),
      screen: "NewTravel",
    },
    {
      id: "3",
      title: "GLO",
      icon: require("../../assets/quickLinks/glo.png"),
      screen: "Airtime",
    },
    {
      id: "4",
      title: "DSTV",
      icon: require("../../assets/quickLinks/dstv.png"),
      screen: "SubscriptionMain",
    },
    {
      id: "5",
      title: "Showmax",
      icon: require("../../assets/quickLinks/showmax.png"),
      screen: "ComingSoon",
    },
    {
      id: "6",
      title: "spar giftcard",
      icon: require("../../assets/quickLinks/giftcard.png"),
      screen: "GiftCardStack",
    },
  ];

  const loadCardOffers = offersData?.filter(
    (item) => item.type === "Load Card"
  );

  // Define tiers with names, thresholds, and badge/bar colors
  const tiers = [
    {
      name: "Basic",
      min: 0,
      max: 300,
      barColor: "rgba(255, 255, 255, 0.5)",
      badgeColor: "rgba(255, 255, 255, 0.5)",
    },
    {
      name: "Preferred",
      min: 300,
      max: 750,
      barColor: "white",
      badgeColor: "white",
    },
    {
      name: "Premium",
      min: 750,
      max: 1500,
      barColor: "#CAA928",
      badgeColor: "#CAA928",
    },
    {
      name: "Pink",
      min: 1500,
      max: Infinity,
      barColor: "#FF69B4",
      badgeColor: "#FF69B4",
    },
  ];
  const userPoints = userData?.points ?? 0;

  // Find the current tier based on points
  let currentTier = tiers.find(
    (tier) => userPoints >= tier.min && userPoints < tier.max
  );
  if (!currentTier) {
    currentTier = tiers[tiers.length - 1];
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {isAddingItem && <AppLoader />}

      <AppHeader navigation={navigation} />

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{
            paddingVertical: 20,
            paddingHorizontal: 0,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={reloadApp}
              progressViewOffset={20}
            />
          }
        >
          {/* User Card */}
          <TouchableOpacity
            style={{
              padding: 20,
              backgroundColor: "rgb(51, 0, 102)",
              borderRadius: 14,
              marginHorizontal: 20,
              justifyContent: "space-between",
              marginBottom: 20,
            }}
            onPress={() => navigation.navigate("Cards")}
          >
            {/* Top Section: Welcome and dynamic tier badge */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "white",
                    fontFamily: "Medium",
                  }}
                >
                  Hello {userData?.firstName}, today will be a good day !!
                </Text>
              </View>
              {/* Dynamic Tier Badge */}
              <View
                style={{
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderWidth: 1,
                  borderColor: currentTier.badgeColor,
                  marginLeft: 10,
                  overflow: "hidden",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Medium",
                    color: currentTier.badgeColor,
                  }}
                >
                  {currentTier.name}
                </Text>
              </View>
            </View>
            {/* Middle Section: Points */}
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.7)",
                  fontFamily: "Medium",
                }}
              >
                Total available Point
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  color: "white",
                  fontFamily: "Bold",
                  marginTop: 5,
                }}
              >
                {userPoints.toFixed(2)}
              </Text>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                marginVertical: 12,
              }}
            ></View>

            {/* Bottom Section: Tier Progress */}
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: "white",
                  fontFamily: "Medium",
                  marginBottom: 5,
                }}
              >
                Tier progress
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                {tiers.map((tier, index) => {
                  const isCurrentOrPastTier = userPoints >= tier.min;
                  const isCurrentTier =
                    userPoints >= tier.min && userPoints < tier.max;
                  let fillPercentage = 0;
                  let barColor = "rgba(255, 255, 255, 0.2)";

                  if (isCurrentOrPastTier && !isCurrentTier) {
                    fillPercentage = 100;
                    barColor = tier.barColor;
                  } else if (isCurrentTier) {
                    fillPercentage = Math.min(
                      100,
                      Math.max(
                        0,
                        ((userPoints - tier.min) / (tier.max - tier.min)) * 100
                      )
                    );
                    barColor = tier.barColor;
                  }

                  if (index === tiers.length - 1 && userPoints >= tier.min) {
                    fillPercentage = 100;
                    barColor = tier.barColor;
                  }

                  return (
                    <View
                      key={index}
                      style={{
                        flex: 1,
                        height: 6,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          width: `${fillPercentage}%`,
                          height: "100%",
                          backgroundColor: barColor,
                          borderRadius: 3,
                        }}
                      />
                    </View>
                  );
                })}
              </View>
              {/* Tier Points */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <Text style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.7)" }}>
                  300
                </Text>
                <Text style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.7)" }}>
                  750
                </Text>
                <Text style={{ fontSize: 10, color: "#BBBBBB" }}>1500</Text>
                <Text style={{ fontSize: 10, color: "#BBBBBB" }}>3000</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={{ marginTop: 20, marginHorizontal: 20 }}>
            {/* Section Header */}
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Bold",
                color: "#000000",
                marginBottom: 10,
              }}
            >
              Quick Links
            </Text>

            {/* Quick Links Grid */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              {quickLinksData.map((link) => (
                <TouchableOpacity
                  key={link.id}
                  style={{
                    flexBasis: "30%",
                    aspectRatio: 1,
                    backgroundColor: "#F5F5F5",
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                  }}
                  onPress={() => navigation.navigate(link.screen)}
                >
                  <Image
                    source={link.icon}
                    style={{ width: 40, height: 40, marginBottom: 5 }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Medium",
                      textAlign: "center",
                    }}
                  >
                    {link.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

         {loadCardOffers?.length > 0 && (
  <Offers
    header={"Shop Offers"}
    offersData={loadCardOffers}
    navigation={navigation}
  />
)}

          {/* PRODUCT SWIPER SECTION */}
          {products?.length > 0 && (
            <View style={loadCardOffers?.length > 0? { marginTop: -90 } :{ marginTop: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  marginBottom: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "SemiBold",
                    color: "#000",
                  }}
                >
                  Shop Products
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Merchandise", {
                      title: "Shop Products",
                    })
                  }
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Medium",
                      color: Colors.primary,
                    }}
                  >
                    See More
                  </Text>
                </TouchableOpacity>
              </View>

              <Swiper
                style={{ height: 450 }}
                loop={false}
                showsButtons={false}
                showsPagination={false}
                buttonWrapperStyle={{
                  backgroundColor: "transparent",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "absolute",
                  top: "45%",
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  paddingHorizontal: 20,
                }}
              >
                {products.map((item) => (
                  <View key={item.id} style={{ paddingHorizontal: 10 }}>
                    <ProductCard
                      image={item.thumbNail?.downloadUrl}
                      title={item.title}
                      description={item.description}
                      points={item.price}
                      onRedeem={() => addToCart(item.id)}
                      // New prop to handle navigating to product details
                      onPress={() => handleProductPress(item.id)} 
                    />
                  </View>
                ))}
              </Swiper>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;