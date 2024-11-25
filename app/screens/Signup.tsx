import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { ref, set } from 'firebase/database'; // ใช้ Realtime Database แทน Firestore
import { FirebaseError } from 'firebase/app';  // นำเข้า FirebaseError

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

const Signup = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = FIREBASE_AUTH;

  const handleSignup = async () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true); // Set loading to true when starting the signup process
    
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully:', response.user);

      // ตั้งค่า displayName ใน Firebase Authentication
      await updateProfile(response.user, {
        displayName: username, // ตั้งค่า displayName เป็นชื่อผู้ใช้ที่ผู้สมัครกรอก
      });

      // Save user data to Realtime Database
      const userRef = ref(FIREBASE_DB, 'users/' + response.user.uid); // Realtime Database path
      await set(userRef, {
        username: username,
        email: email,
        // Add any other user info you want to store
      });

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log('Signup error', error.message);  // ใช้ error.message จาก FirebaseError

        switch (error.code) {
          case 'auth/email-already-in-use':
            Alert.alert('Error', 'The email address is already in use by another account.');
            break;
          case 'auth/invalid-email':
            Alert.alert('Error', 'The email address is not valid.');
            break;
          case 'auth/weak-password':
            Alert.alert('Error', 'The password is too weak.');
            break;
          default:
            Alert.alert('Signup failed!', 'Please try again.');
        }
      } else {
        Alert.alert('Unknown error', 'An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput
        value={email}
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        value={username}
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        onChangeText={(text) => setUsername(text)}
      />

      <TextInput
        secureTextEntry={true}
        value={password}
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
      />

      <TextInput
        secureTextEntry={true}
        value={confirmPassword}
        style={styles.input}
        placeholder="Confirm Password"
        onChangeText={(text) => setConfirmPassword(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
        <Text style={styles.loginText}>Already have an account? <Text style={styles.boldText}>Log In</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;

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
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#15518a',
    fontSize: 16,
    marginBottom: 50,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
