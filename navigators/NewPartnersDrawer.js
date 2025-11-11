import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import CustomDrawer from "../components/CustomDrawer"; 
import { SafeAreaView } from "react-native-safe-area-context";
import PartnerDashboard from "../screens/newPartners/Dashboard";
import PartnerProfile from "../screens/newPartners/Profile";
import ScanQrCode from "../screens/newPartners/ScanQrCode";
import ScanPayment from "../screens/newPartners/ScanPayment";
import ScanPaymentSuccess from "../screens/newPartners/ScanPaymentSuccess";
import PinConfirmationScreen from "../screens/newPartners/Pin";
import ViewProducts from "../screens/newPartners/products/ViewProducts";
import AddProduct from "../screens/newPartners/products/AddProduct";
import ProductDetails from "../screens/partner/products/ProductDetails";
import EditProduct from "../screens/partner/products/EditProduct";
import Notifications from "../screens/partner/Notifications";
import ViewCampaigns from "../screens/partner/Campaign";
import CreateCampaign from "../screens/newPartners/CreateCampaign";
import PreviewCampaign from "../screens/partner/promotion/PreviewCampaign";
import UpdatePromotion from "../screens/partner/promotion/UpdatePromotion";
import MembersPage from "../screens/partner/MembersPage";
import AddCustomer from "../screens/newPartners/AddCustomer";
import ModerationGeneral from "../screens/newPartners/ModerationGeneral";
import StoreOverview from "../screens/partner/store/StoreOverview";
import CreateStore from "../screens/partner/store/CreateStore";
import PartnerOrders from "../screens/partner/store/Orders";
import CampaignPreview from "../screens/partner/CampaignPreview";
import TeamMembers from "../screens/newPartners/TeamMembers";
import PartnerStores from "../screens/partner/store/PatnerStores";
import StoreDetailsScreen from "../screens/partner/store/PatnerStoreDetails";

const Stack = createNativeStackNavigator();

const SettingsScreen = ({ navigation }) => (
  <View style={styles.screen}>
    <CustomDrawer navigation={navigation} />
    <Text style={styles.text}>Settings Screen</Text>
  </View>
);

export default function NewPartnersDrawer() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "none" }}>
      <Stack.Screen name="PartnerDashboard" component={PartnerDashboard} />
      <Stack.Screen name="PartnerProfile" component={PartnerProfile} />
      <Stack.Screen name="ScanQrCode" component={ScanQrCode} />
      <Stack.Screen name="ScanPayment" component={ScanPayment} />
      <Stack.Screen
        name="PinConfirmationScreen"
        component={PinConfirmationScreen}
      />
      <Stack.Screen name="ScanPaymentSuccess" component={ScanPaymentSuccess} />
      <Stack.Screen name="ViewProducts" component={ViewProducts} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="EditProduct" component={EditProduct} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="ViewCampaigns" component={ViewCampaigns} />
      <Stack.Screen name="CreateCampaign" component={CreateCampaign} />
      <Stack.Screen name="PreviewCampaign" component={PreviewCampaign} />
      <Stack.Screen name="CampaignPreview" component={CampaignPreview} />
      <Stack.Screen name="UpdatePromotion" component={UpdatePromotion} />
      <Stack.Screen name="MembersPage" component={MembersPage} />
      <Stack.Screen name="AddCustomer" component={AddCustomer} />
      <Stack.Screen name="ModerationGeneral" component={ModerationGeneral} />
      <Stack.Screen name="StoreOverview" component={StoreOverview} />
      <Stack.Screen name="CreateStore" component={CreateStore} />
       <Stack.Screen name="TeamMembers" component={TeamMembers} />
      <Stack.Screen name="PartnerOrders" component={PartnerOrders} />
            <Stack.Screen name="PartnerStores" component={PartnerStores} />
                        <Stack.Screen name="StoreDetailsScreen " component={StoreDetailsScreen } />
    </Stack.Navigator>


  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

