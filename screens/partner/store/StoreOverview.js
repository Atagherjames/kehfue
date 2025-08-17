import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import CustomDrawer from "../../../components/CustomDrawer";
import RevenueCard from "../../../components/partners/RevenueLineChart";
import Swiper from "react-native-swiper";
import CustomSwiperDot from "../../../components/partners/customSwiperDot";
import AppLoader from "../../../components/AppLoader";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../../recoil/UserData";
import {
  useGetTotalSalesQuery,
  useGetAverageSalesQuery,
} from "../../../services/routes/partnerRoute";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { BarChart } from "react-native-gifted-charts";
import SwiperSalesCard from "../../../components/partners/CustomSwiperCard";
import { useToast } from "react-native-toast-notifications";
import { useRef } from "react";

const StoreOverview = ({ navigation }) => {
  const USFlag = require("../../../assets/images/usa.png");
  const AUFlag = require("../../../assets/images/australia.png");
  const PHFlag = require("../../../assets/images/philippines.png");
  const icon1 = require("../../../assets/images/coinicon.png");
  const icon2 = require("../../../assets/images/squareicon.png");
  const icon3 = require("../../../assets/images/usericon.png");

  const [token] = useRecoilState(PartnerAccessToken);
  const toast = useToast();
  const hasShownError = useRef(false);

  const {
    data: totalSalesData,
    isLoading: isTotalSalesLoading,
    error: totalSalesError,
  } = useGetTotalSalesQuery(token);

  const {
    data: averageSalesData,
    isLoading: isAverageSalesLoading,
    error: averageSalesError,
  } = useGetAverageSalesQuery(token);

  if ((totalSalesError || averageSalesError) && !hasShownError.current) {
    const errorMsg =
      totalSalesError?.data?.message ||
      averageSalesError?.data?.message ||
      "Failed to load sales data. Please try again.";

    toast.show(errorMsg, {
      type: "danger",
      placement: "top",
      animationType: "slide-in",
      duration: 4000,
    });

    hasShownError.current = true;
  }

  const salesData = [
    {
      id: 1,
      label: "Total Sales",
      icon: icon1,
      value: totalSalesData?.record?.totalAmount,
      growth: "10%",
    },
    {
      id: 2,
      label: "Avg Sale Value",
      icon: icon2,
      value: averageSalesData?.totalSales?.totalPrice,
      growth: "0.0%",
    },
    {
      id: 3,
      label: "Customers",
      icon: icon3,
      value: "$23,569",
      growth: "0.0%",
    },
  ];

  const topLocations = [
    {
      country: "United States",
      count: 19800,
      percentage: 55,
      flag: USFlag,
    },
    {
      country: "Australia",
      count: 7200,
      percentage: 20,
      flag: AUFlag,
    },
    {
      country: "Philippines",
      count: 9800,
      percentage: 25,
      flag: PHFlag,
    },
  ];

  const trafficData = [
    { value: 47.83, label: "Female", frontColor: "#5F57FF" },
    { value: 89.17, label: "Male", frontColor: "#33CFFF" },
    { value: 25, label: "Others", frontColor: "#EEEFF2" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {(isTotalSalesLoading || isAverageSalesLoading) && <AppLoader />}
      <CustomDrawer />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="filter" size={16} color="#555" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton}>
            <Feather name="download" size={16} color="#fff" />
            <Text style={styles.exportText}>Export</Text>
            <Feather name="chevron-down" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 240, marginBottom: 20 }}>
          <Swiper
            loop={false}
            showsPagination
            dot={<CustomSwiperDot />}
            activeDot={<CustomSwiperDot active />}
          >
            {salesData.map((i, index) => (
              <SwiperSalesCard
                key={index}
                icon={i.icon}
                label={i.label}
                value={i.value}
                growth={i.growth}
              />
            ))}
          </Swiper>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <FontAwesome5
                name="piggy-bank"
                size={18}
                color="#808897"
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Revenue</Text>
            </View>
            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownButtonText}>All Products</Text>
              <Feather
                name="chevron-down"
                size={14}
                color="#555"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.horizontalRule} />
          <View style={styles.revenueSummary}>
            <Text style={styles.revenueAmount}>$23,569.00</Text>
            <View>
              <View style={styles.growthContainer}>
                <Feather name="arrow-up" size={12} color="#40C4AA" />
                <Text style={styles.growthPercentage}>10.5%</Text>
              </View>
              <Text style={styles.growthText}>from last period</Text>
            </View>
          </View>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColorBox, { backgroundColor: "#4E57EF" }]}
              />
              <Text style={styles.legendText}>This period</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColorBox, { backgroundColor: "#33CFFF" }]}
              />
              <Text style={styles.legendText}>Last period</Text>
            </View>
          </View>
          <RevenueCard />
        </View>

        <View style={styles.card}>
          <View style={styles.topLocationHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.cardTitle}>Top Location</Text>
              <Feather
                name="info"
                size={16}
                color="#9CA3AF"
                style={{ marginLeft: 6 }}
              />
            </View>
            <TouchableOpacity style={styles.threeDotButton}>
              <Feather name="more-horizontal" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.horizontalRule} />
          {topLocations.map((item, index) => (
            <View key={index} style={styles.topLocationItem}>
              <View style={styles.topLocationRow}>
                <Image
                  source={item.flag}
                  style={styles.flagImage}
                  resizeMode="contain"
                />
                <Text style={styles.countryName}>{item.country}</Text>
              </View>
              <View style={styles.countContainer}>
                <Text style={styles.countText}>
                  {item.count.toLocaleString()}
                </Text>
                <Text style={styles.percentageText}>{item.percentage}%</Text>
              </View>
              <View style={styles.segmentedBar}>
                {[...Array(20)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.segment,
                      {
                        backgroundColor:
                          i < Math.round((item.percentage / 100) * 20)
                            ? "#28005B"
                            : "#EEEFF2",
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.topLocationHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.cardTitle}>Social Traffic</Text>
              <Feather
                name="info"
                size={16}
                color="#9CA3AF"
                style={{ marginLeft: 6 }}
              />
            </View>
            <TouchableOpacity style={styles.threeDotButton}>
              <Feather name="more-horizontal" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <BarChart
            data={trafficData}
            barWidth={48}
            height={240}
            yAxisThickness={0}
            xAxisThickness={0}
            noOfSections={4}
            showValuesAsTopLabel
            xAxisLabelTextStyle={{ color: "#555", fontSize: 12 }}
            hideYAxisText
            isAnimated
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const PRIMARY_COLOR = "#4A90E2";
const CARD_BG = "#FFFFFF";

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16 },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DFE1E6",
    borderRadius: 10,
  },
  filterText: {
    fontSize: 14,
    color: "#666D80",
    marginLeft: 6,
  },
  exportButton: {
    flexDirection: "row",
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#28005B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  exportText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
    marginRight: 8,
  },
  wrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DFE1E6",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  card: {
    position: "relative",
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderColor: "#DFE1E6",
  },

  horizontalRule: {
    height: 1,
    backgroundColor: "#E5E7EB",
    alignSelf: "stretch",
    marginVertical: 10,
  },

  hRule: {
    marginHorizontal: -16,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    marginRight: 6,
  },
  cardTitle: {
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: "500",
    color: "#666D80",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    height: 32,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: "#DFE1E6",
    borderWidth: 1,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: "#555",
  },
  revenueSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  revenueAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginRight: 10,
  },
  growthContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  growthPercentage: {
    fontSize: 12,
    fontWeight: "600",
    color: "#40C4AA",
    marginRight: 3,
  },
  growthText: {
    fontSize: 13,
    color: "#777",
  },

  locationItem: {
    marginBottom: 10,
  },
  locationLabel: {
    fontSize: 13,
    marginBottom: 3,
    color: "#555",
  },
  locationBarContainer: {
    backgroundColor: "#E0E0E0",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  locationBar: {
    backgroundColor: PRIMARY_COLOR,
    height: 6,
  },
  locationPercentage: {
    fontSize: 11,
    color: "#777",
    marginTop: 3,
  },

  topLocationItem: {
    marginBottom: 16,
  },
  topLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginVertical: 20,
  },
  countryFlag: {
    fontSize: 22,
  },
  countryName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  countText: {
    fontSize: 12,
    color: "#666D80",
    fontWeight: "400",
  },
  percentageText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#666D80",
  },
  segmentedBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
  },
  segment: {
    flex: 1,
    height: 17,
    borderRadius: 1,
  },
  topLocationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  threeDotButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  flagImage: {
    width: 30,
    height: 30,
    borderRadius: 2,
  },

  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  legendColorBox: {
    width: 8,
    height: 8,
    borderRadius: 2,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#555",
  },
  pointerLabelContainer: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointerLabelTitle: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 4,
  },
  pointerLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  pointerLabelDate: {
    color: "#666",
    fontSize: 11,
  },
  pointerLabelValue: {
    color: "#333",
    fontWeight: "500",
    fontSize: 11,
  },
});

export default StoreOverview;
