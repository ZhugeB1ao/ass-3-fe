import { StatusBar } from 'expo-status-bar';
import { useMemo, useRef, useState, useEffect } from 'react';
import {
  Animated,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ScreenHeader from '../components/ScreenHeader';
import SearchBar from '../components/SearchBar';
import StudentCard from '../components/StudentCard';
import StudentFormModal from '../components/StudentFormModal';
import {
  createStudent,
  deleteStudent,
  fetchStudents,
  searchStudents,
  updateStudent,
} from '../store/studentsSlice';

const emptyForm = {
  id: '',
  name: '',
  university: '',
  email: '',
  major: '',
  gpa: '',
};

export default function StudentListScreen() {
  const dispatch = useDispatch();
  const { items, status, error, actionStatus, actionError } = useSelector(
    (state) => state.students
  );
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState('create');
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const trimmed = query.trim();
    const timer = setTimeout(() => {
      if (trimmed) {
        dispatch(searchStudents(trimmed));
      } else {
        dispatch(fetchStudents());
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [dispatch, query]);

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return items;
    }
    return items.filter((student) => {
      const haystack = [
        student.id,
        student.name,
        student.university,
        student.email,
        student.major,
        student.gpa,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [items, query]);

  const handleDelete = async (id) => {
    setFormError('');
    try {
      await dispatch(deleteStudent(id)).unwrap();
    } catch (err) {
      setFormError(err?.message || 'Khong the xoa sinh vien.');
    }
  };

  const nextId = () => {
    const maxId = items.reduce((max, student) => {
      const parsed = Number(student.id);
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
    }, 0);
    return String(maxId + 1).padStart(3, '0');
  };

  const openCreate = () => {
    setMode('create');
    setForm({ ...emptyForm, id: nextId() });
    setFormError('');
    setModalVisible(true);
  };

  const openEdit = (student) => {
    setMode('edit');
    setForm({ ...student });
    setFormError('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSave = async () => {
    const payload = {
      id: form.id.trim() || nextId(),
      name: form.name.trim(),
      university: form.university.trim(),
      email: form.email.trim(),
      major: form.major.trim(),
      gpa: form.gpa.trim(),
    };

    if (!payload.name || !payload.university || !payload.email) {
      setFormError('Vui long nhap day du thong tin bat buoc.');
      return;
    }

    setFormError('');
    try {
      const action = mode === 'edit' ? updateStudent(payload) : createStudent(payload);
      await dispatch(action).unwrap();
      closeModal();
    } catch (err) {
      setFormError(err?.message || 'Khong the luu du lieu.');
    }
  };

  const isLoading = status === 'loading';
  const isSaving = actionStatus === 'loading';
  const emptyMessage = query.trim()
    ? 'Khong tim thay sinh vien phu hop.'
    : 'Chua co sinh vien nao.';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.backgroundShapePrimary} />
      <View style={styles.backgroundShapeSecondary} />

      <ScreenHeader
        title="DS sinh vien"
        subtitle="Du lieu lay tu API"
        onCreate={openCreate}
        animatedStyle={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            },
          ],
        }}
      />

      <SearchBar
        value={query}
        onChange={setQuery}
        count={filtered.length}
        placeholder="Tim theo ten, email, truong..."
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StudentCard
            student={item}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {isLoading ? 'Dang tai du lieu...' : emptyMessage}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isLoading
                ? 'Vui long doi trong giay lat.'
                : 'Ban co the tao sinh vien moi de bat dau.'}
            </Text>
          </View>
        }
      />
      <StudentFormModal
        visible={modalVisible}
        mode={mode}
        form={form}
        onChange={(field, value) =>
          setForm((prev) => ({ ...prev, [field]: value }))
        }
        onClose={closeModal}
        onSave={handleSave}
        saving={isSaving}
        errorMessage={formError || actionError}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4ef',
  },
  backgroundShapePrimary: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#fcd34d',
    opacity: 0.25,
    top: -60,
    right: -80,
  },
  backgroundShapeSecondary: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#14b8a6',
    opacity: 0.18,
    bottom: -120,
    left: -60,
  },
  listContent: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 14,
  },
  errorText: {
    marginHorizontal: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    fontSize: 12,
  },
  emptyState: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7c2d12',
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 12,
    color: '#9a3412',
  },
});
