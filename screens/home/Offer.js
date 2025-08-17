import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../components/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { Offers } from "../../components/Landing";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import Constants from "expo-constants";
import AppLogo from "../../assets/svg/applogo.svg";
import { AccessToken } from "../../recoil/UserData";
import { useRecoilState } from "recoil";
import { useGetOffersQuery } from "../../services/routes/offersRoute";
import OffersState from "../../recoil/Offers";

const Offer = () => {
  const [accessToken] = useRecoilState(AccessToken);
  const navigation = useNavigation();
  const [category, setCategory] = useState("");
  const [showDropdown, setShowDropdwon] = useState(false);
  const dropdownData = ["all", "loadable", "shoppable"];

  const [page, setPage] = useState(1);
  const [offersData, setOffersData] = useRecoilState(OffersState);
  const [filtered, setFiltered] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: offers,
    isLoading: isOffersLoading,
    isFetching,
    isSuccess: isOffersSuccess,
    refetch: refetchOffers,
  } = useGetOffersQuery({ token: accessToken, page, pageSize: 5 });

  useEffect(() => {
    if (isOffersSuccess && offers?.result?.promotions?.data) {
      const newData = offers.result.promotions.data;
      if (page === 1) {
        setOffersData(newData);
      } else {
        setOffersData((prev) => [...prev, ...newData]);
      }
      setHasMore(newData.length === 5);
      setIsLoadingMore(false);
    }
  }, [isOffersSuccess, offers]);

  useEffect(() => {
    if (category === "all" || !category) {
      setFiltered(offersData);
    } else if (category === "shoppable") {
      setFiltered(offersData.filter((item) => item.type === "Shop Now"));
    } else if (category === "loadable") {
      setFiltered(offersData.filter((item) => item.type === "Load Card"));
    }
  }, [category, offersData]);

  const onRefresh = () => {
    setPage(1);
    setHasMore(true);
    refetchOffers();
  };

  const loadMore = () => {
    if (!isFetching && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  const renderHeader = () => (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}
      onPress={() => setShowDropdwon(true)}
    >
      <Text
        style={{
          fontFamily: "Medium",
          fontSize: 14,
          color: Colors.white,
        }}
      >
        {category ? category[0].toUpperCase() + category.slice(1) : "Offers"}
      </Text>
      <Entypo name="chevron-small-down" size={24} color={Colors.white} />
    </TouchableOpacity>
  );

  const renderFooter = () =>
    isLoadingMore ? (
      <ActivityIndicator
        size="large"
        color={Colors.primary}
        style={{ marginVertical: 20 }}
      />
    ) : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <AppHeader navigation={navigation} />
      <View style={{ flex: 1 }}>
        <FlatList
          data={[]}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            isOffersLoading ? null : filtered.length > 0 ? (
              <Offers offersData={filtered} navigation={navigation} />
            ) : (
              <Text
                style={{
                  fontFamily: "Medium",
                  fontSize: 18,
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                No Offers available
              </Text>
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={isOffersLoading}
              onRefresh={onRefresh}
              progressViewOffset={20}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingVertical: 20 }}
        />
      </View>

      {showDropdown && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: Dimensions.get("window").width,
            height: "100%",
            zIndex: 1,
            backgroundColor: Colors.white,
            alignItems: "center",
            gap: 20,
            marginTop: Constants.statusBarHeight,
          }}
        >
          <View
            style={{
              padding: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: Colors.lightGrey,
              height: 70,
              width: "100%",
            }}
          >
            <AppLogo width={140} />
            <TouchableOpacity onPress={() => setShowDropdwon(false)}>
              <FontAwesome name="close" size={30} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          {dropdownData.map((item, i) => (
            <TouchableOpacity
              style={{
                width: "100%",
                paddingVertical: 20,
                backgroundColor: Colors.menuItemBg,
                paddingHorizontal: 20,
              }}
              key={i}
              onPress={() => {
                setCategory(item);
                setShowDropdwon(false);
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Medium",
                  color: Colors.primary,
                }}
              >
                {item[0]?.toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Offer;
