import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import {Colors} from "../../constants/colors"
import AppButton from "../AppButton"

const AppSwiperContent = ({ icon, title, desc, navigation }) => {
  return (
    <View style={styles.swiperBox}>
        <Image
          source = {icon}
          style = {styles.illustration}
          resizeMode = {"contain"}
        />
        <Text
          style = {styles.header}
        >
          {title}
        </Text>
        <Text
          style = {styles.desc}
        >
          {desc}
        </Text>
        
      
    </View>
  );
};

export default AppSwiperContent;

const styles = StyleSheet.create({
  swiperBox: {
    flex: 1,
    marginTop: 15,
    marginHorizontal: 0,
    padding: 10,
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  illustration: {
    width: "100%",
    height: 250,
    
  },
  header: {
    fontSize: 30,
    fontFamily: "Bold",
    color: Colors.white,
    paddingHorizontal: 20,
    textAlign: "center"
  },
  desc: {
    fontSize: 12,
    fontFamily: "Medium",
    color: Colors.white,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  btnContainer: {
    flexDirection: "row",
  }
});
