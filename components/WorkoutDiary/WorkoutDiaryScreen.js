import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { getFirestore, collection, addDoc, getDocs , query, where } from 'firebase/firestore'; 
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

  // State to hold the exerciseList
  const [exerciseList, setExerciseList] = useState([]);

  async function loadData() {
    // Try catch to handle the promise from getDocs
    try {
      // Getdocs returns a promise, handle with 'await'
      const querySnapshot = await getDocs(collection(db, "exercises"))
      // Avoiding mutating the array state
      const newList = []
      // Arrow function in JS
      querySnapshot.forEach((doc) => {
        newList.push(doc.data()["exercise"]);
        console.log("Adding: ", doc.data());
      });
      setExerciseList(newList);
      console.log("Added exercises");
    } catch (error) {
      console.log("Error loading data: ", error);
    }
  }

  // Wrapper for the two functions, so the button can run both
  async function createAndLoad() {
    try {
      create();
      loadData();
    } catch (error) {
      console.log("Error creating and loading data: ", error);
    }
  }

  // Load data on render (REMOVE LATER. NEW WORKOUT ON A NEW DAY)
  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        What exercises will you perform in today's workout?
      </Text>

      {
        exerciseList.map((exercise, index) => (
          <Text key={index}>{exercise}</Text>
        ))
      }

      <TextInput
        value={exerciseName}
        onChangeText={setExerciseName}
        placeholder="Exercise Name"
        style={styles.textBoxes}
      />

      <Button title="Submit Data" onPress={createAndLoad} />

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
