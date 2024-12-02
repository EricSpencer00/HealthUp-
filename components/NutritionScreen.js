import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { UserContext } from './UserContext';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles/styles';
import { addNutritionEntry } from '../firebase/firebaseFunctions';

export default function NutritionScreen({ route }) {
  const { barcode } = route.params || {};
  const [nutritionData, setNutritionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [portionSize, setPortionSize] = useState(1);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { user, userId } = useContext(UserContext);
  const navigation = useNavigation();

  // Fetch nutrition data by barcode or search query
  const fetchNutritionData = async (searchParam) => {
    setLoading(true);
    setError(null);
    setNutritionData([]);

    try {
      let response;
      const headers = {
        'x-app-id': 'REMOVED_APP_ID',
        'x-app-key': 'REMOVED_APP_KEY',
        'Content-Type': 'application/json',
      };

      if (searchParam.upc) {
        response = await axios.post(
          'https://trackapi.nutritionix.com/v2/search/item',
          { upc: searchParam.upc },
          { headers }
        );
      } else if (searchParam.query) {
        response = await axios.post(
          'https://trackapi.nutritionix.com/v2/natural/nutrients',
          { query: searchParam.query },
          { headers }
        );
      }

      setNutritionData(response.data.foods || []);
    } catch (err) {
      console.error('Error fetching nutrition data:', err);
      setError('Could not fetch nutrition data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setIsSearchActive(true);
    if (searchQuery.trim()) {
      fetchNutritionData({ query: searchQuery });
    }
  };

  useEffect(() => {
    if (barcode) {
      fetchNutritionData({ upc: barcode });
    }
  }, [barcode]);

  const handleAddToJournal = async (foodItem) => {
    if (!foodItem) {
      console.log('No food selected.');
      return;
    }
  
    // if (!user) {
    //   console.log('No user signed in.');
    //   navigation.navigate('SignInScreen');
    //   return;
    // }
  
    const foodEntry = {
      ...foodItem,
      portionSize,
      addedAt: new Date(),
    };
  
    try {
      await addNutritionEntry(userId, foodEntry);
      console.log('Food added to journal:', foodEntry);
    } catch (err) {
      console.error('Error adding food to journal:', err);
    }
  };
  

  const renderNutritionData = () => (
    <FlatList
      data={nutritionData}
      keyExtractor={(item, index) => item.food_id || index.toString()}
      renderItem={({ item }) => {
        const servingFactor = portionSize / (item.serving_qty || 1);
        const displayNutrition = {
          serving: item.serving_qty ? `${portionSize} ${item.serving_unit}` : null,
          calories: item.nf_calories ? `${item.nf_calories * servingFactor} kcal` : null,
          carbs: item.nf_total_carbohydrate ? `${item.nf_total_carbohydrate * servingFactor} g` : null,
          protein: item.nf_protein ? `${item.nf_protein * servingFactor} g` : null,
          fat: item.nf_total_fat ? `${item.nf_total_fat * servingFactor} g` : null,
          sodium: item.nf_sodium ? `${item.nf_sodium * servingFactor} mg` : null,
          cholesterol: item.nf_cholesterol ? `${item.nf_cholesterol * servingFactor} mg` : null,
          fiber: item.nf_dietary_fiber ? `${item.nf_dietary_fiber * servingFactor} g` : null,
          sugar: item.nf_sugars ? `${item.nf_sugars * servingFactor} g` : null,
        };
  
        return (
          <TouchableOpacity style={styles2.itemContainer} onPress={() => setSelectedFood(item)}>
            <Text style={styles.info}>Product: {item.food_name || 'Unknown'}</Text>
            {Object.entries(displayNutrition).map(([key, value]) =>
              value ? (
                <Text key={key} style={styles.info}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                </Text>
              ) : null
            )}
            <Button
              title="Add to Journal"
              onPress={() => handleAddToJournal(item)} // Pass item directly
              style={styles.button}
            />
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={<Text>No nutrition data available.</Text>}
    />
  );
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a food..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity style={styles2.button} onPress={handleSearch}>
        <Text style={styles2.buttonText}>Search</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}

      {!isSearchActive && (
        <TouchableOpacity
          style={styles2.button}
          onPress={() => navigation.navigate('BarcodeScanner')}
        >
          <Text style={styles2.buttonText}>Scan Barcode</Text>
        </TouchableOpacity>
      )}

      {barcode && <Text style={styles.barcodeText}>Barcode: {barcode}</Text>}
      {renderNutritionData()}
    </View>
  );
}

const styles2 = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: '#55c6f2',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemContainer: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
});
