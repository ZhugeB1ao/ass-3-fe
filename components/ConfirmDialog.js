import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ConfirmDialog({
  visible,
  title,
  description,
  errorMessage,
  loading,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={styles.dialog}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>!</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={onCancel}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cancelText}>Giữ lại</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.pressed,
                loading && styles.disabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.deleteText}>Xóa bản ghi</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(8, 28, 30, 0.62)",
  },
  dialog: {
    width: "100%",
    maxWidth: 390,
    padding: 22,
    borderRadius: 22,
    backgroundColor: "#FBFAF6",
    shadowColor: "#000000",
    shadowOpacity: 0.24,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCE4DB",
  },
  iconText: {
    color: "#C54D2B",
    fontSize: 20,
    fontWeight: "900",
  },
  title: {
    marginTop: 16,
    color: "#173235",
    fontSize: 20,
    fontWeight: "800",
  },
  description: {
    marginTop: 8,
    color: "#687571",
    fontSize: 13,
    lineHeight: 20,
  },
  errorBox: {
    marginTop: 14,
    padding: 11,
    borderRadius: 11,
    backgroundColor: "#FCE4DB",
  },
  errorText: {
    color: "#A94327",
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "600",
  },
  actions: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 9,
  },
  cancelButton: {
    minHeight: 43,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAE7DF",
  },
  cancelText: {
    color: "#53605D",
    fontSize: 12,
    fontWeight: "800",
  },
  deleteButton: {
    minWidth: 112,
    minHeight: 43,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C95533",
  },
  deleteText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.76,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.62,
  },
});
