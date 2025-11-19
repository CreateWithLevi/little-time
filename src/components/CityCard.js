import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';
import { formatTime, getHourInZone, isWorkingHour } from '../utils/TimeHelpers';

/**
 * CityCard - Card view showing city time and status
 * Uses gradient background to indicate working hours
 */
export default function CityCard({ city, currentTime }) {
  const timeStr = formatTime(currentTime, city.zone);
  const currentHour = getHourInZone(currentTime, city.zone);
  const isWorking = isWorkingHour(currentHour);

  // Choose gradient colors based on working hours
  const gradientColors = isWorking
    ? [Colors.success + '40', Colors.surface] // Green tint for working hours
    : [Colors.surface, Colors.surface]; // Default for non-working hours

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Flag and City Name */}
        <View style={styles.header}>
          <Text style={styles.flag}>{city.flag}</Text>
          <View style={styles.nameContainer}>
            <Text style={styles.cityName}>{city.name}</Text>
            <Text style={styles.citySubName}>{city.sub}</Text>
          </View>
        </View>

        {/* Time Display */}
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{timeStr}</Text>
          <View style={styles.statusBadge}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isWorking ? Colors.success : Colors.textSecondary },
              ]}
            />
            <Text style={styles.statusText}>
              {isWorking ? '工作時間' : '非工作時間'}
            </Text>
          </View>
        </View>

        {/* Hour indicator */}
        <View style={styles.hourIndicator}>
          <Text style={styles.hourLabel}>當前小時</Text>
          <Text style={styles.hourValue}>
            {currentHour.toString().padStart(2, '0')}:00
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  flag: {
    fontSize: 40,
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
  },
  cityName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  citySubName: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  timeContainer: {
    marginBottom: 16,
  },
  time: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -1,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  hourIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.separator,
  },
  hourLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  hourValue: {
    fontSize: 16,
    color: Colors.accent,
    fontWeight: '700',
  },
});
