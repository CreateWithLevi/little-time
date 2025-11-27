import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import CITY_DATABASE from '../constants/CityData';
import TimeSlider from '../components/TimeSlider';
import TimelineRow from '../components/TimelineRow';
import CityCard from '../components/CityCard';
import SearchModal from '../components/SearchModal';
import { formatTime } from '../utils/TimeHelpers';

/**
 * MainScreen - Primary dashboard for the Little Time app
 * Manages selected cities, time scrubbing, and view modes
 */
export default function MainScreen() {
  // State management
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [selectedCities, setSelectedCities] = useState([]);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'card'
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setSelectedHour(now.getHours());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Initialize with 3 default cities
  useEffect(() => {
    const defaultCities = CITY_DATABASE.filter((city) =>
      ['1', '2', '3'].includes(city.id) // Taipei, Tokyo, New York
    );
    setSelectedCities(defaultCities);
  }, []);

  // Update current time based on slider
  useEffect(() => {
    const now = new Date();
    const newTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      selectedHour,
      0,
      0
    );
    setCurrentTime(newTime);
  }, [selectedHour]);

  const handleSelectCity = (city) => {
    const isAlreadySelected = selectedCities.some((c) => c.id === city.id);

    if (isAlreadySelected) {
      // Remove city
      setSelectedCities(selectedCities.filter((c) => c.id !== city.id));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // Add city
      setSelectedCities([...selectedCities, city]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleCopyTimes = async () => {
    if (selectedCities.length === 0) {
      Alert.alert('提醒', '請先選擇至少一個城市');
      return;
    }

    const timesText = selectedCities
      .map((city) => {
        const time = formatTime(currentTime, city.zone);
        return `${city.flag} ${city.name} (${city.sub}): ${time}`;
      })
      .join('\n');

    try {
      await Clipboard.setStringAsync(timesText);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('成功', '時間已複製到剪貼簿');
    } catch (error) {
      Alert.alert('錯誤', '複製失敗，請重試');
    }
  };

  const toggleViewMode = () => {
    const newMode = viewMode === 'timeline' ? 'card' : 'timeline';
    setViewMode(newMode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const selectedCityIds = selectedCities.map((c) => c.id);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Little Time</Text>
        <Text style={styles.headerSubtitle}>世界時區一覽</Text>
      </View>

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowSearchModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle" size={24} color={Colors.accent} />
          <Text style={styles.controlButtonText}>新增城市</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleViewMode}
          activeOpacity={0.7}
        >
          <Ionicons
            name={viewMode === 'timeline' ? 'grid' : 'list'}
            size={24}
            color={Colors.accent}
          />
          <Text style={styles.controlButtonText}>
            {viewMode === 'timeline' ? '卡片模式' : '時間軸'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleCopyTimes}
          activeOpacity={0.7}
        >
          <Ionicons name="copy" size={24} color={Colors.accent} />
          <Text style={styles.controlButtonText}>複製</Text>
        </TouchableOpacity>
      </View>

      {/* Time Slider */}
      <TimeSlider
        value={selectedHour}
        onValueChange={setSelectedHour}
        localTimezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
      />

      {/* City List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedCities.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="globe-outline" size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>尚未選擇城市</Text>
            <Text style={styles.emptyStateText}>
              點擊上方「新增城市」按鈕開始
            </Text>
          </View>
        ) : (
          selectedCities.map((city) => {
            if (viewMode === 'timeline') {
              return (
                <TimelineRow
                  key={city.id}
                  city={city}
                  currentTime={currentTime}
                  selectedHour={selectedHour}
                />
              );
            } else {
              return (
                <CityCard
                  key={city.id}
                  city={city}
                  currentTime={currentTime}
                />
              );
            }
          })
        )}

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Search Modal */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectCity={handleSelectCity}
        selectedCityIds={selectedCityIds}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  controlButtonText: {
    fontSize: 12,
    color: Colors.accent,
    marginTop: 4,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 40,
  },
});
