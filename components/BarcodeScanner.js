import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';

export default function BarcodeScanner() {
  const [barcode, setBarcode] = useState(null);
  const navigation = useNavigation();

  const handleBarcodeRead = ({ data }) => {
    setBarcode(data);
    navigation.navigate('NutritionScreen', { barcode: data });  // Pass the barcode to NutritionScreen
  };

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        style={{ flex: 1 }}
        onBarCodeRead={handleBarcodeRead}
      >
        {barcode && <Text style={{ color: 'white' }}>{barcode}</Text>}
      </RNCamera>
    </View>
  );
}
