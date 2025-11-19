import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import MainScreen from './src/screens/MainScreen';
import Colors from './src/constants/Colors';

/**
 * App - Entry point for Little Time
 * Strict iOS Dark Mode with SafeAreaView and StatusBar configuration
 */
export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <SafeAreaView style={styles.container}>
        <MainScreen />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
