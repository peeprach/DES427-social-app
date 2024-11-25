import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';

type Post = {
  id: string;
  username: string;
  image: string;
  caption: string;
  likes: number;
  liked: boolean;
};

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      username: 'john_doe',
      image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      caption: 'Enjoying the beautiful sunset 🌅',
      likes: 120,
      liked: false,
    },
    {
      id: '2',
      username: 'jane_smith',
      image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe',
      caption: 'Loving the vibes here ✨',
      likes: 89,
      liked: false,
    },
  ]);

  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Set the image URI
    }
  };

  // Function to take a picture using the camera
  const takePicture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Set the image URI
    }
  };

  // Function to handle posting the new photo
  const handlePost = () => {
    if (!image || !caption) {
      Alert.alert('Error', 'Please add an image and a caption.');
      return;
    }

    const newPost: Post = {
      id: (posts.length + 1).toString(),
      username: 'current_user', // Replace with the logged-in user's username
      image: image,
      caption: caption,
      likes: 0,
      liked: false,
    };

    setPosts([newPost, ...posts]); // Add the new post to the state
    setImage(null); // Reset the image
    setCaption(''); // Reset the caption
  };

  const toggleLike = (id: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => toggleLike(item.id)}>
          <MaterialIcons
            name={item.liked ? 'favorite' : 'favorite-border'}
            size={24}
            color={item.liked ? 'red' : 'black'}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="comment" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="share" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.likes}>{item.likes} likes</Text>
      <Text style={styles.caption}>
        <Text style={styles.username}>{item.username}</Text> {item.caption}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Post image and caption input */}
      <View style={styles.newPostContainer}>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        <TextInput
          style={styles.input}
          placeholder="Write a caption..."
          value={caption}
          onChangeText={setCaption}
        />
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.buttonText}>Take a Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePost}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  newPostContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1c72c4',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postContainer: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
  likes: {
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginTop: 5,
  },
  caption: {
    marginHorizontal: 10,
    marginTop: 5,
  },
});
