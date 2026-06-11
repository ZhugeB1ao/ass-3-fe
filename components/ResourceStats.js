import { Pressable, StyleSheet, Text, View } from "react-native";
import { RESOURCES, RESOURCE_ORDER } from "../config/resources";

function StatCard({ resource, count, active, onPress }) {
  const config = RESOURCES[resource];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        active && styles.activeCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.accent, { backgroundColor: config.accent }]} />
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.label}>{config.label}</Text>
    </Pressable>
  );
}

export default function ResourceStats({
  activeResource,
  counts,
  onChange,
}) {
  return (
    <View style={styles.container}>
      {RESOURCE_ORDER.map((resource) => (
        <StatCard
          key={resource}
          resource={resource}
          count={counts[resource]}
          active={resource === activeResource}
          onPress={() => onChange(resource)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: -2,
    marginBottom: 20,
    flexDirection: "row",
    gap: 10,
  },
  card: {
    position: "relative",
    overflow: "hidden",
    flex: 1,
    minHeight: 82,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0DCD2",
    borderRadius: 17,
    backgroundColor: "#FAF8F2",
  },
  activeCard: {
    borderColor: "#C9C3B7",
    backgroundColor: "#FFFFFF",
  },
  accent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  count: {
    color: "#173235",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "900",
  },
  label: {
    marginTop: 5,
    color: "#75807C",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
});
