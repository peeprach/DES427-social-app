import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { signOut } from 'firebase/auth';
import { ref, get, update } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

const Profile: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit form visibility

  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = ref(FIREBASE_DB, 'users/' + user.uid);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUsername(userData.username); // ดึง username จาก Realtime Database
          }
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Failed to load user data.');
      }
    };

    fetchUserData();
  }, []);

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

        setUsername(newUsername); // Update the local username
        setNewUsername(''); // Clear input field
        setIsEditing(false); // Close the edit form
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
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Username: {username}</Text>

      {/* Button to show edit form */}
      <TouchableOpacity style={styles.button} onPress={() => setIsEditing(!isEditing)}>
        <Text style={styles.buttonText}>{isEditing ? 'Cancel' : 'Edit Profile'}</Text>
      </TouchableOpacity>

      {/* Edit Profile Form */}
      {isEditing && (
        <>
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
        </>
      )}
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
  label: {
    fontSize: 20,
    marginBottom: 10,
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

export default Profile;
