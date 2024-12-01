import { firestore } from './firebase'; // Firebase configuration
import { getCurrentDate } from './utils'; // Helper function for date formatting

const createUserObject = ({
  userName,
  weight,
  favoriteFoods,
  nutritionJournal,
  addFoodToJournal,
  getDailyData,
  getWeeklyData,
  getMonthlyData,
}) => {
  return {
    userName,
    weight,
    favoriteFoods,
    nutritionJournal,

    // Methods to interact with Firebase
    saveToFirebase: async (userId) => {
      try {
        // Save profile
        await firestore.collection('users').doc(userId).collection('profile').doc('data').set({
          userName,
          weight,
          favoriteFoods,
        });

        // Save nutrition journal
        const journalRef = firestore.collection('users').doc(userId).collection('nutritionHistory');
        await Promise.all(
          nutritionJournal.map((entry) => journalRef.add(entry))
        );

        console.log('User data saved successfully!');
      } catch (error) {
        console.error('Error saving user data to Firebase:', error);
      }
    },

    loadFromFirebase: async (userId) => {
      try {
        // Load profile
        const profileDoc = await firestore.collection('users').doc(userId).collection('profile').doc('data').get();
        if (profileDoc.exists) {
          const profileData = profileDoc.data();
          Object.assign(this, profileData); // Update object properties
        }

        // Load nutrition journal
        const journalSnapshot = await firestore.collection('users').doc(userId).collection('nutritionHistory').get();
        const journalData = journalSnapshot.docs.map((doc) => doc.data());
        this.nutritionJournal = journalData;

        console.log('User data loaded successfully!');
      } catch (error) {
        console.error('Error loading user data from Firebase:', error);
      }
    },

    // Add a food entry locally and sync it to Firebase
    addFood: async (userId, food) => {
      const foodWithDate = { ...food, date: getCurrentDate() };
      addFoodToJournal(foodWithDate);

      // Sync the entry to Firebase
      try {
        const journalRef = firestore.collection('users').doc(userId).collection('nutritionHistory');
        await journalRef.add(foodWithDate);
        console.log('Food entry added to Firebase!');
      } catch (error) {
        console.error('Error adding food entry to Firebase:', error);
      }
    },

    getDailyData,
    getWeeklyData,
    getMonthlyData,
  };
};

export default createUserObject;
