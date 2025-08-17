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

const Dashboard = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useRecoilState(UserData);
  const [offersData, setOffersData] = useRecoilState(OffersState);
  const [accessToken] = useRecoilState(AccessToken);
  const dispatch = useDispatch();

  const {
    data: userResponse,
    isLoading,
    isSuccess,
  } = useGetUserQuery(accessToken);

  const {
    data: offers,
    isLoading: isOffersLoading,
    isSuccess: isOffersSuccess,
  } = useGetOffersQuery(accessToken);

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

  const loadCardOffers = offersData?.filter(
    (item) => item.type === "Load Card"
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
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
              height: 165,
              paddingHorizontal: 20,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: Colors.primary,
              borderRadius: 14,
              gap: 20,
              marginHorizontal: 20,
            }}
            onPress={() => navigation.navigate("Cards")}
          >
            <View>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.white,
                  fontFamily: "Medium",
                }}
              >
                Hello
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.white,
                  fontFamily: "Medium",
                }}
              >
                {userData?.firstName} {userData?.lastName}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.white,
                  fontFamily: "Regular",
                  opacity: 0.5,
                }}
              >
                Today will be a good day !!
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 24,
                  color: Colors.white,
                  fontFamily: "Medium",
                }}
              >
                {userData?.points ?? 0}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.white,
                  fontFamily: "Medium",
                  textAlign: "center",
                }}
              >
                Total available Point
              </Text>
            </View>
          </TouchableOpacity>

          {/* Offers Section */}
          {loadCardOffers?.length > 0 ? (
            <Offers
              header={"Shop Offers"}
              offersData={loadCardOffers}
              navigation={navigation}
            />
          ) : (
            <Text
              style={{
                fontFamily: "Medium",
                fontSize: 18,
                textAlign: "center",
                marginVertical: 20,
              }}
            >
              No Offers available
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
