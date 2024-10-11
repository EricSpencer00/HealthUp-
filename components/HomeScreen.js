import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet } from 'react-native';
import { EventTypes } from 'react-native-gesture-handler/lib/typescript/web/interfaces';

// Home Screen Component
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button
        title="Go to Welcome"
        onPress={() => navigation.navigate('Welcome', { userName: 'John Doe' })}
      />
      <Button 
        title="Go to Fitness"
        onPress={() => navigation.navigate('Fitness')}
      />
      <Button 
        title="Go to Nutrition"
        onPress={() => navigation.navigate('NutritionScreen')}
      ></Button>
      <Button
        title="Go to Barcode Scanner"
        onPress={() => navigation.navigate('BarcodeScanner')}
      ></Button>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
