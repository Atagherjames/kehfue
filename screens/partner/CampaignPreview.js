import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "../../constants/colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomDrawer from "../../components/CustomDrawer";
import { AppDefaultInput } from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import { useToast } from "react-native-toast-notifications";
import { useRecoilState } from "recoil";
import AppLoader from "../../components/AppLoader";
import { PartnerAccessToken } from "../../recoil/UserData";
import {
  useActivateCampaignMutation,
  useDeactivateCampaignMutation,
  useUpdateCampaignMutation,
} from "../../services/routes/offersRoute";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const CampaignPreview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const toast = useToast();
  const [token] = useRecoilState(PartnerAccessToken);

  const { data } = route.params;
  const isCreatedByPartner = data.createdBy === data.userId;

  const {
    title,
    details,
    type,
    targetCustomers,
    ageRange,
    thumbNail,
    channels,
    conditions,
    effect,
    duration,
    check,
    id,
  } = data;

  const [detail, setDetail] = useState(details);

  const [activateCampaign, { isLoading: isActivating }] =
    useActivateCampaignMutation();
  const [deactivateCampaign, { isLoading: isDeactivating }] =
    useDeactivateCampaignMutation();
  const [updateCampaign, { isLoading: isUpdating }] =
    useUpdateCampaignMutation();

  const handleActivate = async () => {
    try {
      const res = await activateCampaign({ token, campaignId: id }).unwrap();
      toast.show(res.message, { type: "success" });
    } catch (err) {
      toast.show(err?.data?.message || "Activation failed", { type: "danger" });
    }
  };

  const handleDeactivate = async () => {
    try {
      const res = await deactivateCampaign({ token, campaignId: id }).unwrap();
      navigation.pop();
    } catch (err) {
      toast.show(err?.data?.message || "Deactivation failed", {
        type: "danger",
      });
    }
  };

  const handleSaveDetails = async () => {
    if (!detail?.trim()) {
      toast.show("Campaign details cannot be empty", { type: "warning" });
      return;
    }

    try {
      await updateCampaign({
        token,
        campaignId: data.id,
        body: { ...data, details: detail },
      }).unwrap();

      toast.show("Campaign updated successfully", { type: "success" });
    } catch (err) {
      toast.show(err?.data?.message || "Update failed", { type: "danger" });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomDrawer />
      {(isActivating || isDeactivating || isUpdating) && <AppLoader />}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="angle-left" size={22} color={Colors.primary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Feather name="user" size={20} color={Colors.darkBlue} />
            <Text style={styles.headerTitle}>Campaign Info</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Image
            source={{
              uri:
                thumbNail?.downloadUrl ||
                "https://via.placeholder.com/300x180.png?text=Campaign+Banner",
            }}
            style={styles.banner}
          />
          <Text style={styles.title}>{title}</Text>

          {!isCreatedByPartner && (
            <View style={styles.buttonRow}>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  disabled={isActivating}
                  onPress={handleActivate}
                  style={[styles.actionBtn, styles.whiteBtn]}
                >
                  <AntDesign name="check" size={20} color="#10B981" />
                </TouchableOpacity>
                <Text style={styles.buttonLabel}>Accept</Text>
              </View>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  disabled={isDeactivating}
                  onPress={handleDeactivate}
                  style={[styles.actionBtn, styles.whiteBtn]}
                >
                  <AntDesign name="close" size={20} color="#EF4444" />
                </TouchableOpacity>
                <Text style={styles.buttonLabel}>Reject</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.divider} />

          {[
            ["Campaign type", type],
            ["Target Customers", `${targetCustomers}`],
            ["Age range", `${ageRange?.[0]} - ${ageRange?.[1]}`],
            ["Channels", channels],
            ["Check frequency", check],
            [
              "Run length",
              `${formatDate(duration?.[0])} - ${formatDate(duration?.[1])}`,
            ],
          ].map(([label, value]) => (
            <View key={label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value || "N/A"}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Rule</Text>
          <View style={styles.divider} />

          {[
            ["Condition", conditions?.join(", ") || "N/A"],
            [
              "Effect",
              (() => {
                if (effect?.type === "discount") {
                  return `${effect?.percent || 0}% ${effect?.type || ""}`;
                } else if (effect?.type === "points") {
                  return `${effect?.points || 0} ${effect?.type || ""}`;
                }
                return "N/A";
              })(),
            ],
          ].map(([label, value]) => (
            <View key={label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Campaign details</Text>
          <AppDefaultInput
            onChangeText={setDetail}
            value={detail}
            multiline
            editable={!isCreatedByPartner}
            inputStyles={[
              styles.detailsBox,
              {
                textAlignVertical: "top",
                color: Colors.darkBlue,
              },
            ]}
          />
          {!isCreatedByPartner && (
            <AppButton
              btnText="Update"
              onPress={handleSaveDetails}
              btnStyles={{ marginTop: 12, alignSelf: "flex-end" }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CampaignPreview;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  backText: {
    color: Colors.primary,
    fontFamily: "Medium",
    fontSize: 14,
    marginLeft: 4,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "SemiBold",
    color: Colors.darkBlue,
    marginLeft: 6,
  },
  card: {
    margin: 16,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  banner: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontFamily: "SemiBold",
    marginBottom: 10,
    color: Colors.darkBlue,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    marginTop: 4,
  },
  buttonGroup: {
    alignItems: "center",
  },
  actionBtn: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DFE1E6",
  },
  whiteBtn: {
    backgroundColor: "#ffffff",
  },
  buttonLabel: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Regular",
    color: Colors.darkBlue,
  },
  infoSection: {
    marginTop: 10,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: "SemiBold",
    fontSize: 15,
    marginTop: 20,
    marginBottom: 8,
    color: Colors.darkBlue,
  },
  divider: {
    height: 1,
    backgroundColor: "#DFE1E6",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  infoLabel: {
    fontFamily: "Regular",
    fontSize: 14,
    color: "#6B7280",
  },
  infoValue: {
    fontFamily: "Regular",
    fontSize: 14,
    color: Colors.darkBlue,
    flexShrink: 1,
    textAlign: "right",
  },
  detailsBox: {
    borderWidth: 1,
    borderColor: "#DFE1E6",
    borderRadius: 6,
    padding: 12,
    backgroundColor: Colors.white,
    marginTop: 8,
  },
  detailsText: {
    fontFamily: "Regular",
    fontSize: 14,
    color: Colors.darkBlue,
  },
});
