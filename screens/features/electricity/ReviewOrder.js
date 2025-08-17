import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../../constants/colors'
import { ScrollView, Text, View } from 'react-native'
import AppButton from '../../../components/AppButton'
import { useRecoilState } from 'recoil'
import { AccessToken } from '../../../recoil/UserData'
import { usePlaceOrderMutation } from '../../../services/routes/vtuRoutes'
import AppLoader from '../../../components/AppLoader'
import { useToast } from 'react-native-toast-notifications'

const ElectricityReviewOrder = ({
  navigation,
  route
}) => {
  const {data, disco, name, meterNo} = route?.params
  const [token, _] = useRecoilState(AccessToken)
  const [purchaseData, {isLoading, isError}] = usePlaceOrderMutation()
  const toast = useToast()

  const handlePurchase = async () => {

    try {
      const res = await purchaseData({token, id: data?.id}).unwrap()
      console.log(res)
      if (res?.success) {
        navigation.replace("AirtimeCheckout", {
          data: res?.data
        })
      } else {
        toast.show(res?.message || res?.data?.message, {
          type: "warning"
        })
      }
    } catch (error) {
      console.log(error)
        toast.show(error?.message || error?.data?.message, {
          type: "warning"
        })
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: 20
      }}
    >
      {isLoading && <AppLoader />}
      <View
        style={{
          height: 3,
          backgroundColor: Colors.primary,
          marginVertical: 20
        }}
      />
      <View
        style={{
          flex: 1
        }}
      >
        <ScrollView>
          <Text
            style={{
              fontFamily: "Medium",
              fontSize: 20,
              color: Colors.primary,
              paddingBottom: 20,
              borderBottomWidth: 0.3,
              borderBottomColor: Colors.grey,
              marginBottom: 20
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
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "SemiBold"
                }}
              >Product</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "SemiBold"
                }}
              >Subtotal</Text>
            </View>

            <Text
              style={{
                fontSize: 16,
                color: Colors.primary,
                fontFamily: "Medium"
              }}
            >{data?.planType} - {disco?.name}</Text>

            <View
              style={{
                gap: 12
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.black,
                  fontFamily: "Medium"
                }}
              >Details:</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.textGrey,
                    fontFamily: "Medium"
                  }}
                >Name:</Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.black,
                    fontFamily: "Medium"
                  }}
                >{name}</Text>

              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.textGrey,
                    fontFamily: "Medium"
                  }}
                >Meter Number</Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.black,
                    fontFamily: "Medium"
                  }}
                >{meterNo}</Text>

              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.textGrey,
                    fontFamily: "Medium"
                  }}
                >Phone</Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.black,
                    fontFamily: "Medium"
                  }}
                >{data?.phoneNumber}</Text>

              </View>

            </View>

          </View>

          <View
            style={{
              paddingVertical: 15,
              borderBottomWidth: 0.3,
              borderBottomColor: Colors.grey,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium"
              }}
            >Points Used: </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium"
              }}
            >{data?.pointsUsed}</Text>
          </View>

          <View
            style={{
              paddingVertical: 15,
              borderBottomWidth: 0.3,
              borderBottomColor: Colors.grey,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium"
              }}
            >Points To Earn: </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium"
              }}
            >{data?.pointsToEarn}</Text>
          </View>

          <View
            style={{
              paddingVertical: 15,
              borderBottomWidth: 0.3,
              borderBottomColor: Colors.grey,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium"
              }}
            >Subtotal</Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium"
              }}
            >₦{data?.amount}.00</Text>
          </View>

          {/* <View
            style={{
              paddingVertical: 15,
              borderBottomWidth: 0.3,
              borderBottomColor: Colors.grey,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium"
              }}
            >Points Used</Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium"
              }}
            >Pts. 2,000</Text>
          </View> */}

          <View
            style={{
              paddingVertical: 15,
              borderBottomWidth: 0.3,
              borderBottomColor: Colors.grey,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium"
              }}
            >Total</Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: "Medium"
              }}
            >₦{data?.total}.00</Text>
          </View>

          <Text
            style={{
              fontSize: 16,
              color: Colors.black,
              fontFamily: "Medium",
              marginVertical: 20
            }}
          >Credit/Debit (ATM) Cards | Visa QR | Other Banks Transfers</Text>


          <View
            style={{
              flexDirection: "row",
              justifyContent: 'space-between'
            }}
          >
            <AppButton
              btnText={"Place Order"}
              onPress={handlePurchase}
            />
            <AppButton
              btnText={"Change Details"}
              onPress={() => navigation.pop()}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default ElectricityReviewOrder