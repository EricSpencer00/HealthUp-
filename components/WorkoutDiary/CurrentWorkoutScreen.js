import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import ConfettiCannon from 'react-native-confetti-cannon';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { UserContext } from '../UserContext'; // Ensure correct import path
import { addWorkoutEntry } from '../../firebase/firebaseFunctions'; // Ensure correct import path
import { Alert } from 'react-native';

import app from '../../firebase/firebaseConfig';
const db = getFirestore(app);

export default function CurrentWorkoutScreen({ route }) {
  const { exercises } = route.params || {};
  const { userId } = useContext(UserContext); // Move useContext to component scope

  const [exerciseList, setExerciseList] = useState(exercises || []);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentExerciseSets, setCurrentExerciseSets] = useState(
    (exerciseList[0] && exerciseList[0].sets) || []
  );
  const [currentExerciseName, setCurrentExerciseName] = useState(
    (exerciseList[0] && exerciseList[0].exercise) || ''
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (exerciseList.length > 0) {
      setCurrentExerciseSets(exerciseList[0]?.sets);
      setCurrentExerciseName(exerciseList[0]?.exercise);
    }
  }, [exerciseList]);

  const addSet = () => {
    const updatedSets = [...currentExerciseSets, 0];
    setCurrentExerciseSets(updatedSets);

    const updatedExerciseList = [...exerciseList];
    updatedExerciseList[currentExerciseIdx].sets = updatedSets;
    setExerciseList(updatedExerciseList);
  };

  const goToNextExercise = () => {
    if (currentExerciseIdx < exerciseList.length - 1) {
      setCurrentExerciseIdx(currentExerciseIdx + 1);
      setCurrentExerciseName(exerciseList[currentExerciseIdx + 1]?.exercise);
      setCurrentExerciseSets(exerciseList[currentExerciseIdx + 1]?.sets);
    }
  };

  const goToPrevExercise = () => {
    if (currentExerciseIdx > 0) {
      setCurrentExerciseIdx(currentExerciseIdx - 1);
      setCurrentExerciseName(exerciseList[currentExerciseIdx - 1]?.exercise);
      setCurrentExerciseSets(exerciseList[currentExerciseIdx - 1]?.sets);
    }
  };

  const timerStartStop = () => {
    setIsPlaying(!isPlaying);
  };

  const completeExercise = async () => {
    if (!userId) {
      console.error("User ID is missing. Please ensure the user is logged in.");
      return;
    }

    try {
      const workoutEntry = {
        workout_name: currentExerciseName || 'Unknown Exercise',
        workout_type: 'Strength Training', // Replace with dynamic type if available
        completed_at: new Date(),
        duration_minutes: 0, // You can replace this with actual data if available
        calories_burned: 0, // Optionally calculate or fetch this value
        notes: `Completed ${currentExerciseSets.length} sets.`,
      };

      await addWorkoutEntry(userId, workoutEntry);

      // Add to the journal collection
      const journalRef = collection(db, 'users', userId, 'journal');
      await addDoc(journalRef, {
        ...workoutEntry,
        timestamp: new Date(),
      });

      console.log("Workout entry and journal updated successfully:", workoutEntry);

      setShowConfetti(true); // Trigger confetti
    } catch (error) {
      console.error("Error completing exercise:", error);
    }
  };

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
            <Text style={{ fontSize: 20 }}>REST TIMER</Text>
            <Text style={{ fontSize: 40 }}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </Text>
            <TouchableOpacity onPress={timerStartStop}>
              <Text style={styles.newSetStyle}>{isPlaying ? 'Reset' : 'Start'}</Text>
            </TouchableOpacity>
          </View>
        );
      }}
    </CountdownCircleTimer>
  );

  const renderItem = ({ item, index }) => (
    <View style={styles.horizontalRowWrapper}>
      <View style={styles.horizontalRow}>
        <Text style={styles.setText}>Set {index + 1}:</Text>
        <TextInput
          style={styles.numInput}
          placeholder="0"
          keyboardType="numeric"
          maxLength={2}
          value={item.toString()}
          onChangeText={(text) => {
            const updatedSets = [...currentExerciseSets];
            updatedSets[index] = parseInt(text, 10) || 0;
            setCurrentExerciseSets(updatedSets);

            const updatedExerciseList = [...exerciseList];
            updatedExerciseList[currentExerciseIdx].sets = updatedSets;
            setExerciseList(updatedExerciseList);
          }}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {showConfetti && <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} />}

      <Text style={styles.title}>TODAY'S WORKOUT</Text>

      <View style={styles.timerWrapper}>
        <UrgeWithPleasureComponent />
      </View>

      <View style={styles.horizontalRow}>
        <TouchableOpacity onPress={goToPrevExercise}>
          <Text style={currentExerciseIdx === 0 ? styles.prevNextButtonsEdge : styles.prevNextButtons}>
            &lt;
          </Text>
        </TouchableOpacity>

        <Text style={styles.currentExercise}>{currentExerciseName}</Text>

        <TouchableOpacity onPress={goToNextExercise}>
          <Text style={currentExerciseIdx === exerciseList.length - 1 ? styles.prevNextButtonsEdge : styles.prevNextButtons}>
            &gt;
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.flatListStyle}>
        <FlatList
          data={currentExerciseSets}
          renderItem={renderItem}
          ListFooterComponent={
            <TouchableOpacity onPress={addSet}>
              <Text style={styles.newSetStyle}>Next set!</Text>
            </TouchableOpacity>
          }
        />
      </View>

      <TouchableOpacity style={styles.completeExerciseButton} onPress={completeExercise}>
        <Text style={styles.buttonText}>COMPLETE EXERCISE</Text>
      </TouchableOpacity>
    
    </View>
  );
}

const styles = StyleSheet.create({
  // Your existing styles, plus the ones below:
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
  },
  setText: {
    padding: 0,
    margin: 0,
    alignItems: 'center',
    fontSize: 17,
  },
  newSetStyle: {
    backgroundColor: '#55c6f2',
    color: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    paddingVertical: 7,
    fontSize: 15,
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
    bottom: 20,
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
    bottom: 20,
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalRowWrapper: {
    marginBottom: 7,
    padding: 0,
  },
  currentExercise: {
    padding: 0,
    width: '55%',
    textAlign: 'center',
    fontSize: 30,
    height: 90,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  timerText: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  timerWrapper: {
    margin: 30,
  },
  numInput: {
    height: 40,
    marginVertical: 0,
    marginHorizontal: 5,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 0,
    fontSize: 17,
    borderRadius: 7,
  },
  completeExerciseButton: {
    backgroundColor: '#cff7b2',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
