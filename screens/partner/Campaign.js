import React, { useEffect, useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Colors } from "../../constants/colors";
import { Feather } from "@expo/vector-icons";
import { useGetPartnersCampaignQuery } from "../../services/routes/offersRoute";
import { useToast } from "react-native-toast-notifications";
import AppLoader from "../../components/AppLoader";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../recoil/UserData";
import { useNavigation, useRoute } from "@react-navigation/native";
import { convertTime } from "../../utils/Utilities";
import CustomDrawer from "../../components/CustomDrawer";

const ViewCampaigns = () => {
  const toast = useToast();
  const route = useRoute();
  const navigation = useNavigation();
  const [token] = useRecoilState(PartnerAccessToken);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const promotionStatus = route?.params?.promotionStatus ?? null;

  const { data, isLoading, error, isError } = useGetPartnersCampaignQuery({
    token,
    page,
    pageSize,
    promotionStatus,
  });

  const campaigns = data?.result?.promotions?.data || [];
  const totalPages = data?.result?.promotions?.totalPages || 1;

  useEffect(() => {
    if (isError) {
      toast.show(
        error?.data?.message || error?.message || "Something went wrong",
        { type: "danger" }
      );
    }
  }, [isError, error, toast]);

  const getPaginationNumbers = useMemo(() => {
    return () => {
      const pagesArray = [];
      const numPageButtons = 5;

      if (totalPages <= numPageButtons) {
        for (let i = 1; i <= totalPages; i++) {
          pagesArray.push(i);
        }
      } else {
        if (page <= Math.floor(numPageButtons / 2) + 1) {
          for (let i = 1; i <= numPageButtons - 1; i++) {
            pagesArray.push(i);
          }
          pagesArray.push("...", totalPages);
        } else if (page >= totalPages - Math.floor(numPageButtons / 2)) {
          pagesArray.push(1, "...");
          for (
            let i = totalPages - (numPageButtons - 2);
            i <= totalPages;
            i++
          ) {
            pagesArray.push(i);
          }
        } else {
          pagesArray.push(
            1,
            "...",
            page - 1,
            page,
            page + 1,
            "...",
            totalPages
          );
        }
      }
      return pagesArray;
    };
  }, [page, totalPages]);

  const paginationNumbers = getPaginationNumbers();

  const handlePagePress = (pg) => {
    if (typeof pg === "number") {
      setPage(pg);
    }
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomDrawer />
      {isLoading && <AppLoader />}

      <View style={{ flex: 1, backgroundColor: "#FFFFFF", gap: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "SemiBold",
              color: Colors.darkBlue,
              fontSize: 24,
            }}
          >
            Campaign
          </Text>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: Colors.primary,
              borderRadius: 5,
            }}
            onPress={() => navigation.navigate("CreateCampaign")}
          >
            <Feather name="plus" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={campaigns}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderColor: "#DBDFEA",
              }}
              onPress={() =>
                navigation.navigate("CampaignPreview", { data: item })
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.descText}>{item.title}</Text>
                <Text style={[styles.descText, { fontSize: 10 }]}>
                  {new Date(item.updatedAt).toDateString()}
                </Text>
              </View>
              <Text
                style={[styles.descText, { textAlign: "right", fontSize: 12 }]}
              >
                {convertTime(item.updatedAt)}
              </Text>
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor:
                    item.status === "inactive" ? "#F4BD0E" : "#1EE0AC",
                }}
              />
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderColor: "#DBDFEA",
              }}
            >
              <Text style={[styles.descText, { flex: 1 }]}>Campaign Name</Text>
              <Text style={[styles.descText, { flex: 0, marginRight: 18 }]}>
                Date
              </Text>
            </View>
          }
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                paddingVertical: 20,
                fontSize: 14,
                fontFamily: "SemiBold",
                color: Colors.darkBlue,
              }}
            >
              No Campaign available{"\n"}Click the add button to create one
            </Text>
          }
        />

        {totalPages > 1 && campaigns.length > 0 && (
          <View style={paginationStyles.paginationContainer}>
            <TouchableOpacity
              style={[
                paginationStyles.paginationButtonShared,
                paginationStyles.paginationLeftButton,
              ]}
              onPress={handlePrevPage}
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
                onPress={() => handlePagePress(pg)}
                style={[
                  paginationStyles.paginationButtonShared,
                  paginationStyles.pageButton,
                  page === pg &&
                    typeof pg === "number" &&
                    paginationStyles.activePage,
                  pg === "..." && paginationStyles.ellipsisButton,
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
                      ? paginationStyles.activeText
                      : paginationStyles.pageText
                  }
                >
                  {pg}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                paginationStyles.paginationButtonShared,
                paginationStyles.paginationRightButton,
              ]}
              onPress={handleNextPage}
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

export default ViewCampaigns;

const styles = StyleSheet.create({
  descText: {
    color: Colors.darkBlue,
    fontSize: 14,
    fontFamily: "Medium",
    flex: 1,
  },
});

const paginationStyles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#DBDFEA",
    borderRadius: 4,
    overflow: "hidden",
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
});
