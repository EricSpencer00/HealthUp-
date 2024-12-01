import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { UserContext } from './UserContext';

export default function JournalScreen() {
  const { getWeeklyData, getDailyData, getMonthlyData, completedWorkouts, nutritionJournal } = useContext(UserContext);
  
  const [dailyData, setDailyData] = useState(getDailyData());
  const [weeklyData, setWeeklyData] = useState(getWeeklyData());
  const [monthlyData, setMonthlyData] = useState(getMonthlyData());

  useEffect(() => {
    // Refresh data whenever it changes
    setDailyData(getDailyData());
    setWeeklyData(getWeeklyData());
    setMonthlyData(getMonthlyData());
  }, [nutritionJournal, completedWorkouts]);

  // Function to format date to 'MMMM Do YYYY' format (e.g., "December 1st 2024")
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition & Workout Journal</Text>
      <ScrollView>
        {/* Daily Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Nutrition Summary</Text>
          <Text style={styles.info}>Calories: {dailyData.calories} kcal</Text>
          <Text style={styles.info}>Protein: {dailyData.protein} g</Text>
          <Text style={styles.info}>Fat: {dailyData.fat} g</Text>

          {/* Daily Breakdown */}
          <View style={styles.breakdownContainer}>
            <Text style={styles.breakdownTitle}>Daily Breakdown</Text>
            {dailyData.breakdown?.map((item, index) => (
              <View key={index} style={styles.breakdownItem}>
                <Text style={styles.breakdownText}>{item.foodName} - {item.calories} kcal</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Nutrition Summary</Text>
          <Text style={styles.info}>Total Calories: {weeklyData.calories} kcal</Text>
          <Text style={styles.info}>Total Protein: {weeklyData.protein} g</Text>
          <Text style={styles.info}>Total Fat: {weeklyData.fat} g</Text>
        </View>

        {/* Monthly Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Nutrition Summary</Text>
          <Text style={styles.info}>Total Calories: {monthlyData.calories} kcal</Text>
          <Text style={styles.info}>Total Protein: {monthlyData.protein} g</Text>
          <Text style={styles.info}>Total Fat: {monthlyData.fat} g</Text>
        </View>

        {/* Workouts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed Workouts</Text>
          {completedWorkouts.length === 0 ? (
            <Text>No workouts completed yet!</Text>
          ) : (
            <FlatList
              data={completedWorkouts}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.workoutItem}>
                  <Text style={styles.workoutText}>{item.name} - {formatDate(item.date)}</Text>
                  <Text style={styles.workoutText}>Duration: {item.duration} min</Text>
                  <Text style={styles.workoutText}>Calories Burned: {item.calories} kcal</Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    marginBottom: 5,
  },
  breakdownContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  breakdownText: {
    fontSize: 16,
  },
  workoutItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
  workoutText: {
    fontSize: 16,
  },
});
