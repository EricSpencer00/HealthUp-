import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet } from 'react-native';

// Define types for navigation
export type RootStackParamList = {
  Home: undefined;
  Welcome: { userName: string };
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
    </View>
  );
}

// Welcome Screen Component
function WelcomeScreen({ route }) {
  const { userName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {userName}!</Text>
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
