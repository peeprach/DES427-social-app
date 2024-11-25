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

         // Navigate back to Profile with updated username
         navigation.navigate('Profile', {
          userId: user.uid // Pass the updated username
        });
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
      navigation.navigate('Login'); // ไปที่หน้าจอ Login หลังจากออกจากระบบ
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit profile</Text>
      
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
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start', // เปลี่ยนจาก 'space-between' เป็น 'flex-start' เพื่อให้เนื้อหาอยู่ชิดบน
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10, // ลดระยะห่างด้านล่างของ title
    textAlign: 'left',
    marginTop: 10,
    marginLeft: 10,
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E2E2E2',
    marginVertical: 8,
    marginTop:20,
  },
  button: {
    backgroundColor: '#1c72c4',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10, // ลดระยะห่างระหว่างปุ่ม
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'transparent', // Transparent background for the logout button
    borderWidth: 1,
    borderColor: '#e74c3c', // Red border color
    marginTop: 500, // Remove margin-top to avoid extra space
  },
  logoutText: {
    color: '#e74c3c', // Red text color
  },
});

export default Setting;