import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import AppHeader from "../../../components/AppHeader";
import Header from "../../../components/partners/Header";
import { ScrollView, View, Text, TouchableOpacity, Image, Platform } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import AppButton from "../../../components/AppButton";
import { AppDefaultInput } from "../../../components/AppInput";
import DefaultDropdown from "../../../components/DefaultDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";

const CreatePromotion4 = ({ navigation, route }) => {
  const { image, title, type, details, target, ageRange, channel, customer } =
    route.params;
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState("");
  const availableChecks = ["daily"];
  const [showTimeRangeModal, setShowTimeRangeModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState("");
  const availableTimeRange = ["Today"];
  const [showRunLengthModal, setShowRunLengthModal] = useState(false);
  const [selectedRunLength, setSelectedRunLength] = useState("");
  const availableRunLength = [
    "15th September - 15th October",
    "15th September - 15th November",
    "15th September - 15th December",
  ];
  
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date"); // Mode can be 'date' or 'time'
  const [show, setShow] = useState(false);
  
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // console.log(currentDate)
    setShow(Platform.OS === "ios"); // For iOS, keep the picker open after selection
    setShow(Platform.OS === "android" && false);
    setDate(currentDate); // Update the selected date/time
    setSelectedRunLength(`${currentDate.getFullYear().toString()}-${(currentDate.getMonth() + 1).toString()}-${currentDate.getDate()}`)
    // console.log(selectedRunLength)
  };

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
                Step 4 of 5
              </Text>
              <AntDesign name="right" size={18} color={Colors.labelColor} />
            </View>

            <Text
              style={{
                fontSize: 18,
                color: Colors.black,
                fontFamily: "SemiBold",
              }}
            >
              Time Manage
            </Text>

            <View
              style={{
                gap: 20,
              }}
            >
              <DefaultDropdown
                data={availableChecks}
                label={"Check"}
                showModal={showCheckModal}
                setShowModal={setShowCheckModal}
                placeholder={"Select Check"}
                value={selectedCheck}
                setValue={setSelectedCheck}
              />
              <DefaultDropdown
                data={availableTimeRange}
                label={"Time Range"}
                showModal={showTimeRangeModal}
                setShowModal={setShowTimeRangeModal}
                placeholder={"Select Time Range"}
                value={selectedRange}
                setValue={setSelectedRange}
              />
              {/* <DefaultDropdown
                data={availableRunLength}
                label={"Run Length"}
                showModal={showRunLengthModal}
                setShowModal={setShowRunLengthModal}
                placeholder={"Select Run Length"}
                value={selectedRunLength}
                setValue={setSelectedRunLength}
              /> */}
              <View
                style={{
                  gap: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Medium",
                    color: Colors.labelColor,
                  }}
                >
                  Select Run Length
                </Text>

                <TouchableOpacity
                  style={{
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    borderWidth: 0.3,
                    borderRadius: 5,
                    borderColor: Colors.borderColor,
                  }}
                  onPress={() => setShow(true)}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Medium",
                      color: Colors.placeholderColor,
                    }}
                  >
                    {date.toDateString()}
                  </Text>
                </TouchableOpacity>
              </View>
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
              <AppButton btnText={"Continue"} onPress={() => navigation.navigate("CreatePromotion5", {
                image,
                title,
                type,
                details,
                target,
                ageRange,
                channel,
                customer,
                check: selectedCheck,
                timeRange: selectedRange,
                duration: selectedRunLength
              })} />
            </View>
          </View>
        </ScrollView>
      </View>

      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
};

export default CreatePromotion4;
