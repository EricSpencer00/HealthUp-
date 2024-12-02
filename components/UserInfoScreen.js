import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { UserContext } from './UserContext';

export default function UserInfoScreen() {
  const { userName, weight, favoriteFoods, nutritionJournal, getNutritionStats } = useContext(UserContext);

  // Retrieve nutrition stats for display
  // const { calories, protein, fat } = getNutritionStats();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>User Information</Text>
      <Text style={styles.info}>Name: {userName || 'Not set'}</Text>
      <Text style={styles.info}>Weight: {weight || 'Not set'} kg</Text>
      <Text style={styles.info}>Favorite Foods: {favoriteFoods || 'Not set'}</Text>

      <Text style={styles.title}>Nutrition Journal</Text>
      {nutritionJournal.length === 0 ? (
        <Text style={styles.info}>No entries in the journal.</Text>
      ) : (
        <View style={styles.journalContainer}>
          {nutritionJournal.map((entry, index) => (
            <View key={index} style={styles.entry}>
              <Text style={styles.info}>Food: {entry.food_name}</Text>
              <Text style={styles.info}>Calories: {entry.nf_calories} kcal</Text>
              <Text style={styles.info}>Protein: {entry.nf_protein} g</Text>
              <Text style={styles.info}>Fat: {entry.nf_total_fat} g</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.title}>Total Nutrition Stats</Text>
      {/* <Text style={styles.info}>Calories: {calories} kcal</Text> */}
      {/* <Text style={styles.info}>Protein: {protein} g</Text> */}
      {/* <Text style={styles.info}>Fat: {fat} g</Text> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  info: {
    fontSize: 18,
    marginBottom: 8,
  },
  journalContainer: {
    width: '100%',
    marginVertical: 10,
  },
  entry: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
