import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet } from 'react-native';
import { EventTypes } from 'react-native-gesture-handler/lib/typescript/web/interfaces';

export default function WorkoutDiary({ navigation }) {
  var types = ["hi", "hello"] 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What exercises will you perform in today's workout?</Text>
      <Text>{'\n'}Add to, delete from, reorder a list of exercises {'\n'}</Text>
      <Button
        title="START WORKOUT!"
        onPress={() => navigation.navigate('CurrentWorkout')}
      />
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
