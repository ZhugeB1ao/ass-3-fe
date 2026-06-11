import { Pressable, StyleSheet, Text, View } from "react-native";
import { RESOURCES } from "../config/resources";

function formatDate(value) {
  if (!value) {
    return "";
  }

  const parts = String(value).slice(0, 10).split("-");
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
}

function initials(value) {
  const words = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words
    .slice(-2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function displayValue(detail, item, courseMap) {
  const rawValue = item[detail.key];
  let value = rawValue;

  if (detail.format === "date") {
    value = formatDate(rawValue);
  }

  if (detail.format === "course") {
    const course = courseMap[String(rawValue)];
    value = course
      ? `${course.course_code} · ${course.course_name}`
      : rawValue
        ? `Môn học #${rawValue}`
        : "";
  }

  if (value === null || value === undefined || value === "") {
    return detail.fallback || "--";
  }

  return `${value}${detail.suffix || ""}`;
}

export default function EntityCard({
  resource,
  item,
  courseMap,
  onView,
  onEdit,
  onDelete,
}) {
  const config = RESOURCES[resource];
  const title = item[config.titleField] || `#${item.id}`;
  const code = item[config.codeField] || `ID ${item.id}`;

  return (
    <View style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: config.accent }]} />

      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: config.softAccent }]}>
          <Text style={[styles.avatarText, { color: config.accent }]}>
            {initials(title) || "ID"}
          </Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.code}>{code}</Text>
          <Text numberOfLines={2} style={styles.title}>
            {resource === "classes" ? `Lớp ${title}` : title}
          </Text>
        </View>

        <View style={styles.idBadge}>
          <Text style={styles.idBadgeText}>#{item.id}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        {config.details.map((detail) => (
          <View key={detail.key} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{detail.label}</Text>
            <Text numberOfLines={2} style={styles.detailValue}>
              {displayValue(detail, item, courseMap)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onView(item)}
          style={({ pressed }) => [
            styles.viewButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.viewButtonText}>Xem chi tiết</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onEdit(item)}
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.editButtonText}>Chỉnh sửa</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onDelete(item)}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    overflow: "hidden",
    flexGrow: 1,
    flexBasis: 320,
    maxWidth: 540,
    minWidth: 0,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E4E0D7",
    backgroundColor: "#FFFFFF",
    shadowColor: "#193B3D",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  titleBlock: {
    flex: 1,
    marginHorizontal: 12,
  },
  code: {
    color: "#79837F",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 4,
    color: "#173235",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
  },
  idBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor: "#F1EFE9",
  },
  idBadgeText: {
    color: "#79837F",
    fontSize: 10,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    marginVertical: 15,
    backgroundColor: "#EFEBE3",
  },
  details: {
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  detailLabel: {
    color: "#87918D",
    fontSize: 12,
    lineHeight: 18,
  },
  detailValue: {
    flex: 1,
    color: "#334A4B",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    textAlign: "right",
  },
  actions: {
    marginTop: 17,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#EFEBE3",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  viewButton: {
    marginRight: "auto",
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 11,
    backgroundColor: "#F1EFE9",
  },
  viewButtonText: {
    color: "#53605D",
    fontSize: 11,
    fontWeight: "800",
  },
  editButton: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 11,
    backgroundColor: "#E7EFED",
  },
  editButtonText: {
    color: "#1D625A",
    fontSize: 11,
    fontWeight: "800",
  },
  deleteButton: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 11,
    backgroundColor: "#FCEBE5",
  },
  deleteButtonText: {
    color: "#BD4F2E",
    fontSize: 11,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
});
