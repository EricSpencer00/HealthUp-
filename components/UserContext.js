import React, { createContext, useState, useEffect } from 'react';
import firebase from '../firebase/firebaseConfig';

// Helper function to get the current date
const getCurrentDate = () => new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

// Create a context for user data
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [weight, setWeight] = useState('');
  const [favoriteFoods, setFavoriteFoods] = useState('');
  const [nutritionJournal, setNutritionJournal] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [userId, setUserId] = useState(null);

  // Function to set the current user's id (retrieved from Firebase Authentication)
  const setUser = (id) => setUserId(id);

  // Function to fetch nutrition journal from Firebase
  const fetchNutritionJournal = async () => {
    const snapshot = await firebase.firestore().collection('nutritionJournal').where('userId', '==', userId).get();
    const journalData = snapshot.docs.map(doc => doc.data());
    setNutritionJournal(journalData);
  };

  // Function to fetch completed workouts from Firebase
  const fetchCompletedWorkouts = async () => {
    const snapshot = await firebase.firestore().collection('completedWorkouts').where('userId', '==', userId).get();
    const workoutsData = snapshot.docs.map(doc => doc.data());
    setCompletedWorkouts(workoutsData);
  };

  // Function to add a food entry to the journal
  const addFoodToJournal = async (food) => {
    const foodWithDate = { ...food, date: getCurrentDate(), userId };
    await firebase.firestore().collection('nutritionJournal').add(foodWithDate);
    fetchNutritionJournal(); // Refresh the journal
  };

  // Function to add a completed workout
  const addCompletedWorkout = async (workout) => {
    const workoutWithDate = { ...workout, date: getCurrentDate(), userId };
    await firebase.firestore().collection('completedWorkouts').add(workoutWithDate);
    fetchCompletedWorkouts(); // Refresh the workout list
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

  // Fetch user data when the user ID is set
  useEffect(() => {
    if (userId) {
      fetchNutritionJournal();
      fetchCompletedWorkouts();
    }
  }, [userId]);

  return (
    <UserContext.Provider
      value={{
        userId,
        userName,
        weight,
        favoriteFoods,
        nutritionJournal,
        completedWorkouts,
        setUserId: setUser,
        addFoodToJournal,
        getDailyData,
        getWeeklyData,
        getMonthlyData,
        addCompletedWorkout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
