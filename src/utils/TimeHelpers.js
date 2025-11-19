/**
 * Time Helpers - Timezone conversion and working hour utilities
 * Uses native JavaScript Intl API for timezone conversions
 */

/**
 * Format a date to HH:mm in a specific timezone
 * @param {Date} date - The date to format
 * @param {string} zone - IANA timezone (e.g., 'Asia/Taipei')
 * @returns {string} Time in HH:mm format
 */
export function formatTime(date, zone) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return formatter.format(date);
  } catch (error) {
    console.error(`Error formatting time for zone ${zone}:`, error);
    return '00:00';
  }
}

/**
 * Get the hour (0-23) in a specific timezone
 * @param {Date} date - The date to get the hour from
 * @param {string} zone - IANA timezone (e.g., 'Asia/Taipei')
 * @returns {number} Hour (0-23)
 */
export function getHourInZone(date, zone) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      hour: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const hourPart = parts.find(part => part.type === 'hour');

    if (hourPart) {
      return parseInt(hourPart.value, 10);
    }

    return 0;
  } catch (error) {
    console.error(`Error getting hour for zone ${zone}:`, error);
    return 0;
  }
}

/**
 * Check if an hour is within working hours (09:00-18:00)
 * @param {number} hour - Hour (0-23)
 * @returns {boolean} True if 9 <= hour < 18
 */
export function isWorkingHour(hour) {
  return hour >= 9 && hour < 18;
}

/**
 * Get date and time parts for a specific timezone
 * @param {Date} date - The date to format
 * @param {string} zone - IANA timezone
 * @returns {object} Object with hour, minute, day, month, year
 */
export function getDatePartsInZone(date, zone) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const getValue = (type) => {
      const part = parts.find(p => p.type === type);
      return part ? parseInt(part.value, 10) : 0;
    };

    return {
      hour: getValue('hour'),
      minute: getValue('minute'),
      day: getValue('day'),
      month: getValue('month'),
      year: getValue('year'),
    };
  } catch (error) {
    console.error(`Error getting date parts for zone ${zone}:`, error);
    return { hour: 0, minute: 0, day: 1, month: 1, year: 2024 };
  }
}

/**
 * Get all 24 hours for a city at a specific reference time
 * @param {Date} referenceDate - The reference date/time
 * @param {string} zone - IANA timezone
 * @returns {Array} Array of 24 objects with hour, isWorking, isCurrent
 */
export function getHoursForCity(referenceDate, zone) {
  const currentHour = getHourInZone(referenceDate, zone);

  return Array.from({ length: 24 }, (_, index) => ({
    hour: index,
    displayHour: index.toString().padStart(2, '0'),
    isWorking: isWorkingHour(index),
    isCurrent: index === currentHour,
  }));
}

export default {
  formatTime,
  getHourInZone,
  isWorkingHour,
  getDatePartsInZone,
  getHoursForCity,
};
