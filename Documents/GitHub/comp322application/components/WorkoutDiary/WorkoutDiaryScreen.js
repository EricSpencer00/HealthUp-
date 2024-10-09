import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; 
import { initializeApp } from 'firebase/app';

import app from './../FirebaseConfig';
const db = getFirestore(app);

export default function WorkoutDiary({ navigation }) {
  const [exerciseName, setExerciseName] = useState('');

  // Function to create a new document in Firestore
  async function create() {
    try {
      // Add a new document to the 'exercises' collection
      await addDoc(collection(db, "exercises"), {
        exercise: exerciseName,
      });
      console.log('Document successfully written!');
      setExerciseName(''); // Clear the input field after submitting
    } catch (error) {
      console.error('Error writing document: ', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        What exercises will you perform in today's workout?
      </Text>
      <Text>{'\n'}Add to, delete from, reorder a list of exercises{'\n'}</Text>

      <TextInput
        value={exerciseName}
        onChangeText={setExerciseName}
        placeholder="Exercise Name"
        style={styles.textBoxes}
      />

      <Button title="Submit Data" onPress={create} />

      <Text>{'\n'}</Text>

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
  textBoxes: {
    width: '90%',
    fontSize: 18,
    padding: 12,
    borderColor: 'gray',
    borderWidth: 0.2,
    borderRadius: 10,
    marginBottom: 20,
  }
});
