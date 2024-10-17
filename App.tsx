import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet } from 'react-native';
// import { EventTypes } from 'react-native-gesture-handler/lib/typescript/web/interfaces';

// Moved components into own folder, import them here to be used in App
import { WelcomeScreen }  from './components/WelcomeScreen';
import FitnessScreen from './components/FitnessScreen';
import HomeScreen from './components/HomeScreen';
import UserSettingsScreen from './components/UserSettingsScreen';
import UserInfoScreen from './components/UserInfoScreen';
import { UserProvider } from './components/UserContext';
import NutritionScreen from './components/NutritionScreen';
import BarcodeScanner from './components/BarcodeScanner';
import WorkoutDiary from './components/WorkoutDiary/WorkoutDiaryScreen';
import CurrentWorkout from './components/WorkoutDiary/CurrentWorkoutScreen';


// Define types for navigation
export type RootStackParamList = {
  Home: undefined;
  Welcome: { userName: string };
  FitnessList: { /* API Calls here */}
  SignIn?: { /* Possible Sign In Screen */}
  Fitness: undefined;
  UserSettings: undefined;
  UserInfo: undefined;
  NutritionScreen: undefined;
  BarcodeScanner: undefined;
  WorkoutDiary: undefined;
  CurrentWorkout: undefined;
};

// Create the stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();


// Main App Component
export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Fitness" component={FitnessScreen} />
          <Stack.Screen name="UserSettings" component={UserSettingsScreen} />
          <Stack.Screen name="UserInfo" component={UserInfoScreen} />
          <Stack.Screen name="NutritionScreen" component={NutritionScreen} />
          <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
          <Stack.Screen name="WorkoutDiary" component={WorkoutDiary} />
          <Stack.Screen name="CurrentWorkout" component={CurrentWorkout} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
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
