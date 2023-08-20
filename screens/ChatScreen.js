import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { setDoc, doc, onSnapshot} from 'firebase/firestore';
import { db } from '../services/firebase.config';
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { DotIndicator } from "react-native-indicators";
import * as Speech from "expo-speech";

import axios from "axios";


const apiUrl = "https://api.openai.com/v1/engines/text-davinci-003/completions";

const ChatScreen = () => {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playbackMessage, setPlaybackMessage] = useState("");

  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [response]);

  useEffect(() => {
    const chatDocRef = doc(db, "chats", conversationId);
    const unsubscribe = onSnapshot(chatDocRef, (doc) => {
      if (doc.exists) {
        const chatData = doc.data();
        setResponse(chatData.chat);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const conversationId = "your_unique_conversation_id"; // Replace with your unique identifier

  const saveChatToFirestore = async (conversation) => {
    try {
      if (!db) {
        console.error("Firestore instance not initialized");
        return;
      }
      const chatDocRef = doc(db, "chats", conversationId);
      await setDoc(chatDocRef, { chat: conversation }, { merge: true });
    } catch (error) {
      console.error("Error saving chat to Firestore:", error);
    }
  };
  
  const handleSend = async () => {
    if (inputText.trim() === "") {
      return;
    }
  
    setTimeout(() => {
      setLoading(!loading); // Show loading indicator after the delay
    }, 100); // Adjust the delay time as needed
  
    const newMessage = {
      id: String(response.length),
      text: inputText,
      isResponse: false,
      timestamp: new Date().getTime(),
    };
  
    const updatedResponse = [...response, newMessage];
    setResponse(updatedResponse);
    setInputText("");
  
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
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
  
      const responseText = apiResponse.data.choices[0].text.trim();
      const responseMessage = {
        id: `response-${response.length}`,
        text: responseText,
        isResponse: true,
        timestamp: new Date().getTime(),
      };
  
      const updatedConversation = [...updatedResponse, responseMessage];
      setResponse(updatedConversation);
      setPlaybackMessage(`response-${response.length}`);
      await saveChatToFirestore(updatedConversation);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Hide loading indicator, regardless of success or error
    }
  };
  
  

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  };

  //EXPO VOICE
  const handlePlay = (messageId, text) => {
    if (playing && messageId === playbackMessage) {
      Speech.stop();
      setPlaying(false);
      setPlaybackMessage("");
    } else {
      Speech.speak(text, {
        onStart: () => {
          setPlaying(true);
          setPlaybackMessage(messageId);
        },
        onDone: () => {
          setPlaying(false);
          setPlaybackMessage("");
        },
        onStopped: () => {
          setPlaying(false);
          setPlaybackMessage("");
        },
      });
    }
  };

  console.log(response, 'response', inputText, 'inputText')

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={35} color="#FFFFFF" />
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
            {item.isResponse ? (
              <View>
                <Text style={styles.messageText}>{item.text}</Text>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => handlePlay(item.id, item.text)}
                >
                  {playing && item.id === playbackMessage ? (
                    <Icon name="stop" size={25} color="#FFFFFF" />
                  ) : (
                    <Icon
                      name="play-circle-outline"
                      size={25}
                      color="#FFFFFF"
                    />
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.messageText}>{item.text}</Text>
            )}
            <View style={styles.timestampContainer}>
              <Text style={styles.timestamp}>
                {formatTimestamp(item.timestamp)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {loading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIndicatorContainer}>
            <DotIndicator color="#FFFFFF" size={5} />
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Icon
            name="send"
            size={55}
            color="#FFFFFF"
            style={styles.sendButtonText}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C2647",
  },
  contentContainer: {
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#442C60",
    paddingTop: 40, // Adjust the paddingTop value for iOS and Android
    paddingBottom: 10,
    paddingRight: 30,
    paddingLeft: 10,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 150,
  },
  messageContainer: {
    backgroundColor: "#574B7F",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: "flex-end",
    maxWidth: "75%",
  },
  responseContainer: {
    backgroundColor: "#191f45",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: "flex-start",
    maxWidth: "75%",
  },
  timestamp: {
    fontSize: 12,
    color: "#BBBBBB",
    marginTop: 5,
  },
  timestampContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  messageText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#5D507E",
    paddingBottom: 25,
    paddingTop: 15,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#574B7F",
    borderRadius: 20,
    padding: 8,
    paddingTop: 8,
    marginRight: 10,
    minHeight: 35, // Increase the height here
    alignSelf: "center",
    color: "#FFFFFF",
  },
  sendButton: {
    backgroundColor: "#8C77AA",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: 10,
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: -45,
  },
  loadingIndicatorContainer: {
    backgroundColor: "#574B7F",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    height: 35,
  },
  responseTouchable: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#191f45",
  },
  playButton: {
    top: 20,
    width: 50,
    height: 50,
    justifyContent: "flex-end",
  },
});

export default ChatScreen;
