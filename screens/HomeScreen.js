import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { signOut, getAuth } from 'firebase/auth';
import { FIREBASE_APP } from '../services/firebase.config';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const chats = [
  { id: '1', title: 'Chat 1' },
  { id: '2', title: 'Chat 2' },
  { id: '3', title: 'Chat 3' },
  // Add more chats as needed
];

const HomeScreen = () => {
  const auth = getAuth(FIREBASE_APP);
  const navigation = useNavigation();

  const handleSignOut = async () => {
    // Show confirmation alert
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Sign out user
              await signOut(auth);

              // Navigate to SignIn screen
              navigation.navigate('SignIn');
            } catch (error) {
              console.log(error);
              // Handle sign-out error if necessary
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleChatPress = (chatId) => {
    // Navigate to Chat screen
    navigation.navigate('Chat', { chatId });
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleChatPress(item.id)}>
      <View style={styles.chatItem}>
        <Text style={styles.chatTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <Text>Home Screen</Text>
      {/* List of chats */}
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity onPress={handleSignOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = {
  chatItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  chatTitle: {
    fontSize: 16,
  },
};

export default HomeScreen;
