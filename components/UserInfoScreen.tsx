import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserContext } from './UserContext';

export default function UserInfoScreen() {
  const { userName, weight, favoriteFoods } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Information</Text>
      <Text style={styles.info}>Name: {userName || 'Not set'}</Text>
      <Text style={styles.info}>Weight: {weight || 'Not set'} kg</Text>
      <Text style={styles.info}>Favorite Foods: {favoriteFoods || 'Not set'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  info: {
    fontSize: 18,
    marginBottom: 8,
  },
});
