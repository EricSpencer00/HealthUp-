// NutritionScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import os from 'os';

export default function NutritionScreen({ route }) {
  const { barcode } = route.params; // Get the barcode from the route
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(true);
  NUTRITIONIX_APP_KEY = os.getenv('NUTRITIONIX_APP_KEY')
  NUTRITIONIX_APP_ID = os.getenv('NUTRITIONIX_APP_ID')

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const response = await axios.post(
          'https://trackapi.nutritionix.com/v2/search/item',
          {
            upc: barcode, // The scanned barcode
          },
          {
            headers: {
              'x-app-id': NUTRIONIX_APP_ID,
              'x-app-key': NUTRITIONIX_APP_KEY,
              'Content-Type': 'application/json',
            },
          }
        );
        setNutritionData(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, [barcode]);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!nutritionData) {
    return <Text>No data found for this product.</Text>;
  }

  return (
    <View>
      <Text>Product: {nutritionData.foods[0].food_name}</Text>
      <Text>Calories: {nutritionData.foods[0].nf_calories}</Text>
      <Text>Carbs: {nutritionData.foods[0].nf_total_carbohydrate}</Text>
      <Text>Protein: {nutritionData.foods[0].nf_protein}</Text>
      <Text>Fat: {nutritionData.foods[0].nf_total_fat}</Text>
    </View>
  );
}
