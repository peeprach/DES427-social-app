import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AntDesign from '@expo/vector-icons/AntDesign';// Importing AntDesign icons

const ForgetPass = () => {
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  const handleNext = () => {
    // ทำการส่งข้อมูลหรือเปลี่ยนหน้า
    console.log('Sending password reset link to', username);
    // ท่านสามารถทำการเชื่อมต่อกับ Firebase หรือระบบของท่านเพื่อส่งลิงก์รีเซ็ตรหัสผ่าน
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
        <AntDesign name="questioncircleo" size={50} color="#15518a" style={styles.icon} />
      <Text style={styles.title}>Trouble logging in?</Text>
      <Text style={styles.subtitle}>
        Enter your username and we’ll send you a link to get back into your account.
      </Text>
      <Text style={styles.subtitle2}>Username</Text>
      <View style={styles.underline} />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>NEXT</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleBackToLogin}>
        <Text style={styles.backText}>Back to log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20, // Adjust spacing between icon and title
  },
  title: {
    color: '#15518a',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  subtitle: {
    color: '#0a2c4f',
    fontSize: 16,
    marginBottom: 50,
    textAlign: 'center',
    marginLeft: 60,
    marginRight: 60,
  },
  subtitle2: {
    color: '#15518a',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    marginLeft: 60,
    marginRight: 60,
  },
  underline: {
    width: '85%', // ความกว้างของเส้นขีด
    height: 1.5, // ความหนาของเส้นขีด
    backgroundColor: '#000000', // สีของเส้นขีด
    alignSelf: 'center',
    marginTop: -10, // ปรับตำแหน่งให้อยู่ใกล้กับข้อความมากขึ้น
    marginBottom: 20, // ระยะห่างจากองค์ประกอบอื่น ๆ
  },
  input: {
    width: '85%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: '85%',
    paddingVertical: 13,
    backgroundColor: '#1c72c4',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  backText: {
    marginTop: 100,
    color: '#15518a',
    fontSize: 16,
  },
});

export default ForgetPass;
