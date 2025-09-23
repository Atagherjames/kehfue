import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../../recoil/UserData";
import { useGetPartnerStoresQuery } from "../../../services/routes/partnerRoute";
import AppLoader from "../../../components/AppLoader";
import { useToast } from "react-native-toast-notifications";
import moment from "moment";
import CustomDrawer from "../../../components/CustomDrawer";
import { Colors } from "../../../constants/colors";

const statusColor = {
  Approved: "#1EE0AC",
  Under_review: "#F4BD0E",
  Denied: "#EB4D4B",
};

// Component to display a single store in the list
const StoreItem = ({ store, navigation }) => {
  const storeStatus = store.status ? store.status.toLowerCase() : 'pending';

  return (
    <TouchableOpacity
      style={styles.storeItem}
      onPress={() => navigation.navigate("StoreDetailsScreen ", { store: store })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.storeName}>{store.storeName}</Text>
        <Text style={styles.date}>
          {moment(store.createdAt).format("DD MMM YYYY, hh:mma")}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.storeType}>{store.storeType || 'N/A'}</Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: statusColor[storeStatus] },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: statusColor[storeStatus] },
            ]}
          >
            {store.status ? store.status.charAt(0).toUpperCase() + store.status.slice(1) : 'Pending'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PartnerStores = () => {
  const navigation = useNavigation();
  const [token] = useRecoilState(PartnerAccessToken);
  const toast = useToast();

  const {
    data: storesData,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetPartnerStoresQuery(token);

  const stores = storesData?.stores || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const filteredStores = useMemo(() => {
    if (!searchQuery) {
      return stores;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return stores.filter((store) =>
      store.storeName.toLowerCase().includes(lowercasedQuery) ||
      (store.storeType && store.storeType.toLowerCase().includes(lowercasedQuery))
    );
  }, [searchQuery, stores]);

  const handleRefresh = () => {
    refetch();
  };

  useEffect(() => {
    if (isError) {
      const errMsg =
        "data" in error && typeof error.data === "object"
          ? error.data?.message
          : "message" in error
          ? error.message
          : "Failed to load stores.";
      toast.show(errMsg, { type: "danger" });
    }
  }, [isError, error, toast]);

  const handleCreateNewStore = () => {
    navigation.navigate("CreateStore");
  };

  const renderContent = () => {
    if (isLoading) {
      return <AppLoader />;
    }

    if (isSuccess && filteredStores.length > 0) {
      return (
        <FlatList
          data={filteredStores}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <StoreItem store={item} navigation={navigation} />}
          contentContainerStyle={styles.flatListContent}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
          }
        />
      );
    }

    if (isSuccess && filteredStores.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You have not created any stores yet.</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleCreateNewStore}>
            <Text style={styles.emptyButtonText}>Create Your First Store</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomDrawer />
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>My Stores</Text>
            <Text style={styles.subtitle}>
              You have a total of {filteredStores.length} Stores.
            </Text>
          </View>
        </View>
        <View style={styles.fullWidthSeparator} />
        <View style={styles.listHeaderSection}>
          <Text style={styles.listTitle}>All Stores</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => setIsSearching(!isSearching)}>
              <Feather name="search" size={18} color="#8A94A6" />
            </TouchableOpacity>
          </View>
        </View>
        {isSearching && (
          <TextInput
            style={styles.searchInput}
            placeholder="Search store name or type..."
            placeholderTextColor="#8A94A6"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        )}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>STORE NAME</Text>
          <Text style={[styles.tableHeaderText, { textAlign: "right" }]}>
            STATUS
          </Text>
        </View>
        {renderContent()}
        <TouchableOpacity style={styles.fab} onPress={handleCreateNewStore}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EFF3F9",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#364A63",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#526484",
  },
  fullWidthSeparator: {
    height: 1,
    backgroundColor: "#E5E9F2",
  },
  listHeaderSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#364A63",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
  },
  searchInput: {
    height: 44,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E9F2",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
    marginHorizontal: 16,
    fontSize: 15,
    color: "#364A63",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E9F2",
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FB",
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8A94A6",
  },
  storeItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6576FF",
  },
  date: {
    fontSize: 12,
    color: "#8091A7",
    marginTop: 2,
  },
  storeType: {
    fontSize: 14,
    fontWeight: "500",
    color: "#364A63",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 80, // Space for the FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#8A94A6",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: "#6576FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#6576FF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 30,
  },
});

export default PartnerStores;