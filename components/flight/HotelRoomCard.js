import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
const placeholderImage = require("../../assets/images/hotelplaceholder.png");

// Helper for "|t|" delimited fields
function getArray(str) {
  if (!str || typeof str !== "string") return [];
  return str.split("|t|");
}
function getFirst(str) {
  if (!str || typeof str !== "string") return "";
  return str.split("|t|")[0];
}

const RoomCard = ({
  room,
  onReserve,
  hideReserve,
}) => {

  const firstImage =
    Array.isArray(room.roomImages) && room.roomImages.length > 0
      ? { uri: room.roomImages[0] }
      : placeholderImage;

  const roomTypes = getArray(room.roomType);
  const descs = getArray(room.description);
  const fares = getArray(room.fareType);
  const boardTypes = getArray(room.boardType);
  const occs = getArray(room.maxOccupancyPerRoom);
  const extrabeds = getArray(room.extrabeds);
  const roomCodes = getArray(room.roomCode);
  const facilities =
    Array.isArray(room.facilities) && room.facilities.length > 0
      ? room.facilities
      : null;

  const cancellationPolicy = getFirst(room.cancellationPolicy);
  const inventoryType = getFirst(room.inventoryType);

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={firstImage} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.inner}>
        <Text style={styles.title}>
          {roomTypes.length > 0 ? roomTypes.join(" / ") : "Room"}
        </Text>
        {descs.length > 0 && (
          <Text style={styles.desc}>{descs.join(" / ")}</Text>
        )}
        {boardTypes.length > 0 && (
          <View style={styles.infoRow}>
            <MaterialIcons name="meeting-room" size={17} color="#444" />
            <Text style={styles.infoText}>Board: {boardTypes.join(", ")}</Text>
          </View>
        )}
        {fares.length > 0 && (
          <View style={styles.infoRow}>
            <MaterialIcons name="local-offer" size={17} color="#444" />
            <Text style={styles.infoText}>Fare: {fares.join(", ")}</Text>
          </View>
        )}
        {roomCodes.length > 0 && (
          <View style={styles.infoRow}>
            <MaterialIcons name="code" size={17} color="#444" />
            <Text style={styles.infoText}>Code: {roomCodes.join(", ")}</Text>
          </View>
        )}
        {facilities && facilities.length > 0 && (
          <View style={styles.facRows}>
            {facilities.map((ft, idx) => (
              <View key={idx} style={styles.facilityItem}>
                <MaterialIcons name="check-circle" size={15} color="#36ba4c" />
                <Text style={styles.facilityText}>{ft}</Text>
              </View>
            ))}
          </View>
        )}
        {occs.length > 0 && (
          <View style={styles.sleepsRow}>
            <Text style={styles.sleepsLabel}>Sleeps </Text>
            {occs.map((occ, j) => (
              <React.Fragment key={j}>
                {Array.from({ length: parseInt(occ, 10) || 1 }).map((_, i) => (
                  <FontAwesome
                    name="user"
                    key={i}
                    size={15}
                    color="#444"
                    style={{ marginRight: 2 }}
                  />
                ))}
                {j !== occs.length - 1 && <Text style={{ fontSize: 14 }}> / </Text>}
              </React.Fragment>
            ))}
          </View>
        )}
        {extrabeds.some((b) => b && b !== "0") && (
          <View style={styles.infoRow}>
            <MaterialIcons name="king-bed" size={17} color="#444" />
            <Text style={styles.infoText}>
              Extra beds: {extrabeds.join(" / ")}
            </Text>
          </View>
        )}
        {inventoryType && (
          <View style={styles.infoRow}>
            <MaterialIcons name="assignment" size={15} color="#666" />
            <Text style={styles.infoText}>
              Inventory: {inventoryType.replace(/_/g, " ")}
            </Text>
          </View>
        )}
        {/* {cancellationPolicy && cancellationPolicy.trim() && (
          <View style={styles.infoRow}>
            <MaterialIcons name="cancel" size={15} color="#d22323" />
            <Text style={styles.infoText}>
              Cancellation: {cancellationPolicy}
            </Text>
          </View>
        )} */}
        {/* Price and Reserve: side by side */}
        <View style={styles.footer}>
          <Text style={styles.priceNaira}>
            {room.currency || "₦"} {parseFloat(room.netPrice).toLocaleString()}
          </Text>
          {!hideReserve && (
            <TouchableOpacity style={styles.reserveBtn} onPress={onReserve}>
              <Text style={styles.reserveText}>Reserve</Text>
       <MaterialIcons name="north-east" size={20} color={Colors.white}/>

            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    backgroundColor: "#fff",
    elevation: 2,
    marginVertical: 10,
    marginHorizontal: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: "hidden",
  },
  imageContainer: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: "hidden",
    height: 120,
    backgroundColor: "#f3f3f3",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  inner: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 3,
    color: "#24243A",
  },
  desc: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  infoText: {
    fontSize: 13.3,
    color: "#444",
    marginLeft: 5,
  },
  facRows: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 3,
    marginTop: 2,
  },
  facilityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 3,
  },
  facilityText: {
    fontSize: 12.5,
    color: "#444",
    marginLeft: 2,
  },
  sleepsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 8,
  },
  sleepsLabel: {
    color: "#585A77",
    fontWeight: "600",
    fontSize: 13,
    marginRight: 3,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // aligns price and button on same row
    marginTop: 8,
  },
  priceNaira: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#190259",
    marginBottom: 1,
  },
  reserveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginLeft: 10,
  },
  reserveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15.5,
  },
});

export default RoomCard;
