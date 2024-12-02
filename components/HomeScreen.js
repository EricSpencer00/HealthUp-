import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { EventTypes } from 'react-native-gesture-handler/lib/typescript/web/interfaces';

const { width, height } = Dimensions.get('window');

// Home Screen Component
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>HealthUp!</Text>
      </View>

      <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
        <Image style={styles.profileButtonImg} source={require('./assets/ProfileButton.png')} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.trio} onPress={() => navigation.navigate('Nutrition')}>
        <Image style={styles.trioImg} source={require('./assets/Nutrition.png')} />
        <View style={styles.trioText}>
          <Text style={styles.trioTitle}>Nutrition</Text>
          <Text style={styles.trioDescription}>Track macros.</Text>
        </View>
          
      </TouchableOpacity>

      <TouchableOpacity style={styles.trio} onPress={() => navigation.navigate('Exercise')}>
        <Image style={styles.trioImg} source={require('./assets/Exercise.png')} />
        <View style={styles.trioText}>
          <Text style={styles.trioTitle}>Exercise</Text>
          <Text style={styles.trioDescription}>Start your workout.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.trio} onPress={() => navigation.navigate('Journal')}>
        <Image style={styles.trioImg} source={require('./assets/Journal.png')} />        
        <View style={styles.trioText}>
          <Text style={styles.trioTitle}>Journal</Text>
          <Text style={styles.trioDescription}>Check your progress.</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 30,
    // fontWeight: 'bold',
    color: '#171717',
  },
  topBar: {
    position: 'absolute',
    backgroundColor: 'white',
    borderBottomColor: '#d6d6d6',
    borderBottomWidth: 1,
    top: 0,
    height: 70,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButtonImg: {
    width: 45,
    height: 45,
  },
  profileButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  trio: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: '#d6d6d6',
    borderWidth: 1,
    margin: 20,
    padding: 20,
    flexDirection: 'row',
  },
  trioTitle: {
    fontSize: 30,
    color: 'black',
  },
  trioDescription: {
    fontSize: 15,
  },
  trioImg: {
    width: 100,
    height: 100,
  },
  trioText: {
    justifyContent: 'center',
    marginLeft: 20,
  }
});
