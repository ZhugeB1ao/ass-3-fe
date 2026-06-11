import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RESOURCES } from "../config/resources";

function CourseSelector({ value, courses, onChange, disabled }) {
  if (!courses.length) {
    return (
      <View style={styles.courseWarning}>
        <Text style={styles.courseWarningTitle}>Chưa có môn học</Text>
        <Text style={styles.courseWarningText}>
          Hãy tạo ít nhất một môn học trước khi thêm lớp.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.courseList}>
      {courses.map((course) => {
        const selected = String(value) === String(course.id);

        return (
          <Pressable
            key={course.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected, disabled }}
            disabled={disabled}
            onPress={() => onChange(String(course.id))}
            style={({ pressed }) => [
              styles.courseOption,
              selected && styles.courseOptionSelected,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.courseOptionCode,
                selected && styles.courseOptionCodeSelected,
              ]}
            >
              {course.course_code}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.courseOptionName,
                selected && styles.courseOptionNameSelected,
              ]}
            >
              {course.course_name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function ResourceFormModal({
  visible,
  mode,
  resource,
  form,
  courses,
  saving,
  errorMessage,
  onChange,
  onClose,
  onSave,
}) {
  const config = RESOURCES[resource];
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const firstInputRef = useRef(null);
  const isWide = width >= 700;

  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    const timer = setTimeout(() => firstInputRef.current?.focus(), 250);
    return () => clearTimeout(timer);
  }, [visible, resource]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[
          styles.overlay,
          isWide ? styles.overlayCentered : styles.overlayBottom,
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            isWide ? styles.dialog : styles.bottomSheet,
            { paddingBottom: Math.max(insets.bottom, 18) },
          ]}
        >
          <View style={styles.handle} />

          <View style={styles.modalHeader}>
            <View style={styles.modalTitleBlock}>
              <Text style={[styles.modalEyebrow, { color: config.accent }]}>
                {mode === "edit" ? "CẬP NHẬT BẢN GHI" : "TẠO BẢN GHI MỚI"}
              </Text>
              <Text style={styles.modalTitle}>
                {mode === "edit" ? "Chỉnh sửa" : "Thêm"} {config.singular}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              disabled={saving}
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
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formContent}
          >
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {config.fields.map((field, index) => (
              <View key={field.key} style={styles.field}>
                <Text style={styles.label}>
                  {field.label}
                  {field.required ? (
                    <Text style={styles.required}> *</Text>
                  ) : null}
                </Text>

                {field.type === "course" ? (
                  <CourseSelector
                    value={form[field.key] ?? ""}
                    courses={courses}
                    disabled={saving}
                    onChange={(value) => onChange(field.key, value)}
                  />
                ) : (
                  <TextInput
                    ref={index === 0 ? firstInputRef : undefined}
                    accessibilityLabel={field.label}
                    value={form[field.key]}
                    editable={!saving}
                    onChangeText={(value) => onChange(field.key, value)}
                    placeholder={field.placeholder}
                    placeholderTextColor="#A5ADA9"
                    keyboardType={field.keyboardType || "default"}
                    autoCapitalize={field.autoCapitalize || "sentences"}
                    maxLength={field.maxLength}
                    style={[styles.input, saving && styles.inputDisabled]}
                  />
                )}
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              disabled={saving}
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={saving}
              onPress={onSave}
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: config.accent },
                pressed && styles.pressed,
                saving && styles.disabled,
              ]}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {mode === "edit" ? "Lưu thay đổi" : "Tạo mới"}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingHorizontal: 14,
    backgroundColor: "rgba(8, 28, 30, 0.62)",
  },
  overlayCentered: {
    alignItems: "center",
    justifyContent: "center",
  },
  overlayBottom: {
    justifyContent: "flex-end",
    paddingHorizontal: 0,
  },
  sheet: {
    maxHeight: "92%",
    backgroundColor: "#FBFAF6",
    shadowColor: "#000000",
    shadowOpacity: 0.22,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
  dialog: {
    width: "100%",
    maxWidth: 560,
    borderRadius: 24,
    padding: 22,
  },
  bottomSheet: {
    width: "100%",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    alignSelf: "center",
    marginBottom: 17,
    borderRadius: 2,
    backgroundColor: "#D6D2C9",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3D9",
  },
  modalTitleBlock: {
    flex: 1,
  },
  modalEyebrow: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.3,
  },
  modalTitle: {
    marginTop: 5,
    color: "#173235",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
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
  formContent: {
    paddingVertical: 18,
    gap: 15,
  },
  errorBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3CFC2",
    backgroundColor: "#FCEBE5",
  },
  errorText: {
    color: "#A94327",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  field: {
    gap: 7,
  },
  label: {
    color: "#435351",
    fontSize: 12,
    fontWeight: "800",
  },
  required: {
    color: "#D35834",
  },
  input: {
    minHeight: 46,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "#DCD8CF",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    color: "#173235",
    fontSize: 14,
  },
  inputDisabled: {
    opacity: 0.65,
  },
  courseList: {
    gap: 8,
  },
  courseOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#DCD8CF",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  courseOptionSelected: {
    borderColor: "#1D7A6D",
    backgroundColor: "#E1F0EC",
  },
  courseOptionCode: {
    color: "#73807C",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.9,
  },
  courseOptionCodeSelected: {
    color: "#1D7A6D",
  },
  courseOptionName: {
    marginTop: 3,
    color: "#344947",
    fontSize: 12,
    fontWeight: "700",
  },
  courseOptionNameSelected: {
    color: "#174E48",
  },
  courseWarning: {
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E9D8A8",
    backgroundColor: "#F8F0D9",
  },
  courseWarningTitle: {
    color: "#8B6518",
    fontSize: 12,
    fontWeight: "800",
  },
  courseWarningText: {
    marginTop: 4,
    color: "#8B7445",
    fontSize: 11,
    lineHeight: 17,
  },
  footer: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E8E3D9",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 9,
  },
  cancelButton: {
    minWidth: 86,
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAE7DF",
  },
  cancelButtonText: {
    color: "#53605D",
    fontSize: 12,
    fontWeight: "800",
  },
  saveButton: {
    minWidth: 126,
    minHeight: 44,
    paddingHorizontal: 17,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
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
