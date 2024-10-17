import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { UserContext } from './UserContext';

export default function NutritionScreen({ route }) {
  const { barcode } = route.params || {};
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [portionSize, setPortionSize] = useState(1);  // User-defined portion size
  const [selectedFood, setSelectedFood] = useState(null); // To handle multiple food types
  const { addFoodToJournal, getDailyData, getWeeklyData, getMonthlyData } = useContext(UserContext);

  // Fetch nutrition data by barcode or search query
  const fetchNutritionData = async (searchParam) => {
    setLoading(true);
    setError(null);
    setNutritionData(null);
    setSearchResults([]);

    try {
      let response;
      if (searchParam.upc) {
        // Use the barcode search endpoint
        response = await axios.post(
          'https://trackapi.nutritionix.com/v2/search/item',
          { upc: searchParam.upc },
          {
            headers: {
              'x-app-id': "REMOVED_APP_ID",
              'x-app-key': "REMOVED_APP_KEY",
              'Content-Type': 'application/json',
            },
          }
        );
        setNutritionData(response.data.foods);
      } else if (searchParam.query) {
        // Use the natural nutrients endpoint for common food search
        response = await axios.post(
          'https://trackapi.nutritionix.com/v2/natural/nutrients',
          { query: searchParam.query },
          {
            headers: {
              'x-app-id': "REMOVED_APP_ID",
              'x-app-key': "REMOVED_APP_KEY",
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('API Response:', response.data);
        setNutritionData(response.data.foods);
      }
    } catch (error) {
      console.error('Error fetching data', error);
      setError('Could not fetch nutrition data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Adjust handleSearch to use fetchNutritionData
  const handleSearch = () => {
    if (searchQuery) {
      console.log('Searching for:', searchQuery);
      fetchNutritionData({ query: searchQuery });
    }
  };

  // Fetch data by barcode on initial load if barcode is provided
  useEffect(() => {
    if (barcode) {
      fetchNutritionData({ upc: barcode });
    }
  }, [barcode]);

  // Handle adding the current food item to the journal
  const handleAddToJournal = () => {
    if (selectedFood) {
      addFoodToJournal(selectedFood);
    }
  };

  // Calculate total nutrition from the user's journal
  const { calories, protein, fat } = getDailyData(); // Can change to getWeeklyData or getMonthlyData based on your need

  // Calculate nutrition based on serving size
  const calculateServingNutrition = (food) => {
    const servingFactor = portionSize / (food.serving_qty || 1);
    return {
      calories: food.nf_calories * servingFactor,
      protein: food.nf_protein * servingFactor,
      fat: food.nf_total_fat * servingFactor,
    };
  };  

  const { weight } = useContext(UserContext);

  const calculateDV = (value, nutrient) => {
    if (!weight) { return 'N/A'; }

    console.log(`Calculating DV for ${nutrient} with value: ${value} and weight: ${weight}`);
    const avgDV = {
      calories: 2000,
      carbs: 275, // g
      protein: 50, // g
      fat: 70, // g
      sodium: 2300, // mg
      cholesterol: 300, // mg
      fiber: 28, // g
      potassium: 4700, // mg
      sugar: 90, // g
    };
    
    const dailyValue = avgDV[nutrient];
  
    // Return the percentage of the daily value based on the nutrient value for the user's weight
    if (dailyValue) {
      // Adjust the DV calculation based on user's weight (example: multiply by weight/70)
      return ((value / dailyValue) * 100 * (weight / 70)).toFixed(2); // Adjusted for weight
    }
    return 'N/A';
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a food..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error && <Text style={styles.error}>{error}</Text>}

      {nutritionData && (
        <View style={styles.nutritionInfo}>
          <FlatList
            data={nutritionData}
            keyExtractor={(item, index) => item.food_id ? item.food_id.toString() : index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedFood(item)}>
                <Text style={styles.info}>
                  Product: {item.food_name ? item.food_name : 'Unknown'}
                </Text>
                <Text style={styles.info}>
                  Calories: {item.nf_calories ? item.nf_calories : 'N/A'} kcal 
                  ({calculateDV(item.nf_calories, 'calories')}% DV)
                </Text>
                <Text style={styles.info}>
                  Carbs: {item.nf_total_carbohydrate ? item.nf_total_carbohydrate : 'N/A'} g 
                  ({calculateDV(item.nf_total_carbohydrate, 'carbs')}% DV)
                </Text>
                <Text style={styles.info}>
                  Protein: {item.nf_protein ? item.nf_protein : 'N/A'} g 
                  ({calculateDV(item.nf_protein, 'protein')}% DV)
                </Text>
                <Text style={styles.info}>
                  Fat: {item.nf_total_fat ? item.nf_total_fat : 'N/A'} g 
                  ({calculateDV(item.nf_total_fat, 'fat')}% DV)
                </Text>
                <Text style={styles.info}>
                  Serving Size: {item.serving_qty && item.serving_unit
                    ? `${item.serving_qty} ${item.serving_unit}`
                    : 'N/A'}
                </Text>
                <Text style={styles.info}>
                  Sodium: {item.nf_sodium ? item.nf_sodium : 'N/A'} mg 
                  ({calculateDV(item.nf_sodium, 'sodium')}% DV)
                </Text>
                <Text style={styles.info}>
                  Cholesterol: {item.nf_cholesterol ? item.nf_cholesterol : 'N/A'} mg 
                  ({calculateDV(item.nf_cholesterol, 'cholesterol')}% DV)
                </Text>
                <Text style={styles.info}>
                  Dietary Fiber: {item.nf_dietary_fiber ? item.nf_dietary_fiber : 'N/A'} g 
                  ({calculateDV(item.nf_dietary_fiber, 'fiber')}% DV)
                </Text>
                <Text style={styles.info}>
                  Potassium: {item.nf_potassium ? item.nf_potassium : 'N/A'} mg 
                  ({calculateDV(item.nf_potassium, 'potassium')}% DV)
                </Text>
                <Text style={styles.info}>
                  Sugars: {item.nf_sugars ? item.nf_sugars : 'N/A'} g 
                  ({calculateDV(item.nf_sugars, 'sugar')}% DV)
                </Text>
                <Button
                  onPress={() => addFoodToJournal(item)}
                  title="Add to Journal"
                />
              </TouchableOpacity>
            )}
          />


          {selectedFood && (
            <View style={styles.selectedFoodInfo}>
              <Text style={styles.title}>Selected: {selectedFood.food_name}</Text>
              <TextInput
                style={styles.portionInput}
                placeholder="Enter portion size (e.g., 0.5 for half a banana)"
                keyboardType="numeric"
                value={portionSize.toString()}
                onChangeText={(text) => setPortionSize(parseFloat(text))}
              />
              <Text style={styles.info}>Adjusted Nutrition:</Text>
              <Text style={styles.info}>Calories: {calculateServingNutrition(selectedFood).calories} kcal</Text>
              <Text style={styles.info}>Protein: {calculateServingNutrition(selectedFood).protein} g</Text>
              <Text style={styles.info}>Fat: {calculateServingNutrition(selectedFood).fat} g</Text>
              <Button title="Add to Journal" onPress={handleAddToJournal} />
            </View>
          )}
        </View>
      )}

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Journal Nutrition Stats</Text>
        <Text style={styles.info}>Total Calories: {calories} kcal</Text>
        <Text style={styles.info}>Total Protein: {protein} g</Text>
        <Text style={styles.info}>Total Fat: {fat} g</Text>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  nutritionInfo: {
    marginTop: 20,
  },
  selectedFoodInfo: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  portionInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  statsContainer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    marginVertical: 5,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginVertical: 10,
  },
});
