import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { ref, get, child, update } from 'firebase/database';
import AntDesign from '@expo/vector-icons/AntDesign';

// กำหนดอินเทอร์เฟซ User
interface User {
  id: string;
  username: string;
  profileImage?: string;
  followers?: number;
  following?: number;
  posts?: number;
  postsImages?: string[];
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  const [users, setUsers] = useState<User[]>([]); // List of users matching the query
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Selected user's profile data
  const [isFollowing, setIsFollowing] = useState<boolean>(false); // State to track following status

  // Search users by username
  const handleSearch = async () => {
    try {
      const dbRef = ref(FIREBASE_DB);
      const snapshot = await get(child(dbRef, 'users/'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const filteredUsers: User[] = Object.keys(data)
          .filter((userId) =>
            data[userId].username.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((userId) => ({
            id: userId,
            ...data[userId],
          }));
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      handleSearch();
    } else {
      setUsers([]);
    }
  }, [searchQuery]);

  // Handle follow/unfollow action
  const handleFollowUnfollow = async () => {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!selectedUser || !currentUser) return;

    const userRef = ref(FIREBASE_DB, `users/${selectedUser.id}`);
    const currentUserRef = ref(FIREBASE_DB, `users/${currentUser.uid}`);

    try {
      if (isFollowing) {
        // Unfollow
        const updatedFollowers = (selectedUser.followers || 0) - 1;
        const updatedFollowing = (currentUser.following || 0) - 1;

        // Update in Firebase
        await update(userRef, { followers: updatedFollowers });
        await update(currentUserRef, { following: updatedFollowing });

        // Update local state
        setSelectedUser((prev) => prev ? { ...prev, followers: updatedFollowers } : null);
        setIsFollowing(false);
      } else {
        // Follow
        const updatedFollowers = (selectedUser.followers || 0) + 1;
        const updatedFollowing = (currentUser.following || 0) + 1;

        // Update in Firebase
        await update(userRef, { followers: updatedFollowers });
        await update(currentUserRef, { following: updatedFollowing });

        // Update local state
        setSelectedUser((prev) => prev ? { ...prev, followers: updatedFollowers } : null);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error updating follow/unfollow:', error);
    }
  };

  // Rest of the component remains unchanged

  // Render selected user's profile
  const renderSelectedUserProfile = () => {
    if (!selectedUser) return null;

    return (
      <View style={styles.profileContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedUser(null)}>
            <AntDesign name="arrowleft" size={20} color="black" />
            <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: selectedUser.profileImage || 'https://example.com/default-profile.jpg' }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.username}>{selectedUser.username}</Text>
            <Text style={styles.handle}>@{selectedUser.username}</Text>
            <View style={styles.stats}>
              <Text>{selectedUser.following || 0} Following</Text>
              <Text>{selectedUser.followers || 0} Followers</Text>
              <Text>{selectedUser.posts || 0} Posts</Text>
            </View>
          </View>
        </View>

        {/* Follow/Unfollow Button */}
        <TouchableOpacity style={styles.followButton} onPress={handleFollowUnfollow}>
          <Text style={styles.followButtonText}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Text>
        </TouchableOpacity>

        {/* User Posts */}
        {selectedUser.postsImages && selectedUser.postsImages.length > 0 ? (
          <FlatList
            data={selectedUser.postsImages}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.postImage} />
            )}
            contentContainerStyle={styles.postsGrid}
          />
        ) : (
          <Text style={styles.noPostsText}>No posts available</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <AntDesign name="search1" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          placeholder="Search for a username"
        />
      </View>

      {/* Search Results or Selected User Profile */}
      {!selectedUser ? (
        <View>
          {users.length > 0 ? (
            users.map((user, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedUser(user)}
                style={styles.userItem}
              >
                <Text style={styles.userName}>{user.username}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noUsersText}>No users found</Text>
          )}
        </View>
      ) : (
        renderSelectedUserProfile()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginTop: 40,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  userItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileContainer: {
    flex: 1,
    marginTop: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  handle: {
    fontSize: 14,
    color: 'gray',
  },
  stats: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  followButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  postsGrid: {
    padding: 10,
  },
  postImage: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    borderRadius: 8,
  },
  noPostsText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  noUsersText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default Search;
