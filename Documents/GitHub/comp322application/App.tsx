import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet } from 'react-native';
import { EventTypes } from 'react-native-gesture-handler/lib/typescript/web/interfaces';

// Define types for navigation
export type RootStackParamList = {
  Home: undefined;
  Welcome: { userName: string };
  FitnessList: { /* API Calls here */}
  SignIn: { /* Possible Sign In Screen */}
};

// Create the stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// Home Screen Component
function HomeScreen({ navigation }) {
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
    </View>
  );
}

// Welcome Screen Component
function WelcomeScreen({ route }) {
  const { userName } = route.params;

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Welcome {userName}!</Text> */}
      {/* <Text style={styles.title}>We hope you enjoy your stay here at Fitness App!</Text> */}
      <Text> Hello! to start, why don't you tell me your name?</Text>
      {/* <Button
        title='Tell Me Your Name'
        onPress={() TextInput}
      ></Button> */}
    </View>
  );
}

function FitnessScreen({ route }) {
  var types = ["hi", "hello"]

  return (
    <View style={styles.container}>
      <Text>Here are the types of exercises you can do</Text>
      for(int i : types) {
        <Text>{ types }: i</Text>
      }
    </View>
  );
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Fitness" component={FitnessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
