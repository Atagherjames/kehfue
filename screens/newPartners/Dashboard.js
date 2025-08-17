import { SafeAreaView } from "react-native-safe-area-context";
import CustomDrawer from "../../components/CustomDrawer";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useEffect } from "react";
import { Colors } from "../../constants/colors";
import Entypo from "@expo/vector-icons/Entypo";
import PartnerCards from "../../components/partners/PartnerCards";
import DashboardLineChart from "../../components/partners/DashboardLineChart";
import { useRecoilState } from "recoil";
import { UserData } from "../../recoil/UserData";
import AppLoader from "../../components/AppLoader";
import { useToast } from "react-native-toast-notifications";
import { useGetPartnersCampaignQuery } from "../../services/routes/offersRoute";
import { PartnerAccessToken } from "../../recoil/UserData";
import { useNavigation } from "@react-navigation/native";
const USFlag = require("../../assets/images/usa.png");
const AUFlag = require("../../assets/images/australia.png");
const PHFlag = require("../../assets/images/philippines.png");

const storeList = [
  {
    country: "United States (USA)",
    users: "5,741,687 Users",
    progress: 70,
    flag: USFlag,
    barColor: "#0FCA7A",
  },
  {
    country: "Australia",
    users: "1,452,301 Users",
    progress: 62,
    flag: AUFlag,
    barColor: "#5E72E4",
  },
  {
    country: "Philippines",
    users: "958,122 Users",
    progress: 58,
    flag: PHFlag,
    barColor: "#11CDEF",
  },
];

const topSpenders = [
  { points: "85.6 KPTS", id: "UD12333", lastVisit: "2023-11-06 09:25" },
  { points: "42.7 KPTS", id: "UD12323", lastVisit: "2023-11-06 09:16" },
  { points: "25.4 KPTS", id: "UD12313", lastVisit: "2023-11-06 09:12" },
];

const PartnerDashboard = () => {
  const navigation = useNavigation();
  const [userData] = useRecoilState(UserData);
  const [token] = useRecoilState(PartnerAccessToken);
  const toast = useToast();

  const page = 1;
  const pageSize = 5;
  const promotionStatus = "active";
  const { data, isLoading, error, isError } = useGetPartnersCampaignQuery({
    token,
    page,
    pageSize,
    promotionStatus,
  });

  const activeCampaigns = data?.result?.promotions?.data || [];
  useEffect(() => {
    if (isError) {
      toast.show(
        error?.data?.message || error?.message || "Something went wrong",
        { type: "danger" }
      );
    }
  }, [isError]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading && <AppLoader />}
      <CustomDrawer />
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 20,
          paddingHorizontal: 15,
          gap: 20,
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heading}>
              Hi, {userData?.companyContactPerson?.fullName} 👋
            </Text>
            <Text style={styles.subHeading}>
              Here is what we have for you today
            </Text>
          </View>
          <Entypo name="dots-three-vertical" size={20} color="black" />
        </View>

        {/* Partner Cards & Chart */}
        <PartnerCards />
        <DashboardLineChart />

        {/* Available Stores */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Available Stores</Text>
            <TouchableOpacity onPress={() => console.log("View All Stores")}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {storeList.map((store, index) => (
            <View key={index}>
              <View style={styles.storeItem}>
                <Image source={store.flag} style={styles.flag} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.storeName}>{store.country}</Text>
                  <Text style={styles.storeUsers}>{store.users}</Text>
                </View>
                <View style={styles.progressRight}>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressText}>{store.progress}%</Text>
                    <View style={styles.progressBarBackground}>
                      <View
                        style={{
                          width: `${store.progress}%`,
                          backgroundColor: store.barColor,
                          height: 5,
                          borderRadius: 6,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
              {index !== storeList.length - 1 && (
                <View style={styles.dashedLine} />
              )}
            </View>
          ))}
        </View>

        {/* Active Campaign */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Active Campaign</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ViewCampaigns", {
                  promotionStatus: "active",
                })
              }
            >
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.campaignHeaderWrapper}>
            <Text style={styles.campaignColumn}>Subject</Text>
            <Text style={styles.campaignColumn}>Channels</Text>
          </View>
          <View style={styles.thickDivider} />
          {activeCampaigns.map((item, index) => (
            <TouchableOpacity
              key={item.id || index}
              onPress={() =>
                navigation.navigate("CampaignPreview", {
                  data: item,
                })
              }
            >
              <View style={styles.campaignRow}>
                <View>
                  <Text style={styles.campaignName}>{item.title}</Text>
                  <Text style={styles.createdOn}>
                    Created on {new Date(item.createdAt).toDateString()}
                  </Text>
                </View>
                <Text style={styles.campaignDate}>
                  {Array.isArray(item.channels)
                    ? item.channels.join(", ")
                    : item.channels}
                </Text>
              </View>
              {index !== activeCampaigns.length - 1 && (
                <View style={styles.dashedLine} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Top Spenders */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Top Spenders Today</Text>
            <TouchableOpacity onPress={() => console.log("Spender Options")}>
              <Entypo name="dots-three-vertical" size={16} color="#999" />
            </TouchableOpacity>
          </View>
          {topSpenders.map((spender, index) => (
            <View key={index}>
              <View style={styles.spenderRow}>
                <Text style={styles.spenderPoints}>{spender.points}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.spenderId}>{spender.id}</Text>
                  <Text style={styles.spenderVisit}>
                    Last visit: {spender.lastVisit}
                  </Text>
                </View>
              </View>
              {index !== topSpenders.length - 1 && (
                <View style={styles.dashedLine} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PartnerDashboard;

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontFamily: "SemiBold",
    color: Colors.darkBlue,
  },
  subHeading: {
    fontSize: 12,
    fontFamily: "Regular",
    color: Colors.darkBlue,
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: "SemiBold",
    fontSize: 14,
    color: "#28005B",
  },
  viewAll: {
    fontFamily: "Medium",
    fontSize: 12,
    color: "#733AEA",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  storeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  flag: {
    width: 28,
    height: 18,
    resizeMode: "contain",
    marginRight: 10,
  },
  storeName: {
    fontFamily: "Medium",
    fontSize: 14,
    color: Colors.darkBlue,
  },
  storeUsers: {
    fontFamily: "Regular",
    fontSize: 12,
    color: "#666",
  },
  progressRight: {
    alignItems: "flex-end",
    width: 90,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  progressText: {
    fontFamily: "Medium",
    fontSize: 11,
    color: Colors.darkBlue,
  },
  progressBarBackground: {
    flex: 1,
    height: 5,
    backgroundColor: "#E7FAF2",
    borderRadius: 6,
    overflow: "hidden",
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#DBDFEA",
    marginVertical: 6,
  },
  thickDivider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 6,
  },
  campaignHeaderWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  campaignColumn: {
    fontFamily: "Medium",
    fontSize: 13,
    color: "#8091A7",
  },
  campaignRow: {
    flexDirection: "row",
    gap: 2,
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  campaignName: {
    fontFamily: "Medium",
    fontSize: 12,
    color: Colors.darkBlue,
  },
  createdOn: {
    fontFamily: "Regular",
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  campaignDate: {
    fontFamily: "Regular",
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  spenderRow: {
    flexDirection: "coloumn",
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  spenderPoints: {
    fontFamily: "SemiBold",
    fontSize: 18,
    color: Colors.primary,
    width: 90,
  },
  spenderId: {
    fontFamily: "Medium",
    fontSize: 13,
    color: Colors.darkBlue,
  },
  spenderVisit: {
    fontFamily: "Regular",
    fontSize: 11,
    color: "#888",
  },
});
