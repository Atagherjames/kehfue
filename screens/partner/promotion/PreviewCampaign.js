import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import Header from "../../../components/partners/Header";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, View, Text, TouchableOpacity, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { convertTime } from "../../../utils/Utilities";
import AppButton from "../../../components/AppButton";
import AppModal from "../../../components/AppModal";
import { useDeleteCampaignMutation } from "../../../services/routes/offersRoute";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../../../components/AppLoader";
import CustomDrawer from "../../../components/CustomDrawer";

const RenderItem = ({ item, value, type }) => (
  <View
    style={{
      gap: type == "small" ? 3 : 10,
      borderLeftWidth: 1,
      paddingLeft: 10,
      borderColor: Colors.textGrey,
    }}
  >
    <Text
      style={{
        fontSize: 14,
        color: Colors.labelColor,
        fontFamily: "Medium",
      }}
    >
      {item}
    </Text>
    <Text
      style={{
        fontSize: type == "small" ? 16 : 14,
        color: Colors.black,
        fontFamily: type == "small" ? "Bold" : "Medium",
      }}
    >
      {value}
    </Text>
  </View>
);

const PreviewCampaign = ({ route }) => {
  const navigation = useNavigation();
  const [token, _] = useRecoilState(PartnerAccessToken);
  const { data } = route?.params;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCampaign, { isLoading }] = useDeleteCampaignMutation();
  const toast = useToast();
  const handleDelete = async () => {
    setShowDeleteModal(false);
    try {
      const deleteRes = await deleteCampaign({ token, id: data?.id }).unwrap();
      if (deleteRes.success) {
        toast.show(
          deleteRes.message ||
            deleteRes?.data?.message ||
            "Deleted Successfully",
          {
            type: "success",
          }
        );
        navigation.pop();
      }
    } catch (error) {
      console.log(error);
      toast.show(
        error?.data?.message || error?.message || "Something went wrong",
        {
          type: "danger",
        }
      );
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      {isLoading && <AppLoader />}
      {/* <Header navigation={navigation} /> */}
      <CustomDrawer />
      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView>
          <View
            style={{
              padding: 16,
              gap: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 5,
                }}
                onPress={() => navigation.pop()}
              >
                <AntDesign name="arrowleft" size={24} color={Colors.primary} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  flex: 1,
                  textAlign: "center",
                  fontFamily: "SemiBold",
                  color: Colors.labelColor,
                }}
              >
                Promotion Details
              </Text>
            </View>

            <View
              style={{
                gap: 20,
              }}
            >
              <Image
                source={{ uri: data?.thumbNail?.downloadUrl }}
                style={{
                  width: "100%",
                  height: 250,
                  borderRadius: 20,
                }}
                resizeMode="cover"
              />
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "SemiBold",
                  color: Colors.labelColor,
                }}
              >
                {data.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Medium",
                  color: Colors.labelColor,
                  paddingLeft: 10,
                  borderLeftWidth: 1,
                }}
              >
                {data.details}
              </Text>

              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Medium",
                    color: Colors.black,
                  }}
                >
                  Reward
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 20,
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <RenderItem item={"Clicks"} value={"122"} type={"small"} />
                  <RenderItem
                    item={"Impression"}
                    value={"122"}
                    type={"small"}
                  />
                  <RenderItem
                    item={"Total Cost"}
                    value={"$2.5"}
                    type={"small"}
                  />
                  <RenderItem
                    item={"Budget"}
                    value={"$122 p/day"}
                    type={"small"}
                  />
                  <RenderItem
                    item={"End Date"}
                    value={new Date(data?.duration[1]).toDateString()}
                    type={"small"}
                  />
                </View>
              </View>
              <View
                style={{
                  gap: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "SemiBold",
                    color: Colors.black,
                  }}
                >
                  Audience
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <RenderItem
                    item={"Target Customer"}
                    value={data?.targetCustomers}
                  />
                  <RenderItem
                    item={"Age Range"}
                    value={`${data?.ageRange[0]} - ${data?.ageRange[1]}`}
                  />
                  <RenderItem item={"Channels"} value={data?.channels} />
                </View>
              </View>
              <View
                style={{
                  gap: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "SemiBold",
                    color: Colors.black,
                  }}
                >
                  Time Manage
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <RenderItem item={"Check"} value={data?.check} />
                  <RenderItem item={"Time Range"} value={data?.timeRange} />
                  <RenderItem
                    item={"Run Length"}
                    value={`${new Date(
                      data?.duration[0]
                    ).toDateString()} - ${new Date(
                      data?.duration[1]
                    ).toDateString()}`}
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <AppButton
                btnText={"Edit"}
                btnTextStyles={{
                  fontSize: 12,
                  color: Colors.black,
                }}
                btnStyles={{
                  backgroundColor: Colors.white,
                  borderWidth: 1,
                  borderColor: Colors.black,
                  width: 100,
                }}
                onPress={() => navigation.navigate("UpdatePromotion", { data })}
              />
              <AppButton
                btnText={"Delete"}
                btnTextStyles={{
                  fontSize: 12,
                  color: Colors.white,
                }}
                btnStyles={{
                  backgroundColor: "#dd0000",
                  width: 100,
                }}
                onPress={() => setShowDeleteModal(true)}
              />
            </View>
          </View>
        </ScrollView>
      </View>

      <AppModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <View
          style={{
            alignItems: "center",
            gap: 16,
          }}
        >
          <AntDesign name="closecircle" size={40} color="#dd0000" />
          <Text
            style={{
              fontFamily: "SemiBold",
              textAlign: "center",
              color: Colors.black,
              fontSize: 18,
            }}
          >
            Are you sure you want to delete Promotion?
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "80%",
            }}
          >
            <AppButton
              btnText={"Cancel"}
              btnTextStyles={{
                fontSize: 12,
                color: Colors.black,
              }}
              btnStyles={{
                backgroundColor: Colors.white,
                borderWidth: 1,
                borderColor: Colors.black,
              }}
              onPress={() => setShowDeleteModal(false)}
            />
            <AppButton
              btnText={"Delete"}
              btnTextStyles={{
                fontSize: 12,
                color: Colors.white,
              }}
              btnStyles={{
                backgroundColor: "#dd0000",
              }}
              onPress={handleDelete}
            />
          </View>
        </View>
      </AppModal>
    </SafeAreaView>
  );
};

export default PreviewCampaign;
