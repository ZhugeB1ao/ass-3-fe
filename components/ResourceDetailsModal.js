import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RESOURCES } from "../config/resources";

function formatDate(value) {
  if (!value) {
    return "Chưa cập nhật";
  }

  const datePart = String(value).slice(0, 10);
  const parts = datePart.split("-");

  if (parts.length !== 3) {
    return String(value);
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatDateTime(value) {
  if (!value) {
    return "Không có dữ liệu";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("vi-VN");
}

function formatFieldValue(resource, field, item, courseMap) {
  const rawValue = item?.[field.key];

  if (field.key === "date_of_birth") {
    return formatDate(rawValue);
  }

  if (resource === "classes" && field.key === "course_id") {
    const course = courseMap[String(rawValue)];

    if (course) {
      return `${course.course_code} · ${course.course_name}`;
    }

    return rawValue ? `Môn học #${rawValue}` : "Chưa chọn môn học";
  }

  if (rawValue === null || rawValue === undefined || rawValue === "") {
    return "Chưa cập nhật";
  }

  return String(rawValue);
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text selectable style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

export default function ResourceDetailsModal({
  visible,
  resource,
  item,
  courseMap,
  status,
  errorMessage,
  onClose,
  onRetry,
  onEdit,
}) {
  const config = RESOURCES[resource];
  const insets = useSafeAreaInsets();
  const isLoading = status === "loading";
  const hasError = status === "failed";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        style={[
          styles.overlay,
          {
            paddingTop: Math.max(insets.top, 20),
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.dialog}>
          <View style={styles.header}>
            <View
              style={[styles.icon, { backgroundColor: config.softAccent }]}
            >
              <Text style={[styles.iconText, { color: config.accent }]}>i</Text>
            </View>
            <View style={styles.titleBlock}>
              <Text style={[styles.eyebrow, { color: config.accent }]}>
                THÔNG TIN CHI TIẾT
              </Text>
              <Text style={styles.title}>{config.singular}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {isLoading ? (
              <View style={styles.state}>
                <ActivityIndicator color={config.accent} size="large" />
                <Text style={styles.stateTitle}>Đang tải chi tiết</Text>
                <Text style={styles.stateDescription}>
                  Đang lấy dữ liệu mới nhất từ API.
                </Text>
              </View>
            ) : null}

            {hasError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorTitle}>
                  Không thể tải thông tin chi tiết
                </Text>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={onRetry}
                  style={({ pressed }) => [
                    styles.retryButton,
                    { backgroundColor: config.accent },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.retryButtonText}>Thử lại</Text>
                </Pressable>
              </View>
            ) : null}

            {!isLoading && !hasError && item ? (
              <View style={styles.details}>
                <DetailRow label="ID" value={String(item.id ?? "--")} />

                {config.fields.map((field) => (
                  <DetailRow
                    key={field.key}
                    label={field.label}
                    value={formatFieldValue(
                      resource,
                      field,
                      item,
                      courseMap,
                    )}
                  />
                ))}

                {"created_at" in item ? (
                  <DetailRow
                    label="Ngày tạo"
                    value={formatDateTime(item.created_at)}
                  />
                ) : null}

                {"updated_at" in item ? (
                  <DetailRow
                    label="Cập nhật lần cuối"
                    value={formatDateTime(item.updated_at)}
                  />
                ) : null}
              </View>
            ) : null}
          </ScrollView>

          {!isLoading && !hasError && item ? (
            <View style={styles.footer}>
              <Pressable
                accessibilityRole="button"
                onPress={onClose}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.secondaryButtonText}>Đóng</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => onEdit(item)}
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: config.accent },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.primaryButtonText}>Chỉnh sửa</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(8, 28, 30, 0.62)",
  },
  dialog: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "92%",
    padding: 22,
    borderRadius: 24,
    backgroundColor: "#FBFAF6",
    shadowColor: "#000000",
    shadowOpacity: 0.24,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
  header: {
    paddingBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3D9",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 20,
    fontWeight: "900",
  },
  titleBlock: {
    flex: 1,
    marginHorizontal: 12,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.3,
  },
  title: {
    marginTop: 4,
    color: "#173235",
    fontSize: 21,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  closeButton: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#ECE9E1",
  },
  closeButtonText: {
    color: "#53605D",
    fontSize: 11,
    fontWeight: "800",
  },
  content: {
    paddingVertical: 18,
  },
  details: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E4E0D7",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  detailRow: {
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEBE3",
    gap: 5,
  },
  detailLabel: {
    color: "#87918D",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  detailValue: {
    color: "#294143",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  state: {
    minHeight: 230,
    alignItems: "center",
    justifyContent: "center",
  },
  stateTitle: {
    marginTop: 14,
    color: "#294143",
    fontSize: 16,
    fontWeight: "800",
  },
  stateDescription: {
    marginTop: 6,
    color: "#7C8783",
    fontSize: 12,
  },
  errorBox: {
    minHeight: 190,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0C9BC",
    borderRadius: 16,
    justifyContent: "center",
    backgroundColor: "#FBEAE4",
  },
  errorTitle: {
    color: "#9E3F25",
    fontSize: 15,
    fontWeight: "800",
  },
  errorText: {
    marginTop: 7,
    color: "#A65C47",
    fontSize: 12,
    lineHeight: 18,
  },
  retryButton: {
    alignSelf: "flex-start",
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 11,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  footer: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E8E3D9",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 9,
  },
  secondaryButton: {
    minHeight: 44,
    paddingHorizontal: 17,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAE7DF",
  },
  secondaryButtonText: {
    color: "#53605D",
    fontSize: 12,
    fontWeight: "800",
  },
  primaryButton: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.76,
    transform: [{ scale: 0.99 }],
  },
});
