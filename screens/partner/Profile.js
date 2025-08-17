import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/partners/Header";
import { Colors } from "../../constants/colors";
import AppButton from "../../components/AppButton";
import { useRecoilState } from "recoil";
import { PartnerAccessToken, UserData } from "../../recoil/UserData";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import userBg from "../../assets/images/user-bg.png";
import person from "../../assets/images/person.png";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLogoutMutation } from "../../services/routes/authRoute";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../../components/AppLoader";

const DetailsItem = ({ icon, title, value }) => (
  <View
    style={{
      flexDirection: "row",
      gap: 20,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderColor: "#E1E1E1",
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 40,
        height: 40,
        backgroundColor: "#EEE8F4",
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={icon}
        style={{
          width: 18,
          height: 18,
        }}
        resizeMode="contain"
      />
    </View>

    <View>
      <Text
        style={{
          fontFamily: "SemiBold",
          fontSize: 16,
          color: "#323232",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: "Medium",
          fontSize: 14,
          color: "#545454",
        }}
      >
        {value}
      </Text>
    </View>
  </View>
);

const Profile = ({ navigation }) => {
  const [token, setToken] = useRecoilState(PartnerAccessToken);
  const [user, setUser] = useRecoilState(UserData);
  const [logout, {isLoading}] = useLogoutMutation()
  const toast = useToast()
  // console.log(user)
  const handleLogout = async () => {
    try {
      const logoutRes = await logout(token).unwrap()
      if (logoutRes.success) {
        setToken("")
        toast.show(logoutRes.message, {
          type: "success"
        })
      } else {
        toast.show(logoutRes.message, {
          type: "warning"
        })

      }
    } catch (error) {
      toast.show(error?.message || error?.data?.message || "Something went wrong", {
        type: "danger"
      })
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      {isLoading && <AppLoader />}
      <Header navigation={navigation} />

      <View>
        <ScrollView>
          <View
            style={{
              padding: 20,
              gap: 20,
            }}
          >
            <View style={{ gap: 10 }}>
              <View
                style={{
                  height: 180,
                }}
              >
                <Image
                  source={userBg}
                  style={{
                    width: "100%",
                    height: 130,
                    borderRadius: 14,
                  }}
                  resizeMode="cover"
                />
                <Image
                  source={person}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    position: "absolute",
                    bottom: 0,
                    alignSelf: "center",
                  }}
                  resizeMode="contain"
                />
              </View>
              <Text
                style={{
                  fontFamily: "Medium",
                  fontSize: 24,
                  textAlign: "center",
                }}
              >
                {user?.companyName}
              </Text>
              <TouchableOpacity
                style={{
                  width: 70,
                  backgroundColor: Colors.white,
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  borderRadius: 10,
                  alignSelf: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  padding: 5,
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="edit" size={20} color={Colors.primary} />
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.primary,
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{gap: 16}}>
              <DetailsItem
                icon={require("../../assets/icons/partner-name.png")}
                title={"Name"}
                value={user?.companyContactPerson?.fullName}
              />
              <DetailsItem
                icon={require("../../assets/icons/partner-number.png")}
                title={"Mobile Number"}
                value={"+" + user?.companyContactPerson?.phoneNumber}
                />
              <DetailsItem
                icon={require("../../assets/icons/partner-email.png")}
                title={"Email"}
                value={user?.companyContactPerson?.emailAddress}
              />
              <DetailsItem
                icon={require("../../assets/icons/partner-location.png")}
                title={"Moble Number"}
                value={user?.companyAddress}
              />
            </View>

            <AppButton btnText={"Logout"} onPress={handleLogout} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
