// SignInScreen.js
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
      console.log("User ID:", userId);
      setUserId(userId);
      Alert.alert("Success", "Welcome!");
      navigation.replace("Home");
    } catch (error) {
      console.error("Error:", error);
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

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.buttonText}>{isSignUp ? "Already have an account? Sign In" : "Create an account"}</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
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
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 7,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#55c6f2',
  },
  buttonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
});
