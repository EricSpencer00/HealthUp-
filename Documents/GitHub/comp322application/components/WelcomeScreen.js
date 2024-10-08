import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet } from 'react-native';
import { EventTypes } from 'react-native-gesture-handler/lib/typescript/web/interfaces';

// Welcome Screen Component
export default function WelcomeScreen({ route }) {
  const { userName } = route.params;

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Welcome {userName}!</Text> */}
      {/* <Text style={styles.title}>We hope you enjoy your stay here at Fitness App!</Text> */}
      <Text>Hello! to start, why don't you tell me your name?</Text>
      {/* <Button
        title='Tell Me Your Name'
        onPress={() TextInput}
      ></Button> */}
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
