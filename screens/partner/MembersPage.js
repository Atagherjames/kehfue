import { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { Colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRecoilState } from "recoil";
import { PartnerAccessToken } from "../../recoil/UserData";
import { useToast } from "react-native-toast-notifications";
import { useGetPartnersCustomerQuery } from "../../services/routes/userRoutes";
import AppLoader from "../../components/AppLoader";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import CustomDrawer from "../../components/CustomDrawer";

const MembersPage = () => {
  const navigation = useNavigation();
  const [token] = useRecoilState(PartnerAccessToken);
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error } = useGetPartnersCustomerQuery({
    token,
    page,
    pageSize,
  });

  const membersData = data?.record?.data || [];
  const totalPages = data?.record?.totalPages || 1;

  const [selectedUsers, setSelectedUsers] = useState([]);

  const filteredData = useMemo(() => {
    if (!membersData || !search.trim()) return membersData;
    return membersData.filter((member) =>
      `${member.firstName} ${member.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, membersData]);

  useEffect(() => {
    if (isError) {
      toast.show(
        error?.data?.message || error?.message || "Something went wrong",
        {
          type: "warning",
        }
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

      <View style={{ flex: 1, backgroundColor: "#F5F6FA" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "SemiBold",
                color: Colors.darkBlue,
                fontSize: 24,
              }}
            >
              Customers
            </Text>
            <Text
              style={{
                color: Colors.darkBlue,
                fontFamily: "Medium",
                fontSize: 12,
              }}
            >
              You have total {data?.record?.totalRecord} customers.
            </Text>
          </View>
          {/* <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: Colors.primary,
              borderRadius: 5,
            }}
            onPress={() => navigation.navigate("AddCustomer")}
          >
            <AntDesign name="plus" size={16} color={Colors.white} />
          </TouchableOpacity> */}
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.inputBorder,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: Colors.white,
                }}
              >
                {/* <TouchableOpacity
                  onPress={() => {
                    if (selectedUsers.includes(item.id)) {
                      setSelectedUsers((prev) =>
                        prev.filter((id) => id !== item.id)
                      );
                    } else {
                      setSelectedUsers((prev) => [...prev, item.id]);
                    }
                  }}
                  style={{ marginRight: 10 }}
                >
                  {selectedUsers.includes(item.id) ? (
                    <AntDesign
                      name="checksquare"
                      size={20}
                      color={Colors.primary}
                    />
                  ) : (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderWidth: 1,
                        borderColor: Colors.inputBorder,
                        borderRadius: 2,
                      }}
                    />
                  )}
                </TouchableOpacity> */}

                {item.profilePicture ? (
                  <Image
                    source={{ uri: item.profilePicture }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: Colors.inputBorder,
                      marginRight: 10,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: Colors.primary,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Medium",
                        color: Colors.white,
                        fontSize: 16,
                        marginTop: 2,
                      }}
                    >
                      {item.firstName[0]}
                      {item.lastName[0]}
                    </Text>
                  </View>
                )}

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "SemiBold",
                      color: Colors.darkBlue,
                      fontSize: 16,
                    }}
                  >
                    {item.firstName + " " + item.lastName}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Medium",
                      fontSize: 12,
                      color: Colors.darkBlue,
                    }}
                  >
                    {item.email}
                  </Text>
                </View>
                {/* <TouchableOpacity>
                  <Entypo
                    name="dots-three-horizontal"
                    size={20}
                    color={Colors.darkBlue}
                  />
                </TouchableOpacity> */}
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{
            paddingBottom: 20,
            backgroundColor: Colors.white,
            borderTopWidth: 1,
            borderColor: Colors.inputBorder,
          }}
          ListHeaderComponent={
            <View
              style={{ borderBottomWidth: 1, borderColor: Colors.inputBorder }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 20,
                  marginTop: 10,
                  marginBottom: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: Colors.inputBorder,
                  backgroundColor: Colors.white,
                }}
              >
                <TextInput
                  style={{ fontSize: 14, flex: 1, fontFamily: "Medium" }}
                  placeholder="Search here..."
                  onChangeText={setSearch}
                  value={search}
                />
                <Feather name="search" size={20} color={Colors.darkBlue} />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: Colors.white,
                }}
              >
                {/* <TouchableOpacity
                  onPress={() => {
                    if (selectedUsers.length === membersData?.length) {
                      setSelectedUsers([]);
                    } else {
                      setSelectedUsers(membersData.map((item) => item.id));
                    }
                  }}
                  style={{ marginRight: 10 }}
                >
                  {selectedUsers.length === membersData?.length ? (
                    <AntDesign
                      name="checksquare"
                      size={20}
                      color={Colors.primary}
                    />
                  ) : (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderWidth: 1,
                        borderColor: Colors.inputBorder,
                        borderRadius: 2,
                      }}
                    />
                  )}
                </TouchableOpacity> */}

                <Text
                  style={{
                    flex: 1,
                    fontFamily: "Medium",
                    color: Colors.darkBlue,
                  }}
                >
                  User
                </Text>
                {/* <TouchableOpacity
                  onPress={() => navigation.navigate("AddCustomer")}
                >
                  <AntDesign
                    name="plussquareo"
                    size={20}
                    color={Colors.darkBlue}
                  />
                </TouchableOpacity> */}
              </View>
            </View>
          }
        />

        {totalPages > 1 && filteredData.length > 0 && (
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

export default MembersPage;

const styles = StyleSheet.create({});

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
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
