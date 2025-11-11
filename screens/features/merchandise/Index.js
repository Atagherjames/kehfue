import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../components/AppHeader";
import { Colors } from "../../../constants/colors";
import {
  useAddToCartMutation,
  useGetProductsQuery,
} from "../../../services/routes/productRoutes";
import { useRecoilState } from "recoil";
import { AccessToken } from "../../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import { ActivityIndicator, FlatList, Image, Text, View, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import AppButton from "../../../components/AppButton";
import AppLoader from "../../../components/AppLoader";
import BackButton from "../../../components/BackButton";

const Merchandise = ({ navigation }) => {
  const [token, _] = useRecoilState(AccessToken);
   const route = useRoute();
     const { title } = route.params || {};

  const toast = useToast();
  const { data, isError, isLoading, isSuccess, refetch, error } =
    useGetProductsQuery(token);
  const [addItem, { isLoading: isAddingItem }] = useAddToCartMutation();


  useEffect(() => {
    if (isError && !isLoading) {
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
  }, [isError]);
  const merchandise = data?.products?.data || [];
  

  const addToCart = async (id) => {
    try {
      const addRes = await addItem({ token, id }).unwrap();
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      {isAddingItem && <AppLoader />}
      <AppHeader navigation={navigation} />
      <View style={{ flexDirection: "row", paddingLeft: 20, paddingRight: 70 }}>
        <BackButton />
        <Text
          style={{
            fontSize: 24,
            color: "#545454",
            fontFamily: "Bold",
            textAlign: "center",
            marginVertical: 20,
            flex: 1,
          }}
        >
         {title || "Shop Merchandise"}
        </Text>
      </View>
      {isLoading && <ActivityIndicator />}

      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          data={merchandise}
          renderItem={({ item, index }) => (
            <TouchableOpacity
  onPress={() => navigation.navigate("ProductDetails", {token, id: item.id })}
  activeOpacity={0.9}
>
  <View
    style={{
      marginBottom: 30,
      alignItems: "center",
      paddingHorizontal: 20,
      gap: 16,
    }}
  >
    <Image
      source={{ uri: item?.thumbNail?.downloadUrl }}
      style={{
        width: "100%",
        height: 200,
        borderRadius: 10,
      }}
    />
    <View
      style={{
        width: "100%",
        gap: 8,
      }}
    >
      <Text
        style={{
          fontFamily: "Bold",
          fontSize: 18,
          color: "#545454",
        }}
      >
        {item.name}
      </Text>
      <Text
        style={{
          fontFamily: "Regular",
          fontSize: 14,
          color: "#545454",
        }}
      >
        {item.description}
      </Text>
      <Text
        style={{
          fontFamily: "Medium",
          fontSize: 18,
          color: Colors.primary,
        }}
      >
        {item?.currency?.toUpperCase() + " " + item?.price}
      </Text>

      <AppButton
        btnText={"Redeem Now"}
        onPress={(e) => {
          e.stopPropagation(); 
          addToCart(item.id);
        }}
      />
    </View>
  </View>
</TouchableOpacity>

          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Merchandise;
