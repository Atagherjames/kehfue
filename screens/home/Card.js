import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppLogo from "../../assets/svg/applogo.svg";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";
import NotificationIcon from "../../assets/icons/notification-icon.svg";
import CartIcon from "../../assets/icons/cart-icon.svg";
import CoinBox from "../../assets/illustrations/coin-box.svg";
import UsedCoins from "../../assets/illustrations/used-coins.svg";
import TravelSuitCase from "../../assets/illustrations/travel-suitcase.svg";
import Groceries from "../../assets/illustrations/groceries.svg";
import Dining from "../../assets/illustrations/dining.svg";
import Movies from "../../assets/illustrations/movies.svg";
import Tickets from "../../assets/illustrations/tickets.svg";
import Shopping from "../../assets/illustrations/shopping.svg";
import person from "../../assets/images/person.png";
import AppFooter from "../../components/AppFooter";
import { useRecoilState } from "recoil";
import { AccessToken, UserData } from "../../recoil/UserData";
import AppHeader from "../../components/AppHeader";
import { useGetTranactionsQuery } from "../../services/routes/authRoute";
import TransactionIcon from "../../assets/icons/transaction-icon.svg";
import { useGetUserCardQuery } from "../../services/routes/userRoutes";
import BackButton from "../../components/BackButton";

const Card = ({ navigation }) => {
  const [userData, _] = useRecoilState(UserData);
  const [token, __] = useRecoilState(AccessToken);
  const {
    data: transactionRes,
    isLoading,
    isError,
  } = useGetTranactionsQuery(token);
  const { data: cardData, isLoading: isCardLoading } = useGetUserCardQuery({
    token,
    id: userData.id,
  });
  const transactionHistory = transactionRes?.history?.data || [];

  const data = [
    {
      icon: <TravelSuitCase />,
      type: "TRAVELS",
      points: 200,
    },
    {
      icon: <Groceries />,
      type: "GROCERIES",
      points: 600,
    },
    {
      icon: <Dining width={100} />,
      type: "DINING",
      points: 50,
    },
    {
      icon: <Movies />,
      type: "MOVIES",
      points: 150,
    },
    {
      icon: <Tickets />,
      type: "AIR TICKETS",
      points: 50,
    },
    {
      icon: <Shopping />,
      type: "SHOPPING",
      points: 150,
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      {/* header */}
      {/* <View
            style={{
                padding: 15,
                flexDirection: 'row',
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: Colors.lightGrey,
                height: 70,
            }}
        >
            <AppLogo width={140} />

            <View
                style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    gap: 10
                }}
            >
                <TouchableOpacity>
                    <NotificationIcon />
                </TouchableOpacity>
                <TouchableOpacity>
                    <CartIcon />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("User")}
                >
                    <Image
                        source={person}
                        style={{
                            width: 40,
                            height: 40
                        }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            </View>
        </View> */}
      <AppHeader navigation={navigation} />
      <BackButton style={{ marginLeft: 20, marginTop: 20 }} />
      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView style={{}} showsVerticalScrollIndicator={false}>
          <View
            style={{
              gap: 20,
              marginVertical: 20,
            }}
          >
            {/* Points card */}

            <View
              style={{
                padding: 20,
                borderRadius: 12,
                backgroundColor: Colors.secondary,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginHorizontal: 20,
              }}
            >
              <View
                style={{
                  marginBottom: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 38,
                    fontFamily: "SemiBold",
                    color: Colors.white,
                  }}
                >
                  {userData?.points}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "SemiBold",
                    color: Colors.white,
                  }}
                >
                  Total Earned Points
                </Text>
              </View>
              <CoinBox />
            </View>

            {/* Used Points */}

            <View
              style={{
                padding: 20,
                borderRadius: 12,
                backgroundColor: Colors.secondary,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginHorizontal: 20,
              }}
            >
              <View
                style={{
                  marginBottom: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 38,
                    fontFamily: "SemiBold",
                    color: Colors.white,
                  }}
                >
                  {cardData?.data?.pointsUsed}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "SemiBold",
                    color: Colors.white,
                  }}
                >
                  Used to Redeemed
                </Text>
              </View>
              <UsedCoins />
            </View>
          </View>

          <View
            style={{
              marginHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "SemiBold",
                color: Colors.labelColor,
                marginBottom: 20,
              }}
            >
              Points earned by category
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 20,
                flexWrap: "wrap",
                marginBottom: 10,
                paddingHorizontal: 10,
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              {data.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={{
                    borderRadius: 14,
                    backgroundColor: Colors.white,
                    elevation: 4,
                    padding: 10,
                    width: 130,
                    alignItems: "center",
                    height: 170,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Medium",
                      color: Colors.textGrey,
                    }}
                  >
                    {item.type}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "SemiBold",
                      color: Colors.primary,
                    }}
                  >
                    {item.points} Points
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 10,
              marginBottom: 20,
              gap: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Bold",
                color: Colors.labelColor,
                fontSize: 18,
              }}
            >
              Transaction History
            </Text>

            <View
              style={{
                gap: 15,
              }}
            >
              {/* <FlatList
                            data={transactionHistory}
                            renderItem={({ item, i }) => (
                                <TouchableOpacity>
                                    <View>
                                        <Text
                                            style={{
                                                color: Colors.labelColor,
                                                fontFamily: "Regular"
                                            }}
                                        >
                                            TRANSACTION ID
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        /> */}

              {transactionHistory.length > 0 ? (
                transactionHistory.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    style={{
                      backgroundColor: Colors.white,
                      elevation: 3,
                      padding: 10,
                      borderRadius: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                    onPress={() => console.log(item)}
                  >
                    <TransactionIcon />
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.labelColor,
                          fontFamily: "Regular",
                        }}
                      >
                        TRANSACTION ID
                      </Text>
                      <Text
                        style={{
                          color: Colors.labelColor,
                          fontFamily: "Medium",
                          fontSize: 14,
                        }}
                        numberOfLines={1}
                      >
                        #{item.id}
                      </Text>
                      <Text
                        style={{
                          color: Colors.labelColor,
                          fontFamily: "Medium",
                          fontSize: 14,
                        }}
                        numberOfLines={1}
                      >
                        {item.context}
                      </Text>
                      <Text
                        style={{
                          color: Colors.labelColor,
                          fontFamily: "Medium",
                          fontSize: 14,
                        }}
                        numberOfLines={1}
                      >
                        {item?.currency}
                        {item.estimatedCost}
                      </Text>
                      <Text
                        style={{
                          color: Colors.labelColor,
                          fontFamily: "Medium",
                          fontSize: 14,
                        }}
                        numberOfLines={1}
                      >
                        Payment Method - {item?.paymentMethod}
                      </Text>
                      <Text
                        style={{
                          color: Colors.labelColor,
                          fontFamily: "Medium",
                          fontSize: 14,
                        }}
                        numberOfLines={1}
                      >
                        Status - {item?.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No Transaction Available...</Text>
              )}
            </View>
          </View>

          {/* <AppFooter

                /> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Card;
