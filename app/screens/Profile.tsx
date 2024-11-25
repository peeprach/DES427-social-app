import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { ref, get, onValue } from 'firebase/database'; // เพิ่ม onValue
import AntDesign from '@expo/vector-icons/AntDesign'; // เพิ่มการนำเข้า AntDesign
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; // นำเข้าชนิด RootStackParamList
import { RouteProp, useRoute } from '@react-navigation/native';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    following: 0,
    followers: 0,
    posts: 0,
    likes: 0,
    postsImages: [],
  });

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const route = useRoute<RouteProp<RootStackParamList, 'Profile'>>();
  
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // ฟังการเปลี่ยนแปลงในฐานข้อมูลและอัพเดตข้อมูลทันที
    const fetchUserProfile = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const userRef = ref(FIREBASE_DB, 'users/' + user.uid);
          
          // ฟังการเปลี่ยนแปลงข้อมูลของ user
          onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              setProfileData({
                username: userData.username,
                following: userData.following || 0,
                followers: userData.followers || 0,
                posts: userData.posts || 0,
                likes: userData.likes || 0,
                postsImages: Object.values(userData.postsImages || {}),
              });
            }
          });
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Failed to load profile data.');
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (route.params?.userId) {
      setUserId(route.params.userId);
    }
  }, [route.params?.userId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://example.com/profile-image.jpg' }} 
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{profileData.username}</Text>
          <Text style={styles.handle}>@{profileData.username}</Text>
          <View style={styles.stats}>
            <Text>{profileData.following} Following</Text>
            <Text>{profileData.followers} Followers</Text>
            <Text>{profileData.posts} Posts</Text>
            <Text>{profileData.likes} Likes</Text>
          </View>
          <View style={styles.underline} />
        </View>
        <TouchableOpacity onPress={() => {
          navigation.navigate('Setting');
        }}>
          <AntDesign name="setting" size={30} color="black" style={styles.settingIcon} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={profileData.postsImages}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.postImage} />
        )}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 100,
  },
  handle: {
    fontSize: 14,
    color: 'gray',
    marginTop: 10,
  },
  stats: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  grid: {
    padding: 16,
  },
  postImage: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    borderRadius: 8,
  },
  underline: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#000000',
    alignSelf: 'center',
    marginTop: 10,
  },
  settingIcon: {
    position: 'absolute',
    right: 5,
    top: 16,
    marginTop:-60,
  },
});

export default Profile;
