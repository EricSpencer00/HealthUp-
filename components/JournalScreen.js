import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import { getNutritionHistory, getWorkoutHistory } from '../firebase/firebaseFunctions';
import { UserContext } from './UserContext';

const screenWidth = Dimensions.get('window').width;

export default function JournalScreen({ }) {
  const { userId } = useContext(UserContext);
  const [nutritionHistory, setNutritionHistory] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!userId) {
        console.log("User ID: ", userId); 
        return;
      }
  
      try {
        const nutritionData = await getNutritionHistory(userId);
        console.log("Fetched nutrition data:", nutritionData);
        setNutritionHistory(nutritionData);
      } catch (error) {
        console.error("Error fetching nutrition history:", error);
      }
  
      try {
        const workoutData = await getWorkoutHistory(userId);
        console.log("Fetched workout data:", workoutData);
        setWorkoutHistory(workoutData);
      } catch (error) {
        console.error("Error fetching workout history:", error);
      }
    }
  
    fetchData();
  }, [userId]);
  

  // Helper to group nutrition entries by date
  const groupByDate = (entries) => {
    return entries.reduce((acc, entry) => {
      const date = new Date(entry.consumed_at).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
      return acc;
    }, {});
  };

  const groupedNutrition = groupByDate(nutritionHistory);

  // Generate "bar chart" style data visualization using View widths
  const generateBars = (entries) => {
    const dates = Object.keys(entries);
    const caloriesData = dates.map((date) =>
      entries[date].reduce((sum, item) => sum + item.nutrients.calories, 0)
    );
    const maxCalories = Math.max(...caloriesData, 1); // Avoid division by zero

    return dates.map((date, index) => ({
      date,
      calories: caloriesData[index],
      barWidth: (caloriesData[index] / maxCalories) * (screenWidth - 40), // Scale bar width
    }));
  };

  const barData = generateBars(groupedNutrition);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nutrition & Workout Journal</Text>

      {/* Nutrition Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Nutrition Overview</Text>
        {Object.keys(groupedNutrition).map((date, index) => (
          <View key={index} style={styles.daySection}>
            <Text style={styles.dateTitle}>{date}</Text>
            {groupedNutrition[date].map((item, idx) => (
              <Text key={idx} style={styles.entryText}>
                {item.food_name}: {item.nutrients.calories} kcal
              </Text>
            ))}
          </View>
        ))}
      </View>

      {/* Simple "Bar Chart" */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calories Trend</Text>
        {barData.map((data, index) => (
          <View key={index} style={styles.barContainer}>
            <Text style={styles.barLabel}>{data.date}</Text>
            <View style={[styles.bar, { width: data.barWidth }]} />
            <Text style={styles.barValue}>{data.calories} kcal</Text>
          </View>
        ))}
      </View>

      {/* Workout Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout History</Text>
        {workoutHistory.length === 0 ? (
          <Text>No workouts logged yet.</Text>
        ) : (
          <FlatList
            data={workoutHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.workoutItem}>
                <Text style={styles.entryText}>
                  {item.name}: {item.duration} min
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  daySection: {
    marginBottom: 15,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  entryText: {
    fontSize: 14,
    color: '#555',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  barLabel: {
    width: 70,
    fontSize: 12,
    color: '#333',
  },
  bar: {
    height: 20,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  barValue: {
    fontSize: 12,
    color: '#333',
  },
  workoutItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
});