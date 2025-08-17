import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { ScrollView, Text, View } from "react-native";
import AppButton from "../../../components/AppButton";
import { usePlaceOrderMutation } from "../../../services/routes/vtuRoutes";
import { useRecoilState } from "recoil";
import { AccessToken } from "../../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../../../components/AppLoader";
import BackButton from "../../../components/BackButton";

const ReviewOrder = ({ navigation, route }) => {
  const { data } = route?.params;
  const [purchaseAirtime, { isLoading, isError }] = usePlaceOrderMutation();
  const [token, _] = useRecoilState(AccessToken);
  const toast = useToast();

  const {
    amount,
    network,
    phoneNumber: phone,
    total,
    id,
    pointsUsed,
    pointsToEarn,
  } = data;

  const handlePurchase = async () => {
    try {
      const res = await purchaseAirtime({ token, id }).unwrap();
      console.log(res);
      if (res?.success) {
        navigation.replace("AirtimeCheckout", {
          data: res?.data,
        });
      } else {
        toast.show(res?.message || res?.data?.message, {
          type: "warning",
        });
      }
    } catch (error) {
      console.log(error);
      toast.show(error?.message || error?.data?.message, {
        type: "warning",
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: 20,
      }}
    >
      {isLoading && <AppLoader />}
      <View
        style={{
          height: 3,
          backgroundColor: Colors.primary,
          marginVertical: 20,
        }}
      />
      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView>
          <BackButton />
          <Text
            style={{
              fontFamily: "Medium",
              fontSize: 20,
              color: Colors.primary,
              paddingBottom: 20,
              borderBottomWidth: 0.3,
              borderBottomColor: Colors.grey,
              marginBottom: 20,
              marginTop: 10,
            }}
          >
            REVIEW YOUR ORDER
          </Text>

          <View
            style={{
              gap: 15,
              paddingBottom: 20,
              borderBottomWidth: 0.3,
              borderBottomColor: Colors.grey,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "SemiBold",
                }}
              >
                Product
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "SemiBold",
                }}
              >
                Subtotal
              </Text>
            </View>

            <Text
              style={{
                fontSize: 16,
                color: Colors.primary,
                fontFamily: "Medium",
              }}
            >
              Airtime × 1
            </Text>

            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.black,
                  fontFamily: "Medium",
                }}
              >
                Network:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.textGrey,
                    fontFamily: "Medium",
                  }}
                >
                  {network}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.black,
                    fontFamily: "Medium",
                  }}
                >
                  ₦{amount}.00
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.black,
                  fontFamily: "Medium",
                }}
              >
                Phone:
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.textGrey,
                  fontFamily: "Medium",
                }}
              >
                {phone}
              </Text>
            </View>
          </View>

          <View
            style={{
              paddingVertical: 15,
              borderBottomWidth: 0.3,
              borderBottomColor: Colors.grey,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium",
              }}
            >
              Subtotal
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium",
              }}
            >
              ₦{amount}.00
            </Text>
          </View>

          <View
            style={{
              paddingVertical: 15,
              borderBottomWidth: 0.3,
              borderBottomColor: Colors.grey,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium",
              }}
            >
              Points Used
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium",
              }}
            >
              {pointsUsed}
            </Text>
          </View>
          <View
            style={{
              paddingVertical: 15,
              borderBottomWidth: 0.3,
              borderBottomColor: Colors.grey,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium",
              }}
            >
              Points To Earn
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium",
              }}
            >
              {pointsToEarn}
            </Text>
          </View>

          <View
            style={{
              paddingVertical: 15,
              borderBottomWidth: 0.3,
              borderBottomColor: Colors.grey,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium",
              }}
            >
              Total
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium",
              }}
            >
              ₦{total}.00
            </Text>
          </View>

          <Text
            style={{
              fontSize: 16,
              color: Colors.black,
              fontFamily: "Medium",
              marginVertical: 20,
            }}
          >
            Credit/Debit (ATM) Cards | Visa QR | Other Banks Transfers
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <AppButton
              btnText={"Place Order"}
              onPress={() => {
                // navigation.navigate("AirtimeCheckout")
                handlePurchase();
              }}
            />
            <AppButton
              btnText={"Change Details"}
              onPress={() => navigation.pop()}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ReviewOrder;
