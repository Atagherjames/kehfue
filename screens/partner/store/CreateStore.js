import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import CustomDrawer from "../../../components/CustomDrawer";
import StepIndicator from "../../../components/partners/StepIndicator";
import StoreFormStepOne from "../../../components/partners/StoreFormStepOne";
import StoreFormStepTwo from "../../../components/partners/StoreFormStepTwo";
import StoreFormStepThree from "../../../components/partners/StoreFormStepThree";
import StoreFormStepFour from "../../../components/partners/StoreFormStepFour";
import StoreFormStepFive from "../../../components/partners/StoreFormStepFive";
import {
  useGetTeamMembersQuery,
  useCreateStoreMutation,
  useGetStoreCreationPresetQuery,
} from "../../../services/routes/partnerRoute";
import { storeFormState } from "../../../recoil/StoreForm";
import AppLoader from "../../../components/AppLoader";
import { PartnerAccessToken } from "../../../recoil/UserData";
import { useRecoilState } from "recoil";
import { useToast } from "react-native-toast-notifications";

import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const CreateStore = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedStep, setCompletedStep] = useState(0);
  const [token] = useRecoilState(PartnerAccessToken);
  const [form] = useRecoilState(storeFormState);
  const toast = useToast();
  const scrollRef = useRef(null);

  const [createStore, { isLoading: isCreating }] = useCreateStoreMutation();
  const { data: presetData } = useGetStoreCreationPresetQuery(token);

  const {
    data: teamMembersData,
    isLoading,
    isError,
    error,
  } = useGetTeamMembersQuery(
    { token, page: 1, pageSize: 10 },
    { skip: currentStep !== 3 }
  );

  useEffect(() => {
    if (isError) {
      const errMsg =
        "data" in error && typeof error.data === "object"
          ? error.data?.message
          : "message" in error
          ? error.message
          : "Failed to load team members";

      toast.show(errMsg, { type: "danger" });
    }
  }, [isError]);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (
          !form.storeName?.trim() ||
          !form.category?.trim() ||
          !form.websiteURL?.trim() ||
          !form.description?.trim()
        ) {
          toast.show("Please enter store name", { type: "warning" });
          return false;
        }
        return true;

      case 2:
        const docsValid = 
          form.businessLogo &&
          form.businessBanner &&
          form.CAC_StatusReport &&
          form.CertificateOfIncorporation &&
          form.ProofOfBusinessAddress &&
          form.TaxIdentificationDocument;
        if (!docsValid) {
          toast.show("Please upload all required documents.", {
            type: "warning",
          });
          return false;
        }
        return true;

      case 3:
        return true;

      case 4:
        if (
          !form.country?.trim() ||
          !form.city?.trim() ||
          !form.state?.trim() ||
          !form.streetAddress?.trim()
        ) {
          toast.show("Please complete your store address details.", {
            type: "warning",
          });
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const convertToFormData = async (form) => {
    const data = new FormData();

    for (const key in form) {
      const value = form[key];

      if (key === "teamMembers") {
        if (value && value.length > 0) {
          const cleanedTeam = value.map(({ email, fullName, avatar }) => ({
            fullName,
            email,
            imageUrl: avatar || null,
          }));
          data.append(key, JSON.stringify(cleanedTeam));
        } else {
          data.append(key, null);
        }
      } 
      else if (
        value &&
        typeof value === "object" &&
        "uri" in value &&
        "type" in value &&
        "name" in value
      ) {
        data.append(key, {
          uri: value.uri,
          type: value.type === "image" ? "image/jpeg" : "application/octet-stream",
          name: value.name,
        });
      } 
      else if (value !== undefined && value !== null) {
        data.append(key, value);
      }
    }

    return data;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (currentStep === 4) {
      try {
        const formData = await convertToFormData(form);
        await createStore({ token, body: formData }).unwrap();
        setCompletedStep(5);
        setCurrentStep(5);
        scrollToTop();
      } catch (err) {
        console.log(err);

        let errMsg = "Failed to create store.";
        if (err.data && typeof err.data === "object" && err.data.message) {
          errMsg = err.data.message;
        } else if (err.message) {
          errMsg = err.message;
        }

        toast.show(errMsg, { type: "danger" });
      }
    } else {
      const next = Math.min(currentStep + 1, 5);
      setCompletedStep((prev) => Math.max(prev, currentStep));
      setCurrentStep(next);
      setTimeout(scrollToTop, 0);
    }
  };

  const handlePrev = () => {
    const prev = Math.max(currentStep - 1, 1);
    setCurrentStep(prev);
    setTimeout(scrollToTop, 0);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.storeBg }}>
      <CustomDrawer />

      {(isLoading || (isCreating && currentStep === 4)) && <AppLoader />}

      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Setup Your Store</Text>
        <Text style={styles.subtitle}>
          Setup your Khefue store in 5 easy steps and start selling right from
          your dashboard
        </Text>

        <View style={styles.card}>
          <StepIndicator
            currentStep={currentStep}
            completedStep={completedStep}
          />
          <View style={styles.separator} />
          {currentStep === 1 && <StoreFormStepOne preset={presetData?.data} />}
          {currentStep === 2 && <StoreFormStepTwo />}
          {currentStep === 3 && (
            <StoreFormStepThree
              teamMembers={
                teamMembersData?.record?.data?.map((member) => ({
                  id: member.id,
                  fullName: `${member.firstName} ${member.lastName}`,
                  email: member.email,
                  role: member.department || "Team Member",
                  avatar: member.profilePicture?.downloadUrl || null,
                })) || []
              }
              navigation={navigation}
            />
          )}
          {currentStep === 4 && <StoreFormStepFour preset={presetData?.data} />}
          {currentStep === 5 && (
            <StoreFormStepFive
              onDashboard={() => navigation.replace("PartnerDashboard")}
            />
          )}

          <View style={styles.navButtons}>
            {currentStep > 1 && currentStep !== 5 && (
              <TouchableOpacity style={styles.prevButton} onPress={handlePrev}>
                <Text style={styles.prevButtonText}>Prev</Text>
              </TouchableOpacity>
            )}
            {currentStep < 5 && (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                disabled={isCreating}
              >
                <Text style={styles.nextButtonText}>
                  {currentStep === 4 ? "Create Store" : "Next"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: "600", color: "#364A63", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#526484", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 32,
  },
  separator: { height: 1, backgroundColor: "#E5E9F2", marginVertical: 16, marginHorizontal: -16 },
  navButtons: { flexDirection: "row", justifyContent: "flex-start", gap: 12, marginTop: 24 },
  prevButton: { backgroundColor: "#EBEDFF", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  prevButtonText: { color: "#28005B", fontWeight: "600", fontSize: 15 },
  nextButton: { backgroundColor: "#28005B", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  nextButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});

export default CreateStore;
