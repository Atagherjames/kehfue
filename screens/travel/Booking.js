import React, { useState, useMemo } from "react";
import { 
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import AppHeader from "../../components/AppHeader";
import ScreenWrapper from "../../components/ScreenWrapper";
import { Colors } from "../../constants/colors";
import BackArrow from "../../components/BackArrow";

// ---------- MOCK DATA ----------
const mockHotels = [
  {
    id: "KH123456",
    status: "COMPLETED",
    createdAt: "2025-10-25T14:38:00.000Z",
    referenceNum: "#KH123456",
    roomBookDetails: {
      hotelName: "Radisson Blu",
      city: "Lagos",
      country: "Nigeria",
      checkIn: "Jan 10, 2025",
      checkOut: "Jan 12, 2025",
    },
  },

];
const mockFlights = [
  {
    id: "KH234567",
    status: "COMPLETED",
    createdAt: "2025-09-13T08:38:00.000Z",
    bookingId: "#KH234567",
    airline: "Air Peace",
    bookingDate: "Jan 7, 2025",
    flightNumber: "P47820",
    ticketType: "Economy",
    totalFare: "₦120,000",
    refundPolicy: "Refundable (80% if canceled 48+ hours before departure).",
    passenger: {
      name: "John Doe",
      seat: "12A",
      baggage: "23kg Checked, 7kg Carry-on"
    },
    departureAirport: "LOS",
    departureLocation: "Murtala Muhammed International Airport",
    departureTime: "Jan 10, 2025, 09:15 AM",
    arrivalAirport: "ABV",
    arrivalLocation: "Nnamdi Azikiwe International Airport",
    arrivalTime: "Jan 10, 2025, 10:45 AM",
    // RAW/NESTED FULL DETAILS FOR FUTURE FEATURES OR PROCESSING:
    bookFlightResult: {
      fareItenary: {
        FareItinerary: {
          OriginDestinationOptions: [
            {
              OriginDestinationOption: [
                {
                  FlightSegment: {
                    MarketingAirlineName: "Air Peace",
                    FlightNumber: "P47820",
                    DepartureAirportLocationCode: "LOS",
                    DepartureDateTime: "2025-01-10T09:15:00",
                    ArrivalAirportLocationCode: "ABV",
                    ArrivalDateTime: "2025-01-12T10:45:00"
                  }
                }
              ]
            }
          ]
        }
      }
    }
  },
];


const TAB_LABELS = ["All bookings", "Completed", "Processing"];
const ITEMS_PER_PAGE = 10;

function getPageNumbers(currentPage, pageCount) {
  let numbers = [];
  if (pageCount <= 5) {
    numbers = Array.from({length: pageCount}, (_, i) => i+1);
  } else {
    numbers = [1];
    if (currentPage > 3) numbers.push("...");
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(pageCount - 1, currentPage + 1);
    for (let i = start; i <= end; i++) numbers.push(i);
    if (currentPage < pageCount - 2) numbers.push("...");
    numbers.push(pageCount);
  }
  return numbers;
}

const BookingHistoryScreen = ({ navigation }) => {
  const allBookings = useMemo(() => {
    const hotelRows = mockHotels.map(b => ({
      id: b.id,
      status: b.status === "COMPLETED" ? "completed" : "cancelled",
      reference: b.referenceNum,
      bookingType: "Hotel",
      executionTime: `${b.roomBookDetails.checkIn} - ${b.roomBookDetails.checkOut}`, 
      raw: b
    }));
    const flightRows = mockFlights.map(b => {
      const seg = b.bookFlightResult.fareItenary.FareItinerary.OriginDestinationOptions[0].OriginDestinationOption[0].FlightSegment;
      return {
        id: b.id,
        status: b.status === "COMPLETED" ? "completed" : "cancelled",
        reference: b.bookingId,
        bookingType: "Flight",
        executionTime: `${seg.DepartureDateTime.split("T")[0]} - ${seg.ArrivalDateTime.split("T")[0]}`, // date range
        raw: b
      };
    });
    return [...hotelRows, ...flightRows].sort(
      (a, b) => new Date(b.executionTime.split(" - ")[0]) - new Date(a.executionTime.split(" - ")[0])
    );
  }, []);

  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBookings = useMemo(() => {
    if (activeTab === 1) return allBookings.filter(b => b.status === "completed");
    if (activeTab === 2) return allBookings.filter(b => b.status === "processing" || b.status === "active");
    return allBookings;
  }, [activeTab, allBookings]);

  const pageCount = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const pageNumbers = getPageNumbers(currentPage, pageCount);

  return (
    <ScreenWrapper style={{backgroundColor: Colors.storeBg}}>
      <AppHeader />
        <View style={styles.headerMain}>
        <BackArrow onPress={() => navigation.goBack()} />
        <Text style={styles.bookHeader}>Booking History</Text>
        <Text style={styles.bookSub}>Manage your bookings</Text>
      </View>
   
      <View style={styles.card}>
          {/* Tabs */}
        <View style={styles.tabs}>
          {TAB_LABELS.map((tab, idx) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabBtn}
              onPress={() => {
                setActiveTab(idx);
                setCurrentPage(1);
              }}
            >
              <Text style={[
                styles.tabText,
                activeTab === idx && styles.activeTabText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.tabsUnderline} />
        {/* Table */}
        <ScrollView horizontal>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeader}>Book ID</Text>
              <Text style={styles.tableHeader}>Booking type</Text>
              <Text style={styles.tableHeader}>Execution time</Text>
              <Text style={styles.tableHeader}>{""}</Text>
            </View>
            {paginatedBookings.map(row => (
              <TouchableOpacity
                key={row.id}
                style={styles.tableRow}
                onPress={() => navigation && navigation.navigate("BookingDetails", { booking: row.raw })}
                activeOpacity={0.7}
              >
                <Text style={styles.cellID}>{row.reference}</Text>
                <Text style={styles.cellBold}>{row.bookingType}</Text>
                <Text style={styles.cellTime}>{row.executionTime}</Text>
                <View style={styles.cellAction}>
                  <Text style={styles.ellipsis}>...</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {/* Pagination */}
        <View style={styles.paginationBar}>
          <TouchableOpacity
            style={[styles.pagiBtn, currentPage === 1 && styles.pagiBtnDisabled]}
            disabled={currentPage === 1}
            onPress={() => setCurrentPage(currentPage - 1)}
          >
            <View style={styles.circleIcon}>
              <Text style={styles.pagiArrow}>{"<"}</Text>
            </View>
          </TouchableOpacity>
          {pageNumbers.map((num, idx) => (
            typeof num === "number" ? (
              <TouchableOpacity
                key={num}
                style={[
                  styles.pageNum, currentPage === num && styles.activePageNum
                ]}
                onPress={() => setCurrentPage(num)}
              >
                <Text style={[
                  styles.pageNumText,
                  currentPage === num && styles.activePageNumText
                ]}>{num}</Text>
              </TouchableOpacity>
            ) : (
              <Text key={"ellipsis" + idx} style={styles.pageEllipsis}>...</Text>
            )
          ))}
          <TouchableOpacity
            style={[styles.pagiBtn, currentPage === pageCount && styles.pagiBtnDisabled]}
            disabled={currentPage === pageCount}
            onPress={() => setCurrentPage(currentPage + 1)}
          >
            <View style={styles.circleIcon}>
              <Text style={styles.pagiArrow}>{">"}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerMain: { marginVertical: 18, marginHorizontal: 8 },
  bookHeader: { fontWeight: "bold", fontSize: 22, color: "#1A2954" },
  bookSub: { marginTop: 3, color: "#8898AA", fontSize: 13 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 10,
    padding: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  // Tabs
  tabs: { flexDirection: "row", marginBottom: 0, justifyContent: "flex-start" },
  tabBtn: { flexDirection: "column", alignItems: "center", marginRight: 22, paddingVertical: 12 },
  tabText: { color: "#666D80", fontWeight: "bold", fontSize: 14 },
  activeTabText: { color: "#3554D1" },
  tabsUnderline: { borderBottomWidth: 1.5, borderBottomColor: "#EEE", marginTop: -5, marginBottom: 12 },
  table: { minWidth: 400 },
  tableHeaderRow: { flexDirection: "row", backgroundColor: "#F9F9F9", borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  tableHeader: { flex: 1, fontWeight: "bold", color: "#545454", fontSize: 15, padding: 12 },
  tableRow: { flexDirection: "row", borderBottomColor: "#EAEDF3", borderBottomWidth: 1, backgroundColor: "#fff", alignItems: "center" },
  cellID: { flex: 1, padding: 12, fontSize: 14, color: Colors.black },
  cellBold: { flex: 1, padding: 12, fontWeight: "bold", fontSize: 15, color: "#23223F" },
  cellTime: { flex: 1, padding: 12, color:Colors.black, fontSize: 14 },
  cellAction: { flex: 1, alignItems: "flex-start", paddingHorizontal: 14 },
  ellipsis: { fontSize: 24, color: "#8D99AE" },
  paginationBar: { flexDirection: "row", justifyContent: "center", alignItems: "center", margin: 10 },
  pagiBtn: { marginRight: 6, marginLeft: 6 },
  pagiBtnDisabled: { opacity: 0.35 },
  circleIcon: { borderWidth: 1, borderColor: "#CFD8DC", width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  pagiArrow: { fontSize: 18, color: "#8998AD", fontWeight: "bold" },
  pageNum: { borderRadius: 30, backgroundColor: "#fff", marginHorizontal: 3, paddingHorizontal: 11, paddingVertical: 4 },
  activePageNum: { backgroundColor: "#283593" },
  pageNumText: { color: "#283593", fontWeight: "bold", fontSize: 15 },
  activePageNumText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  pageEllipsis: { color: "#8998AD", fontWeight: "bold", fontSize: 16, paddingHorizontal: 3 },

  // back a
});

export default BookingHistoryScreen;
