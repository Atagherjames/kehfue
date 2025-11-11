import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

// colors
const CARD_PADDING = 16;
const DARK_PURPLE = Colors.primary;
const DASHED_LINE = "#5481C4";
const FLIGHT_CARD_TEXT_LIGHT = "#6B7280";

// flight card
export const FlightCard = ({
  airline,
  price,
  from,
  to,
  depart,
  arrive,
  duration,
  tags,
  flightLogo
}) => (
  <View style={styles.flightCardWrap}>
    <View style={styles.flightCard}>
      {/* Airline + Price */}
      <View style={styles.flightRow}>
        <View style={styles.airlineRow}>
          <View style={styles.flightLogo}>
          <Image
  source={  flightLogo || require('../../assets/images/Lion logo.png')}
  style={{ width: 20, height:20 }}
/>
          <Text style={[styles.airlineText, { color: DARK_PURPLE }]}>
            {airline}
          </Text>
</View>
        </View>
        <Text style={[styles.priceText, { color: DARK_PURPLE }]}>{price}</Text>
      </View>

      {/* Route */}
      <View style={styles.routeRow}>
        <View style={styles.codes}>
          <Text style={[styles.codeBig, { color: DARK_PURPLE }]}>{from}</Text>
          <Text style={[styles.timeText, { color: FLIGHT_CARD_TEXT_LIGHT }]}>
            {depart}
          </Text>
        </View>

        <View style={styles.routeMid}>
          <View style={styles.routeConnector}>
            <View
              style={[styles.dashedLine, { borderColor: DASHED_LINE }]}
            />
            <MaterialIcons
              name="arrow-forward-ios"
              size={12}
              color={DASHED_LINE}
            />
          </View>
          <Text style={[styles.durationText, { color: FLIGHT_CARD_TEXT_LIGHT }]}>
            {duration}
          </Text>
        </View>

        <View style={[styles.codes, { alignItems: "flex-end" }]}>
          <Text style={[styles.codeBig, { color: DARK_PURPLE }]}>{to}</Text>
          <Text style={[styles.timeText, { color: FLIGHT_CARD_TEXT_LIGHT }]}>
            {arrive}
          </Text>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.tagsRow}>
        {tags.map((t) => (
          <View key={`${t.icon}-${t.name}`} style={styles.tag}>
            <MaterialIcons name={t.icon} size={14} color="#4B5563" />
            <Text style={[styles.tagText, { color: "#4B5563" }]}>
              {t.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  // flight card styles
  flightCardWrap: {
    marginHorizontal: 0,
  },
  flightCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: CARD_PADDING,
    paddingTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
      },
      android: { elevation: 6 },
    }),
  },
  flightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  flightLogo:{
backgroundColor:'#F9FAFB',
borderRadius:24,
padding:6,
display:'flex',
flexDirection:'row',
justifyContent:'center',
alignItems:'center'
  },
  airlineRow: { flexDirection: "row", alignItems: "center" },
  airlineText: { fontWeight: "600", fontSize: 13 },
  priceText: { fontWeight: "700", fontSize: 16 },

  
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  codes: {
    width: 50, 
    alignItems: "flex-start",
  },
  codeBig: { fontWeight: "700", fontSize: 16 },
  timeText: { fontSize: 12},

  routeMid: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  routeConnector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  dashedLine: {
    flex: 1,
    height: 2,
    borderBottomWidth: 2,
    borderStyle: "dashed",
    marginHorizontal: 0, 
    overflow: "hidden",
  },
  durationText: { fontSize: 11, marginTop: 4 },

  tagsRow: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E9E9E9",
    paddingTop: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    lineHeight: 16,
  },
});
