import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { NUTRITIONIX_APP_ID, NUTRITIONIX_APP_KEY } from '@env';

export default function NutritionScreen({ route }) {
  const { barcode } = route.params;
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const response = await axios.post(
          'https://trackapi.nutritionix.com/v2/search/item',
          {
            upc: barcode,
          },
          {
            headers: {
              'x-app-id': NUTRITIONIX_APP_ID,
              'x-app-key': NUTRITIONIX_APP_KEY,
              'Content-Type': 'application/json',
            },
          }
        );
        setNutritionData(response.data.foods[0]);
      } catch (error) {
        console.error('Error fetching data', error);
        setError('Could not fetch nutrition data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, [barcode]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading nutrition data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!nutritionData) {
    return (
      <View style={styles.noDataContainer}>
        <Text>No data found for this product.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product: {nutritionData.food_name}</Text>
      <Text style={styles.info}>Calories: {nutritionData.nf_calories} kcal</Text>
      <Text style={styles.info}>Carbs: {nutritionData.nf_total_carbohydrate} g</Text>
      <Text style={styles.info}>Protein: {nutritionData.nf_protein} g</Text>
      <Text style={styles.info}>Fat: {nutritionData.nf_total_fat} g</Text>
      <Text style={styles.info}>Serving Size: {nutritionData.serving_qty} {nutritionData.serving_unit}</Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
});
