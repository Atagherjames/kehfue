import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomDrawer from "../../../components/CustomDrawer";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Colors } from "../../../constants/colors";
import { AppDefaultInput } from "../../../components/AppInput";
import { apiSlice, PRODURL } from "../../../services/apiSlice";
import AppLoader from "../../../components/AppLoader";
import { useDispatch } from "react-redux";
import { useRecoilState } from "recoil";
import * as ImagePicker from "expo-image-picker";
import AppButton from "../../../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import { PartnerAccessToken } from "../../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import { useGetPartnerStoresQuery } from "../../../services/routes/partnerRoute";
import DefaultDropdown from "../../../components/DefaultDropdown";

const AddProduct = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const dispatch = useDispatch();
  const [token] = useRecoilState(PartnerAccessToken);

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [price, setPrice] = useState("");
  const [number, setNumber] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [tag, setTag] = useState("");

  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedStoreName, setSelectedStoreName] = useState("");
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data } = useGetPartnerStoresQuery({ token });
  const storesData = data?.stores || [];

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
      console.log("ImagePicker Error:", err.message);
    }
  };

  const handleCreate = async () => {
    try {
      if (!selectedStoreId) {
        toast.show("Please select a store", { type: "warning" });
        return;
      }

      if (!selectedImage?.uri) {
        toast.show("Please pick a product image", { type: "warning" });
        return;
      }

      setLoading(true);

      const payload = {
        storeId: selectedStoreId,
        name,
        description,
        count: Number(number),
        currency: "NGN", // hardcoded currency
        category,
        price: Number(price),
        brand: brand || undefined,
        size: size ? size.split(",").map((s) => s.trim()) : undefined,
        colour: color ? color.split(",").map((c) => c.trim()) : undefined,
        tag: tag ? tag.split(",").map((t) => t.trim()) : undefined,
        imageUrl: selectedImage.uri,
      };

      const response = await fetch(`${PRODURL}/partners/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        dispatch(apiSlice.util.invalidateTags(["product"]));
        navigation.pop();
        toast.show(result?.message || "Product created successfully", {
          type: "success",
        });
      } else {
        toast.show(result?.message || "Failed to create product", {
          type: "danger",
        });
      }
    } catch (error) {
      setLoading(false);
      toast.show("An error occurred", { type: "danger" });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading && <AppLoader />}
      <CustomDrawer />
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          backgroundColor: Colors.white,
          margin: 20,
          borderRadius: 20,
          gap: 20,
        }}
      >
        <Text style={styles.header}>Add new product</Text>

        <AppDefaultInput
          label="Product name"
          placeholder="Product name"
          onChangeText={setName}
        />
        <AppDefaultInput
          label="Product Youtube link"
          placeholder="Youtube link"
          onChangeText={setLink}
        />
        <AppDefaultInput
          label="Price"
          placeholder="Price"
          onChangeText={setPrice}
          keyboardType="number-pad"
        />
        <AppDefaultInput
          label="Number in stock"
          placeholder="Stock count"
          onChangeText={setNumber}
          keyboardType="number-pad"
        />

        <DefaultDropdown
          label="Select a Store"
          placeholder="Stores"
          data={storesData.map((store) => store.storeName)}
          showModal={showStoreModal}
          setShowModal={setShowStoreModal}
          value={selectedStoreName}
          setValue={(val) => {
            setSelectedStoreName(val);
            const selected = storesData.find((s) => s.storeName === val);
            if (selected) setSelectedStoreId(selected.id);
          }}
        />

        <DefaultDropdown
          label="Category"
          data={[
            "Utensils",
            "Gadgets",
            "Kitchen Appliances",
            "Automobiles",
            "Furniture",
            "No category",
          ]}
          value={category}
          setValue={setCategory}
          showModal={showCategoryModal}
          setShowModal={setShowCategoryModal}
        />

        <AppDefaultInput
          label="Product description"
          placeholder="Description"
          onChangeText={setDescription}
          multiline
          inputStyles={{ height: 120, textAlignVertical: "top" }}
        />
        <AppDefaultInput
          label="Brand (optional)"
          placeholder="Brand"
          onChangeText={setBrand}
        />
        <AppDefaultInput
          label="Sizes (comma separated)"
          placeholder="e.g. S, M, L"
          onChangeText={setSize}
        />
        <AppDefaultInput
          label="Colours (comma separated)"
          placeholder="e.g. red, blue"
          onChangeText={setColor}
        />
        <AppDefaultInput
          label="Tags (comma separated)"
          placeholder="e.g. pen, school"
          onChangeText={setTag}
        />

        <View>
          <Text style={{ fontFamily: "Medium", color: Colors.labelColor }}>
            Product Image
          </Text>
          <TouchableOpacity onPress={pickImage} style={styles.imageCont}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage.uri }} style={styles.image} />
            ) : (
              <Text>Click to select image</Text>
            )}
          </TouchableOpacity>
        </View>

        <AppButton
          btnStyles={{ alignSelf: "flex-start", marginBottom: 20 }}
          btnText="Add product"
          onPress={handleCreate}
          disabled={
            !name ||
            !price ||
            !number ||
            !category ||
            !description ||
            !selectedImage ||
            !selectedStoreId
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  header: {
    fontFamily: "SemiBold",
    color: Colors.darkBlue,
    fontSize: 20,
  },
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
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});
