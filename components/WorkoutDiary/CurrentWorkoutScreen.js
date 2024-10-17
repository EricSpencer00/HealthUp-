import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc, query, getDocs, collection } from 'firebase/firestore';

import app from './../FirebaseConfig';
const db = getFirestore(app);

export default function CurrentWorkout({ navigation }) {
  const [exerciseListState, setExerciseListState] = useState([]);

  async function loadData() {
    try {
      const querySnapshot = await getDocs(collection(db, "exercises"));
      const newList = []
      querySnapshot.forEach((doc) => {
        newList.push(doc.data()["exercise"]);
        console.log('Adding: ', doc.data());
      })
      setExerciseListState(newList);
      console.log('Added exercises');
    } catch (error) {
      console.log('Error loading data:', error);
    }
  }

  async function clearLocalData() {
    try {
      setExerciseListState([]);
      console.log('Successfully cleared data!');
    } catch (error) {
      console.log('Error clearing data: ', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODAY'S WORKOUT</Text>

      {/* <Text>{exerciseListState}</Text> */}
      {exerciseListState.map(exercise => (
        <Text>{exercise}</Text>
      ))}
      <Button title="Load exercises" onPress={loadData} />
      <Button title="Clear exercises" onPress={clearLocalData} />

      <Text>{'\n'}Carousel, prev exercise & next exercise, show image of exercise</Text>
      <Text>Add set 1: # reps</Text>

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
