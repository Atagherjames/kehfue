import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../components/AppHeader";
import { Colors } from "../../constants/colors";
import { Banner, Events, HowItWorks, Offers } from "../../components/Landing";
import AppFooter from "../../components/AppFooter";
import loyaltyImage from "../../assets/images/loyalty-image.png";
import AppButton from "../../components/AppButton";
import { useNavigation } from "@react-navigation/native";

const Landing = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      <AppHeader navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Banner navigation={navigation} />
        <Events />
        <HowItWorks />
        <Offers />
        {/* Loyalty progarm */}
        <View
          style={{
            paddingHorizontal: 20,
            alignItems: "center",
            marginBottom: 50,
          }}
        >
          <Image
            source={loyaltyImage}
            style={{
              width: "100%",
              height: 300,
              borderRadius: 20,
            }}
          />
          <Text
            style={{
              fontSize: 24,
              marginVertical: 20,
              fontFamily: "SemiBold",
              textAlign: "center",
            }}
          >
            Join the loyalty program that turns your daily activities into
            rewards
          </Text>
          <AppButton btnText={"Join Now"} />
        </View>

        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Landing;
