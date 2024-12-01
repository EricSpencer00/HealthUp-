// SignInScreen.js
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { signInUser, signUpUser } from '../firebase/auth'; // Import Firebase auth functions
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './UserContext';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const navigation = useNavigation();
  const { setUserId } = useContext(UserContext);

  const handleAuth = async () => {
    try {
      let userId;
      if (isSignUp) {
        userId = await signUpUser(email, password, userName);
      } else {
        userId = await signInUser(email, password);
      }
      setUserId(userId);
      Alert.alert("Success", "Welcome!");
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
      {isSignUp && (
        <TextInput
          placeholder="User Name"
          value={userName}
          onChangeText={setUserName}
          style={styles.input}
        />
      )}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={isSignUp ? "Sign Up" : "Sign In"} onPress={handleAuth} />
      <Button
        title={isSignUp ? "Already have an account? Sign In" : "Create an account"}
        onPress={() => setIsSignUp(!isSignUp)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});
