import React, { useState, useRef, useEffect } from 'react';
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
// Correct width calculation: Screen - (Margin * 2) - (Padding * 2)
// Margin: 16, Padding: 24
const SLIDER_OFFSET = 16 + 24; // 40
const SLIDER_WIDTH = SCREEN_WIDTH - (SLIDER_OFFSET * 2); // Screen - 80
const SLIDER_HEIGHT = 60;

/**
 * TimeSlider - Custom iOS-style slider with haptic feedback
 * Allows users to scrub through 24 hours (0-23)
 */
export default function TimeSlider({ value, onValueChange, localTimezone }) {
  const [isDragging, setIsDragging] = useState(false);
  // Track the visual position of the thumb (0 to SLIDER_WIDTH)
  const [thumbX, setThumbX] = useState((value / 23) * SLIDER_WIDTH);

  // Refs to avoid stale closures in PanResponder
  const valueRef = useRef(value);
  const onValueChangeRef = useRef(onValueChange);
  const lastHapticValue = useRef(value);

  // Update refs and sync thumb position when not dragging
  useEffect(() => {
    valueRef.current = value;
    onValueChangeRef.current = onValueChange;

    // If not dragging, snap thumb to the current value
    if (!isDragging) {
      setThumbX((value / 23) * SLIDER_WIDTH);
    }
  }, [value, onValueChange, isDragging]);

  const handleTouch = (screenX) => {
    // Convert absolute screen X to local slider X
    const localX = screenX - SLIDER_OFFSET;
    const clampedX = Math.max(0, Math.min(localX, SLIDER_WIDTH));

    // Update visual thumb position immediately for smoothness
    setThumbX(clampedX);

    // Calculate the discrete hour value (0-23)
    const newValue = Math.round((clampedX / SLIDER_WIDTH) * 23);

    // Only trigger update if value changed
    if (newValue !== valueRef.current) {
      // Trigger haptic feedback when value changes
      if (newValue !== lastHapticValue.current) {
        Haptics.selectionAsync();
        lastHapticValue.current = newValue;
      }
      onValueChangeRef.current(newValue);
    }
  };

  // PanResponder for touch handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt, gestureState) => {
        setIsDragging(true);
        // Use pageX for the initial touch position
        handleTouch(evt.nativeEvent.pageX);
      },

      onPanResponderMove: (evt, gestureState) => {
        // Use moveX for subsequent movements
        handleTouch(gestureState.moveX);
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

  // Format timezone name to be cleaner (e.g., "Asia/Taipei" -> "Taipei")
  const displayTimezone = localTimezone ? localTimezone.split('/').pop().replace(/_/g, ' ') : 'Local Time';

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <View>
          <Text style={styles.label}>時間選擇</Text>
          <Text style={styles.subLabel}>{displayTimezone}</Text>
        </View>
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
                width: thumbX,
              },
            ]}
          />
        </View>

        {/* Thumb */}
        <View
          style={[
            styles.thumb,
            {
              left: thumbX - 16, // Center the thumb (32px width / 2)
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
  subLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
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
