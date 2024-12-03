import { db } from './firebaseConfig';
import 'firebase/firestore';
import { doc, getDoc, getFirestore, collection, addDoc, arrayUnion, updateDoc } from 'firebase/firestore';

/**
 * Fetch the user's profile data.
 * @param {string} userId - The user's ID.
 * @returns {Object} Profile data.
 */
export const getUserProfile = async (userId) => {
  try {
    const profileDoc = await db.collection('users').doc(userId).collection('profile').doc('data').get();
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
    await db.collection('users').doc(userId).collection('profile').doc('data').set(profileData, { merge: true });
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
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("User does not exist.");
      return;
    }

    const newEntry = {
      food_name: entry.food_name || 'Unknown',
      meal_type: entry.meal_type || null,
      consumed_at: entry.consumed_at || new Date().toISOString(),
      serving_qty: entry.serving_qty || 1,
      serving_unit: entry.serving_unit || 'unit',
      serving_weight_grams: entry.serving_weight_grams || 0,
      nutrients: {
        calories: entry.nf_calories || 0,
        protein: entry.nf_protein || 0,
        carbs: entry.nf_total_carbohydrate || 0,
        fat: entry.nf_total_fat || 0,
        fiber: entry.nf_dietary_fiber || 0,
        sugars: entry.nf_sugars || 0,
        sodium: entry.nf_sodium || 0,
        cholesterol: entry.nf_cholesterol || 0,
      },
      photo: entry.photo || {},
    };

    await updateDoc(userDocRef, {
      nutritionHistory: arrayUnion(newEntry),
    });

    console.log("Nutrition entry added successfully:", newEntry);
  } catch (error) {
    console.error("Error adding nutrition entry:", error);
  }
};


/**
 * Fetch all entries from the user's nutrition history.
 * Validates each entry to ensure required fields are present.
 *
 * @param {string} userId - The user's ID.
 * @returns {Promise<Array>} Nutrition history entries.
 */
export const getNutritionHistory = async (userId) => {
  console.log("getNutritionHistory called with userId:", userId);

  try {
    const userDocRef = doc(db, 'users', userId);
    console.log("User doc reference created:", userDocRef);

    const userDoc = await getDoc(userDocRef);
    console.log("Fetched user document:", userDoc.exists() ? userDoc.data() : "No document found");

    if (!userDoc.exists()) {
      console.error("User does not exist.");
      return [];
    }

    const userData = userDoc.data();
    console.log("User data fetched:", userData);

    const nutritionHistory = userData.nutritionHistory || [];
    console.log("Nutrition history before processing:", nutritionHistory);

    if (!Array.isArray(nutritionHistory)) {
      console.error("nutritionHistory is not an array:", nutritionHistory);
      return [];
    }

    const processedHistory = nutritionHistory.map((entry, index) => {
      console.log(`Processing entry ${index}:`, entry);
      return {
        id: `${userId}_${index}`,
        ...entry,
      };
    });

    console.log("Processed nutrition history:", processedHistory);
    return processedHistory;
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
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("User does not exist.");
      return;
    }

    const newEntry = {
      workout_name: entry.workout_name || 'Unknown',
      workout_type: entry.workout_type || null,
      completed_at: entry.completed_at || new Date(),
      duration_minutes: entry.duration_minutes || 0,
      calories_burned: entry.calories_burned || 0,
      notes: entry.notes || '',
    };

    await updateDoc(userDocRef, {
      workoutHistory: arrayUnion(newEntry),
    });

    console.log("Workout entry added successfully:", newEntry);
  } catch (error) {
    console.error("Error adding workout entry:", error);
  }
};

/**
 * Fetch all entries from the user's workout history.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Array>} Workout history entries.
 */
export const getWorkoutHistory = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("User does not exist.");
      return [];
    }

    const userData = userDoc.data();
    const workoutHistory = userData.workoutHistory || [];

    return workoutHistory.map((entry, index) => ({
      id: `${userId}_${index}`, // Unique ID for each entry
      ...entry,
    }));
  } catch (error) {
    console.error("Error fetching workout history:", error);
    return [];
  }
};


export const saveExercise = async (userId, exerciseName) => {
  try {
    const exerciseRef = collection(db, 'users', userId, 'exercises');
    await addDoc(exerciseRef, {
      name: exerciseName,
      addedAt: new Date(),
    });
    console.log('Exercise saved successfully');
  } catch (error) {
    console.error('Error saving exercise:', error.message);
    throw error;
  }
};

export const getSavedExercises = async (userId) => {
  try {
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('savedExercises')
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching saved exercises:', error.message);
    throw error;
  }
};

export const deleteExercise = async (userId, exerciseId) => {
  try {
    const exerciseDoc = db
      .collection('users')
      .doc(userId)
      .collection('savedExercises')
      .doc(exerciseId);

    await exerciseDoc.delete();
    console.log('Exercise deleted successfully');
  } catch (error) {
    console.error('Error deleting exercise:', error.message);
    throw error;
  }
};

export const fetchUserName = async (userId) => {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (doc.exists) {
      return doc.data().userName || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user name:', error.message);
    throw error;
  }
}

// export const getWeight = async (userId) => {
//   const doc = await db.collection('users').doc(userId).get();
//   if (doc.exists) {
//     return doc.data().weight || null;
//   } else {
//     await db.collection('users').doc(userId).set({ weight: null }, { merge: true });
//     return null;
//   }
// };

// export const setWeight = async (userId, weight) => {
//   await db.collection('users').doc(userId).set({ weight }, { merge: true });
// };

// // Get height from Firestore
// export const getHeight = async (userId) => {
//   const doc = await db.collection('users').doc(userId).get();
//   if (doc.exists) {
//     return doc.data().height || null; // Return height if present, or null
//   } else {
//     // Create document with default fields if it doesn't exist
//     await db.collection('users').doc(userId).set({ height: null }, { merge: true });
//     return null;
//   }
// };

// // Set height in Firestore
// export const setHeight = async (userId, height) => {
//   await db.collection('users').doc(userId).set({ height }, { merge: true });
// };