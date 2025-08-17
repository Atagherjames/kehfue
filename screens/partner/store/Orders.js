import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import CustomDrawer from "../../../components/CustomDrawer";
import { useGetPartnerSalesOrderQuery } from "../../../services/routes/partnerRoute";
import { useRecoilState } from "recoil";
import AppLoader from "../../../components/AppLoader";
import { PartnerAccessToken } from "../../../recoil/UserData";
import moment from "moment";

const statusColor = {
  Complete: "#1EE0AC",
  Pending: "#F4BD0E",
  Cancelled: "#EB4D4B",
  pending: "#F4BD0E",
  completed: "#2ECC71",
  cancelled: "#EB4D4B",
};

const OrderItem = ({ item }) => (
  <View style={styles.orderItem}>
    <View style={{ flex: 1 }}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.date}>
        {moment(item.createdAt).format("DD MMM YYYY, hh:mma")}
      </Text>
    </View>
    <View style={{ alignItems: "flex-end" }}>
      <Text style={[styles.amount]}>
        {item.currency} {item.totalPrice.toFixed(2)}
      </Text>
      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: statusColor[item.status.toLowerCase()] },
          ]}
        />
        <Text
          style={[
            styles.statusText,
            { color: statusColor[item.status.toLowerCase()] },
          ]}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </View>
  </View>
);

const PartnerOrders = () => {
  const [page, setPage] = useState(1);
  const [token] = useRecoilState(PartnerAccessToken);
  const { data, isLoading, isError } = useGetPartnerSalesOrderQuery({
    token,
    page,
    pageSize: 10,
    optional: "all",
  });

  const orders = data?.data?.data || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) {
      return orders;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return orders.filter((order) =>
      order.name.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, orders]);

  const itemsPerPage = 6;
  const totalFilteredOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalFilteredOrders / itemsPerPage);

  const getPaginationNumbers = () => {
    const pages = [];
    const numPageButtons = 5;

    if (totalPages <= numPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= Math.floor(numPageButtons / 2) + 1) {
        for (let i = 1; i <= numPageButtons - 1; i++) {
          pages.push(i);
        }
        pages.push("...", totalPages);
      } else if (page >= totalPages - Math.floor(numPageButtons / 2)) {
        pages.push(1, "...");
        for (let i = totalPages - (numPageButtons - 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const paginationNumbers = getPaginationNumbers();

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomDrawer />
      {isLoading && <AppLoader />}
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Orders</Text>
            <Text style={styles.subtitle}>
              You have a total of {totalFilteredOrders} Orders.
            </Text>
          </View>
        </View>
        <View style={styles.fullWidthSeparator} />
        <View style={styles.listHeaderSection}>
          <Text style={styles.listTitle}>All Orders</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => setIsSearching(!isSearching)}>
              <Feather name="search" size={18} color="#8A94A6" />
            </TouchableOpacity>
          </View>
        </View>
        {isSearching && (
          <TextInput
            style={styles.searchInput}
            placeholder="Search product name..."
            placeholderTextColor="#8A94A6"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        )}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>PRODUCT NAME</Text>
          <Text style={[styles.tableHeaderText, { textAlign: "right" }]}>
            AMOUNT
          </Text>
        </View>
        <FlatList
          data={filteredOrders.slice(
            (page - 1) * itemsPerPage,
            page * itemsPerPage
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <OrderItem item={item} />}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={
            !isLoading && (
              <Text style={styles.noOrdersText}>No orders found.</Text>
            )
          }
        />

        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButtonShared,
                styles.paginationLeftButton,
              ]}
              onPress={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              <Feather
                name="chevrons-left"
                size={18}
                color={page === 1 ? "#B0B0B0" : "#526484"}
              />
            </TouchableOpacity>

            {paginationNumbers.map((pg, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => typeof pg === "number" && setPage(pg)}
                style={[
                  styles.paginationButtonShared,
                  styles.pageButton,
                  page === pg && typeof pg === "number" && styles.activePage,
                  pg === "..." && styles.ellipsisButton,
                  (idx !== 0 ||
                    (idx === 0 &&
                      paginationNumbers[0] !== 1 &&
                      paginationNumbers.length > 1)) && {
                    borderLeftWidth: StyleSheet.hairlineWidth,
                  },
                ]}
                disabled={pg === "..."}
              >
                <Text
                  style={
                    page === pg && typeof pg === "number"
                      ? styles.activeText
                      : styles.pageText
                  }
                >
                  {pg}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.paginationButtonShared,
                styles.paginationRightButton,
              ]}
              onPress={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              <Feather
                name="chevrons-right"
                size={18}
                color={page === totalPages ? "#B0B0B0" : "#526484"}
              />
            </TouchableOpacity>
          </View>
        )}
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
  orderItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6576FF",
  },
  date: {
    fontSize: 12,
    color: "#8091A7",
    marginTop: 2,
  },
  amount: {
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
    paddingBottom: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  paginationButtonShared: {
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E9F2",
    borderRadius: 0,
  },
  paginationLeftButton: {
    paddingHorizontal: 12,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderRightWidth: 0,
  },
  paginationRightButton: {
    paddingHorizontal: 12,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderLeftWidth: 0,
  },
  pageButton: {
    minWidth: 32,
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  activePage: {
    backgroundColor: "#28005B",
    borderColor: "#28005B",
  },
  ellipsisButton: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    width: 32,
  },
  pageText: {
    color: "#526484",
    fontSize: 13,
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  noOrdersText: {
    textAlign: "center",
    marginTop: 20,
    color: "#8A94A6",
    fontSize: 16,
  },
});

export default PartnerOrders;
