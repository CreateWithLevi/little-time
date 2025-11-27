import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import { formatTime, isWorkingHour, getHourInZone } from '../utils/TimeHelpers';

const HOUR_BLOCK_WIDTH = 48;
const HOUR_BLOCK_MARGIN = 4;
const FULL_BLOCK_WIDTH = HOUR_BLOCK_WIDTH + HOUR_BLOCK_MARGIN;
const HOUR_BLOCK_HEIGHT = 52;

/**
 * TimelineRow - Horizontal bar chart showing 24 hours for a city
 * Sticky header on the left, scrollable hour blocks
 */
export default function TimelineRow({ city, currentTime, selectedHour }) {
  const scrollViewRef = useRef(null);
  const [scrollViewWidth, setScrollViewWidth] = useState(0);

  // Get the current hour in this city's timezone
  const currentHourInCity = getHourInZone(currentTime, city.zone);
  const currentTimeStr = formatTime(currentTime, city.zone);

  // Calculate padding to center the first and last items
  // We want the center of the first item to be at the center of the view
  // View Center = scrollViewWidth / 2
  // First Item Center = paddingLeft + (FULL_BLOCK_WIDTH / 2)
  // So: paddingLeft = (scrollViewWidth / 2) - (FULL_BLOCK_WIDTH / 2)
  const horizontalPadding = scrollViewWidth > 0
    ? (scrollViewWidth / 2) - (FULL_BLOCK_WIDTH / 2)
    : 0;

  // Auto-scroll to center the selected hour
  useEffect(() => {
    if (scrollViewRef.current && scrollViewWidth > 0) {
      // Item position relative to the scroll content start (including padding)
      const itemX = horizontalPadding + (currentHourInCity * FULL_BLOCK_WIDTH);

      // We want this itemX to be at the center of the viewport
      // ScrollOffset = ItemX - (ViewportWidth / 2) + (ItemWidth / 2)
      // But since we want the center of the item to align with center of viewport:
      // Center of Item = itemX + (FULL_BLOCK_WIDTH / 2)
      // Center of Viewport (in scroll coords) = ScrollOffset + (scrollViewWidth / 2)
      // Equating them: ScrollOffset = itemX + (FULL_BLOCK_WIDTH / 2) - (scrollViewWidth / 2)

      // Let's simplify:
      // We want to scroll so that the start of the item is at (ViewWidth - ItemWidth)/2
      // ScrollOffset = ItemX - (scrollViewWidth - FULL_BLOCK_WIDTH) / 2

      const offset = itemX - (scrollViewWidth - FULL_BLOCK_WIDTH) / 2;

      scrollViewRef.current.scrollTo({
        x: offset,
        animated: true,
      });
    }
  }, [currentHourInCity, scrollViewWidth, horizontalPadding]);

  // Create array of 24 hours
  const hours = Array.from({ length: 24 }, (_, index) => ({
    hour: index,
    isWorking: isWorkingHour(index),
    isCurrent: index === currentHourInCity,
    isSelected: index === currentHourInCity,
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
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scrollView}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingVertical: 8,
        }}
        onLayout={(e) => setScrollViewWidth(e.nativeEvent.layout.width)}
      >
        {hours.map((hourData) => {
          const { hour, isWorking, isCurrent, isSelected } = hourData;

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
    zIndex: 1,
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
