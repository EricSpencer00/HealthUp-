import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { UserContext } from './UserContext';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles/styles';
import { addFoodEntry } from '../firebase/firebaseFunctions';

export default function NutritionScreen({ route }) {
  const { barcode } = route.params || {};
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [portionSize, setPortionSize] = useState(1);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { addFoodToJournal, user } = useContext(UserContext);
  const navigation = useNavigation();

  // Fetch nutrition data by barcode or search query
  const fetchNutritionData = async (searchParam) => {
    setLoading(true);
    setError(null);
    setNutritionData(null);

    try {
      let response;
      if (searchParam.upc) {
        response = await axios.post(
          'https://trackapi.nutritionix.com/v2/search/item',
          { upc: searchParam.upc },
          {
            headers: {
              'x-app-id': 'REMOVED_APP_ID',
              'x-app-key': 'REMOVED_APP_KEY',
              'Content-Type': 'application/json',
            },
          }
        );
        setNutritionData(response.data.foods);
      } else if (searchParam.query) {
        response = await axios.post(
          'https://trackapi.nutritionix.com/v2/natural/nutrients',
          { query: searchParam.query },
          {
            headers: {
              'x-app-id': 'REMOVED_APP_ID',
              'x-app-key': 'REMOVED_APP_KEY',
              'Content-Type': 'application/json',
            },
          }
        );
        setNutritionData(response.data.foods);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Could not fetch nutrition data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setIsSearchActive(true);
    if (searchQuery) {
      fetchNutritionData({ query: searchQuery });
    }
  };

  useEffect(() => {
    if (barcode) {
      fetchNutritionData({ upc: barcode });
    }
  }, [barcode]);

  const handleAddToJournal = () => {
    if (selectedFood) {
      if (!user) {
        navigation.navigate('SigninScreen');
        return;
      }
      addFoodToJournal(selectedFood);
      addFoodEntry(user, selectedFood); // Save food to Firebase
    }
  };

  const renderNutritionData = () => {
    if (!nutritionData || nutritionData.length === 0) {
      return <Text>No nutrition data available.</Text>;
    }

    return (
      <FlatList
        data={nutritionData}
        keyExtractor={(item, index) => item.food_id ? item.food_id.toString() : index.toString()}
        renderItem={({ item }) => {
          const servingFactor = portionSize / (item.serving_qty || 1);
          const displayNutrition = {
            calories: item.nf_calories ? `${item.nf_calories * servingFactor} kcal` : null,
            carbs: item.nf_total_carbohydrate ? `${item.nf_total_carbohydrate * servingFactor} g` : null,
            protein: item.nf_protein ? `${item.nf_protein * servingFactor} g` : null,
            fat: item.nf_total_fat ? `${item.nf_total_fat * servingFactor} g` : null,
            sodium: item.nf_sodium ? `${item.nf_sodium * servingFactor} mg` : null,
            cholesterol: item.nf_cholesterol ? `${item.nf_cholesterol * servingFactor} mg` : null,
            fiber: item.nf_dietary_fiber ? `${item.nf_dietary_fiber * servingFactor} g` : null,
            potassium: item.nf_potassium ? `${item.nf_potassium * servingFactor} mg` : null,
            sugar: item.nf_sugars ? `${item.nf_sugars * servingFactor} g` : null,
          };

          return (
            <TouchableOpacity onPress={() => setSelectedFood(item)}>
              <Text style={styles.info}>Product: {item.food_name || 'Unknown'}</Text>
              {Object.entries(displayNutrition).map(([key, value]) =>
                value ? (
                  <Text key={key} style={styles.info}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  </Text>
                ) : null
              )}
              <Button onPress={handleAddToJournal} title="Add to Journal" />
            </TouchableOpacity>
          );
        }}
      />
    );
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

      {!isSearchActive && (
        <Button
          title="Scan Barcode"
          onPress={() => navigation.navigate('BarcodeScanner')}
        />
      )}
      {!isSearchActive && barcode && <Text style={styles.barcodeText}>Barcode: {barcode}</Text>}

      {renderNutritionData()}

      {selectedFood && (
        <View style={styles.selectedFoodContainer}>
          <Text>Portion Size: {portionSize}</Text>
          <Button title="Increase Portion Size" onPress={() => setPortionSize(portionSize + 1)} />
          <Button title="Decrease Portion Size" onPress={() => setPortionSize(portionSize - 1)} />
        </View>
      )}
    </View>
  );
}
