import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import AppHeader from "../../../components/AppHeader";
import { useNavigation } from "@react-navigation/native";
import {
  useAddToCartMutation,
  useCartCheckoutMutation,
  useGetCartItemQuery,
  useRemoveFromCartMutation,
} from "../../../services/routes/productRoutes";
import { useRecoilState } from "recoil";
import { AccessToken, UserData } from "../../../recoil/UserData";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import AppLoader from "../../../components/AppLoader";
import { useToast } from "react-native-toast-notifications";
import { FontAwesome } from "@expo/vector-icons";
import { AppDefaultInput } from "../../../components/AppInput";
import AppButton from "../../../components/AppButton";

const Cart = () => {
  const navigation = useNavigation();
  const [token, _] = useRecoilState(AccessToken);
  const [userData, __] = useRecoilState(UserData);
  const [activeType, setActiveType] = useState(0);
  let n;
  const [input, setInput] = useState("");
  const { data, isLoading, isError, refetch } = useGetCartItemQuery({ token });
  const [addItem, { isLoading: isAddingItem }] = useAddToCartMutation();
  const [removeItem, { isLoading: isRemovingItem }] =
    useRemoveFromCartMutation();
  const [checkout, { isLoading: isCheckoutLoading }] =
    useCartCheckoutMutation();
  const cartData = data?.cart?.data || [];
  const toast = useToast();
  const types = [
    `Use all some points (256 Pay with Points required)`,
    `No points, credit card only transaction`,
  ];
  const totalAmount = cartData?.reduce((total, val) => {
    return total + val.price;
  }, 0);

  const addToCart = async (id) => {
    try {
      const addRes = await addItem({ token, id }).unwrap();
      console.log(addRes);
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
  const removeFromCart = async (id) => {
    try {
      const addRes = await removeItem({ token, id }).unwrap();
      console.log(addRes);
      if (addRes.success) {
        toast.show(addRes?.message || "Product removed successfully", {
          type: "success",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    } catch (error) {
      console.log(error);
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

  const handleConfirmOrder = async () => {
    const body = {
      cartIds: cartData.map((item) => item.id),
      paymentMethod: "card",
    };

    const pointBody = {
      cartIds: cartData.map((item) => item.id),
      paymentMethod: "card_and_points",
      point: input ? parseInt(input) : 0,
    };

    try {
      const checkoutRes = await checkout({
        token,
        body: activeType == 0 ? pointBody : body,
      }).unwrap();
      console.log(checkoutRes);
      if (checkoutRes.success) {
        navigation.replace("MerchandiseCheckout", {
          data: checkoutRes,
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
      {(isLoading || isAddingItem || isRemovingItem || isCheckoutLoading) && (
        <AppLoader />
      )}
      <AppHeader navigation={navigation} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
          paddingBottom: 10,
        }}
      >
        {cartData.length > 0 ? (
          <FlatList
            data={cartData}
            keyExtractor={(item) => item.id}
            renderItem={({ item, i }) => (
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 20,
                  elevation: 10,
                  backgroundColor: Colors.white,
                  padding: 10,
                  borderRadius: 10,
                  marginHorizontal: 5,
                }}
              >
                <Image
                  source={{ uri: item?.thumbNail?.downloadUrl }}
                  style={{ width: 100, height: 120, borderRadius: 20 }}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "SemiBold",
                    }}
                  >
                    {item.productName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Bold",
                      color: Colors.primary,
                    }}
                  >
                    {item.currency + " " + item.price}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Bold",
                      color: Colors.primary,
                    }}
                  >
                    <Text
                      style={{ fontFamily: "Regular", color: Colors.textGrey }}
                    >
                      Or
                    </Text>{" "}
                    {item.price / 10} points
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: Colors.primary,
                        borderRadius: 14,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => removeFromCart(item.productId)}
                    >
                      <AntDesign name="minus" size={14} color={Colors.white} />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "Medium",
                      }}
                    >
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: Colors.primary,
                        borderRadius: 13,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => addToCart(item.productId)}
                    >
                      <AntDesign name="plus" size={14} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            ListHeaderComponent={() => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <TouchableOpacity onPress={() => navigation.pop()}>
                  <AntDesign
                    name="arrowleft"
                    size={24}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "center",
                    color: "#545454",
                    fontFamily: "SemiBold",
                    fontSize: 24,
                  }}
                >
                  My Cart
                </Text>
              </View>
            )}
            ListFooterComponent={() => (
              <View style={{ paddingHorizontal: 10 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Medium",
                    color: "#1C1C1C",
                  }}
                >
                  Payment
                </Text>
                <Text
                  style={{
                    color: "#29821B",
                    fontSize: 14,
                    lineHeight: 24,
                    fontFamily: "Regular",
                  }}
                >
                  We use secure transmission {"\n"}
                  We protect your personal information
                </Text>

                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "Medium",
                    marginVertical: 16,
                  }}
                >
                  Available points balance: {userData?.points} PTS
                </Text>

                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "Medium",
                    marginBottom: 10,
                  }}
                >
                  How to would you like to pay?
                </Text>

                <View style={{ gap: 10, marginBottom: 10 }}>
                  {types.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        setActiveType(i);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <FontAwesome
                        name={activeType == i ? "dot-circle-o" : "circle-o"}
                        size={24}
                        color={
                          activeType == i ? Colors.primary : Colors.labelColor
                        }
                      />
                      <Text
                        style={{
                          fontFamily: "Regular",
                          color: Colors.labelColor,
                          flex: 1,
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {activeType == 0 && (
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Medium",
                        marginBottom: 10,
                      }}
                    >
                      Enter the amount of points and/or cash you to use for the
                      total price
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <AppDefaultInput
                        keyboardType="numeric"
                        onChangeText={(val) => (n = val)}
                        onEndEditing={() => setInput(n)}
                        defaultValue={input}
                        placeholder={"0"}
                      />
                      <Text
                        style={{
                          fontFamily: "Medium",
                          fontSize: 14,
                        }}
                      >
                        Points + {totalAmount - parseInt(input * 10)}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Cart Summary */}
                <View style={{ paddingVertical: 16 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "SemiBold",
                      marginBottom: 10,
                    }}
                  >
                    Cart Summary
                  </Text>

                  <View>
                    {cartData.map((item, i) => (
                      <View
                        key={item.id}
                        style={{
                          paddingVertical: 15,
                          borderBottomWidth: 0.5,
                          flexDirection: "row",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            color: "#6A6A6A",
                            fontFamily: "Medium",
                            flex: 1,
                          }}
                        >
                          {item.productName}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            color: "#1C1C1C",
                            fontFamily: "Medium",
                          }}
                        >
                          {item.currency} {item.price}
                        </Text>
                      </View>
                    ))}
                    <View
                      style={{
                        paddingVertical: 15,
                        borderBottomWidth: 0.5,
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#1C1C1C",
                          fontFamily: "Medium",
                          flex: 1,
                        }}
                      >
                        Total
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#1C1C1C",
                          fontFamily: "Medium",
                        }}
                      >
                        {cartData[0]?.currency || "NGN"}{" "}
                        {totalAmount -
                          (activeType == 0 && input ? parseInt(input) : 0)}{" "}
                        & {activeType == 0 && input ? parseInt(input) : 0}{" "}
                        points
                      </Text>
                    </View>
                  </View>
                </View>

                <AppButton
                  btnText={"Confirm Order"}
                  btnStyles={{ marginVertical: 20 }}
                  onPress={handleConfirmOrder}
                />
              </View>
            )}
          />
        ) : (
          <View style={{ gap: 20, padding: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <TouchableOpacity onPress={() => navigation.pop()}>
                <AntDesign name="arrowleft" size={24} color={Colors.primary} />
              </TouchableOpacity>
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  color: "#545454",
                  fontFamily: "SemiBold",
                  fontSize: 24,
                }}
              >
                My Cart
              </Text>
            </View>

            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                color: Colors.primary,
                fontFamily: "Medium",
              }}
            >
              No Item In Cart. Add an Item to continue
            </Text>
            <AppButton
              btnText={"View Products"}
              onPress={() => navigation.navigate("Merchandise")}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Cart;
