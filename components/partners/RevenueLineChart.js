import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import Svg, { Line, Polyline, Circle } from "react-native-svg";

const data = {
  thisPeriod: [15000, 18000, 21000, 20000, 23000, 25000, 23500],
  lastPeriod: [13000, 14000, 16000, 15000, 17000, 19000, 18500],
};

const colors = {
  thisPeriod: "#3B4CEB",
  lastPeriod: "#5ED3F3",
};

const RevenueLineChart = () => {
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 64;
  const chartHeight = 180;
  const tooltipWidth = 160;
  const padding = 24;

  const minValue = 10000;
  const maxValue = 25000;
  const labels = ["Jan 28", "", "", "", "", "", "Feb 28"];

  const scaleX = (i) =>
    (i / (data.thisPeriod.length - 1)) * (chartWidth - padding * 2) + padding;

  const scaleY = (val) =>
    chartHeight -
    ((val - minValue) / (maxValue - minValue)) * (chartHeight - padding * 1.5) -
    padding / 2;

  return (
    <View style={styles.wrapper}>
      <View style={styles.chartRow}>
        <View style={styles.yAxis}>
          {[25000, 20000, 15000, 10000].map((v, i) => (
            <Text key={i} style={styles.yLabel}>
              ₦{v / 1000}K
            </Text>
          ))}
        </View>

        <View style={{ flex: 1, position: "relative" }}>
          <Svg width={chartWidth} height={chartHeight}>
            {data.thisPeriod.map((_, i) => (
              <Line
                key={`vline-${i}`}
                x1={scaleX(i)}
                y1={padding / 2}
                x2={scaleX(i)}
                y2={chartHeight - padding / 2}
                stroke="#E5E7EB"
                strokeDasharray="4,4"
                strokeWidth={1}
              />
            ))}

            {tooltipIndex !== null && (
              <Line
                x1={scaleX(tooltipIndex)}
                y1={padding / 2}
                x2={scaleX(tooltipIndex)}
                y2={chartHeight - padding / 2}
                stroke="#C7C7C7"
                strokeDasharray="4,4"
                strokeWidth={1.5}
              />
            )}

            <Polyline
              points={data.thisPeriod
                .map((val, i) => `${scaleX(i)},${scaleY(val)}`)
                .join(" ")}
              fill="none"
              stroke={colors.thisPeriod}
              strokeWidth={2.5}
            />
            <Polyline
              points={data.lastPeriod
                .map((val, i) => `${scaleX(i)},${scaleY(val)}`)
                .join(" ")}
              fill="none"
              stroke={colors.lastPeriod}
              strokeWidth={2.5}
            />

            {tooltipIndex !== null && (
              <>
                <Circle
                  cx={scaleX(tooltipIndex)}
                  cy={scaleY(data.thisPeriod[tooltipIndex])}
                  r={4}
                  fill={colors.thisPeriod}
                />
                <Circle
                  cx={scaleX(tooltipIndex)}
                  cy={scaleY(data.lastPeriod[tooltipIndex])}
                  r={4}
                  fill={colors.lastPeriod}
                />
              </>
            )}
          </Svg>

          {tooltipIndex !== null && (
            <View
              style={[
                styles.tooltip,
                {
                  top: scaleY(data.thisPeriod[tooltipIndex]) - 75,
                  left: Math.max(
                    4,
                    Math.min(
                      scaleX(tooltipIndex) - tooltipWidth / 2,
                      chartWidth - tooltipWidth - 4
                    )
                  ),
                },
              ]}
            >
              <Text style={styles.tooltipTitle}>Total Revenue</Text>
              <View style={styles.tooltipDivider} />
              <View style={styles.tooltipRow}>
                <Text style={styles.tooltipLabel}>Feb 12, 2024</Text>
                <Text
                  style={[styles.tooltipValue, { color: colors.thisPeriod }]}
                >
                  ₦{(data.thisPeriod[tooltipIndex] / 1000).toFixed(1)}K
                </Text>
              </View>
              <View style={styles.tooltipRow}>
                <Text style={styles.tooltipLabel}>Jan 12, 2024</Text>
                <Text
                  style={[styles.tooltipValue, { color: colors.lastPeriod }]}
                >
                  ₦{(data.lastPeriod[tooltipIndex] / 1000).toFixed(1)}K
                </Text>
              </View>
            </View>
          )}

          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <Pressable
              style={{ flex: 1 }}
              onPress={(e) => {
                const x = e.nativeEvent.locationX;
                const segmentWidth =
                  (chartWidth - padding * 2) / (data.thisPeriod.length - 1);
                const index = Math.round((x - padding) / segmentWidth);
                const isOutside = x < padding || x > chartWidth - padding;

                if (isOutside) {
                  setTooltipIndex(null);
                } else if (index >= 0 && index < data.thisPeriod.length) {
                  setTooltipIndex((prev) => (prev === index ? null : index));
                } else {
                  setTooltipIndex(null);
                }
              }}
            />
          </View>
        </View>
      </View>

      <View style={styles.xLabels}>
        {labels.map((label, i) => (
          <Text
            key={i}
            style={[
              styles.labelText,
              i === 0
                ? { textAlign: "left", flex: 1 }
                : i === labels.length - 1
                ? { textAlign: "right", flex: 1 }
                : { textAlign: "center", flex: 1 },
            ]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 12,
    paddingRight: 8,
    position: "relative",
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  yAxis: {
    justifyContent: "space-between",
    height: 150,
    marginTop: 20,
    marginRight: 4,
  },
  yLabel: {
    fontSize: 10,
    color: "#888",
    textAlign: "right",
  },
  xLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 24,
  },
  labelText: {
    fontSize: 10,
    color: "#888",
  },
  tooltip: {
    position: "absolute",
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    elevation: 3,
    zIndex: 999,
  },
  tooltipTitle: {
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 4,
    textAlign: "center",
  },
  tooltipDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 6,
  },
  tooltipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  tooltipLabel: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  tooltipValue: {
    fontSize: 11,
    fontWeight: "600",
  },
});

export default RevenueLineChart;
