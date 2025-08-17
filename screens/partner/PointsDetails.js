import React from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import Header from "../../components/partners/Header";
import { useNavigation } from "@react-navigation/native";
import {
  useGetPartnerSalePointsQuery,
  useGetPointsEarnedByCustomerQuery,
} from "../../services/routes/userRoutes";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../recoil/UserData";
import AppLoader from "../../components/AppLoader";
import AntDesign from "@expo/vector-icons/AntDesign";

const PointsDetails = () => {
  const navigation = useNavigation();
  const [token, _] = useRecoilState(PartnerAccessToken);
  const {
    data: totalPoints,
    isLoading,
    isError,
  } = useGetPartnerSalePointsQuery(token);
  const {
    data: listData,
    isLoading: isListLoading,
    isError: isListError,
  } = useGetPointsEarnedByCustomerQuery(token);
  const dataToRender = listData?.record?.data?.pointsEarned || [];
  //   console.log(dataToRender)

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <AppLoader />}
      <Header navigation={navigation} />
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10
          }}
        >
          <TouchableOpacity
            style={{
              padding: 5,
            }}
            onPress={() => navigation.pop()}
          >
            <AntDesign name="arrowleft" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              flex: 1,
              textAlign: "center",
              fontFamily: "SemiBold",
              color: Colors.labelColor,
            }}
          >
            Point History
          </Text>
        </View>
        <FlatList
          data={dataToRender}
          ListHeaderComponent={() => (
            <View style={styles.card}>
              <View>
                <Text style={styles.heading}>Total points from sales</Text>
                <Text style={styles.points}>
                  {totalPoints?.data?.points || "0"}
                </Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.smallHeading}>Items sold:</Text>
                  <Text style={styles.smallValue}>
                    {totalPoints?.data?.itemsBought || "0"}
                  </Text>
                </View>
                <View style={{ width: 1, backgroundColor: Colors.white }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.smallHeading}>Points Value:</Text>
                  <Text style={styles.smallValue}>
                    {totalPoints?.data?.value || "NGN 0"}
                  </Text>
                </View>
              </View>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View style={styles.listBox}>
              <Text style={{ fontFamily: "Medium" }}>{index + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemEmail}>{item.email}</Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.itemName,
                    {
                      textAlign: "right",
                      color: Colors.primary,
                      fontFamily: "SemiBold",
                    },
                  ]}
                >
                  {item.points} points
                </Text>
                <Text style={[styles.itemEmail, { textAlign: "right" }]}>
                  {item.value}
                </Text>
              </View>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={{alignItems: "center"}}>
            {isListLoading && <ActivityIndicator color={Colors.primary}/>}
            <Text
              style={{
                fontSize: 14,
                textAlign: "center",
                color: Colors.primary,
                marginVertical: 10,
                fontFamily: "Medium",
              }}
            >
              No more data to show
            </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default PointsDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  heading: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: "Medium",
  },
  card: {
    backgroundColor: Colors.primary,
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
    gap: 16,
    marginBottom: 20,
  },
  points: {
    fontFamily: "SemiBold",
    fontSize: 28,
    color: Colors.white,
    textAlign: "center",
  },

  smallHeading: {
    color: Colors.white,
    textAlign: "center",
    fontFamily: "Medium",
  },
  smallValue: {
    color: Colors.white,
    textAlign: "center",
    fontFamily: "SemiBold",
    fontSize: 18,
  },
  listBox: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: Colors.lightGrey,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  itemName: {
    fontSize: 14,
    fontFamily: "Bold",
  },
  itemEmail: {
    fontSize: 12,
    fontFamily: "Medium",
  },
});
