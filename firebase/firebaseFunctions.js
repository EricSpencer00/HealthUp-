import { firestore } from './firebaseConfig';

/**
 * Fetch the user's profile data.
 * @param {string} userId - The user's ID.
 * @returns {Object} Profile data.
 */
export const getUserProfile = async (userId) => {
  try {
    const profileDoc = await firestore.collection('users').doc(userId).collection('profile').doc('data').get();
    return profileDoc.exists ? profileDoc.data() : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

/**
 * Update the user's profile data.
 * @param {string} userId - The user's ID.
 * @param {Object} profileData - Data to update the profile with.
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    await firestore.collection('users').doc(userId).collection('profile').doc('data').set(profileData, { merge: true });
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
};

/**
 * Add a new entry to the user's nutrition history.
 * @param {string} userId - The user's ID.
 * @param {Object} entry - Nutrition entry to add.
 */
export const addNutritionEntry = async (userId, entry) => {
  try {
    await firestore.collection('users').doc(userId).collection('nutritionHistory').add(entry);
  } catch (error) {
    console.error("Error adding nutrition entry:", error);
  }
};

/**
 * Fetch all entries from the user's nutrition history.
 * @param {string} userId - The user's ID.
 * @returns {Array} Nutrition history entries.
 */
export const getNutritionHistory = async (userId) => {
  try {
    const snapshot = await firestore.collection('users').doc(userId).collection('nutritionHistory').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching nutrition history:", error);
    return [];
  }
};

/**
 * Add a new entry to the user's workout history.
 * @param {string} userId - The user's ID.
 * @param {Object} entry - Workout entry to add.
 */
export const addWorkoutEntry = async (userId, entry) => {
  try {
    await firestore.collection('users').doc(userId).collection('workoutHistory').add(entry);
  } catch (error) {
    console.error("Error adding workout entry:", error);
  }
};

/**
 * Fetch all entries from the user's workout history.
 * @param {string} userId - The user's ID.
 * @returns {Array} Workout history entries.
 */
export const getWorkoutHistory = async (userId) => {
  try {
    const snapshot = await firestore.collection('users').doc(userId).collection('workoutHistory').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching workout history:", error);
    return [];
  }
};

