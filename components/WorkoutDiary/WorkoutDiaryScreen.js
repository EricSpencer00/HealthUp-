import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { getFirestore, collection, addDoc, getDocs , query, where } from 'firebase/firestore'; 
import { initializeApp } from 'firebase/app';

import app from './../FirebaseConfig';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
        newList.push({ 
          id: doc.id, 
          exercise: doc.data()["exercise"]
        })
          
        console.log("Adding: ", doc.id, " => ", doc.data());
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

  // Function to access id of the clicked item
  const handlePressedItem = (item) => {
    console.log("Pressed: ", item.id)
  }

  // For FlatList. Renders each item with onPress, to trigger handlePressedItem on item
  const renderItem = ({item})=>(
    <View style={styles.listRow}>
      <View style={styles.item}>
        <Text>{item.exercise}</Text>
      </View>
      <TouchableOpacity style={styles.itemX} onPress={() => handlePressedItem(item)}>
        <Text>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        What exercises will you perform in today's workout?
      </Text>

      <FlatList
        style={styles.flatListStyle}
        data={exerciseList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          value={exerciseName}
          onChangeText={setExerciseName}
          placeholder="Exercise Name"
          style={styles.textBoxes}
        />
        <TouchableOpacity style={styles.submit} onPress={createAndLoad}>
          <Text style={styles.submitText}>✔</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.startWorkout} onPress={() => navigation.navigate('CurrentWorkout')}>
        <Text style={styles.buttonText}>START WORKOUT!</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  title: {
    marginBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  textBoxes: {
    flex: 1,
    fontSize: 18,
    padding: 7,
    paddingHorizontal: 15,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
  },
  item: {
    backgroundColor: '#ebf4ff',
    borderRadius: 15,
    fontSize: 17,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 2,
  },
  itemX: {
    backgroundColor: '#ffd7d4',
    borderRadius: 15,
    fontSize: 17,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 2,
  },
  flatListStyle: {
    flexGrow: 1,
    margin: 5,
    marginBottom: 10,
  },
  buttons: {
    padding: 10,
    borderRadius: 5,
    margin: 10,
    backgroundColor: '#4287f5',
    width: '80%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  submit: {
    backgroundColor: '#cff7b2',
    color: 'white',
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  submitText: {
    fontSize: 24,
    color: 'black',
  },
  listRow: {
    flexDirection: 'row',
  },
  startWorkout: {
    padding: 10,
    borderRadius: 5,
    margin: 10,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#92d5f0',
  },
});