import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet } from 'react-native';
import { EventTypes } from 'react-native-gesture-handler/lib/typescript/web/interfaces';

export default function CurrentWorkout({ route }) {
  var types = ["hi", "hello"] 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODAY'S WORKOUT</Text>
      <Text>{'\n'}Load exercise list</Text>
      <Text>Current exercise, start from exercises[0]{'\n'}</Text>
      <Text>{'\n'}Carousel, prev exercise & next exercise, show image of exercise</Text>
      <Text>Add set 1: # reps</Text>
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
