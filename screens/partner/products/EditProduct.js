import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { useEditProductMutation } from "../../../services/routes/productRoute";
import AppLoader from "../../../components/AppLoader";
import { useDispatch } from "react-redux";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../../recoil/UserData";
import CustomDrawer from "../../../components/CustomDrawer";

const EditProduct = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();
  const [token] = useRecoilState(PartnerAccessToken);

  const {
    name,
    storeId,
    description,
    thumbNail,
    count,
    currency,
    category,
    price,
    id,
    brand,
    size,
    colour,
    tag,
  } = route?.params?.data;

  const [editProduct, { isLoading }] = useEditProductMutation();
  const [newName, setNewName] = useState(name);
  const [newDesc, setNewDesc] = useState(description);
  const [newCount, setNewCount] = useState(count.toString());
  const [newCurrency, setNewCurrency] = useState(currency);
  const [newCategory, setNewCategory] = useState(category);
  const [newPrice, setNewPrice] = useState(price.toString());
  const [newBrand, setNewBrand] = useState(brand || "");
  const [newSize, setNewSize] = useState(size?.join(", ") || "");
  const [newColour, setNewColour] = useState(colour?.join(", ") || "");
  const [newTag, setNewTag] = useState(tag?.join(", ") || "");
  const [selectedImage, setSelectedImage] = useState(null);
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

  const handleUpdate = async () => {
    try {
      const uploadUrl = `${PRODURL}/partners/product/update/${id}`;
      const bodyFields = {
        storeId: storeId,
        name: newName,
        description: newDesc,
        count: newCount,
        currency: newCurrency,
        category: newCategory,
        price: newPrice,
        brand: newBrand,
        size: newSize,
        colour: newColour,
        tag: newTag,
      };

      if (selectedImage) {
        setLoading(true);
        const response = await FileSystem.uploadAsync(
          uploadUrl,
          selectedImage.uri,
          {
            httpMethod: "PUT",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: "thumbNail",
            parameters: bodyFields,
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${token}`,
            },
          }
        );

        setLoading(false);
        if (response.status === 200 || response.status === 201) {
          dispatch(apiSlice.util.invalidateTags(["product"]));
          navigation.navigate("ViewProducts");
        } else {
          const error = JSON.parse(response.body);
          toast.show(error?.message || "Image upload failed", {
            type: "danger",
          });
        }
      } else {
        const jsonBody = {
          ...bodyFields,
          count: Number(newCount),
          price: Number(newPrice),
          size: newSize.split(",").map((v) => v.trim()),
          colour: newColour.split(",").map((v) => v.trim()),
          tag: newTag.split(",").map((v) => v.trim()),
          uploadInfo: {
            fileSize: thumbNail?.metadata?.size,
            url: thumbNail?.downloadUrl,
          },
        };

        const updateRes = await editProduct({
          token,
          id,
          body: jsonBody,
        }).unwrap();

        if (updateRes.success || updateRes?.data?.success) {
          toast.show(
            updateRes.message ||
              updateRes?.data?.message ||
              "Product Updated Successfully",
            { type: "success" }
          );
          navigation.navigate("ViewProducts");
        } else {
          toast.show(updateRes?.message || "Update failed", {
            type: "danger",
          });
        }
      }
    } catch (error) {
      setLoading(false);
      toast.show(
        error?.data?.message || error?.message || "Something went wrong",
        {
          type: "danger",
        }
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {(isLoading || loading) && <AppLoader />}
      <CustomDrawer />
      <View style={styles.topBarContainer}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.pop()}
        >
          <AntDesign name="arrowleft" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Product</Text>
      </View>
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView>
          <View style={{ paddingHorizontal: 16, gap: 16, paddingBottom: 16 }}>
            <TouchableOpacity onPress={pickImage} style={styles.imageCont}>
              <Image
                source={{
                  uri: selectedImage?.uri || thumbNail?.downloadUrl,
                }}
                style={{ width: "100%", height: "100%" }}
              />
              <Text>Click to change image</Text>
            </TouchableOpacity>

            <AppDefaultInput
              label="Name"
              value={newName}
              onChangeText={setNewName}
            />
            <AppDefaultInput
              label="Description"
              value={newDesc}
              onChangeText={setNewDesc}
              multiline
              inputStyles={{ maxHeight: 150 }}
            />
            <AppDefaultInput
              label="Quantity"
              value={newCount}
              onChangeText={setNewCount}
              keyboardType="numeric"
            />
            {/* <DefaultDropdown
              label="Currency"
              data={["NGN"]}
              value={newCurrency}
              setValue={setNewCurrency}
              showModal={showCurrencyModal}
              setShowModal={setShowCurrencyModal}
            /> */}
            <AppDefaultInput
              label="Price"
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="numeric"
            />
            <DefaultDropdown
              label="Category"
              data={["Utencils", "Automobiles", "No category"]}
              value={newCategory}
              setValue={setNewCategory}
              showModal={showCategoryModal}
              setShowModal={setShowCategoryModal}
            />
            <AppDefaultInput
              label="Brand"
              value={newBrand}
              onChangeText={setNewBrand}
            />
            <AppDefaultInput
              label="Size (comma-separated)"
              value={newSize}
              onChangeText={setNewSize}
              placeholder="e.g. 12in, 13.5in"
            />
            <AppDefaultInput
              label="Colour (comma-separated)"
              value={newColour}
              onChangeText={setNewColour}
              placeholder="e.g. red, black"
            />
            <AppDefaultInput
              label="Tags (comma-separated)"
              value={newTag}
              onChangeText={setNewTag}
              placeholder="e.g. gift, kitchen"
            />

            <AppButton btnText="Update Product" onPress={handleUpdate} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditProduct;

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
