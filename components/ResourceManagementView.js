import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDialog from "./ConfirmDialog";
import EntityCard from "./EntityCard";
import ResourceFormModal from "./ResourceFormModal";
import ResourceHeader from "./ResourceHeader";
import ResourceDetailsModal from "./ResourceDetailsModal";
import ResourceSearchBar from "./ResourceSearchBar";
import ResourceStats from "./ResourceStats";
import ResourceTabs from "./ResourceTabs";
import {
  createEmptyForm,
  formToPayload,
  itemToForm,
  RESOURCES,
  validateForm,
} from "../config/resources";

function normalizeSearchValue(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function ResourceManagementView({
  resource,
  actions,
  selectResourceState,
  onNavigate,
}) {
  const dispatch = useDispatch();
  const activeState = useSelector(selectResourceState);
  const students = useSelector((state) => state.students.items);
  const courses = useSelector((state) => state.courses.items);
  const classes = useSelector((state) => state.classes.items);
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState("create");
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(createEmptyForm(resource));
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [detailTargetId, setDetailTargetId] = useState(null);

  const config = RESOURCES[resource];

  useEffect(() => {
    dispatch(actions.clearMutation());
  }, [actions, dispatch]);

  const counts = {
    students: students.length,
    courses: courses.length,
    classes: classes.length,
  };

  const courseMap = useMemo(
    () =>
      courses.reduce((result, course) => {
        result[String(course.id)] = course;
        return result;
      }, {}),
    [courses],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(query.trim());
    if (!normalizedQuery) {
      return activeState.items;
    }

    return activeState.items.filter((item) => {
      const values = Object.values(item);

      if (resource === "classes") {
        const course = courseMap[String(item.course_id)];
        values.push(course?.course_code, course?.course_name);
      }

      return normalizeSearchValue(values.join(" ")).includes(normalizedQuery);
    });
  }, [activeState.items, courseMap, query, resource]);

  const refreshResource = async () => {
    await dispatch(actions.fetchItems());
  };

  const openCreate = () => {
    setMode("create");
    setEditingItem(null);
    setForm(createEmptyForm(resource));
    setFormError("");
    dispatch(actions.clearMutation());
    setModalVisible(true);
  };

  const openEdit = (item) => {
    setMode("edit");
    setEditingItem(item);
    setForm(itemToForm(resource, item));
    setFormError("");
    dispatch(actions.clearMutation());
    setModalVisible(true);
  };

  const openDetails = (item) => {
    setDetailTargetId(item.id);
    setDetailsVisible(true);
    dispatch(actions.clearDetails());
    dispatch(actions.fetchItemById(item.id));
  };

  const closeDetails = () => {
    setDetailsVisible(false);
    setDetailTargetId(null);
    dispatch(actions.clearDetails());
  };

  const retryDetails = () => {
    if (detailTargetId !== null) {
      dispatch(actions.fetchItemById(detailTargetId));
    }
  };

  const editFromDetails = (item) => {
    closeDetails();
    openEdit(item);
  };

  const closeModal = () => {
    if (activeState.mutationStatus === "loading") {
      return;
    }

    setModalVisible(false);
    setEditingItem(null);
    setFormError("");
    dispatch(actions.clearMutation());
  };

  const handleSave = async () => {
    const validationMessage = validateForm(resource, form);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    const values = formToPayload(resource, form);
    setFormError("");

    try {
      if (mode === "edit") {
        await dispatch(
          actions.updateItem({
            id: editingItem.id,
            values,
          }),
        ).unwrap();
      } else {
        await dispatch(actions.createItem(values)).unwrap();
      }

      await refreshResource();
      setModalVisible(false);
      setEditingItem(null);
    } catch (error) {
      setFormError(error.message || "Không thể lưu dữ liệu.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await dispatch(actions.deleteItem(deleteTarget.id)).unwrap();
      setDeleteTarget(null);
      await refreshResource();
    } catch (error) {
      setFormError(error.message || "Không thể xóa bản ghi.");
    }
  };

  const openDelete = (item) => {
    setFormError("");
    dispatch(actions.clearMutation());
    setDeleteTarget(item);
  };

  const switchResource = (nextResource) => {
    setDeleteTarget(null);
    setDetailsVisible(false);
    setDetailTargetId(null);
    dispatch(actions.clearDetails());
    onNavigate(nextResource);
  };

  const isLoading =
    activeState.status === "loading" && activeState.items.length === 0;
  const isRefreshing =
    activeState.status === "loading" && activeState.items.length > 0;
  const isMutating = activeState.mutationStatus === "loading";
  const hasError = activeState.status === "failed";

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ResourceHeader resource={config} onCreate={openCreate} />

        <View style={styles.contentShell}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => refreshResource()}
                tintColor={config.accent}
              />
            }
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(insets.bottom, 20) + 24 },
            ]}
          >
            <View style={styles.content}>
              <ResourceStats
                activeResource={resource}
                counts={counts}
                onChange={switchResource}
              />

              <View style={styles.toolbar}>
                <ResourceTabs
                  activeResource={resource}
                  counts={counts}
                  onChange={switchResource}
                />

                <ResourceSearchBar
                  label={config.label}
                  placeholder={config.searchPlaceholder}
                  value={query}
                  onChange={setQuery}
                />
              </View>

              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>DANH SÁCH HIỆN TẠI</Text>
                  <Text style={styles.sectionTitle}>
                    {filteredItems.length} {config.label.toLowerCase()}
                  </Text>
                </View>
                <Text style={styles.apiBadge}>API v1</Text>
              </View>

              {isLoading ? (
                <View style={styles.stateCard}>
                  <ActivityIndicator color={config.accent} size="large" />
                  <Text style={styles.stateTitle}>Đang tải dữ liệu</Text>
                  <Text style={styles.stateDescription}>
                    Frontend đang kết nối với endpoint {resource}.
                  </Text>
                </View>
              ) : null}

              {hasError ? (
                <View style={styles.errorCard}>
                  <Text style={styles.errorTitle}>Chưa kết nối được API</Text>
                  <Text style={styles.errorDescription}>
                    {activeState.error}
                  </Text>
                  <Pressable
                    onPress={() => refreshResource()}
                    style={({ pressed }) => [
                      styles.retryButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.retryButtonText}>Thử lại</Text>
                  </Pressable>
                </View>
              ) : null}

              {!isLoading && !hasError && filteredItems.length === 0 ? (
                <View style={styles.stateCard}>
                  <View
                    style={[
                      styles.emptyMark,
                      { backgroundColor: config.softAccent },
                    ]}
                  >
                    <Text
                      style={[styles.emptyMarkText, { color: config.accent }]}
                    >
                      {query ? "0" : "+"}
                    </Text>
                  </View>
                  <Text style={styles.stateTitle}>
                    {query
                      ? "Không tìm thấy kết quả"
                      : `Chưa có ${config.singular}`}
                  </Text>
                  <Text style={styles.stateDescription}>
                    {query
                      ? "Thử một từ khóa khác hoặc xóa bộ lọc tìm kiếm."
                      : "Tạo bản ghi đầu tiên để bắt đầu quản lý dữ liệu."}
                  </Text>
                </View>
              ) : null}

              {!isLoading && !hasError && filteredItems.length > 0 ? (
                <View style={styles.cardGrid}>
                  {filteredItems.map((item) => (
                    <EntityCard
                      key={String(item.id)}
                      resource={resource}
                      item={item}
                      courseMap={courseMap}
                      onView={openDetails}
                      onEdit={openEdit}
                      onDelete={openDelete}
                    />
                  ))}
                </View>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      <ResourceFormModal
        visible={modalVisible}
        mode={mode}
        resource={resource}
        form={form}
        courses={courses}
        saving={isMutating}
        errorMessage={formError || activeState.mutationError}
        onChange={(field, value) =>
          setForm((current) => ({ ...current, [field]: value }))
        }
        onClose={closeModal}
        onSave={handleSave}
      />

      <ResourceDetailsModal
        visible={detailsVisible}
        resource={resource}
        item={activeState.selectedItem}
        courseMap={courseMap}
        status={activeState.detailStatus}
        errorMessage={activeState.detailError}
        onClose={closeDetails}
        onRetry={retryDetails}
        onEdit={editFromDetails}
      />

      <ConfirmDialog
        visible={Boolean(deleteTarget)}
        title={`Xóa ${config.singular}?`}
        description="Thao tác này không thể hoàn tác. Các dữ liệu liên kết có thể bị xóa theo ràng buộc trong cơ sở dữ liệu."
        errorMessage={formError || activeState.mutationError}
        loading={isMutating}
        onCancel={() => {
          if (!isMutating) {
            setDeleteTarget(null);
            setFormError("");
            dispatch(actions.clearMutation());
          }
        }}
        onConfirm={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#143436",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#143436",
  },
  contentShell: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "#F3F0E8",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  toolbar: {
    gap: 12,
  },
  sectionHeader: {
    marginTop: 26,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  sectionEyebrow: {
    color: "#8B938F",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  sectionTitle: {
    marginTop: 5,
    color: "#173235",
    fontSize: 20,
    fontWeight: "800",
  },
  apiBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
    overflow: "hidden",
    backgroundColor: "#E2E9E6",
    color: "#3F625E",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    gap: 12,
  },
  stateCard: {
    minHeight: 230,
    padding: 28,
    borderWidth: 1,
    borderColor: "#DED9CF",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF8F2",
  },
  emptyMark: {
    width: 50,
    height: 50,
    marginBottom: 15,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyMarkText: {
    fontSize: 24,
    fontWeight: "800",
  },
  stateTitle: {
    marginTop: 14,
    color: "#294143",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  stateDescription: {
    maxWidth: 330,
    marginTop: 7,
    color: "#7C8783",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  errorCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0C9BC",
    borderRadius: 18,
    backgroundColor: "#FBEAE4",
  },
  errorTitle: {
    color: "#9E3F25",
    fontSize: 15,
    fontWeight: "800",
  },
  errorDescription: {
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
    backgroundColor: "#C95533",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
});
