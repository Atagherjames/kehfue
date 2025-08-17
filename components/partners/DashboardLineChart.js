import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Line, Circle, Polyline } from "react-native-svg";

const data = {
  Campaign: [50, 100, 200, 150, 300, 400, 500, 600],
  Products: [100, 200, 300, 250, 350, 200, 450, 650],
  Offer: [80, 130, 180, 260, 310, 350, 400, 450],
  Other: [60, 120, 240, 300, 360, 420, 480, 500],
};

const colors = {
  Campaign: "blue",
  Products: "green",
  Offer: "pink",
  Other: "orange",
};

const DashboardLineChart = () => {
  const [selectedRange, setSelectedRange] = useState("Week");

  const labels = ["03 Dec", "", "", "", "", "", "", "31 Dec"];
  const width = 300;
  const height = 250;
  const padding = 30;
  const maxValue = Math.max(...Object.values(data).flat());
  const yAxisValues = [0, 100, 200, 300, 400, 500, 600];

  const scaleX = (index) =>
    (index / (labels.length - 1)) * (width - padding * 2) + padding;
  const scaleY = (value) =>
    height - (value / maxValue) * (height - padding * 2) - padding;

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Performance Overview
        </Text>
        <View style={{ flexDirection: "row" }}>
          {["Week", "Month"].map((range) => (
            <TouchableOpacity
              key={range}
              onPress={() => setSelectedRange(range)}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: selectedRange === range ? "#6A5AE0" : "#aaa",
                  marginLeft: 10,
                  textDecorationLine:
                    selectedRange === range ? "underline" : "none",
                }}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          justifyContent: "center",
        }}
      >
        {Object.keys(colors).map((key) => (
          <View
            key={key}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 10,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors[key],
                marginRight: 5,
              }}
            />
            <Text style={{ fontSize: 12 }}>{key}</Text>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Y-Axis Labels */}
        <View style={{ width: 30, alignItems: "flex-end" }}>
          {yAxisValues.map((value) => (
            <Text
              key={value}
              style={{
                fontSize: 10,
                color: "#888",
                position: "absolute",
                bottom: scaleY(value) - height / 1.75, // Adjust position for alignment
              }}
            >
              {(value - 600).toString().replace("-", "")}
            </Text>
          ))}
        </View>

        {/* Chart */}
        <Svg width={width} height={height}>
          {/* Grid lines */}
          {yAxisValues.map((value) => (
            <Line
              key={value}
              x1={padding}
              y1={scaleY(value)}
              x2={width - padding}
              y2={scaleY(value)}
              stroke="#eee"
              strokeWidth="1"
            />
          ))}

          {/* Graph Lines */}
          {Object.keys(data).map((key) => (
            <Polyline
              key={key}
              points={data[key]
                .map((val, i) => `${scaleX(i)},${scaleY(val)}`)
                .join(" ")}
              fill="none"
              stroke={colors[key]}
              strokeWidth="2"
            />
          ))}

          {/* Graph Dots */}
          {Object.keys(data).map((key) =>
            data[key].map((val, i) => (
              <Circle
                key={`${key}-${i}`}
                cx={scaleX(i)}
                cy={scaleY(val)}
                r="3"
                fill={colors[key]}
              />
            ))
          )}
        </Svg>
      </View>

      {/* X-axis labels */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 0,
          width: width,
          alignSelf: "center",
        }}
      >
        {labels.map((label, i) => (
          <Text key={i} style={{ fontSize: 12, color: "#888" }}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default DashboardLineChart;
