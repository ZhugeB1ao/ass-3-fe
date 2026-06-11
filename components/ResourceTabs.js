import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { RESOURCES, RESOURCE_ORDER } from "../config/resources";

export default function ResourceTabs({ activeResource, counts, onChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabs}
    >
      {RESOURCE_ORDER.map((resourceKey) => {
        const config = RESOURCES[resourceKey];
        const active = resourceKey === activeResource;

        return (
          <Pressable
            key={resourceKey}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(resourceKey)}
            style={({ pressed }) => [
              styles.tab,
              active && styles.activeTab,
              pressed && styles.pressed,
            ]}
          >
            <View
              style={[
                styles.dot,
                { backgroundColor: active ? config.accent : "#B7C1BE" },
              ]}
            />
            <Text style={[styles.label, active && styles.activeLabel]}>
              {config.label}
            </Text>
            <View style={[styles.count, active && styles.activeCount]}>
              <Text
                style={[styles.countText, active && styles.activeCountText]}
              >
                {counts[resourceKey]}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabs: {
    gap: 8,
    paddingRight: 20,
  },
  tab: {
    minHeight: 42,
    paddingHorizontal: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDD9CF",
    backgroundColor: "#F8F6F0",
    flexDirection: "row",
    alignItems: "center",
  },
  activeTab: {
    borderColor: "#193B3D",
    backgroundColor: "#193B3D",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 8,
  },
  label: {
    color: "#53605D",
    fontSize: 13,
    fontWeight: "700",
  },
  activeLabel: {
    color: "#FFFFFF",
  },
  count: {
    minWidth: 23,
    height: 23,
    marginLeft: 9,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8E4DA",
  },
  activeCount: {
    backgroundColor: "#315457",
  },
  countText: {
    color: "#53605D",
    fontSize: 11,
    fontWeight: "800",
  },
  activeCountText: {
    color: "#DDEAE7",
  },
  pressed: {
    opacity: 0.8,
  },
});
