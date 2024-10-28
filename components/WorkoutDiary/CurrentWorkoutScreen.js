import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getFirestore, getDocs, collection } from 'firebase/firestore';

import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

import app from './../FirebaseConfig';
const db = getFirestore(app);
let exerciseList = []

export default function CurrentWorkout({ navigation }) {
  
  // State to hold the exerciseList CHANGE THIS, WE WILL BE USING THIS TO STORE IT. HARD TO UPDATE THE SETS. 
  // const [exerciseList, setExerciseList] = useState([]);
  

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
          exercise: doc.data()["exercise"],
          sets: [0],
        })
          
        console.log("Adding: ", doc.id, " => ", doc.data());
      });
      exerciseList = newList;
      setCurrentExerciseSets(exerciseList[currentExerciseIdx]?.sets);
      setCurrentExerciseName(exerciseList[currentExerciseIdx]?.exercise);
      console.log("Added exercises");
    } catch (error) {
      console.log("Error loading data: ", error);
    }
  }

  // Load data on render (REMOVE LATER. NEW WORKOUT ON A NEW DAY)
  useEffect(() => {
    loadData();
  }, []);  

  // Initialize currentExerciseIdx state
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);

  // State to keep current sets/reps list.
  // Separate from bigger array of objects.
  // First update the state. Later, update the object array.
  // Update object array when going to prev/next exercise

  // Need to have state for the current sets list
  const [currentExerciseSets, setCurrentExerciseSets] = useState([]);
  // State for current exercise name
  const [currentExerciseName, setCurrentExerciseName] = useState([]);

  // Add set button function
  async function addSet() {
    try {
      setCurrentExerciseSets(
        [
          ...currentExerciseSets, 0,
        ]
      );
      console.log("Set added!");
    } catch (error) {
      console.log("Error adding set: ", error);
    }
  } 

  const addSetButton = ({}) => (
    <View>
      <TouchableOpacity onPress={() => addSet()}>
        <Text style={styles.newSetStyle}>Next set!</Text>
      </TouchableOpacity>
    </View>
  );
 
  // For FlatList. Renders each item with onPress, to trigger handlePressedItem on item
  const renderItem = ({item, index})=>( 
    // style={styles.listRow}
    <View >
      <View style={styles.item}>
        <Text>Set {index + 1}: {item}</Text>
      </View>
    </View>
  );

  // Updating data in the FlatList: on num input change, on addSet

  async function goToNextExercise() {
    try {
      if (currentExerciseIdx < exerciseList.length - 1) {
        // Update exerciseList
        exerciseList[currentExerciseIdx].sets = currentExerciseSets
        setCurrentExerciseIdx(currentExerciseIdx + 1);
        setCurrentExerciseName(exerciseList[currentExerciseIdx + 1]?.exercise);
        setCurrentExerciseSets(exerciseList[currentExerciseIdx + 1]?.sets);
      }
    } catch (error) {
      console.log("Error going to next exercise: ", error);
    }
  }

  async function goToPrevExercise() {
    try {
      if (currentExerciseIdx > 0) {
        // Update exerciseList
        exerciseList[currentExerciseIdx].sets = currentExerciseSets
        setCurrentExerciseIdx(currentExerciseIdx - 1);
        setCurrentExerciseName(exerciseList[currentExerciseIdx - 1]?.exercise);
        setCurrentExerciseSets(exerciseList[currentExerciseIdx - 1]?.sets);
      }
    } catch (error) {
      console.log("Error going to next exercise: ", error);
    }
  }

  const [isPlaying, setIsPlaying] = useState(false);
  function timerStartStop() {
    setIsPlaying(!isPlaying);
  }

  const UrgeWithPleasureComponent = () => (
    <CountdownCircleTimer
      isPlaying={isPlaying}
      duration={120}
      colors={['#004777', '#F7B801', '#A30000', '#A30000']}
      colorsTime={[7, 5, 2, 0]}
      style={styles.padding}
      size={300}
      strokeWidth={15}
    >
      {({ remainingTime }) => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        return (
          <View style={styles.timerText}>
            <Text>REST TIMER</Text>
            <Text style={{ fontSize: 40 }}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </Text>
            <TouchableOpacity onPress={() => timerStartStop()}>
              <Text style={styles.newSetStyle}>{isPlaying ? 'Reset' : 'Start'}</Text>
            </TouchableOpacity>
          </View>
        );
      }}
    </CountdownCircleTimer>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODAY'S WORKOUT</Text>

      {/* COUNTDOWN TIMER */}
      <View style={styles.timerWrapper}>
        <UrgeWithPleasureComponent />
      </View>
      

      <View style={styles.horizontalRow}>
        <TouchableOpacity onPress={() => goToPrevExercise()}>
          <Text 
            style={
              currentExerciseIdx == 0 ?
              styles.prevNextButtonsEdge : styles.prevNextButtons
            } >
              &lt;
          </Text>
        </TouchableOpacity>
        <Text style={styles.currentExercise}>{currentExerciseName}</Text>
        <TouchableOpacity onPress={() => goToNextExercise()}>
          <Text 
            style={
              currentExerciseIdx == exerciseList.length - 1 ?
              styles.prevNextButtonsEdge : styles.prevNextButtons
            } >
              &gt;
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.flatListStyle}>
        <FlatList
          data={currentExerciseSets}
          renderItem={renderItem}
          ListFooterComponent={addSetButton}
        />
      </View>
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
    height: 150,
    // alignItems: 'center',
  },
  item: {
    padding: 5,
    alignItems: 'center',
  },
  newSetStyle: {
    backgroundColor: '#55c6f2',
    color: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingVertical: 7,
  },
  prevNextButtons: {
    backgroundColor: '#55c6f2',
    color: 'white',
    borderRadius: 15,
    fontSize: 25,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 2,
    width: 40,
  },
  prevNextButtonsEdge: {
    backgroundColor: '#a5ddf2',
    color: 'white',
    borderRadius: 15,
    fontSize: 25,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 2,
    width: 40,
  },
  horizontalRow: {
    flexDirection: 'row',
  },
  currentExercise: {
    padding: 8,
    width: '55%',
    textAlign: 'center',
    fontSize: 17,
  },
  timerText: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  timerWrapper: {
    margin: 30,
    // width: '70%',
  }
});