import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ImageBackground, Dimensions } from 'react-native';
import { UserContext } from './UserContext';

const { width, height } = Dimensions.get('window');

// Welcome Screen Component
export default function ProfileScreen({ navigation }) {
  const { userName, weight, favoriteFoods } = useContext(UserContext);

  // const bgPath = {uri: './components/Images/FitBG.png' };
  

  return (
    <View style={styles.container}>

      <ImageBackground source={require('./assets/FitBG.png')} style={styles.container}>
        <View style={styles.whiteBox}>
          
          <Text style={styles.title}>Your profile.</Text>

          <Text style={styles.info}>User Name: {userName || "Not Set"}</Text>
          <Text style={styles.info}>Weight: {weight || "Not Set"} kg</Text>
          <Text style={styles.info}>Favorite Foods: {favoriteFoods || "Not Set"}</Text>

          <Button
            title="Go to User Settings"
            onPress={() => navigation.navigate('UserSettings')}
          />

          <Button
            title="View User Info"
            onPress={() => navigation.navigate('UserInfo')}
          />
        </View>
      </ImageBackground>
      
    </View>
  );
}

// // User Info Screen Component
// export function UserInfoScreen() {
//   const { userName, weight, favoriteFoods } = useContext(UserContext);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>User Information</Text>
//       <Text style={styles.info}>Name: {userName}</Text>
//       <Text style={styles.info}>Weight: {weight} kg</Text>
//       <Text style={styles.info}>Favorite Foods: {favoriteFoods}</Text>
//     </View>
//   );
// }

// // User Settings Screen Component
// export function UserSettingsScreen({ navigation }) {
//   const { userName, setUserName, weight, setWeight, favoriteFoods, setFavoriteFoods } = useContext(UserContext);

//   const handleSave = () => {
//     navigation.navigate('Welcome');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Edit User Settings</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter your name"
//         value={userName}
//         onChangeText={setUserName}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Enter your weight"
//         value={weight}
//         onChangeText={setWeight}
//         keyboardType="numeric"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Enter your favorite foods"
//         value={favoriteFoods}
//         onChangeText={setFavoriteFoods}
//       />

//       <Button title="Save Settings" onPress={handleSave} />
//     </View>
//   );
// }

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    width: width,
    height: height,
  },
  whiteBox: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    width: width * 0.8,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  info: {
    fontSize: 18,
    marginTop: 8,
  },
});
