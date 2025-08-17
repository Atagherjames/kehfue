import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomDrawer from "../../components/CustomDrawer";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Colors } from "../../constants/colors";
import { useRecoilState } from "recoil";
import { UserData } from "../../recoil/UserData";
import Entypo from "@expo/vector-icons/Entypo";

const RenderItem = ({ item, value, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        borderBottomWidth: 0.5,
        borderColor: Colors.borderColor,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 12,
            color: Colors.darkBlue,
            fontFamily: "Regular",
          }}
        >
          {item}
        </Text>
        <Text
          style={{
            fontFamily: "Medium",
            fontSize: 14,
            color: Colors.darkBlue,
          }}
        >
          {value}
        </Text>
      </View>
      <Entypo name="chevron-small-right" size={24} color="black" />
    </TouchableOpacity>
  );
};

const PartnerProfile = () => {
  const [userData, _] = useRecoilState(UserData);
  // console.log(userData)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
      <CustomDrawer />

      <View
        style={{
          flex: 1,
          padding: 10,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            backgroundColor: Colors.white,
            gap: 16,
          }}
        >
          <View>
            <Text style={styles.header}>Personal Information</Text>
            <Text style={styles.inFoText}>
              Basic info, like your name and address, that you use on Khefue.
            </Text>
          </View>

          <Text style={styles.listHeader}>Basics</Text>

          <View style={{ gap: 10 }}>
            <RenderItem
              item={"Full Name"}
              value={userData?.companyContactPerson?.fullName}
            />
            <RenderItem item={"Email"} value={userData?.email} />
            <RenderItem
              item={"Phone Number"}
              value={"+" + userData?.companyContactPerson?.phoneNumber}
            />
            <RenderItem item={"Company Name"} value={userData?.companyName} />
            <RenderItem item={"Website URL"} value={userData?.websiteUrl} />
            <RenderItem item={"Address"} value={userData?.companyAddress} />
            <RenderItem item={"Plan"} value={userData?.plans} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PartnerProfile;

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    color: Colors.darkBlue,
    fontFamily: "SemiBold",
  },
  inFoText: {
    fontSize: 14,
    color: Colors.darkBlue,
    fontFamily: "Medium",
  },
  listHeader: {
    color: Colors.darkBlue,
    fontFamily: "SemiBold",
    fontSize: 16,
    backgroundColor: Colors.grey,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
});
