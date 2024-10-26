import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { getFirestore, doc, getDoc, query, getDocs, collection } from 'firebase/firestore';

import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

import app from './../FirebaseConfig';
const db = getFirestore(app);

didIt = false
// let exerciseObjects = []

export default function CurrentWorkout({ navigation }) {
  

  // State to hold the exerciseList
  const [exerciseList, setExerciseList] = useState([]);

  async function loadData() {
    // Try catch to handle the promise from getDocs
    try {
      // Getdocs returns a promise, handle with 'await'
      const querySnapshot = await getDocs(collection(db, "exercises"))
      // Avoiding mutating the array state
      const newList = []
      // Arrow function in JS. Add each object to newList.
      querySnapshot.forEach((doc) => {
        newList.push({ 
          id: doc.id, 
          exercise: doc.data()["exercise"],
          sets: [0],
        })
      });
      // Update exerciseList state, set it to newList
      setExerciseList(newList); 
      console.log("40: Added exercises!");
      console.log("40: ", newList);
      console.log("41: ", exerciseList);
      // console.log("41: ", exerciseList[0].sets);
    } catch (error) {
      console.log("Error loading data: ", error);
    }
  }

  

  async function clearLocalData() {
    try {
      setExerciseList([]);
      console.log('Successfully cleared data!');
    } catch (error) {
      console.log('Error clearing data: ', error);
    }
  }

  // Initialize currentExerciseIdx state
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
 

  // Updating object array manually
  // try {
  //   exerciseObjects[0].sets.push(20000);
  //   exerciseObjects[0].sets.push(1000)
  //   console.log("Current exercise list's sets/reps: ", exerciseObjects[currentExerciseIdx].sets);
  // } catch (error) {
  //   console.log("nOPE: ", error);
  // }


  // State to keep current sets/reps list.
  // Separate from bigger array of objects.
  // First update the state. Later, update the object array.
  // Update object array when going to prev/next exercise

  // const [currentExerciseSetsState, setCurrentExerciseSetsState] = useState([]);
  // temp = []
  // try {
  //   temp = exerciseObjects[0].sets;
  //   console.log("temp: ", temp);
  // } catch (error) {
  //   console.log("Error initializing exercise sets state: ", error);
  // }
  // console.log(temp)
  // if (!didIt) {
  //   setCurrentExerciseSetsState(temp);
  //   didIt = true
  // }
  



  // Add set button function
  async function addSet() {
    try {
      exerciseList[currentExerciseIdx].sets.push(0);
      console.log("Set added!");
      console.log("Current exercise list's sets/reps: ", exerciseList[currentExerciseIdx].sets);
    } catch (error) {
      console.log("Error adding set: ", error);
    }
  } 
 
  // For FlatList. Renders each item with onPress, to trigger handlePressedItem on item
  const renderItem = ({item, index})=>(
    // style={styles.listRow}
    <View >
      {/* style={styles.item} */}
      <View >
        <Text>Set {index + 1}: {item}</Text>
      </View>
    </View>
  );

  
  useEffect(() => {
    loadData();
  }, []);

  // console.log(exerciseObjects);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODAY'S WORKOUT</Text>

      {/* <FlatList
        style={styles.flatListStyle}

        data={exerciseList[currentExerciseIdx].sets}
        renderItem={renderItem}
        // keyExtractor={item => item.id}
      /> */}

      {/* {exerciseListState.map((exercise, index) => (
        <Text key={index}>{exercise}</Text>
      ))} */}

      <Button title="Add set" onPress={addSet} />
      <Button title="Load exercises" onPress={loadData} />
      <Button title="Clear exercises" onPress={clearLocalData} />


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
  flatListStyle: {
    height: 100,
  }
});