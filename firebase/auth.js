// auth.js
import { app, db } from './firebaseConfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage) // Correct persistence setup
});

export const signUpUser = async (email, password, userName) => {
  try {
    console.log('Attempting to sign up user...'); // Log when sign-up is triggered

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Get user info
    const user = userCredential.user;
    console.log('User created successfully: ', user.uid);

    // Optionally, save additional user data (like username) in Firestore
    const userRef = doc(db, 'users', user.uid); // Create a user document in Firestore
    await setDoc(userRef, {
      userName: userName,
      email: email,
      createdAt: new Date(),
    });

    console.log('User data saved in Firestore successfully');
    
    return { userId: user.uid, userName: userName };
    
  } catch (error) {
    console.error('Error signing up user: ', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.error('Email is already in use!');
    } else if (error.code === 'auth/invalid-email') {
      console.error('Invalid email format!');
    } else if (error.code === 'auth/weak-password') {
      console.error('Password is too weak!');
    } else {
      console.error('Unknown error occurred:', error.message);
    }
    
    return { error: error.message };
  }
};

export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user.uid;
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
};
