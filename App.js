import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={styles.container}>
          <Text style={styles.text}>FightNight App 🥊</Text>
          <Text style={styles.subtext}>Redux Setup Complete!</Text>
          <StatusBar style="light" />
        </View>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FF4444',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#FFD700',
    fontSize: 16,
    marginTop: 10,
  },
});
