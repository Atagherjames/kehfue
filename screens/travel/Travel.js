import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AppHeader from "../../components/AppHeader";
import {
  MaterialIcons,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";

import { SafeAreaView } from "react-native-safe-area-context";

export default function TravelScreen({ navigation }) {
  // Sample data for popular deals
  const popularDeals = [
    {
      id: 1,
      title: "Paris Getaway",
      description: "5-day trip to Paris with flights and 4-star hotel",
      price: "$799",
      // image: require('../assets/paris.jpg') // Replace with actual image
    },
    {
      id: 2,
      title: "Beach Paradise",
      description: "7-day all-inclusive Caribbean vacation",
      price: "$1299",
      // image: require('../assets/beach.jpg') // Replace with actual image
    },
    {
      id: 3,
      title: "Mountain Retreat",
      description: "Weekend in the Rockies with outdoor activities",
      price: "$499",
      // image: require('../assets/mountain.jpg') // Replace with actual image
    },
  ];

const travelGuides = [
  {
    id: 1,
    title: "Packing Tips",
    description: "Essential packing list for any trip",
    icon: "suitcase",
    color: "#6A00F4",
  },
  {
    id: 2,
    title: "Local Cuisine",
    description: "Must-try foods around the world",
    icon: "cutlery", 
    color: "#FF6B00",
  },
  {
    id: 3,
    title: "Budget Travel",
    description: "Travel more while spending less",
    icon: "money", 
    color: "#00C853",
  },
  {
    id: 4,
    title: "Solo Travel",
    description: "Tips for safe solo adventures",
    icon: "user", 
    color: "#FF4081",
  },
  {
    id: 5,
    title: "Family Trips",
    description: "Planning the perfect family vacation",
    icon: "users", 
    color: "#0091EA",
  },
];


  return (
    <SafeAreaView style={styles.safeArea}> 
      <AppHeader />

      <ScrollView contentContainerStyle={styles.contentPadding}>
        {/* Quick Access Icons */}
        <View style={styles.quickAccessContainer}>
          <TouchableOpacity
            style={styles.quickAccessItem}
             onPress={() => navigation.navigate("NewTravel")}
               
          >
            <View style={[styles.iconContainer, { backgroundColor: "#F3E9FF" }]}>
              <MaterialIcons name="flight" size={24} color="#28005B" />
            </View>
            <Text style={styles.quickAccessText}>Flights</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessItem}
            onPress={() => navigation.navigate("NewHotel")}
          
       
          >
            <View style={[styles.iconContainer, { backgroundColor: "#F3E9FF" }]}>
              <FontAwesome name="hotel" size={24} color="#28005B" />
            </View>
            <Text style={styles.quickAccessText}>Hotels</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessItem}
            onPress={() => navigation.navigate("NewCar")}
                //  onPress={() => navigation.navigate("ComingSoon")}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#F3E9FF" }]}>
              <Ionicons name="car-sport" size={24} color="#28005B" />
            </View>
            <Text style={styles.quickAccessText}>Car Rental</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickAccessContainer}>
          <TouchableOpacity
            style={styles.quickAccessItem}
            // onPress={() => navigation.navigate("Packages")}
                   onPress={() => navigation.navigate("ComingSoon")}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#F3E9FF" }]}>
              <Ionicons name="ticket" size={24} color="#28005B" />
            </View>
            <Text style={styles.quickAccessText}>Packages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAccessItem}
            // onPress={() => navigation.navigate("NewEvent")}
                 onPress={() => navigation.navigate("ComingSoon")}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#F3E9FF" }]}>
              <MaterialIcons name="slideshow" size={24} color="#28005B" />
            </View>
            <Text style={styles.quickAccessText}>Experience</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessItem}
             onPress={() => navigation.navigate("Booking")}

          >
            <View style={[styles.iconContainer, { backgroundColor: "#F3E9FF" }]}>
              <FontAwesome name="history" size={24} color="#896dafff" />
            </View>
            <Text style={styles.quickAccessText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Deals Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Deals</Text>
            <Text style={styles.emoji}>🔥</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {popularDeals.map((deal) => (
              <View key={deal.id} style={styles.dealCard}>
                <View style={styles.dealInfo}>
                  <Text style={styles.dealTitle}>{deal.title}</Text>
                  <Text style={styles.dealDescription}>{deal.description}</Text>
                  <Text style={styles.dealPrice}>{deal.price}</Text>
                  <TouchableOpacity style={styles.ctaButton}>
                    <Text style={styles.ctaText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Travel Guides Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Travel Guides</Text>
            <Feather
              name="compass"
              size={20}
              color="#28005B"
              style={styles.sectionIcon}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {travelGuides.map((guide) => (
              <TouchableOpacity
                key={guide.id}
                style={[styles.guideCard, { backgroundColor: guide.color }]}
              >
                <View style={styles.guideIconContainer}>
                  <FontAwesome name={guide.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.guideTitle}>{guide.title}</Text>
                <Text style={styles.guideDescription}>{guide.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Example: A Call to Action Button */}
        <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => navigation.navigate("Booking")}
        >
            <Text style={styles.addButtonText}>View All Bookings</Text>
            <MaterialIcons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentPadding: {
    paddingBottom: 20, 
  },
  

  quickAccessContainer: {
    flexDirection: "row",
    justifyContent: "space-around", 
    backgroundColor: "#fff",
    marginBottom: 20,
    marginTop: 20, 
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickAccessItem: {
    alignItems: "center",
    width: 70,
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#28005B",
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28005B",
  },
  sectionIcon: {
    marginLeft: 8,
  },
  emoji: {
    marginLeft: 8,
    fontSize: 18,
  },
  horizontalScroll: {
    paddingVertical: 5,
  },
  dealCard: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 15,
    shadowColor: "#28005B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    overflow: "hidden",
  },
  dealImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  dealInfo: {
    padding: 15,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#28005B",
  },
  dealDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    lineHeight: 18,
  },
  dealPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28005B",
    marginBottom: 12,
  },
  ctaButton: {
    backgroundColor: "#28005B",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  ctaText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  guideCard: {
    width: 160,
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    justifyContent: "space-between",
  },
  guideIconContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  guideDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 16,
  },
  addButton: {
    backgroundColor: "#28005B",
    padding: 16,
    borderRadius: 10,
    margin: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#28005B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
});