import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const TakePhoto = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');

  // Function to pick image from gallery
  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;  // Access the uri from the first asset
      setPhoto(uri);  // Set the URI to the state
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a Photo</Text>

      {photo ? (
        <>
          <Image source={{ uri: photo }} style={styles.preview} />
          <TextInput
            style={styles.input}
            placeholder="Add a description..."
            value={description}
            onChangeText={setDescription}
          />
          <Text style={styles.previewText}>Description: {description}</Text>
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick a Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TakePhoto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  preview: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1c72c4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewText: {
    marginTop: 20,
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
});
