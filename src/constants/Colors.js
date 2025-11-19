// iOS Dark Mode Color Palette
// Strictly following iOS Human Interface Guidelines

export const Colors = {
  // Backgrounds
  background: '#000000',        // Pure Black - Primary background
  surface: '#1C1C1E',           // Dark Gray - Cards and elevated surfaces
  surfaceSecondary: '#2C2C2E',  // Slightly lighter surface for layering

  // Text
  textPrimary: '#FFFFFF',       // White - Primary text
  textSecondary: '#8E8E93',     // System Gray - Secondary text
  textTertiary: '#636366',      // Darker gray - Tertiary text

  // Accent Colors
  accent: '#0A84FF',            // iOS Blue - Interactive elements
  success: '#30D158',           // iOS Green - Working hours (09:00-18:00)
  warning: '#FF9F0A',           // iOS Orange - Warning states
  error: '#FF453A',             // iOS Red - Error states

  // Separators and Borders
  separator: '#38383A',         // Separator lines
  border: '#48484A',            // Border color

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',           // Modal overlay
  overlayLight: 'rgba(28, 28, 30, 0.95)',  // Light overlay

  // Hour blocks
  hourInactive: '#1C1C1E',      // Default hour block
  hourActive: '#0A84FF',        // Current selected hour
  hourWorking: '#30D158',       // Working hours (09:00-18:00)
  hourWorkingActive: '#32D760', // Working hour + active
  hourNonWorking: '#2C2C2E',    // Non-working hours
};

export default Colors;
