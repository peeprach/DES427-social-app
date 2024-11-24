import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { signOut } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type SettingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

const Setting: React.FC = () => {
  const navigation = useNavigation<SettingScreenNavigationProp>();
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = FIREBASE_AUTH;

  const handleUpdateUsername = async () => {
    if (!newUsername) {
      Alert.alert('Error', 'Please enter a new username.');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(FIREBASE_DB, 'users/' + user.uid);
        await update(userRef, {
          username: newUsername,
        });

        setNewUsername(''); // Clear input field
        Alert.alert('Success', 'Username updated successfully!');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to update username.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login'); // Navigate to Login screen after logout
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      {/* Update Username */}
      <TextInput
        value={newUsername}
        style={styles.input}
        placeholder="Enter new username"
        onChangeText={(text) => setNewUsername(text)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdateUsername}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Username'}</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#1c72c4',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Setting;
