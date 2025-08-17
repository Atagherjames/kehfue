import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import AppHeader from "../../../components/AppHeader";
import Header from "../../../components/partners/Header";
import { ScrollView, View, Text, TouchableOpacity, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import AppButton from "../../../components/AppButton";
import { AppDefaultInput } from "../../../components/AppInput";
import DefaultDropdown from "../../../components/DefaultDropdown";

const CreatePromotion3 = ({ navigation, route }) => {
  const {image, title, details, type} = route.params
  const [target, setTarget] = useState("")
  const [showRangeModal, setShowRangeModal] = useState(false);
  const [selectedAgeRange, setSelectedAgeRange] = useState("");
  const ageranges = ["7 - 10", "10 - 15", "20 - 30", "50 - 70"];
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [selectedChannel, setSelectedChannelRange] = useState("");
  const availableChannels = ["Email", "SMS"];
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const availableCustomers = ["All customers"];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      <Header navigation={navigation} />

      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView>
          <View
            style={{
              padding: 20,
              gap: 20,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                color: Colors.labelColor,
                fontFamily: "Bold",
              }}
            >
              Create New Promotion
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign name="left" size={18} color={Colors.labelColor} />
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.black,
                  fontFamily: "Medium",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                Step 3 of 5
              </Text>
              <AntDesign name="right" size={18} color={Colors.labelColor} />
            </View>

            <Text
              style={{
                fontSize: 18,
                color: Colors.black,
                fontFamily: "Medium",
              }}
            >
              Audience
            </Text>

            <View
              style={{
                gap: 20,
              }}
            >
              <AppDefaultInput
                label={"Target Customer"}
                placeholder={"e.g 12450"}
                keyboardType="numeric"
                onChangeText={setTarget}
              />
              <DefaultDropdown
                data={ageranges}
                label={"Age range"}
                showModal={showRangeModal}
                setShowModal={setShowRangeModal}
                placeholder={"Select Age Range"}
                value={selectedAgeRange}
                setValue={setSelectedAgeRange}
              />
              <DefaultDropdown
                data={availableChannels}
                label={"Channels"}
                showModal={showChannelModal}
                setShowModal={setShowChannelModal}
                placeholder={"Select Channel"}
                value={selectedChannel}
                setValue={setSelectedChannelRange}
              />
              <DefaultDropdown
                data={availableCustomers}
                label={"Customer"}
                showModal={showCustomerModal}
                setShowModal={setShowCustomerModal}
                placeholder={"Select Customer"}
                value={selectedCustomer}
                setValue={setSelectedCustomer}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 20,
                justifyContent: "space-between",
              }}
            >
              <AppButton
                btnText={"Back"}
                btnStyles={{
                  backgroundColor: Colors.white,
                  borderColor: Colors.primary,
                  borderWidth: 1,
                }}
                btnTextStyles={{
                  color: Colors.primary,
                }}
                onPress={() => navigation.pop()}
              />
              <AppButton btnText={"Continue"} onPress={() => navigation.navigate("CreatePromotion4", {
                image,
                title,
                type,
                details,
                target,
                ageRange: selectedAgeRange,
                channel: selectedChannel,
                customer: selectedCustomer
              })} />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreatePromotion3;
