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
import { useGetUserLocationsQuery, useGetDeliveryEstimateMutation, useRemoveUserLocationMutation } from "../../../services/routes/userRoutes";
import { useRecoilState } from "recoil";
import { AccessToken, UserData } from "../../../recoil/UserData";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
    StyleSheet,
    Alert,
    Modal
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
 
const { data: locationsData, isLoading: locationLoading, refetch: refetchLocations } = useGetUserLocationsQuery(token);


const [getDeliveryEstimate, { data: deliveryEstimate, isLoading: estimateLoading }] = useGetDeliveryEstimateMutation();

// Remove user location
const [removeUserLocation, { isLoading: removingLocation }] = useRemoveUserLocationMutation();


  // Using let for input and deliveryLocation as per your request.
  let input = "";
const [selectedAddress, setSelectedAddress] = useState(null);
const [modalVisible, setModalVisible] = useState(false);
 const [newAddress, setNewAddress] = useState({
    address: "",
    state: "",
    country: "", 
  });
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false); 


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
    `No points, card only transaction`,
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

useEffect(() => {
    const allLocations = locationsData?.data || [];
    if (allLocations.length > 0) {
      const usedAddress = allLocations.find((loc) => loc.used > 0);
      const initialAddress = usedAddress || allLocations[0];
      setSelectedAddress(initialAddress);

      if (initialAddress?.id && token) {
        getDeliveryEstimate({
          token,
          deliveryLocationId: initialAddress.id,
        }).unwrap().catch(error => {
      toast.show(
              error?.data?.message || "Failed to get delivery estimate.",
              {
                type: "warning",
                placement: "bottom",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
              }
            );
        });
      }
    }
  }, []); 



  const handleConfirmOrder = async () => {
  // Default bodies
  const body = {
    cartIds: cartData.map((item) => item.id),
    paymentMethod: "card",
  };

  const pointBody = {
    cartIds: cartData.map((item) => item.id),
    paymentMethod: "card_and_points",
    point: input ? parseInt(input) : 0,
  };

  if (selectedAddress?.id) {
    body.deliveryLocationId = selectedAddress.id;
    pointBody.deliveryLocationId = selectedAddress.id;
  } else {
    const newLoc = {
      address: selectedAddress?.address || "No address selected",
      state: selectedAddress?.state ,
      country: selectedAddress?.country,
    };
    body.deliveryLocation = newLoc;
    pointBody.deliveryLocation = newLoc;
  }

  try {
    const checkoutRes = await checkout({
      token,
      body: activeType === 0 ? pointBody : body,
    }).unwrap();

    console.log(checkoutRes);
    if (checkoutRes.success) {
      navigation.replace("MerchandiseCheckout", { data: checkoutRes });
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
        backgroundColor: Colors.storeBg,
      }}
    >
      {(isLoading || isAddingItem || isRemovingItem || isCheckoutLoading|| estimateLoading|| locationLoading||removingLocation) && (
        <AppLoader />
      )}
      <AppHeader navigation={navigation} />

      {/* Cart Header */}
            <View style={styles.titleRow}>
              <TouchableOpacity style={styles.backCircle} onPress={() => navigation.pop()}>
                <AntDesign name="arrowleft" size={18} color={Colors.primary} />
              </TouchableOpacity>
      
              <Text style={styles.titleText}>My Cart</Text>
              <View style={styles.rightSpacer} />
            </View>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
          paddingBottom: 10,
          paddingTop: 5,
            elevation: 10,
                  backgroundColor: Colors.white,
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
                  How  would you like to pay?
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
                        onChangeText={(text) => {
                          input = text;
                        }}
                        placeholder={"0"}
                      />
                      <Text
                        style={{
                          fontFamily: "Medium",
                          fontSize: 14,
                        }}
                      >
                        Points +{" "}
                        {totalAmount - (input ? parseInt(input) * 10 : 0)}
                      </Text>
                    </View>
                  </View>
                )}

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


     {/* Delivery Address Card */}
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={styles.cardTitle}>Shipping Address</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
            <FontAwesome name="pencil" size={16} color={Colors.primary} />
        </TouchableOpacity>
    </View>

  {/* Address Box */}
<View style={styles.addressBox}>
  <View style={{ flex: 1 }}>
    <Text style={styles.addressText}>
      {selectedAddress ? selectedAddress.address : "select or create an address"}
    </Text>
    {selectedAddress?.state && (
      <Text style={styles.addressText}>
        {selectedAddress.state}, {selectedAddress.country}
      </Text>
    )}
  </View>
</View>
   <TouchableOpacity
onPress={() => {
    setIsAddingNewAddress(true); 
    setSelectedAddress(null); 
  }}
  style={{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
  }}
>
  <FontAwesome name="plus-circle" size={14} color={Colors.primary} />
  <Text
    style={{
      color: Colors.primary,
      fontFamily: "Medium",
      marginLeft: 4,
    }}
  >
    Add Address
  </Text>
</TouchableOpacity>

    <View style={styles.sectionDivider} />

    {/* Delivery Estimate */}
<View
  style={{
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
  }}
>
{deliveryEstimate?.data &&( deliveryEstimate?.data && <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
    <FontAwesome name="motorcycle" size={18} color="green" />
    <Text
      style={{
        color: "green",
        fontSize: 16,
        fontFamily: "SemiBold",
        marginLeft: 8,
      }}
    >
      Delivery
    </Text>
  </View>)}

  {estimateLoading ? (
    <Text
      style={{ color: Colors.textGrey, fontFamily: "Regular", fontSize: 14 }}
    >
      Calculating delivery time...
    </Text>
  ) : (
    deliveryEstimate?.data && (
      <Text
        style={{ color: Colors.textGrey, fontFamily: "Regular", fontSize: 14 }}
      >
        Estimated delivery:{" "}
        {deliveryEstimate.data.estimatedTimeOfArrival || "N/A"}
      </Text>
    )
  )}
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

  {isAddingNewAddress && (
  <Modal
    transparent
    animationType="none"
    visible={isAddingNewAddress}
    onRequestClose={() => setIsAddingNewAddress(false)}
  >
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 }}>
      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20 }}>
        <Text style={{ fontSize: 18, fontFamily: 'SemiBold', marginBottom: 10 }}>
          Enter New Address
        </Text>

        <AppDefaultInput
          placeholder="Full Address"
          value={newAddress.address}
          onChangeText={(text) => setNewAddress(prev => ({ ...prev, address: text }))}
          style={{ marginBottom: 10 }}
        />
        <AppDefaultInput
          placeholder="State/Region"
          value={newAddress.state}
          onChangeText={(text) => setNewAddress(prev => ({ ...prev, state: text }))}
          style={{ marginBottom: 10 }}
        />
        <AppDefaultInput
          placeholder="Country"
          value={newAddress.country}
          onChangeText={(text) => setNewAddress(prev => ({ ...prev, country: text }))}
          style={{ marginBottom: 20 }}
        />

        {/* Buttons Row */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
          {/* Cancel */}
          <TouchableOpacity
            onPress={() => setIsAddingNewAddress(false)}
            style={{ paddingVertical: 8, paddingHorizontal: 16 }}
          >
            <Text style={{ color: Colors.primary, fontFamily: 'Medium' }}>Cancel</Text>
          </TouchableOpacity>

          {/* Done (disabled until address and state are filled) */}
          <TouchableOpacity
            onPress={() => {
              setSelectedAddress(newAddress);
              setIsAddingNewAddress(false);
              setNewAddress({ address: '', state: '', country: 'Nigeria' });
            }}
            disabled={!newAddress.address.trim() || !newAddress.state.trim()}
            style={{
              backgroundColor: !newAddress.address.trim() || !newAddress.state.trim() ? '#ccc' : Colors.primary,
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: '#fff', fontFamily: 'Medium' }}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}


    {/* Address Selector Modal */}
{modalVisible && (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <View
      style={{
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        maxHeight: "80%",
      }}
    >
      <Text
        style={{
          fontFamily: "SemiBold",
          fontSize: 16,
          marginBottom: 10,
        }}
      >
        Select or Delete Address
      </Text>

      <FlatList
        data={locationsData?.data || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderColor: "#ddd",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Address Info */}
            <TouchableOpacity
              style={{ flex: 1 }}
          onPress={async () => {
  setSelectedAddress(item);
  setModalVisible(false);
  try {
    const res = await getDeliveryEstimate({
      token,
        deliveryLocationId: item.id,
    }).unwrap();

  } catch (error) {
    console.log("Estimate error:", error);
  }
}}

            >
              <Text
                style={{
                  fontFamily:
                    selectedAddress?.id === item.id ? "SemiBold" : "Regular",
                  color:
                    selectedAddress?.id === item.id
                      ? Colors.primary
                      : Colors.textGrey,
                }}
              >
                {item.address}
              </Text>
              <Text
                style={{
                  fontFamily: "Regular",
                  color: Colors.textGrey,
                  fontSize: 12,
                }}
              >
                {item.state || "Unknown"}, {item.country || "Nigeria"}
              </Text>
            </TouchableOpacity>

            {/* Icons Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* Check Icon (selected) */}
              {selectedAddress?.id === item.id && (
                <FontAwesome name="check" size={16} color={Colors.primary} />
              )}

              {/* Delete Icon */}
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "Delete Address",
                    "Are you sure you want to delete this address?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                          try {
                            const res = await removeUserLocation({
                              token,
                              locationId: item.id,
                            }).unwrap();
                            if (res.success) {
                              console.log(res)
                              toast.show("Address deleted successfully", {
                                type: "success",
                              });
                              refetchLocations();
                            }
                          } catch (error) {
                            toast.show(
                              error?.data?.message ||
                                "Failed to delete address",
                              { type: "danger" }
                            );
                          }
                        },
                      },
                    ]
                  )
                }
              >
                <FontAwesome name="trash" size={18} color={"red"} />
              </TouchableOpacity>
            </View>
          </View>
        )}


      />

      <TouchableOpacity
        onPress={() => setModalVisible(false)}
        style={{
          alignSelf: "center",
          marginTop: 15,
        }}
      >
        <Text
          style={{
            color: Colors.primary,
            fontFamily: "Medium",
          }}
        >
          Close
        </Text>
      </TouchableOpacity>
    </View>
  </View>
)}

    </SafeAreaView>
  );
};

export default Cart;


/* -------------------------
   Styles
   ------------------------- */
const styles = StyleSheet.create({


  /* title row */
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  
  backCircle: {
    backgroundColor: Colors.white,
    width: 38,
    height: 38,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    marginRight: 10,
  },
  titleText: {
    flex: 1,
    textAlign: "center",
    fontFamily: "SemiBold",
    fontSize: 20,
    color: "#545454",
  },
  rightSpacer: { width: 38 }, // balances the centered title

  /* -------------------------
    Styles for Shipping Address Section
    ------------------------- */
cardTitle: { 
    fontFamily: "SemiBold", 
    fontSize: 18, 
    color: "#1C1C1C", 
    marginBottom: 8 
},

addressBox: {
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
},
addressName: { 
    fontFamily: "SemiBold", 
    fontSize: 15,
    color: "#1C1C1C"
},
addressText: { 
    color: Colors.textGrey, 
    fontFamily: 'Regular' 
},

sectionDivider: { 
    height: 1, 
    backgroundColor: "#EEE", 
    marginVertical: 10 
},

deliveryRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 10 
},
deliveryLabel: { 
    fontFamily: "SemiBold", 
    color: '#2BB673', 
    fontSize: 14 
},
deliveryEstimate: { 
    color: Colors.textGrey, 
    fontFamily: 'Medium', 
    fontSize: 14, 
    flex: 1, 
    marginLeft: 5 
},

});

