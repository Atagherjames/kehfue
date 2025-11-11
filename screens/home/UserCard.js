import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import AppHeader from "../../components/AppHeader";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ProfileCircle from "../../assets/icons/profile-circle.svg";
import CardBadge from "../../assets/icons/card-badge.svg";
import FooterLogo from "../../assets/svg/footer-logo.svg"
import logowhite from "../../assets/icons/logowhite.png";
import { useRecoilState } from "recoil";
import { AccessToken, UserData } from "../../recoil/UserData";
import { useGetQrCodeQuery, useGetUserCardQuery } from "../../services/routes/userRoutes";
import AppLoader from "../../components/AppLoader";
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";

const UserCard = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useRecoilState(UserData);
  const [token, __] = useRecoilState(AccessToken);
  const toast = useToast();
  const { data, isLoading, isError, error, isSuccess, refetch } = useGetUserCardQuery({
    token,
    id: userData.id,
  });
  const cardData = data?.data || null;
  const {data: qrData, isLoading: isQrLoading, isError: isQrError, error: qrError} = useGetQrCodeQuery(token)

  useEffect(() => {
    if (isError) {
      toast.show(
        error?.data?.message || error?.message || "Something went wrong",
        {
          type: "warning",
        }
      );
    }
  }, [isError]);
  useEffect(() => {
    if (isQrError) {
      toast.show(
        qrError?.data?.message || qrError?.message || "Something went wrong",
        {
          type: "warning",
        }
      );
      console.log(qrError)
    }
  }, [isQrError]);
  useEffect(() => {
    if (isSuccess) {
      toast.show(data?.message || "Successful", {
        type: "success",
      });
    }
  }, [isSuccess]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      {isLoading && <AppLoader />}
      <AppHeader navigation={navigation} />

      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView>
          <View
            style={{
              paddingHorizontal: 20,
              gap: 30,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <ProfileCircle width={50} />
              <Text
                style={{
                  fontFamily: "Medium",
                  fontSize: 24,
                  color: Colors.primary,
                }}
              >
                My Card
              </Text>
            </View>

            <View
              style={{
                padding: 20,
                backgroundColor: Colors.primary,
                borderRadius: 14,
                gap: 30,
                marginBottom:10
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
             <Image source={logowhite} style={{ width: 100, height: 50 }} resizeMode="contain" />
                <CardBadge />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "SemiBold",
                      fontSize: 24,
                      color: Colors.white,
                    }}
                  >
                    {userData?.points}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Medium",
                      fontSize: 12,
                      color: Colors.white,
                    }}
                  >
                    Points
                  </Text>
                </View>

                <View style={{}}>
                  <Text
                    style={{
                      fontFamily: "SemiBold",
                      fontSize: 18,
                      color: Colors.white,
                    }}
                  >
                  {userData.firstName.trim()} {userData.lastName.trim()}

                  </Text>
                  <Text
                    style={{
                      fontFamily: "Medium",
                      fontSize: 20,
                      color: Colors.white,
                      opacity: 0.5,
                    }}
                  >
                    {cardData?.cardNumber}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  alignItems: "center",
                  gap: 15,
                }}
              >
                {/* <QRCode value={cardData?.cardNumber} size={200} /> */}
                <Image
                  source={{uri: qrData?.data?.dataUrl}}
                  style={{width: "100%", height: 250}}
                  resizeMode="contain"
                /> 
                <Text
                  style={{
                    fontFamily: "Medium",
                    fontSize: 12,
                    color: Colors.white,
                  }}
                >
                  Scan this code to redeem point!
                </Text>
              </View>
            </View>

            {/* <TouchableOpacity
                onPress={() => navigation.navigate("ScanQrCode")}
            >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontFamily: "Medium",
                color: Colors.primary
              }}
              
            >
              Receive payment via QR code
            </Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default UserCard;
