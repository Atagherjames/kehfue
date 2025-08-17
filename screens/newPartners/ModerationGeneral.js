import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomDrawer from "../../components/CustomDrawer";
import { Text, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Switch } from "react-native-elements";

const ModerationGeneral = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomDrawer />
      <View
        style={{
          padding: 20,
          gap: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "SemiBold",
            fontSize: 24,
            color: Colors.darkBlue,
          }}
        >
          General moderation
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 20,
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "SemiBold",
                fontSize: 18,
                color: Colors.black,
              }}
            >
              Tiered Loyalty Levels
            </Text>
            <Text
              style={{
                fontFamily: "Medium",
                fontSize: 14,
                color: Colors.darkBlue,
              }}
            >
              Enable/disable tiered loyalty levels with customizable benefits
            </Text>
          </View>
          <View
            style={{
              backgroundColor: isEnabled ? Colors.primary : Colors.white,
              borderRadius: 20,
            }}
          >
            <Switch
              value={isEnabled}
              onValueChange={(val) => setIsEnabled(val)}
              color={isEnabled ? Colors.white : Colors.primary}
              trackColor={{ false: Colors.white, true: Colors.primary }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ModerationGeneral;
