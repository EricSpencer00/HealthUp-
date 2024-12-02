import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from './UserContext';
import { useNavigation } from '@react-navigation/native';

export default function UserSettingsScreen() {
  const { userName, setUserName, weight, setWeight, favoriteFoods, setFavoriteFoods } = useContext(UserContext);
  const navigation = useNavigation();

  const handleSave = () => {
    navigation.goBack();  // Navigates back to the previous screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit User Settings</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={userName}
        onChangeText={setUserName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      {/* <TextInput
        style={styles.input}
        placeholder="Enter your favorite foods"
        value={favoriteFoods}
        onChangeText={setFavoriteFoods}
      /> */}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
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
