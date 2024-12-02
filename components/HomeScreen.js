import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet } from 'react-native';
import { EventTypes } from 'react-native-gesture-handler/lib/typescript/web/interfaces';

// Home Screen Component
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}></View>
      <Text style={styles.title}>Welcome to HealthUp!</Text>
      <Text style={styles.title}>Home Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile', { userName: 'John Doe' })}
      />
      <Button 
        title=" Nutrition"
        onPress={() => navigation.navigate('NutritionScreen')}
      ></Button>
      <Button
        title="Exercise"
        onPress={() => navigation.navigate('WorkoutDiary')}
      />
      <Button
        title="Journal"
        onPress={() => navigation.navigate('JournalScreen')}
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
