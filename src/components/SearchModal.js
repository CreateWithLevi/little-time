import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import CITY_DATABASE from '../constants/CityData';

/**
 * SearchModal - City selection modal with search
 * iOS-style modal with blur background and search functionality
 */
export default function SearchModal({ visible, onClose, onSelectCity, selectedCityIds }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter cities based on search query
  const filteredCities = CITY_DATABASE.filter((city) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return city.keywords.some((keyword) => keyword.toLowerCase().includes(query));
  });

  const handleSelectCity = (city) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectCity(city);
  };

  const handleClose = () => {
    setSearchQuery('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose();
  };

  const renderCityItem = ({ item }) => {
    const isSelected = selectedCityIds.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.cityItem}
        onPress={() => handleSelectCity(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cityItemLeft}>
          <Text style={styles.cityFlag}>{item.flag}</Text>
          <View style={styles.cityTextContainer}>
            <Text style={styles.cityItemName}>{item.name}</Text>
            <Text style={styles.cityItemSub}>{item.sub}</Text>
          </View>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={Colors.accent} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Blur overlay */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        </TouchableOpacity>

        {/* Modal content */}
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.handleBar} />
            <View style={styles.headerContent}>
              <Text style={styles.title}>選擇城市</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeButtonText}>完成</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={Colors.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="搜尋城市..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* City list */}
          <FlatList
            data={filteredCities}
            renderItem={renderCityItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>找不到城市</Text>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    paddingTop: 8,
  },
  handleBar: {
    width: 36,
    height: 5,
    backgroundColor: Colors.separator,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accent,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    padding: 0,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    marginBottom: 8,
  },
  cityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cityFlag: {
    fontSize: 32,
    marginRight: 12,
  },
  cityTextContainer: {
    flex: 1,
  },
  cityItemName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cityItemSub: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 12,
  },
});
