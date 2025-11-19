import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 48; // 24px padding on each side
const SLIDER_HEIGHT = 60;

/**
 * TimeSlider - Custom iOS-style slider with haptic feedback
 * Allows users to scrub through 24 hours (0-23)
 */
export default function TimeSlider({ value, onValueChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const lastHapticValue = useRef(value);

  // PanResponder for touch handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        setIsDragging(true);
        handleTouch(evt.nativeEvent.locationX);
      },

      onPanResponderMove: (evt) => {
        handleTouch(evt.nativeEvent.locationX);
      },

      onPanResponderRelease: () => {
        setIsDragging(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },

      onPanResponderTerminate: () => {
        setIsDragging(false);
      },
    })
  ).current;

  const handleTouch = (x) => {
    // Clamp x position to slider bounds
    const clampedX = Math.max(0, Math.min(x, SLIDER_WIDTH));

    // Convert position to hour (0-23)
    const newValue = Math.round((clampedX / SLIDER_WIDTH) * 23);

    if (newValue !== value) {
      // Trigger haptic feedback when value changes
      if (newValue !== lastHapticValue.current) {
        Haptics.selectionAsync();
        lastHapticValue.current = newValue;
      }
      onValueChange(newValue);
    }
  };

  // Calculate thumb position based on current value
  const thumbPosition = (value / 23) * SLIDER_WIDTH;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>時間選擇</Text>
        <Text style={styles.valueLabel}>{value.toString().padStart(2, '0')}:00</Text>
      </View>

      <View style={styles.sliderContainer} {...panResponder.panHandlers}>
        {/* Track background */}
        <View style={styles.track}>
          {/* Active track (filled portion) */}
          <View
            style={[
              styles.activeTrack,
              {
                width: thumbPosition,
              },
            ]}
          />
        </View>

        {/* Thumb */}
        <View
          style={[
            styles.thumb,
            {
              left: thumbPosition - 16, // Center the thumb (32px width / 2)
            },
            isDragging && styles.thumbActive,
          ]}
        >
          <View style={styles.thumbInner} />
        </View>

        {/* Hour markers */}
        <View style={styles.markersContainer}>
          {Array.from({ length: 5 }, (_, i) => {
            const hour = i * 6; // 0, 6, 12, 18, 24
            const position = (hour / 23) * SLIDER_WIDTH;
            return (
              <View
                key={i}
                style={[
                  styles.marker,
                  {
                    left: position - 1,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* Hour labels */}
      <View style={styles.hoursContainer}>
        <Text style={styles.hourLabel}>00</Text>
        <Text style={styles.hourLabel}>06</Text>
        <Text style={styles.hourLabel}>12</Text>
        <Text style={styles.hourLabel}>18</Text>
        <Text style={styles.hourLabel}>23</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  valueLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  sliderContainer: {
    height: SLIDER_HEIGHT,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 6,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  activeTrack: {
    height: '100%',
    backgroundColor: Colors.accent,
  },
  thumb: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  thumbActive: {
    transform: [{ scale: 1.2 }],
  },
  thumbInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent,
  },
  markersContainer: {
    position: 'absolute',
    width: '100%',
    height: 6,
    top: SLIDER_HEIGHT / 2 - 3,
  },
  marker: {
    position: 'absolute',
    width: 2,
    height: 6,
    backgroundColor: Colors.separator,
  },
  hoursContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  hourLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
