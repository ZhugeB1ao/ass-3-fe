import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function StudentCard({ student, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View>
          <Text style={styles.cardName}>{student.name}</Text>
          <Text style={styles.cardMeta}>{student.university}</Text>
        </View>
        <View style={styles.idPill}>
          <Text style={styles.idText}>ID {student.id}</Text>
        </View>
      </View>

      <View style={styles.cardInfoRow}>
        <Text style={styles.cardLabel}>Email</Text>
        <Text style={styles.cardValue}>{student.email}</Text>
      </View>
      <View style={styles.cardInfoRow}>
        <Text style={styles.cardLabel}>Chuyen nganh</Text>
        <Text style={styles.cardValue}>
          {student.major || 'Chua cap nhat'}
        </Text>
      </View>
      <View style={styles.cardInfoRow}>
        <Text style={styles.cardLabel}>GPA</Text>
        <Text style={styles.cardValue}>{student.gpa || '--'}</Text>
      </View>

      <View style={styles.cardActions}>
        <Pressable
          onPress={() => onEdit(student)}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
        >
          <Text style={styles.actionButtonText}>Chi tiet</Text>
        </Pressable>
        <Pressable
          onPress={() => onDelete(student.id)}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.actionButtonPressed,
          ]}
        >
          <Text style={styles.deleteButtonText}>Xoa</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748b',
  },
  idPill: {
    backgroundColor: '#e2f8f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  idText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f766e',
    letterSpacing: 0.6,
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  cardValue: {
    fontSize: 13,
    color: '#1f2937',
    flexShrink: 1,
    textAlign: 'right',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  deleteButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#fee2e2',
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b91c1c',
  },
  actionButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
