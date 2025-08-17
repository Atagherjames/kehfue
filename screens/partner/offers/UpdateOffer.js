import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import Header from "../../../components/partners/Header";
import { useNavigation } from "@react-navigation/native";
import { AppDefaultInput } from "../../../components/AppInput";
import DefaultDropdown from "../../../components/DefaultDropdown";
import AppButton from "../../../components/AppButton";
import { Text, View, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useUpdateOfferMutation } from "../../../services/routes/offersRoute";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../../../components/AppLoader";

const UpdateOffer = ({ route }) => {
  const navigation = useNavigation();
  const [token, _] = useRecoilState(PartnerAccessToken);
  const { title, desc, offerType, id, category } = route?.params;
  const [newTitle, setNewTitle] = useState(title);
  const [newDesc, setNewDesc] = useState(desc);
  const [newOfferType, setNewOfferType] = useState(offerType);
  const [newCategory, setNewCategory] = useState(category);
  const [showCategoryModal, setShowcategoryModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [updateOffer, { isLoading }] = useUpdateOfferMutation();
  const categories = [
    "Travel",
    "Groceries",
    "Dining",
    "Fitness",
    "Events",
    "Pharmacy",
    "Hotel",
    "Movies",
    "Shopping",
    "Air Tickets",
  ];
  const toast = useToast();

  const handleUpdate = async () => {
    const body = {
      title: newTitle,
      description: newDesc,
      offerType: newOfferType,
      category: newCategory,
    };
    try {
      const updateRes = await updateOffer({ token, id, body });
      console.log(updateRes);
      if (updateRes.data.success) {
        toast.show(
          updateRes.message ||
            updateRes?.data?.message ||
            "Offer Updated Successfully",
          {
            type: "success",
          }
        );
        navigation.pop();
      } else {
        toast.show(
          updateRes.message ||
            updateRes?.error?.data?.message ||
            "Something went wrong",
          {
            type: "danger",
          }
        );
      }
    } catch (error) {
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
      <Header navigation={navigation} />
      <View
        style={{
          flex: 1,
          gap: 16,
          padding: 16,
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
            Update Offer
          </Text>
        </View>
        <AppDefaultInput
          label={"Edit title"}
          placeholder={"Enter New Title"}
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <AppDefaultInput
          label={"Edit description"}
          placeholder={"Enter New Description"}
          value={newDesc}
          onChangeText={setNewDesc}
        />
        <DefaultDropdown
          data={categories}
          label={"Edit category"}
          setValue={setNewCategory}
          value={newCategory}
          showModal={showCategoryModal}
          setShowModal={setShowcategoryModal}
        />
        <DefaultDropdown
          data={["loadable", "shoppable"]}
          label={"Edit offer type"}
          setValue={setNewOfferType}
          value={newOfferType}
          showModal={showModal}
          setShowModal={setShowModal}
        />
        <AppButton btnText={"Update Offer"} onPress={handleUpdate} />
      </View>
    </SafeAreaView>
  );
};

export default UpdateOffer;
