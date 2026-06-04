import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function SearchBar({ value, onChange, count, placeholder }) {
  return (
    <View style={styles.searchWrapper}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        style={styles.searchInput}
      />
      <Text style={styles.searchHint}>{count} ket qua</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
  },
  searchInput: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 15,
    color: '#0f172a',
  },
  searchHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#64748b',
  },
});
