import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  StatusBar
} from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0084ff" />
      <ActivityIndicator size="large" color="#0084ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
});

export default SplashScreen;
