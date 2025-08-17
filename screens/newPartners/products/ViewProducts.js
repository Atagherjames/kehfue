import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomDrawer from "../../../components/CustomDrawer";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Colors } from "../../../constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useGetPartnerProductsQuery } from "../../../services/routes/productRoute";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../../../components/AppLoader";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../../recoil/UserData";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";

const ViewProducts = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const [token, _] = useRecoilState(PartnerAccessToken);
  const { data, isLoading, error, isError } = useGetPartnerProductsQuery(token);
  const productsData = data?.products?.data || [];
  useEffect(() => {
    if (isError) {
      toast.show(
        error?.data?.message || error?.message || "Something went wrong",
        {
          type: "danger",
        }
      );
    }
  }, [isError]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading && <AppLoader />}
      <CustomDrawer />

      <View style={{ flex: 1, padding: 20, gap: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "SemiBold",
              color: Colors.darkBlue,
              fontSize: 24,
            }}
          >
            Products
          </Text>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: Colors.primary,
              borderRadius: 5,
            }}
            onPress={() => navigation.navigate("AddProduct")}
          >
            <AntDesign name="plus" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={productsData}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 10,
                borderBottomWidth: 0.5,
                borderColor: Colors.borderColor,
              }}
              onPress={() =>
                navigation.navigate("ProductDetails", { data: item })
              }
            >
              <Text style={styles.descText}>{item.name}</Text>
              <Text style={[styles.descText, { fontFamily: "SemiBold" }]}>
                ₦{item.price}
              </Text>
              <Text style={styles.descText}>{item.count}</Text>
              <TouchableOpacity>
                <Entypo name="dots-three-horizontal" size={16} color="black" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          contentContainerStyle={{
            backgroundColor: Colors.white,
            borderRadius: 10,
            overflow: "hidden",
          }}
          ListHeaderComponent={
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 10,
                borderBottomWidth: 0.5,
                borderColor: Colors.borderColor,
              }}
            >
              <Text style={styles.descText}>Product Name</Text>
              <Text style={[styles.descText, { fontFamily: "SemiBold" }]}>
                Price
              </Text>
              <Text style={styles.descText}>Stock</Text>
              <TouchableOpacity>
                <Entypo name="dots-three-horizontal" size={16} color="black" />
              </TouchableOpacity>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewProducts;

const styles = StyleSheet.create({
  descText: {
    color: Colors.darkBlue,
    fontSize: 14,
    fontFamily: "Medium",
    flex: 1,
  },
});
