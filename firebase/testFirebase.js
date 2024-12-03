import { getNutritionHistory } from './firebaseFunctions';

const testGetNutritionHistory = async () => {
  const userId = '68ZOlgZ9fTXB3vEalprjE9UOgUz1';
  
  try {
    const nutritionHistory = await getNutritionHistory(userId);
    console.log('Fetched Nutrition History:', nutritionHistory);
  } catch (error) {
    console.error('Error during test:', error);
  }
};

testGetNutritionHistory();
