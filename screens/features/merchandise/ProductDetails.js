import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  FlatList,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import AppHeader from "../../../components/AppHeader";
import AppLoader from "../../../components/AppLoader";
import { Colors } from "../../../constants/colors";
import {
  useGetSingleProductQuery,
  useAddToCartMutation,
} from "../../../services/routes/productRoutes";
import { useGetProductsQuery } from "../../../services/routes/offersRoute";

const windowWidth = Dimensions.get("window").width;

const ProductGridCard = ({ product, onRedeem, onPress }) => {
  const handleViewDetails = () => {
    if (onPress) {
      onPress(product.id);
    }
  };

  return (
    <TouchableOpacity
      style={gridCardStyles.card}
      onPress={handleViewDetails}
      activeOpacity={0.7}
    >
      <View style={gridCardStyles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={gridCardStyles.image}
          resizeMode="cover"
        />
      </View>
      <View style={gridCardStyles.content}>
        <Text style={gridCardStyles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={gridCardStyles.points}>₦{product.points}</Text>
        <TouchableOpacity
          style={gridCardStyles.redeemBtn}
          activeOpacity={0.85}
          onPress={() => onRedeem(product.id)} // Use the passed onRedeem prop
        >
          <Text style={gridCardStyles.redeemBtnText}>Redeem</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// ----------------------------------------------------------------------------------
// NEW SECTION: More Like This
// ----------------------------------------------------------------------------------
const MoreLikeThisSection = ({ products, onGridCardSelect, addToCart }) => {
  if (!products || products.length === 0) return null;

  const filteredProducts = products.filter((p) => p.id !== p.currentProductId);

  return (
    <View style={styles.moreLikeThisContainer}>
      <Text style={styles.moreLikeThisTitle}>More like this</Text>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContentContainer}
        renderItem={({ item }) => (
          <ProductGridCard
            product={item}
            onRedeem={addToCart} 
            onPress={onGridCardSelect} 
          />
        )}
      />
    </View>
  );
};

const ProductDetailsScreen = ({ navigation, route }) => {
  const { id: routeProductId, token } = route.params;

  const toast = useToast();
  const insets = useSafeAreaInsets();
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetSingleProductQuery(
    {
      token,
      productId: routeProductId,
    },
    { refetchOnMountOrArgChange: true } 
  );

  const { data: similarProductsData, isLoading: isProductsLoading } =
    useGetProductsQuery(token, { skip: !token });

  let product = data?.product;

  const [addItem, { isLoading: isAddingItem }] = useAddToCartMutation();

  /**
   * Handles adding a product to the cart.
   * @param {string} productId 
   */
  const addToCart = async (productId) => {
    console.log(quantity);
    try {
      const addRes = await addItem({ token, id: productId, quantity: quantity }).unwrap();
      if (addRes.success) {
        toast.show(addRes?.message || "Product added successfully", {
          type: "success",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    } catch (error) {
      toast.show(
        error?.data?.message || error?.message || "Something went wrong",
        {
          type: "warning",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        }
      );
    }
  };

  /**
   * @param {string} newProductId 
   */
  const onGridCardSelect = (newProductId) => {
    setSelectedSize(null);
    setSelectedColor(null);
    setQuantity(1);
    setShowDetails(false);
    setShowShipping(false);


    navigation.setParams({ id: newProductId });

    // Scroll to the top of the screen to see the new product details
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  };

  // Placeholder data structure for "similar products" to match the card logic
  const similarProducts =
    similarProductsData?.products?.data?.map((p) => ({
      id: p.id,
      name: p.name,
      points: p.price,
      image:
        p.thumbNail?.downloadUrl ||
        p.images?.[0]?.url ||
        "https://via.placeholder.com/150",
      currentProductId: routeProductId, 
    })) || [];

  if (product) {
    product = {
      ...product,
      title: product.name,
      sizes: product.sizes ?? ["50ml", "100ml", "150ml"],
      colors: product.colors ?? ["#53181A", "#D52400", "#E1C03F", "#379D8F"],
      details:
        product.details ??
        "This is a placeholder for the full product details based on the design. This text explains the materials, usage, and key features of the non-sticky fry pans.",
      shipping:
        product.shipping ??
        "This is a placeholder for the shipping and return policy. Typically includes delivery times and return process.",
    };
  }

  // Initialize state hooks. Use a local variable to hold the product to ensure proper initialization
  const initialSize = product?.sizes?.[0] ?? null;
  const initialColor = product?.colors?.[0] ?? null;

  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [showShipping, setShowShipping] = useState(false);

  // Ref to control scrolling
  const scrollViewRef = React.useRef(null);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] ?? null);
      setSelectedColor(product.colors?.[0] ?? null);
      setQuantity(1);
    }
  }, [product?.id]);

  const priceText = useMemo(() => {
    return `${product?.currency ?? "₦"}${product?.price ?? ""}`;
  }, [product?.price, product?.currency]);

  if (isLoading || isAddingItem || isProductsLoading) {
    return (
      <View
        style={[
          styles.screen,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <AppHeader navigation={navigation} />
        <AppLoader message={"Redeeming Product.."} />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View
        style={[
          styles.screen,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <AppHeader navigation={navigation} />
        <View style={styles.loaderWrap}>
          <Text style={{ color: "red", fontFamily: "Medium" }}>
            Failed to load product details.
          </Text>
          {error?.data?.message && (
            <Text style={{ color: "#555", marginTop: 8 }}>
              {error.data.message}
            </Text>
          )}
        </View>
      </View>
    );
  }

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  const onRedeem = () => {
    addToCart(product.id);
  };

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <AppHeader navigation={navigation} />

      {/* Breadcrumb - using product.name */}
      <View style={styles.breadcrumbWrap}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Merchandise")}
          activeOpacity={0.8}
        >
          <Text style={styles.breadcrumbText}>Shop</Text>
        </TouchableOpacity>
        <MaterialIcons name="chevron-right" size={18} color="#6B7280" />
        <Text style={styles.breadcrumbActive} numberOfLines={1}>
          {product.name}
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageWrap}>
          <Image
            source={{
              uri:
                product.thumbNail?.downloadUrl ||
                product.image ||
                product.images?.[0]?.url,
            }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Title / Description / Price */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{product.name}</Text>

          {product.description ? (
            <Text numberOfLines={2} style={styles.shortDesc}>
              {product.description}
            </Text>
          ) : null}

          <Text style={[styles.price, styles.priceRow]}>{priceText}</Text>
        </View>

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select size</Text>
            <View style={styles.sizeRow}>
              {product.sizes.map((s) => {
                const active = selectedSize === s;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setSelectedSize(s)}
                    style={[
                      styles.sizeBtn,
                      active && {
                        borderColor: Colors.primary,
                        backgroundColor: Colors.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        active && { color: "#fff" },
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Colors */}
        {product.colors?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select colour</Text>
            <View style={styles.colorRow}>
              {product.colors.map((c, i) => {
                const active = selectedColor === c;
                return (
                  <TouchableOpacity
                    key={`${c}-${i}`}
                    onPress={() => setSelectedColor(c)}
                    style={[
                      styles.colorChip,
                      { backgroundColor: c },
                      active && styles.colorChipActive,
                    ]}
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* Quantity + Redeem */}
        <View style={[styles.section, styles.qtyRedeemCol]}>
          <View style={styles.qtyBox}>
            <Text style={styles.sectionTitle}>Quantity</Text>

            <View style={styles.qtyControlsContainer}>
              <TouchableOpacity onPress={decrement} style={styles.qtyControlBtn}>
                <AntDesign name="minus" size={18} color="#09121F" />
              </TouchableOpacity>

              <Text style={styles.qtyTextCentered}>{quantity}</Text>

              <TouchableOpacity onPress={increment} style={styles.qtyControlBtn}>
                <AntDesign name="plus" size={18} color="#09121F" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.redeemBtn, styles.redeemBtnFullWidth]}
            onPress={onRedeem}
            activeOpacity={0.85}
          >
            <Text style={styles.redeemBtnText}>Redeem Now</Text>
          </TouchableOpacity>
        </View>

        {/* Details Accordion */}
        <View style={[styles.section, styles.accordionTopDivider]}>
          <TouchableOpacity
            onPress={() => setShowDetails((s) => !s)}
            style={styles.accordionHeader}
          >
            <Text style={styles.accordionTitle}>Details</Text>
            <View style={styles.accordionIconContainer}>
              <AntDesign
                name={showDetails ? "minus" : "plus"}
                size={20}
                color="#333"
              />
            </View>
          </TouchableOpacity>
          {showDetails && product.details ? (
            <Text style={styles.accordionBody}>{product.details}</Text>
          ) : null}
        </View>

        {/* Shipping Accordion */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => setShowShipping((s) => !s)}
            style={styles.accordionHeader}
          >
            <Text style={styles.accordionTitle}>Shipping & Return policy</Text>
            <View style={styles.accordionIconContainer}>
              <AntDesign
                name={showShipping ? "minus" : "plus"}
                size={20}
                color="#333"
              />
            </View>
          </TouchableOpacity>
          {showShipping && product.shipping ? (
            <Text style={styles.accordionBody}>{product.shipping}</Text>
          ) : null}
        </View>

        {/* INSERT MORE LIKE THIS SECTION HERE */}
        <MoreLikeThisSection
          products={similarProducts}
          onGridCardSelect={onGridCardSelect} 
          addToCart={addToCart} 
        />

        <View style={{ height: 36 }} />
      </ScrollView>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAFAFB",
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  breadcrumbWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 6,
  },
  breadcrumbText: {
    color: "#6B7280",
    fontFamily: "Medium",
    fontSize: 13,
  },
  breadcrumbActive: {
    color: "#111827",
    fontFamily: "Medium",
    fontSize: 13,
    maxWidth: "70%",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageWrap: {
    width: "100%",
    height: windowWidth > 450 ? 420 : 320,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: Platform.OS === "web" ? "visible" : "hidden",
  },
  image: { width: "70%", height: "90%" },

  titleSection: {
    marginTop: 18,
  },
  priceRow: {
    marginTop: 6,
  },
  title: {
    fontSize: 18,
    fontFamily: "SemiBold",
    color: "#0F172A",
    marginBottom: 6,
  },
  shortDesc: {
    color: "#6B7280",
    fontSize: 13,
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontFamily: "SemiBold",
    color: Colors.primary,
  },
  section: { marginTop: 18 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Medium",
    color: "#111827",
    marginBottom: 10,
  },
  sizeRow: { flexDirection: "row", alignItems: "center" },
  sizeBtn: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#F8FAFC",
  },
  sizeText: { fontSize: 13, fontFamily: "Medium", color: "#111827" },
  colorRow: { flexDirection: "row", alignItems: "center" },
  colorChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  colorChipActive: { borderWidth: 2, borderColor: "#111827" },

  // Quantity and Redeem button new layout
  qtyRedeemCol: {},
  qtyBox: {
    flex: 0,
    marginBottom: 18,
  },

  // --- UPDATED STYLES FOR QUANTITY CONTROL ---
  qtyControlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    width: 130,
    height: 36,
    justifyContent: "space-between",
  },
  qtyControlBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyTextCentered: {
    marginHorizontal: 0,
    fontSize: 15,
    fontFamily: "Medium",

    paddingHorizontal: 12,
    height: "100%",
    lineHeight: 36,
    textAlignVertical: "center",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#E5E7EB",
  },

  redeemBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  redeemBtnFullWidth: {
    width: "100%",
    marginLeft: 0,
  },
  redeemBtnText: {
    color: "#fff",
    fontFamily: "SemiBold",
    fontSize: 14,
  },

  // Accordion Styles
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#BDBDBD",
  },
  accordionTopDivider: {
    borderTopWidth: 1,
    borderTopColor: "#BDBDBD",
    marginTop: 18,
  },
  accordionIconContainer: {
    width: 25,
    height: 25,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  accordionTitle: { fontSize: 15, fontFamily: "Medium", color: "#111827" },
  accordionBody: {
    color: "#6B7280",
    paddingVertical: 12,
    lineHeight: 20,
  },

  // --- NEW STYLES FOR MORE LIKE THIS SECTION ---
  moreLikeThisContainer: {
    marginTop: 24,
  },
  moreLikeThisTitle: {
    fontSize: 18,
    fontFamily: "SemiBold",
    color: "#0F172A",
    marginBottom: 15,
  },
  // To handle the margin between the two columns
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 15, 
  },
  flatListContentContainer: {
    paddingBottom: 10,
  },
});

// --- NEW STYLESHEET FOR GRID CARD ---
const gridCardStyles = StyleSheet.create({
  card: {
    width: "48.5%",
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#F7F7F7",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 8,
  },
  content: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontFamily: "SemiBold",
    color: "#0F172A",
    minHeight: 36,
    marginBottom: 4,
  },
  points: {
    fontSize: 16,
    fontFamily: "SemiBold",
    color: Colors.primary,
    marginBottom: 8,
  },
  redeemBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  redeemBtnText: {
    color: "#fff",
    fontFamily: "Medium",
    fontSize: 12,
  },
});