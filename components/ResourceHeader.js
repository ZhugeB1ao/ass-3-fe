import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ResourceHeader({ resource, onCreate }) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>A3</Text>
        </View>
        <View style={styles.brandCopy}>
          <Text style={styles.brandName}>Campus Desk</Text>
          <Text style={styles.brandCaption}>ACADEMIC OPERATIONS</Text>
        </View>
      </View>

      <View style={styles.titleRow}>
        <View style={styles.titleCopy}>
          <Text style={styles.eyebrow}>{resource.eyebrow}</Text>
          <Text style={styles.title}>{resource.label}</Text>
          <Text style={styles.description}>{resource.description}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Thêm ${resource.singular}`}
          onPress={onCreate}
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: resource.accent },
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addLabel}>Thêm mới</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2C96D",
  },
  brandMarkText: {
    color: "#132F32",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  brandCopy: {
    marginLeft: 11,
  },
  brandName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  brandCaption: {
    marginTop: 2,
    color: "#8EAAA8",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
  },
  titleCopy: {
    flex: 1,
  },
  eyebrow: {
    color: "#F2C96D",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 7,
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -1,
  },
  description: {
    marginTop: 5,
    color: "#B7C9C7",
    fontSize: 13,
    lineHeight: 19,
  },
  addButton: {
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  addIcon: {
    marginRight: 7,
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 23,
    fontWeight: "400",
  },
  addLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
});
