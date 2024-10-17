import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Camera } from 'react-native-camera'; // Or use expo-barcode-scanner
import { useNavigation } from '@react-navigation/native';

export default function BarcodeScreen() {
  const [barcode, setBarcode] = useState(null);
  const navigation = useNavigation();

  const handleBarcodeScanned = (data) => {
    setBarcode(data);
    navigation.navigate('NutritionScreen', { barcodeData: data });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan a Barcode</Text>
      
      {/* 
        Add barcode scanning logic here using libraries like react-native-camera 
        or expo-barcode-scanner 
      */}

      <Button title="Simulate Barcode Scan" onPress={() => handleBarcodeScanned("0012345678910")} />
      
      {barcode && <Text style={styles.result}>Scanned Barcode: {barcode}</Text>}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    fontSize: 18,
    marginTop: 20,
    color: 'green',
  },
});
