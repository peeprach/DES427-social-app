import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
      caption: 'Enjoying the bedsddautiful sunset 🌅',
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
    {
        id: '3',
        username: 'john_doe',
        image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
        caption: 'Enjoying the beautiful sunset 🌅',
        likes: 120,
        liked: false,
      },
  ]);

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
