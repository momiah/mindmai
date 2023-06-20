import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { useNavigation } from '@react-navigation/native';

import axios from 'axios';
import { API_KEY } from '@env';
const apiKey = API_KEY;

const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';


const ChatScreen = () => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState([]);
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [response]);

  const handleSend = async () => {
    if (inputText.trim() === '') {
      return;
    }

    const newResponse = {
      id: String(response.length),
      text: inputText,
      isResponse: false,
    };

    const updatedResponse = [...response, newResponse];
    setResponse(updatedResponse);
    setInputText('');

    try {
      const apiResponse = await axios.post(
        apiUrl,
        {
          prompt: inputText,
          temperature: 0.6,
          max_tokens: 2048,
        },
        {        
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      const responseText = apiResponse.data.choices[0].text;
      const responseMessage = {
        id: `response-${response.length}`,
        text: responseText,
        isResponse: true,
      };
      setResponse((prevresponse) => [...prevresponse, responseMessage]);
      console.log(responseText, 'looool');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={35} color="#FFFFFF" style={styles.backButtonIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>Chat</Text>
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.contentContainer}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {response.map((item) => (
          <View
            key={item.id}
            style={
              item.isResponse
                ? styles.responseContainer
                : styles.messageContainer
            }
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2647',
  },
  contentContainer: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#442C60',
    paddingTop: 40, // Adjust the paddingTop value for iOS and Android
    paddingBottom: 10,
    paddingRight: 30,
    paddingLeft: 10,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  marginRight: 150,
  },
  
  messageContainer: {
    backgroundColor: '#574B7F',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'flex-end',
    maxWidth: '75%',
  },
  responseContainer: {
    backgroundColor: '#9386AC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'flex-start',
    maxWidth: '75%',
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#5D507E',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#574B7F',
    borderRadius: 20,
    padding: 8,
    paddingTop: 8,
    marginRight: 10,
    minHeight: 35, // Increase the height here
    alignSelf: 'center',
    color: '#FFFFFF',
  },
  sendButton: {
    backgroundColor: '#8C77AA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default ChatScreen;
