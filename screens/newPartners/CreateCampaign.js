import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomDrawer from "../../components/CustomDrawer";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  TextInput,
  Modal,
} from "react-native";
import { Colors } from "../../constants/colors";
import { AppDefaultInput } from "../../components/AppInput";
import { apiSlice, PRODURL } from "../../services/apiSlice";
import AppLoader from "../../components/AppLoader";
import { useDispatch } from "react-redux";
import { useRecoilState } from "recoil";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import AppButton from "../../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import { AccessToken, PartnerAccessToken } from "../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import DefaultDropdown from "../../components/DefaultDropdown";
import { useGetPartnersCustomerQuery } from "../../services/routes/userRoutes";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Entypo } from "@expo/vector-icons";

const CreateCampaign = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const dispatch = useDispatch();
  const [token, _] = useRecoilState(PartnerAccessToken);
  const { data, isLoading, isError, error } = useGetPartnersCustomerQuery({
    token,
    page: 1,
    pageSize: 50000,
  });

  const customerData = data?.record?.data || [];
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [target, setTarget] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const promotionTypes = ["Load Card", "Shop Now"];
  const channels = ["Email", "SMS", "Customers"];
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState("");
  const [selectedEffects, setSelectedEffects] = useState(["Discount"]);
  const [effectModalVisible, setEffectModalVisible] = useState(false);
  const [currentEffectIndex, setCurrentEffectIndex] = useState(null);
  const [rules, setRules] = useState([{ condition: "", discount: "" }]);
  const [loading, setLoading] = useState(false);

  const [dateFrom, setDateFrom] = useState(new Date());
  const [showFrom, setShowFrom] = useState(false);
  const [dateTo, setDateTo] = useState(new Date());
  const [showTo, setShowTo] = useState(false);

  const [timeFrom, setTimeFrom] = useState(new Date());
  const [showTimeFrom, setShowTimeFrom] = useState(false);
  const [timeTo, setTimeTo] = useState(new Date());
  const [showTimeTo, setShowTimeTo] = useState(false);

  const onChangeFromDate = (event, selectedDate) => {
    const currentDate = selectedDate || dateFrom;
    setShowFrom(Platform.OS === "ios");
    setShowFrom(Platform.OS === "android" && false);
    setDateFrom(currentDate);
  };
  const onChangeToDate = (event, selectedDate) => {
    const currentDate = selectedDate || dateTo;
    setShowTo(Platform.OS === "ios");
    setShowTo(Platform.OS === "android" && false);
    setDateTo(currentDate);
  };

  const onChangeTimeFrom = (event, selectedTime) => {
    const currentTime = selectedTime || timeFrom;
    setShowTimeFrom(Platform.OS === "ios");
    setTimeFrom(currentTime);
  };

  const onChangeTimeTo = (event, selectedTime) => {
    const currentTime = selectedTime || timeTo;
    setShowTimeTo(Platform.OS === "ios");
    setTimeTo(currentTime);
  };

  const handleConditionChange = (index, newCondition) => {
    const updatedRules = [...rules];
    updatedRules[index].condition = newCondition;
    setRules(updatedRules);
  };

  const handleDiscountChange = (index, newDiscount) => {
    const updatedRules = [...rules];
    updatedRules[index].discount = newDiscount;
    setRules(updatedRules);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (err) {}
  };

  const handleCreate = async () => {
    if (
      !title ||
      !details ||
      !target ||
      !ageRange ||
      !selectedChannel ||
      !selectedCustomer ||
      !selectedCheck ||
      !dateFrom ||
      !dateTo ||
      !selectedType
    ) {
      toast.show("All fields are required to continue", {
        type: "warning",
      });
      return;
    }

    if (rules.length === 0 || !rules[0].condition || !rules[0].discount) {
      toast.show(
        "At least one rule with a condition and discount is required.",
        {
          type: "warning",
        }
      );
      return;
    }

    const ageParts = ageRange.split("-").map((v) => Number(v.trim()));
    if (ageParts.length !== 2 || ageParts.some(isNaN)) {
      toast.show("Please enter a valid age range like 20 - 50", {
        type: "warning",
      });
      return;
    }

    const allConditions = rules.map((rule) => rule.condition);
    const primaryEffectType =
      selectedEffects[0] === "Discount" ? "discount" : "points";
    const primaryEffectValue = rules[0].discount;

    let parsedEffectValue = null;
    if (primaryEffectValue) {
      parsedEffectValue = parseFloat(primaryEffectValue);
      if (isNaN(parsedEffectValue)) {
        toast.show("Discount/Effect value must be a number.", {
          type: "warning",
        });
        setLoading(false);
        return;
      }
    } else {
      toast.show("Effect value is required for the rule.", { type: "warning" });
      setLoading(false);
      return;
    }

    const campaignEffect = {
      type: primaryEffectType,
      [primaryEffectType === "discount" ? "percent" : "points"]:
        parsedEffectValue,
    };

    const timeRangeHours = `${timeFrom.getHours()}-${timeTo.getHours()}`;

    try {
      const uploadUrl = `${PRODURL}/promotion/create`;
      setLoading(true);
      const response = await FileSystem.uploadAsync(
        uploadUrl,
        selectedImage.uri,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "thumbNail",
          parameters: {
            title: title.toString(),
            details: details.toString(),
            targetCustomers: target.toString(),
            ageRange: JSON.stringify(ageParts),
            channels: JSON.stringify(selectedChannel),
            customer: selectedCustomer.toString(),
            check: selectedCheck.toString(),
            timeRange: timeRangeHours,
            duration: JSON.stringify([dateFrom, dateTo]),
            type: selectedType,
            conditions: JSON.stringify(allConditions),
            effect: JSON.stringify(campaignEffect),
            websiteURL: websiteUrl,
          },
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 200 || response.status == 201) {
        setLoading(false);
        dispatch(apiSlice.util.invalidateTags(["campaign"]));
        const data = JSON.parse(response.body);
        navigation.pop();
        toast.show(data?.message || "Successful", { type: "success" });
      } else {
        setLoading(false);
        const error = JSON.parse(response.body);
        toast.show(error?.message || "Something went wrong", {
          type: "danger",
        });
      }
    } catch (error) {
      setLoading(false);
      toast.show(error?.body?.message || "Something went wrong", {
        type: "danger",
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomDrawer />
      {loading && <AppLoader />}
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          backgroundColor: Colors.white,
          margin: 20,
          borderRadius: 20,
          gap: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "SemiBold",
            color: Colors.darkBlue,
            fontSize: 20,
          }}
        >
          Create a New Campaign
        </Text>
        <AppDefaultInput
          label={"Campaign title"}
          placeholder={"Campaign title"}
          onChangeText={setTitle}
          value={title}
        />
        <AppDefaultInput
          label={"Campaign details"}
          placeholder={"Campaign details"}
          onChangeText={setDetails}
          multiline
          inputStyles={{ height: 200, textAlignVertical: "top" }}
          style={{}}
          value={details}
        />
        <AppDefaultInput
          label={"Website URL"}
          placeholder={"www.khefue.com"}
          onChangeText={setWebsiteUrl}
          value={websiteUrl}
        />
        <DefaultDropdown
          label={"Campaign Type"}
          placeholder={"Campaign type"}
          data={promotionTypes}
          showModal={showTypeModal}
          setShowModal={setShowTypeModal}
          value={selectedType}
          setValue={setSelectedType}
        />

        <Text
          style={{
            fontFamily: "SemiBold",
            fontSize: 16,
            color: Colors.darkBlue,
          }}
        >
          Audience
        </Text>
        <AppDefaultInput
          label={"Target Customers"}
          placeholder={"e.g 12450"}
          onChangeText={setTarget}
          keyboardType={"number-pad"}
          value={target}
        />
        <AppDefaultInput
          label={"Age range"}
          placeholder={"18 - 25"}
          onChangeText={setAgeRange}
          value={ageRange}
        />
        <DefaultDropdown
          label={"Channels"}
          placeholder={"Email, SMS"}
          data={channels}
          showModal={showChannelModal}
          setShowModal={setShowChannelModal}
          value={selectedChannel}
          setValue={setSelectedChannel}
        />
        <DefaultDropdown
          label={"Customer"}
          placeholder={"Customers"}
          data={customerData.map((c) => `${c.firstName} ${c.lastName}`)}
          showModal={showCustomerModal}
          setShowModal={setShowCustomerModal}
          value={selectedCustomer}
          setValue={setSelectedCustomer}
        />

        <Text
          style={{
            fontFamily: "SemiBold",
            fontSize: 16,
            color: Colors.darkBlue,
          }}
        >
          Time Manage
        </Text>
        <DefaultDropdown
          label={"Check"}
          placeholder={"Every hour"}
          data={["hourly", "daily", "weekly", "monthly"]}
          showModal={showCheckModal}
          setShowModal={setShowCheckModal}
          value={selectedCheck}
          setValue={setSelectedCheck}
        />

        <View>
          <Text
            style={{
              fontFamily: "Medium",
              fontSize: 14,
              color: Colors.labelColor,
            }}
          >
            Time range
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 10,
              borderColor: Colors.inputBorder,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowTimeFrom(true)}
              style={styles.timeBox}
            >
              <Text style={styles.timeText}>
                {timeFrom?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                backgroundColor: Colors.footerGrey,
                height: "100%",
                padding: 12,
                fontFamily: "Medium",
                color: Colors.darkBlue,
              }}
            >
              -
            </Text>
            <TouchableOpacity
              onPress={() => setShowTimeTo(true)}
              style={styles.timeBox}
            >
              <Text style={styles.timeText}>
                {timeTo?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "Medium",
              fontSize: 14,
              color: Colors.labelColor,
            }}
          >
            Run length
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 10,
              borderColor: Colors.inputBorder,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowFrom(true)}
              style={styles.dateBox}
            >
              <Text style={styles.dateText}>
                {dateFrom?.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                backgroundColor: Colors.footerGrey,
                height: "100%",
                padding: 12,
                fontFamily: "Medium",
                color: Colors.darkBlue,
              }}
            >
              To
            </Text>
            <TouchableOpacity
              onPress={() => setShowTo(true)}
              style={styles.dateBox}
            >
              <Text style={styles.dateText}>
                {dateTo?.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={{
            fontFamily: "SemiBold",
            fontSize: 16,
            color: Colors.darkBlue,
          }}
        >
          Rule
        </Text>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <Text style={styles.conditionText}>Condition</Text>
          <Text style={styles.conditionText}>Effect</Text>
        </View>
        <View style={{ gap: 10 }}>
          {rules.map((item, i) => (
            <View style={{ flexDirection: "row", gap: 20 }} key={i}>
              <TextInput
                placeholder="e.g When Coupon is valid"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: Colors.inputBorder,
                  padding: 10,
                  borderRadius: 5,
                  height: 48,
                }}
                onChangeText={(text) => handleConditionChange(i, text)}
                value={item.condition}
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: Colors.inputBorder,
                  borderRadius: 5,
                  overflow: "hidden",
                  height: 48,
                }}
              >
                <TextInput
                  keyboardType="numeric"
                  style={{
                    flex: 0.4, // Adjusted flex
                    paddingHorizontal: 10, // Padding for text input
                    height: "100%", // Take full height of parent
                  }}
                  onChangeText={(text) => handleDiscountChange(i, text)}
                  value={item.discount}
                />
                {selectedEffects[i] === "Discount" && (
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Medium",
                      color: Colors.textGrey,
                      marginRight: 5, // Small margin for spacing
                    }}
                  >
                    %
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setCurrentEffectIndex(i);
                    setEffectModalVisible(true);
                  }}
                  style={{
                    flex: 0.6,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                    backgroundColor: Colors.footerGrey,
                    height: "100%",
                  }}
                >
                  <Text style={{ fontSize: 14 }}>
                    {selectedEffects[i] || "Discount"}
                  </Text>
                  <Entypo
                    name="chevron-down"
                    size={14}
                    color={Colors.placeholderColor}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <Text
          onPress={() => {
            setRules([...rules, { condition: "", discount: "" }]);
            setSelectedEffects([...selectedEffects, "Discount"]);
          }}
          style={{
            fontFamily: "SemiBold",
            color: Colors.primary,
            fontSize: 14,
            textAlign: "right",
          }}
        >
          Add Another Rule
        </Text>

        <View>
          <Text style={{ fontFamily: "Medium", color: Colors.labelColor }}>
            Campaign Image
          </Text>
          <TouchableOpacity onPress={pickImage} style={styles.imageCont}>
            {selectedImage && (
              <Image
                source={{
                  uri: selectedImage.uri,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
            <Text>Click to {selectedImage ? "change" : "select"} image</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <AppButton
            btnStyles={{
              alignSelf: "flex-start",
              marginBottom: 20,
              backgroundColor: Colors.lightGrey,
            }}
            btnText={"Cancel"}
            onPress={() => navigation.pop()}
            btnTextStyles={{ color: Colors.primary }}
          />
          <AppButton
            btnStyles={{ alignSelf: "flex-start", marginBottom: 20 }}
            btnText={"Save"}
            onPress={handleCreate}
          />
        </View>
      </ScrollView>

      {showFrom && (
        <DateTimePicker
          value={dateFrom}
          mode={"date"}
          is24Hour={true}
          display="default"
          onChange={onChangeFromDate}
          minimumDate={new Date()}
        />
      )}
      {showTo && (
        <DateTimePicker
          value={dateTo}
          mode={"date"}
          is24Hour={true}
          display="default"
          onChange={onChangeToDate}
          minimumDate={new Date(dateFrom)}
        />
      )}
      {showTimeFrom && (
        <DateTimePicker
          value={timeFrom}
          mode={"time"}
          is24Hour={true}
          display="default"
          onChange={onChangeTimeFrom}
        />
      )}
      {showTimeTo && (
        <DateTimePicker
          value={timeTo}
          mode={"time"}
          is24Hour={true}
          display="default"
          onChange={onChangeTimeTo}
        />
      )}

      <Modal
        animationType="none"
        transparent
        visible={effectModalVisible}
        onRequestClose={() => setEffectModalVisible(false)}
      >
        <TouchableOpacity
          onPress={() => setEffectModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
          activeOpacity={1}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 10,
              width: "100%",
              paddingVertical: 20,
              paddingHorizontal: 15,
            }}
          >
            <Text
              style={{
                fontFamily: "SemiBold",
                fontSize: 16,
                marginBottom: 10,
                color: Colors.darkBlue,
              }}
            >
              Select Effect
            </Text>
            {["Discount", "Points"].map((effect) => (
              <TouchableOpacity
                key={effect}
                onPress={() => {
                  const updatedEffects = [...selectedEffects];
                  updatedEffects[currentEffectIndex] = effect;
                  setSelectedEffects(updatedEffects);
                  setEffectModalVisible(false);
                }}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                }}
              >
                <Text style={{ fontFamily: "Medium", fontSize: 14 }}>
                  {effect}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default CreateCampaign;

const styles = StyleSheet.create({
  imageCont: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    height: 200,
    gap: 5,
    borderColor: Colors.inputBorder,
  },
  dateBox: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dateText: {
    textAlign: "center",
    fontFamily: "Medium",
    color: Colors.textGrey,
    fontSize: 16,
  },
  timeBox: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  timeText: {
    textAlign: "center",
    fontFamily: "Medium",
    color: Colors.textGrey,
    fontSize: 16,
  },
  conditionText: {
    fontFamily: "SemiBold",
    fontSize: 16,
    color: Colors.darkBlue,
    flex: 1,
  },
});
