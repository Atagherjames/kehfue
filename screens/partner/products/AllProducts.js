import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import Header from "../../../components/partners/Header";
import { useNavigation } from "@react-navigation/native";
import { useGetPartnerProductsQuery } from "../../../services/routes/productRoute";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import AntDesign from "@expo/vector-icons/AntDesign";
import AppLoader from "../../../components/AppLoader";

const AllProducts = () => {
  const [token, _] = useRecoilState(PartnerAccessToken);
  const navigation = useNavigation();
  const { data, isLoading, error, isError } = useGetPartnerProductsQuery(token);
  const productsData = data?.products?.data || [];
  const categories = [
    "All",
    ...new Set(productsData.map((item) => item.category)),
  ];
  const [filteredData, setFilteredData] = useState([]);
  const [activeCategory, setActivecategory] = useState(categories[0]);
  const toast = useToast();
  useEffect(() => {
    if (isError) {
      console.log(error);
      toast.show(
        error?.data?.message || error?.message || "Something went wrong",
        {
          type: "danger",
        }
      );
    }
  }, [isError]);

  useEffect(() => {
    if (activeCategory == categories[0]) {
      setFilteredData(productsData);
    } else {
      setFilteredData(
        productsData.filter((item) => item.category == activeCategory)
      );
    }
  }, [activeCategory, data]);

  const [scrollY] = useState(new Animated.Value(0));

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [40, 0],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <AppLoader />}
      <Header navigation={navigation} />
      <View style={styles.topBarContainer}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.pop()}
        >
          <AntDesign name="arrowleft" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Products</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate("CreateProduct")}
        >
          <Text style={styles.headerBtnText}>Create New Product</Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={{
          paddingHorizontal: 20,
          height: headerHeight,
          alignItems: "center",
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
            {categories.map((item, i) => (
              <TouchableOpacity
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  backgroundColor:
                    activeCategory == item ? Colors.primary : Colors.white,
                  borderRadius: 5,
                  borderWidth: activeCategory == item ? 0 : 1,
                }}
                key={i}
                onPress={() => setActivecategory(item)}
              >
                <Text
                  style={{
                    fontFamily: "Medium",
                    fontSize: 12,
                    color: activeCategory == item ? Colors.white : Colors.black,
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <FlatList
          data={filteredData}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.productContainer}
              onPress={() =>
                navigation.navigate("ProductDetails", { data: item })
              }
            >
              <Image
                source={{ uri: item?.thumbNail.downloadUrl }}
                style={styles.productImage}
              />
              <View style={{ flex: 1, gap: 5 }}>
                <Text style={styles.productTitle}>{item.name}</Text>
                <Text style={styles.productDesc} numberOfLines={3}>
                  {item.description}
                </Text>
                <Text
                  style={[
                    styles.productDesc,
                    { color: Colors.black, fontSize: 12 },
                  ]}
                >
                  Category: {item.category}
                </Text>
                <Text
                  style={[
                    styles.productDesc,
                    { textAlign: "right", color: Colors.primary },
                  ]}
                >
                  View Product {">"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, i) => i}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default AllProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backBtn: {
    padding: 5,
  },
  headerText: {
    fontSize: 20,
    flex: 1,
    textAlign: "center",
    fontFamily: "SemiBold",
    color: Colors.labelColor,
  },
  headerBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  headerBtnText: {
    color: Colors.white,
    fontFamily: "Medium",
    fontSize: 12,
  },
  productContainer: {
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 2,
    elevation: 2,
    borderRadius: 5,
    backgroundColor: Colors.white,
    flexDirection: "row",
    gap: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  productTitle: {
    fontSize: 18,
    color: Colors.labelColor,
    fontFamily: "Bold",
  },
  productDesc: {
    fontSize: 14,
    color: Colors.textGrey,
    fontFamily: "Regular",
  },
});
