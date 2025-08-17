import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../../recoil/UserData";
import { useDeleteOfferMutation, useGetSinglePartnerOffersQuery } from "../../../services/routes/offersRoute";
import AppLoader from "../../../components/AppLoader";
import Header from "../../../components/partners/Header";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Colors } from "../../../constants/colors";
import { convertTime } from "../../../utils/Utilities";
import AppButton from "../../../components/AppButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import AppModal from "../../../components/AppModal";
import { useToast } from "react-native-toast-notifications";

const RenderItem = ({ item, value }) => (
  <View
    style={{
      gap: 5,
      paddingBottom: 10,
      borderBottomWidth: 1,
    }}
  >
    <Text
      style={{
        fontSize: 14,
        color: Colors.primary,
        fontFamily: "Medium",
      }}
    >
      {item}
    </Text>
    <Text
      style={{
        fontSize: 16,
        color: Colors.black,
        fontFamily: "SemiBold",
      }}
    >
      {value}
    </Text>
  </View>
);

const PreviewOffer = ({ route }) => {
  const navigation = useNavigation();
  const { id } = route.params;
  const [token, _] = useRecoilState(PartnerAccessToken);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data, isLoading, isError, error } = useGetSinglePartnerOffersQuery({
    token,
    id,
  });
  const [deleteOffer, {isLoading: isDeleting}] = useDeleteOfferMutation()
  const offerDetails = data?.offer || null;
  const toast = useToast()

  useEffect(() => {
    if (isError) {
      toast.show(
        error?.data?.message || error?.message || "Something went wrong",
        {
          type: "danger",
        }
      );
    }
  }, [isError])

  const handleDelete =async () => {
    setShowDeleteModal(false)
    try {
      const deleteRes = await deleteOffer({token, id}).unwrap()
      if (deleteRes.success) {
        toast.show(deleteRes.message || deleteRes?.data?.message || "Deleted Successfully", {
          type: "success"
        })
        navigation.pop()
      }
    } catch (error) {
      toast.show(error?.data?.message || error?.message || "Something went wrong", {
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
      {(isLoading || isDeleting) && <AppLoader />}
      <Header />
      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView showsVertcalScrollIndicator={false}>
          <View style={{ gap: 20, paddingBottom: 10 }}>
            <TouchableOpacity
              style={{
                padding: 10,
              }}
              onPress={() => navigation.pop()}
            >
              <AntDesign name="arrowleft" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <Image
              source={{ uri: offerDetails?.thumbNail?.downloadUrl }}
              style={{ width: "100%", height: 250 }}
              resizeMode="cover"
            />
            <View
              style={{
                paddingHorizontal: 16,
                gap: 16,
              }}
            >
              <RenderItem item={"Title:"} value={offerDetails?.title} />
              <RenderItem
                item={"Description:"}
                value={offerDetails?.description}
              />
              <RenderItem
                item={"Offer Type:"}
                value={offerDetails?.offerType}
              />
              <RenderItem item={"Category:"} value={offerDetails?.category} />
              <RenderItem item={"Shop Link:"} value={offerDetails?.shopLink} />
              <RenderItem
                item={"Created At:"}
                value={convertTime(offerDetails?.createdAt)}
              />
              <RenderItem
                item={"Expires On:"}
                value={convertTime(offerDetails?.expirationDate)}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppButton btnText={"Update Offer"}
                  onPress={() => navigation.navigate("UpdateOffer", {
                    title: offerDetails.title,
                    desc: offerDetails.description,
                    offerType: offerDetails?.offerType,
                    shopLink: offerDetails.shopLink,
                    category: offerDetails.category,
                    id: offerDetails?.id
                  })}
                />
                <AppButton
                  btnText={"Delete Offer"}
                  btnStyles={{
                    backgroundColor: "#dd0000",
                  }}
                  onPress={() => setShowDeleteModal(true)}
                />
              </View>
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
            Are you sure you want to delete Offer?
          </Text>
          <View 
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "80%"
            }}
          >
            <AppButton
              btnText={"Cancel"}
              btnTextStyles={{
                fontSize: 12,
                color: Colors.black
              }}
              btnStyles={{
                backgroundColor: Colors.white,
                borderWidth: 1,
                borderColor: Colors.black
              }}
              onPress={() => setShowDeleteModal(false)}
            />
            <AppButton
              btnText={"Delete"}
              btnTextStyles={{
                fontSize: 12,
                color: Colors.white
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

export default PreviewOffer;
