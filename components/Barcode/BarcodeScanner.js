import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TextInput, Button } from 'react-native';
import { Camera, useCameraDevices, useCodeScanner, useCameraPermission } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';

export default function BarcodeScreen() {
  const [barcode, setBarcode] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [device, setDevice] = useState(null);

  // console.log("devices: ", devices);
  console.log("device: ", device);

  const navigation = useNavigation();

  // Manage camera permissions
  const { hasPermission, requestPermission } = useCameraPermission();

  // Get available camera devices
  const devices = useCameraDevices();

  useEffect(() => {
    // Request permissions on mount
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    if (devices && Array.isArray(devices)) {
      // Filter devices for the back camera
      const backCamera = devices.find((d) => d.position === 'back');
      setDevice(backCamera || null);
    }
  }, [devices]);

  // Configure barcode scanner
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'upc-a'], // Adjust code types based on your use case
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        const detectedBarcode = codes[0].content; // Assuming the library returns `content`
        setBarcode(detectedBarcode);
        Alert.alert('Barcode Scanned', `Data: ${detectedBarcode}`, [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Nutrition', { barcodeData: detectedBarcode }),
          },
        ]);
      }
    },
  });

  const handleManualInput = () => {
    if (manualInput.trim()) {
      setBarcode(manualInput);
      Alert.alert('Manual Entry', `Data: ${manualInput}`, [
        {
          text: 'OK',
          onPress: () => navigation.navigate('NutritionScreen', { barcodeData: manualInput }),
        },
      ]);
      setManualInput('');
    } else {
      Alert.alert('Error', 'Please enter a valid barcode.');
    }
  };

  if (!hasPermission) {
    return <Text>Please grant camera permissions to use this feature.</Text>;
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan a Barcode</Text>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter barcode manually"
          value={manualInput}
          onChangeText={setManualInput}
        />
        <Button title="Submit" onPress={handleManualInput} />
      </View>
      {barcode ? <Text style={styles.result}>Scanned: {barcode}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  inputContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '80%',
    marginBottom: 10,
  },
  result: {
    fontSize: 18,
    marginTop: 20,
    color: 'green',
  },
});
