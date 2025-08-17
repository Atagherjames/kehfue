import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import AppSwiperDot from "../../components/onboarding/AppSwiperDot";
import AppSwiperContent from "../../components/onboarding/AppSwiperContent";
import { Colors } from "../../constants/colors";
import AppButton from "../../components/AppButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import Onboarding1 from "../../assets/illustrations/onboarding1.png";
import { SafeAreaView } from "react-native-safe-area-context";

const ONBOARDING_KEY = "hasOnboarded";

const Onboarding = () => {
  const SwiperData = [
    {
      id: 1,
      title: "Shop & Earn Rewards",
      desc: "Get exclusive rewards for every purchase you make on our partnered platforms.",
      icon: Onboarding1,
    },
    {
      id: 2,
      title: "Seamless Bill Payments",
      desc: "Pay your bills quickly and easily, and earn rewards for every transaction.",
      icon: Onboarding1,
    },
    {
      id: 3,
      title: "Instant Airtime Top-Up",
      desc: "Buy airtime on the go and enjoy rewards for staying connected.",
      icon: Onboarding1,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  let swiperRef = useRef(null);
  const navigation = useNavigation();

  // Check if user already onboarded, then skip
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (value === "true") {
          navigation.replace("Login"); 
        }
      } catch (e) {
        console.error("Failed to load onboarding status", e);
      }
    };
    checkOnboardingStatus();
  }, []);

  const handleScrollBy = (index) => {
    swiperRef.current.scrollBy(index, true);
    setCurrentIndex(index);
  };

  const handleIndexChanged = (index) => {
    setCurrentIndex(index);
  };

  // When onboarding is done, save flag and navigate
  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      navigation.replace("Login"); 
    } catch (e) {
      console.error("Failed to save onboarding status", e);
    }
  };

  // Handle next arrow click
  const handleClick = () => {
    if (currentIndex < SwiperData.length - 1) {
      const newIndex = currentIndex + 1;
      handleScrollBy(newIndex);
    } else {
      finishOnboarding(); // last slide, finish onboarding
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        style={styles.cont}
        source={require("../../assets/Onboarding.png")}
        resizeMode="cover"
      >
        <Swiper
          loop={false}
          dot={<AppSwiperDot active={false} />}
          activeDot={<AppSwiperDot active={true} />}
          paginationStyle={styles.paginationStyle}
          ref={swiperRef}
          onIndexChanged={handleIndexChanged}
        >
          {SwiperData.map((data) => (
            <View style={{ flex: 1 }} key={data.id.toString()}>
              <AppSwiperContent
                icon={data.icon}
                title={data.title}
                desc={data.desc}
                navigation={navigation}
              />
            </View>
          ))}
        </Swiper>

        <View style={{ gap: 20, paddingHorizontal: 20 }}>
          <AppButton
            btnText={"Login"}
            onPress={async () => {
              await finishOnboarding();
            }}
            btnStyles={{
              width: "100%",
              backgroundColor: Colors.white,
              borderRadius: 20,
            }}
            btnTextStyles={{
              color: Colors.black,
            }}
          />
          <AppButton
            btnText={"Join Khefue"}
            onPress={async () => {
              await finishOnboarding();
            }}
            btnStyles={{
              width: "100%",
              backgroundColor: Colors.white,
              borderRadius: 20,
            }}
            btnTextStyles={{
              color: Colors.black,
            }}
          />
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {currentIndex < SwiperData.length - 1 && (
            <Text
              style={{
                color: Colors.white,
                fontFamily: "Medium",
              }}
              onPress={async () => {
                await finishOnboarding();
              }}
            >
              Skip
            </Text>
          )}

          <View></View>

          <TouchableOpacity
            style={{
              height: 40,
              width: 40,
              borderRadius: 70,
              backgroundColor: Colors.white,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleClick}
          >
            <AntDesign name="right" size={14} color={Colors.lightPurple} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    width: "100%",
    paddingBottom: 20,
    gap: 25,
  },
});
