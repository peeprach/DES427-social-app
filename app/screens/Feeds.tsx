import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ref, push, onValue, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_DB } from '../../FirebaseConfig';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { TouchableWithoutFeedback } from 'react-native';

type Post = {
  id: string;
  username: string;
  image: string;
  caption: string;
  likes: number;
  liked: boolean;
};

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [showHeart, setShowHeart] = useState<{ [key: string]: boolean }>({});
  const [username, setUsername] = useState<string>('Anonymous');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.displayName) {
        setUsername(user.displayName);
      } else {
        setUsername('Anonymous');
      }
    });

    const postsRef = ref(FIREBASE_DB, 'posts');
    const unsubscribePosts = onValue(postsRef, (snapshot) => {
      const postsData: Post[] = [];
      snapshot.forEach((childSnapshot) => {
        const post = { id: childSnapshot.key, ...childSnapshot.val() } as Post;
        postsData.unshift(post); // Reverse chronological order
      });
      setPosts(postsData);
    });

    return () => {
      unsubscribe();
      unsubscribePosts();
    };
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permission to take a picture.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!image || !caption) {
      Alert.alert('Error', 'Please provide both an image and a caption.');
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      username: currentUser?.displayName || 'Anonymous',
      image,
      caption,
      likes: 0,
      liked: false,
    };

    try {
      const postsRef = ref(FIREBASE_DB, 'posts/');
      await push(postsRef, newPost);

      setPosts([newPost, ...posts]);
      setImage(null);
      setCaption('');
    } catch (error) {
      console.log('Error posting:', error);
      Alert.alert('Error', 'Failed to post. Please try again.');
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const postRef = ref(FIREBASE_DB, `posts/${postId}`);
      await remove(postRef);  // ลบโพสต์จาก Firebase

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));  // ลบโพสต์จาก state
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post.');
    }
  };

  const toggleLikeWithDoubleTap = (id: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
    setShowHeart((prev) => ({ ...prev, [id]: true }));

    setTimeout(() => {
      setShowHeart((prev) => ({ ...prev, [id]: false }));
    }, 1000);
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <TouchableWithoutFeedback onPress={() => toggleLikeWithDoubleTap(item.id)}>
        <View>
          <Image source={{ uri: item.image }} style={styles.image} />
          {showHeart[item.id] && (
            <View style={styles.heartContainer}>
              <MaterialIcons name="favorite" size={100} color="red" />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => toggleLikeWithDoubleTap(item.id)}>
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
        <TouchableOpacity onPress={() => deletePost(item.id)}>
          <MaterialIcons name="delete" size={24} color="black" />
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
    marginTop: 50,
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
    justifyContent: 'space-around',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'space-around',
  },
  postContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft:10,
    marginBottom:10,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  likes: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  caption: {
    marginLeft: 10,
  },
  heartContainer: {
    position: 'absolute',
    top: '30%',
    left: '40%',
    zIndex: 1,
  },
});

