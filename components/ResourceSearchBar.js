import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

export default function ResourceSearchBar({
  label,
  placeholder,
  value,
  onChange,
}) {
  const { width } = useWindowDimensions();
  const isWide = width >= 760;

  return (
    <View style={[styles.container, isWide && styles.wideContainer]}>
      <Text style={styles.icon}>⌕</Text>
      <TextInput
        accessibilityLabel={`Tìm kiếm ${label}`}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9AA39F"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Xóa nội dung tìm kiếm"
          onPress={() => onChange("")}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.clearButtonText}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 47,
    borderWidth: 1,
    borderColor: "#DAD6CC",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },
  wideContainer: {
    maxWidth: 520,
  },
  icon: {
    marginRight: 8,
    color: "#82908B",
    fontSize: 22,
    lineHeight: 22,
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    color: "#173235",
    fontSize: 13,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECE9E1",
  },
  clearButtonText: {
    color: "#687571",
    fontSize: 19,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.76,
  },
});
