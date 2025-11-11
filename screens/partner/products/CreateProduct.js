import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/partners/Header";
import { useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { Colors } from "../../../constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useToast } from "react-native-toast-notifications";
import { AppDefaultInput } from "../../../components/AppInput";
import DefaultDropdown from "../../../components/DefaultDropdown";
import AppButton from "../../../components/AppButton";
import { apiSlice, PRODURL } from "../../../services/apiSlice";
import AppLoader from "../../../components/AppLoader";
import { useDispatch } from "react-redux";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../../recoil/UserData";

const CreateProduct = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();
  const [token, _] = useRecoilState(PartnerAccessToken);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCount, setNewCount] = useState("");
  const [newCurrency, setNewCurrency] = useState("");
  const [newCategory, setNewCategory] = useState();
  const [newPrice, setNewPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  //   Modal
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleCreate = async () => {
    if (!selectedImage) {
      toast.show("Please select an image to continue", {
        type: "warning",
      });
      return;
    }
    try {
      const uploadUrl = `${PRODURL}/partners/product`;
      setLoading(true);
      const response = await FileSystem.uploadAsync(
        uploadUrl,
        selectedImage.uri,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "thumbNail",
          parameters: {
            name: newName,
            description: newDesc,
            count: newCount,
            currency: newCurrency,
            category: newCategory,
            price: newPrice,
          },
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 200 || response.status == 201) {
        setLoading(false);
        // console.log("File uploaded successfully:", response.body);
        dispatch(apiSlice.util.invalidateTags(["product"]));
        const data = JSON.parse(response.body);
        navigation.replace("ProductDetails", { data: data?.product });
      } else {
        setLoading(false);
        const error = JSON.parse(response.body);
        console.log(error.message);
        toast.show(
          error?.message || error?.data?.message || "Something went wrong",
          {
            type: "danger",
          }
        );
      }
    } catch (error) {
      setLoading(false);
      toast.show(error?.body?.message, {
        type: "warning",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <AppLoader />}
      <Header navigation={navigation} />
      <View style={styles.topBarContainer}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.pop()}
        >
          <AntDesign name="arrowleft" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerText}>New Product</Text>
      </View>
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView>
          <View style={{ paddingHorizontal: 16, gap: 16, paddingBottom: 16 }}>
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

            <AppDefaultInput
              label={"Product Name"}
              placeholder={"Enter name"}
              value={newName}
              onChangeText={setNewName}
            />

            <AppDefaultInput
              label={"Description"}
              value={newDesc}
              onChangeText={setNewDesc}
              placeholder={"Enter Description"}
              multiline
              inputStyles={{ maxHeight: 150 }}
            />

            <AppDefaultInput
              label={"Available quantity"}
              value={newCount.toString()}
              onChangeText={setNewCount}
              placeholder={"Enter Count"}
              keyboardType="numeric"
            />
            <DefaultDropdown
              label={"Select Currency"}
              data={["NGN"]}
              value={newCurrency}
              setValue={setNewCurrency}
              placeholder={"Select currency"}
              showModal={showCurrencyModal}
              setShowModal={setShowCurrencyModal}
            />
            <AppDefaultInput
              label={"Select Price"}
              value={newPrice.toString()}
              onChangeText={setNewPrice}
              placeholder={"Enter Price"}
              keyboardType="numeric"
            />
            <DefaultDropdown
              label={"Change Category"}
              data={["Utencils", "Automobiles"]}
              value={newCategory}
              setValue={setNewCategory}
              placeholder={"Select category"}
              showModal={showCategoryModal}
              setShowModal={setShowCategoryModal}
            />

            <AppButton btnText={"Create Product"} onPress={handleCreate} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreateProduct;

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
  imageCont: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    height: 200,
    gap: 5,
  },
});
