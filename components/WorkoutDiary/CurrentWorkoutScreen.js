import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { getFirestore, getDocs, collection } from 'firebase/firestore';

import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

import app from '../../firebase/firebaseConfig';
export default function CurrentWorkoutScreen({ route }) {
  const { exercises } = route.params || {}; // Fallback to empty object if undefined

  // Set default value for exerciseList if it's undefined
  const [exerciseList, setExerciseList] = useState(exercises || []);

  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentExerciseSets, setCurrentExerciseSets] = useState(
    (exerciseList[0] && exerciseList[0].sets) || [] // Fallback to empty array if first exercise has no sets
  );
  const [currentExerciseName, setCurrentExerciseName] = useState(
    (exerciseList[0] && exerciseList[0].exercise) || '' // Fallback to empty string if first exercise has no name
  );
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (exerciseList.length > 0) {
      setCurrentExerciseSets(exerciseList[0]?.sets);
      setCurrentExerciseName(exerciseList[0]?.exercise);
    }
  }, [exerciseList]);

  const addSet = () => {
    setCurrentExerciseSets([...currentExerciseSets, 0]);
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
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODAY'S WORKOUT</Text>

      {/* COUNTDOWN TIMER */}
      <View style={styles.timerWrapper}>
        <UrgeWithPleasureComponent />
      </View>

      {/* EXERCISE PICKER */}
      <View style={styles.horizontalRow}>
        {/* BUTTON TO GO TO PREV */}
        <TouchableOpacity onPress={goToPrevExercise}>
          <Text style={currentExerciseIdx === 0 ? styles.prevNextButtonsEdge : styles.prevNextButtons}>
            &lt;
          </Text>
        </TouchableOpacity>

        {/* CURRENT EXERCISE TEXT */}
        <Text style={styles.currentExercise}>{currentExerciseName}</Text>

        {/* BUTTON TO GO TO NEXT */}
        <TouchableOpacity onPress={goToNextExercise}>
          <Text style={currentExerciseIdx === exerciseList.length - 1 ? styles.prevNextButtonsEdge : styles.prevNextButtons}>
            &gt;
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIST OF SETS */}
      <View style={styles.flatListStyle}>
        <FlatList
          data={currentExerciseSets}
          renderItem={renderItem}
          ListFooterComponent={<TouchableOpacity onPress={addSet}><Text style={styles.newSetStyle}>Next set!</Text></TouchableOpacity>}
        />
      </View>
    </View>
  );
}

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
  }
});
