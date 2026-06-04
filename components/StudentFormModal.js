import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function StudentFormModal({
  visible,
  mode,
  form,
  onChange,
  onClose,
  onSave,
  saving,
  errorMessage,
}) {
  const isEdit = mode === 'edit';
  const actionLabel = isEdit ? 'Luu cap nhat' : 'Tao moi';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEdit ? 'Chi tiet sinh vien' : 'Tao sinh vien moi'}
            </Text>
            <Pressable onPress={onClose} disabled={saving}>
              <Text
                style={[styles.modalClose, saving && styles.modalCloseDisabled]}
              >
                Dong
              </Text>
            </Pressable>
          </View>

          {errorMessage ? (
            <Text style={styles.formError}>{errorMessage}</Text>
          ) : null}

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Ma so</Text>
            <TextInput
              value={form.id}
              editable={!isEdit && !saving}
              onChangeText={(value) => onChange('id', value)}
              style={[
                styles.formInput,
                isEdit && styles.formInputDisabled,
              ]}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Ho ten</Text>
            <TextInput
              value={form.name}
              editable={!saving}
              onChangeText={(value) => onChange('name', value)}
              style={styles.formInput}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Truong</Text>
            <TextInput
              value={form.university}
              editable={!saving}
              onChangeText={(value) => onChange('university', value)}
              style={styles.formInput}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Email</Text>
            <TextInput
              value={form.email}
              editable={!saving}
              onChangeText={(value) => onChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.formInput}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Chuyen nganh</Text>
            <TextInput
              value={form.major}
              editable={!saving}
              onChangeText={(value) => onChange('major', value)}
              style={styles.formInput}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>GPA</Text>
            <TextInput
              value={form.gpa}
              editable={!saving}
              onChangeText={(value) => onChange('gpa', value)}
              keyboardType="decimal-pad"
              style={styles.formInput}
            />
          </View>

          <Pressable
            onPress={onSave}
            disabled={saving}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && !saving && styles.saveButtonPressed,
              saving && styles.saveButtonDisabled,
            ]}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Dang luu...' : actionLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalClose: {
    fontSize: 14,
    color: '#0f766e',
    fontWeight: '600',
  },
  modalCloseDisabled: {
    opacity: 0.5,
  },
  formError: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    fontSize: 12,
  },
  formRow: {
    gap: 6,
  },
  formLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  formInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  formInputDisabled: {
    backgroundColor: '#f1f5f9',
    color: '#94a3b8',
  },
  saveButton: {
    marginTop: 6,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f97316',
  },
  saveButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff7ed',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
