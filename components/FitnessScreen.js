import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import muscles from './Muscles/Muscles'; // Import the muscles list
import { UserContext } from './UserContext';
import { saveExercise } from '../firebase/firebaseFunctions';

const API_URL = 'REMOVED_API_URL=';

// pass userId to FitnessScreen but null if it does not get passed
export default function FitnessScreen() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMuscle, setSelectedMuscle] = useState('chest'); // Default muscle
  const { userId } = useContext(UserContext);
  console.log(userId); // TESTING

  // Find the selected muscle object from the muscles list
  const muscle = muscles.find(m => m.apiName === selectedMuscle);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        console.log({ API_URL });
        console.log("fetching exercises for: " + muscle.apiName);
        const response = await fetch(`${API_URL}${muscle.apiName}`, {
          headers: {
            'X-RapidAPI-Key': 'REMOVED_RAPIDAPI_KEY',
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
          },
        });
        console.log(response);
        const data = await response.json();
        console.log(data);

        console.log('Selected muscle:', muscle.apiName);
        console.log('Exercise targets from API:');
        data.forEach(exercise => console.log(exercise.bodyPart));  // Log all targets


        const filteredExercises = data.filter((exercise) => {
          console.log(`Comparing ${exercise.target.toLowerCase()} with ${muscle.apiName.toLowerCase()}`);
          return (
            exercise.bodyPart.toLowerCase() === muscle.apiName.toLowerCase() || 
            exercise.target.toLowerCase() === muscle.apiName.toLowerCase()
        );})
        console.log('Filtered exercises:', filteredExercises);  // Log filtered data
        setExercises(filteredExercises);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    if (muscle) fetchExercises();
  }, [muscle]);

  if (loading) return <ActivityIndicator size="large" color="#ffffff" />;

  const handleSaveExercise = async (exerciseName) => { // only show if there is a user logged in
    if (!userId) {
      console.error('User not logged in');
      return;
    }
    try {
      await saveExercise(userId, exerciseName);
      Alert.alert('Exercise saved successfully');
    } catch (error) {
      console.error('Failed to save exercise:', error);
      Alert.alert('Failed to save exercise');
    }
  }

  // Instructions component for splitting and showing more/less text
  const Instructions = ({ instructions }) => {
    const [showFullText, setShowFullText] = useState(false);
  
    // Coerce instructions into a valid string using String() to handle undefined, null, or other types
    const safeInstructions = String(instructions || 'No instructions available');
    const words = safeInstructions.split(' ');  // Safely split after coercion
    const previewText = words.slice(0, 15).join(' ');  // First 15 words
  
    const handleToggle = () => {
      setShowFullText(!showFullText);
    };
  
    return (
      <Text style={styles.instructions}>
        {showFullText ? safeInstructions : previewText}
        {words.length > 15 && (
          <TouchableOpacity onPress={handleToggle}>
            <Text style={styles.moreText}>
              {showFullText ? ' Show less' : ' ... Show more'}
            </Text>
          </TouchableOpacity>
        )}
      </Text>
    );
  };  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercises for {muscle.name}</Text>

      <CustomDropdown
        data={muscles}
        selectedValue={selectedMuscle}
        onValueChange={(itemValue) => setSelectedMuscle(itemValue)}
        labelKey="name"
        valueKey="apiName"
      />

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()} // Ensure it's a string for key extraction
        renderItem={({ item }) => (
          <View style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text>Equipment: {item.equipment}</Text>

            {/* Display secondary muscles in smaller text */}
            <Text style={styles.secondaryMuscles}>
              Secondary Muscles: {item.secondaryMuscles ? item.secondaryMuscles.join(', ') : 'None'}
            </Text>

            <Instructions instructions={item.instructions || 'No instructions available'} />

            {/* Display the exercise GIF within the app */}
            {item.gifUrl ? (
              <Image source={{ uri: item.gifUrl }} style={styles.gif} />
            ) : (
              <Text>No GIF available</Text>
            )}

            {/* Save exercise Button only if there is user logged in */}
            {userId && (
              <TouchableOpacity onPress={() => handleSaveExercise(item.name)}>
                <Text style={styles.moreText}>Save Exercise</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const CustomDropdown = ({ data, selectedValue, onValueChange, labelKey = 'name', valueKey = 'apiName' }) => {
  const [isOpen, setIsOpen] = useState(false); // Toggle dropdown visibility
  const selectedLabel = data.find(item => item[valueKey] === selectedValue)?.[labelKey] || 'Select';

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value) => {
    onValueChange(value);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <View style={dropdownStyles.container}>
      <TouchableOpacity onPress={toggleDropdown} style={dropdownStyles.header}>
        <Text style={dropdownStyles.headerText}>{selectedLabel}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={dropdownStyles.dropdown}>
          <ScrollView>
            {data.map((item) => (
              <TouchableOpacity
                key={item[valueKey]}
                onPress={() => handleSelect(item[valueKey])}
                style={dropdownStyles.item}
              >
                <Text style={dropdownStyles.itemText}>{item[labelKey]}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

// Dropdown styles
const dropdownStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    padding: 10,
    backgroundColor: '#EEE',
    borderRadius: 8,
    borderColor: '#CCC',
    borderWidth: 1,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    marginTop: 5,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: '#CCC',
    borderWidth: 1,
    maxHeight: 200, // Limit dropdown height
    overflow: 'hidden',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemText: {
    fontSize: 16,
  },
});

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  exerciseItem: {
    padding: 15,
    backgroundColor: '#FFF',
    marginVertical: 8,
    borderRadius: 10,
    borderColor: '#DDD',
    borderWidth: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryMuscles: {
    fontSize: 14,
    color: '#777',  // Smaller and lighter color for secondary muscles
  },
  instructions: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  moreText: {
    color: 'blue',
    fontSize: 16,
    marginTop: 5,
  },
  gif: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});
