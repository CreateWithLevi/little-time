import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import { formatTime, isWorkingHour, getHourInZone } from '../utils/TimeHelpers';

const HOUR_BLOCK_WIDTH = 48;
const HOUR_BLOCK_HEIGHT = 52;

/**
 * TimelineRow - Horizontal bar chart showing 24 hours for a city
 * Sticky header on the left, scrollable hour blocks
 */
export default function TimelineRow({ city, currentTime, selectedHour }) {
  // Get the current hour in this city's timezone
  const currentHourInCity = getHourInZone(currentTime, city.zone);
  const currentTimeStr = formatTime(currentTime, city.zone);

  // Create array of 24 hours
  const hours = Array.from({ length: 24 }, (_, index) => ({
    hour: index,
    isWorking: isWorkingHour(index),
    isCurrent: index === currentHourInCity,
    isSelected: index === selectedHour,
  }));

  return (
    <View style={styles.container}>
      {/* Sticky header - City info */}
      <View style={styles.header}>
        <Text style={styles.flag}>{city.flag}</Text>
        <View style={styles.cityInfo}>
          <Text style={styles.cityName}>{city.name}</Text>
          <Text style={styles.cityTime}>{currentTimeStr}</Text>
        </View>
      </View>

      {/* Scrollable hour blocks */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {hours.map((hourData) => {
          const { hour, isWorking, isCurrent, isSelected } = hourData;

          // Determine block color
          let blockColor = Colors.hourNonWorking;
          if (isSelected && isWorking) {
            blockColor = Colors.hourWorkingActive;
          } else if (isSelected) {
            blockColor = Colors.accent;
          } else if (isWorking) {
            blockColor = Colors.success;
          }

          return (
            <View
              key={hour}
              style={[
                styles.hourBlock,
                {
                  backgroundColor: blockColor,
                },
                isCurrent && styles.currentHourBlock,
              ]}
            >
              <Text
                style={[
                  styles.hourText,
                  (isSelected || isCurrent) && styles.hourTextActive,
                ]}
              >
                {hour.toString().padStart(2, '0')}
              </Text>
              {isCurrent && (
                <View style={styles.currentIndicator} />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: Colors.surfaceSecondary,
    borderRightWidth: 1,
    borderRightColor: Colors.separator,
  },
  flag: {
    fontSize: 24,
    marginRight: 8,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cityTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  hourBlock: {
    width: HOUR_BLOCK_WIDTH,
    height: HOUR_BLOCK_HEIGHT,
    marginHorizontal: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  currentHourBlock: {
    borderWidth: 2,
    borderColor: Colors.textPrimary,
  },
  hourText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  hourTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  currentIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textPrimary,
  },
});
