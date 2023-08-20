import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { signOut, getAuth } from 'firebase/auth';
import { FIREBASE_APP } from '../services/firebase.config';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, getFirestore, query, getDocs, orderBy, doc, setDoc, onSnapshot} from 'firebase/firestore';

const HomeScreen = () => {
  const [chats, setChats] = useState([]);
  const auth = getAuth(FIREBASE_APP);
  const navigation = useNavigation();
  const db = getFirestore(FIREBASE_APP);

  const fetchChats = useCallback(async () => {
    const chatsCollection = collection(db, 'chats');
    const chatsQuery = query(chatsCollection, orderBy('id', 'desc'));
    const chatDocs = await getDocs(chatsQuery);
    const chatData = chatDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setChats(chatData);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      fetchChats();
      return () => {
        // Optional cleanup code
      };
    }, [fetchChats])
  );

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

  const handleNewChat = async () => {
    const newChatId = Date.now().toString(); // Generate a new conversation ID
    const chatDocRef = doc(db, 'chats', newChatId);
    await setDoc(chatDocRef, { id: newChatId, chat: [] }); // Add a new document with the generated conversation ID
    navigation.navigate('Chat', { chatId: newChatId }); // Navigate to the Chat screen with the generated conversation ID
  };
  
  

  const renderChatItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleChatPress(item.id)}>
      <View style={styles.chatItem}>
        <Text style={styles.chatTitle}>Chat {item.id}</Text>
      </View>
    </TouchableOpacity>
  );

 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Chats</Text>
        <TouchableOpacity onPress={handleNewChat} style={styles.newChatButton}>
          <Icon name="chat-plus-outline" size={25} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        initialNumToRender={100}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#442C60',
    padding: 10,
    paddingTop: 30,
    marginHorizontal: -10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  newChatButton: {
    backgroundColor: 'transparent',
  },
});

export default HomeScreen;
