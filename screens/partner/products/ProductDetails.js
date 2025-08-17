import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/partners/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "../../../constants/colors";
import AppButton from "../../../components/AppButton";
import EditProductModal from "../../../components/partners/EditProductModal";
import {
  useDeleteProductMutation,
  usePublishProductMutation,
} from "../../../services/routes/productRoute";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../../../components/AppLoader";
import AppModal from "../../../components/AppModal";
import CustomDrawer from "../../../components/CustomDrawer";

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
const RenderItemBox = ({ item, value }) => (
  <View
    style={{
      gap: 5,
      backgroundColor: Colors.primary,
      padding: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      width: "45%",
    }}
  >
    <Text
      style={{
        fontSize: 14,
        color: Colors.grey,
        fontFamily: "Regular",
      }}
    >
      {item}
    </Text>
    <Text
      style={{
        fontSize: 16,
        color: Colors.white,
        fontFamily: "SemiBold",
      }}
    >
      {value}
    </Text>
  </View>
);

const ProductDetails = ({ route }) => {
  const navigation = useNavigation();
  const { data } = route.params;
  const [token, _] = useRecoilState(PartnerAccessToken);
  const [publishProduct, { isLoading }] = usePublishProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toast = useToast();

  const handlePublish = async () => {
    const body = {
      productId: data?.id,
      publish: !data?.isPublished,
    };
    try {
      const response = await publishProduct({ token, body }).unwrap();
      if (response.status) {
        toast.show(
          response.message || response?.data?.message || "Successful",
          {
            type: "success",
          }
        );
        navigation.pop();
      }
    } catch (error) {
      toast.show(
        error?.message || error?.data?.message || "Something went wrong",
        {
          type: "danger",
        }
      );
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    const body = {
      productId: data?.id,
      publish: !data?.isPublished,
    };
    try {
      const response = await deleteProduct({ token, id: data?.id }).unwrap();
      console.log(response);
      if (response.status) {
        toast.show(
          response.message || response?.data?.message || "Successful",
          {
            type: "success",
          }
        );
        navigation.pop();
      }
    } catch (error) {
      console.log(error);
      toast.show(
        error?.message || error?.data?.message || "Something went wrong",
        {
          type: "danger",
        }
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {(isLoading || isDeleting) && <AppLoader />}
      <CustomDrawer />
      <View style={styles.topBarContainer}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.pop()}
        >
          <AntDesign name="arrowleft" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Product Details</Text>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{}}>
            <Image
              source={{ uri: data?.thumbNail?.downloadUrl }}
              style={styles.pImage}
            />
            <View style={{ padding: 16, gap: 16 }}>
              <RenderItem item={"Product Name:"} value={data?.name} />
              <RenderItem
                item={"Product Description:"}
                value={data?.description}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                rowGap: 10,
                paddingHorizontal: 16,
                paddingVertical: 5,
                marginBottom: 20,
                justifyContent: "space-between",
              }}
            >
              <RenderItemBox item={"Category:"} value={data?.category} />
              <RenderItemBox
                item={"Price:"}
                value={data?.currency + " " + data?.price}
              />
              <RenderItemBox item={"Quantity left:"} value={data?.count} />
              <RenderItemBox
                item={"Quantity sold:"}
                value={data?.totalBought}
              />
              <RenderItemBox
                item={"Total Revenue:"}
                value={data?.currency + " " + data?.price * data?.totalBought}
              />
            </View>
            <View style={{ paddingHorizontal: 16 }}>
              <AppButton
                btnText={data?.isPublished ? "Unpublish" : "Publish"}
                onPress={handlePublish}
              />
            </View>
            <View style={styles.btnBox}>
              <AppButton
                btnText={"Edit"}
                btnStyles={{
                  flex: 1,
                  backgroundColor: Colors.white,
                  borderWidth: 1,
                  borderColor: Colors.primary,
                }}
                btnTextStyles={{ color: Colors.primary }}
                onPress={() => navigation.navigate("EditProduct", { data })}
              />
              <AppButton
                btnText={"Delete"}
                btnStyles={{
                  backgroundColor: Colors.red,
                  flex: 1,
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
            Are you sure you want to delete Product?
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

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backBtn: {
    padding: 5,
  },
  headerText: {
    fontSize: 20,
    flex: 1,
    textAlign: "center",
    fontFamily: "SemiBold",
    color: Colors.labelColor,
  },
  pImage: {
    width: "100%",
    height: 200,
  },
  pName: {
    fontSize: 18,
    fontFamily: "Bold",
    color: Colors.labelColor,
  },
  btnBox: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 16,
  },
});
