import React, { createContext, useState } from 'react';

// Helper function to get the current date
const getCurrentDate = () => new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

// Create a context for user data
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [weight, setWeight] = useState('');
  const [favoriteFoods, setFavoriteFoods] = useState('');
  const [nutritionJournal, setNutritionJournal] = useState([]);

  // Function to add a food entry to the journal
  const addFoodToJournal = (food) => {
    const foodWithDate = { ...food, date: getCurrentDate() }; // Add the current date to the food entry
    setNutritionJournal((prevJournal) => [...prevJournal, foodWithDate]);
  };

  // Helper function to calculate the total nutrition for a given list of foods
  const calculateNutrition = (foods) => {
    return foods.reduce(
      (totals, entry) => {
        totals.calories += entry.nf_calories || 0;
        totals.protein += entry.nf_protein || 0;
        totals.fat += entry.nf_total_fat || 0;
        return totals;
      },
      { calories: 0, protein: 0, fat: 0 }
    );
  };

  // Get daily nutrition data
  const getDailyData = () => {
    const today = getCurrentDate();
    const dailyEntries = nutritionJournal.filter((entry) => entry.date === today);
    return calculateNutrition(dailyEntries);
  };

  // Get weekly nutrition data
  const getWeeklyData = () => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to Sunday
    const weeklyEntries = nutritionJournal.filter(
      (entry) => new Date(entry.date) >= startOfWeek
    );
    return calculateNutrition(weeklyEntries);
  };

  // Get monthly nutrition data
  const getMonthlyData = () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1); // Set to the first day of the month
    const monthlyEntries = nutritionJournal.filter(
      (entry) => new Date(entry.date) >= startOfMonth
    );
    return calculateNutrition(monthlyEntries);
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        weight,
        favoriteFoods,
        nutritionJournal,
        addFoodToJournal,
        getDailyData,
        getWeeklyData,
        getMonthlyData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
