import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Chats</Text>
      {/* List of chats */}
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2647',
    padding: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    backgroundColor: '#442C60',
    padding: 10,
    paddingTop: 30,
    marginHorizontal: -10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#574B7F',
  },
  chatTitle: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  signOutButton: {
    backgroundColor: '#8C77AA',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
