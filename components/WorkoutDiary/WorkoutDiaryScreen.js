import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'; 
import { UserContext } from '../UserContext';
import { db } from '../../firebase/firebaseConfig';

// Default exercises when no user is logged in
const defaultExercises = [
  { id: '1', exercise: 'Push-up', sets: [0] },
  { id: '2', exercise: 'Squat', sets: [0] },
  { id: '3', exercise: 'Plank', sets: [0] },
  { id: '4', exercise: 'Lunges', sets: [0] },
  { id: '5', exercise: 'Burpees', sets: [0] },
];

export default function WorkoutDiary({ navigation }) {
  const [exerciseName, setExerciseName] = useState('');
  const { userId } = useContext(UserContext); // Get userId from context

  // Function to create a new exercise in Firestore
  async function create() {
    try {
      // Add a new document to the 'exercises' collection for the current user
      await addDoc(collection(db, "users", userId, "exercises"), {
        exercise: exerciseName,
      });
      console.log('Exercise successfully added!');
      setExerciseName(''); // Clear the input field after submitting
    } catch (error) {
      console.error('Error writing document: ', error);
    }
  }

  // State to hold the exerciseList
  const [exerciseList, setExerciseList] = useState([]);

  async function loadData() {
    try {
      if (userId) {
        // Fetch exercises from the current user's exercises collection
        const querySnapshot = await getDocs(collection(db, 'users', userId, 'exercises'));
        const newList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Extract the correct fields
          newList.push({ 
            id: doc.id, 
            exercise: data.exercise,  // Accessing the nested name field
            sets: [0],  // Placeholder for sets, modify as needed
          });
          console.log("Adding exercise: ", doc.id, " => ", data);
        });
        setExerciseList(newList);
      } else {
        // If no user is logged in, use default exercises
        setExerciseList(defaultExercises);
        console.log("Loading default exercises.");
      }
    } catch (error) {
      console.log("Error loading data: ", error);
    }
  }

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, [userId]); // Re-load data if userId changes

  // Function to delete an exercise
  async function deleteItem(item) {
    try {
      await deleteDoc(doc(db, "users", userId, "exercises", item.id));
      console.log("Deleted exercise: ", item.id);
      loadData();  // Reload the exercise list after deletion
    } catch (error) {
      console.log("Error deleting exercise: ", error);
    }
  }

  // Wrapper function for creating and loading data
  async function createAndLoad() {
    try {
      await create();
      loadData();
    } catch (error) {
      console.log("Error creating and loading data: ", error);
    }
  }

  // Wrapper function for deleting and loading data
  async function deleteAndLoad(item) {
    try {
      await deleteItem(item);
      loadData();
    } catch (error) {
      console.log("Error deleting and loading data: ", error);
    }
  }

  // Render individual exercise item in FlatList
  const renderItem = ({ item }) => (
    <View style={styles.listRow}>
      <View style={styles.item}>
        <Text>{item.exercise}</Text>
      </View>
      <TouchableOpacity style={styles.itemX} onPress={() => deleteAndLoad(item)}>
        <Text>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What exercises will you perform in today's workout?</Text>

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

      <TouchableOpacity style={styles.startWorkout} onPress={() => navigation.navigate('My Workout', { exerciseList})}>
        <Text style={styles.buttonText}>START WORKOUT!</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.startWorkout} onPress={() => navigation.navigate('Exercise List')}>
        <Text style={styles.buttonText}>View exercise list</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    backgroundColor: '#55c6f2',
  },
});
