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
import { setDoc, doc, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../services/firebase.config';
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { DotIndicator } from "react-native-indicators";
import { Audio } from 'expo-av';
import { SpeechToText } from '../services/SpeechToText'
import { API_KEY } from "@env";
const apiKey = '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';

import axios from "axios";

const apiUrl = "https://api.openai.com/v1/engines/text-davinci-003/completions";

const ChatScreen = ({ route }) => {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playbackMessage, setPlaybackMessage] = useState("");
  const [audioClips, setAudioClips] = useState([])
  const [sound, setSound] = useState(null);
  const { state, startRecognizing, stopRecognizing, destroyRecognizer } = useVoiceRecognition();

  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const colRef = collection(db, 'chats')

  const conversationId = route.params.chatId; // Use the chatId passed as a parameter

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [response]);

  //Use effect to retrieve conversation
  useEffect(() => {
    const chatDocRef = doc(db, "chats", conversationId);
    const unsubscribe = onSnapshot(chatDocRef, (doc) => {
      if (doc.exists) {
        const chatData = doc.data();
        if (chatData && chatData.chat) {
          setResponse(chatData.chat);
        } else {
          console.error("Document exists but does not have the expected structure:", chatData);
          setResponse([]); // Initialize the chat with an empty array
        }
      } else {
        console.error("Document does not exist:", conversationId);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [conversationId]);


  useEffect(() => {
    console.log('Audio Clips array =>', audioClips);
  }, [audioClips]);

  //Use effect to retrieve audioUrl
  useEffect(() => {
    // Reference to the chat document in Firestore
    const chatDocRef = doc(db, "chats", conversationId);

    // Set up a listener to the chat document
    const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
      if (docSnapshot.exists) {
        const chatData = docSnapshot.data();
        if (chatData && chatData.chat) {
          // Extract audio URLs from the chat messages
          const fetchedAudioClips = chatData.chat
            .filter(message => message.isResponse && message.audioUrl)
            .map(message => message.audioUrl);

          // Update the audioClips state
          setAudioClips(fetchedAudioClips);
          console.log('fetchd audioClips from Firebase', audioClips)
        } else {
          console.error("Document exists but does not have the expected structure:", chatData);
        }
      } else {
        console.error("Document does not exist:", conversationId);
      }
    });

    // Clean up the listener when the component is unmounted or when conversationId changes
    return () => {
      unsubscribe();
    };
  }, [conversationId, db]);


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
      setLoading(!loading);
    }, 100);

    const newMessage = {
      id: String(response.length),
      text: inputText,
      isResponse: false,
      timestamp: new Date().getTime(),
    };

    const updatedResponse = [...response, newMessage];
    setResponse(updatedResponse);
    setInputText("");

    let responseText = null;

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

      responseText = apiResponse.data.choices[0].text.trim();

      const options = {
        method: 'POST',
        url: 'https://play.ht/api/v2/tts',
        headers: {
          accept: 'audio/mpeg',
          'content-type': 'application/json',
          AUTHORIZATION: 'b3b6ca0c11f248399fd8b77fea2af6c4',
          'X-USER-ID': 'i4b7dpjFnReSXXkflLAoNeVMbLn2'
        },
        data: {
          text: responseText,
          voice: 'daisy',
          quality: 'medium',
          output_format: 'mp3',
          speed: 1,
          sample_rate: 24000
        }
      };

      const playHtResponse = await axios.request(options);
      const lastLine = playHtResponse.data
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .pop();

      const jsonResult = lastLine.split("data: ")[1];
      const result = JSON.parse(jsonResult);
      const audioUrl = result.url;



      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isPlaying) {
          setPlaying(true);
          console.log("Playback status update: playing");
        } else {
          setPlaying(false);
          console.log("Playback status update: not playing");
        }
      });

      await newSound.playAsync();
      console.log("Is playing after playAsync:", playing);

      // setPlaying(true);
      setPlaybackMessage(audioUrl);


      const responseMessage = {
        id: `response-${response.length}`,
        text: responseText,
        isResponse: true,
        timestamp: new Date().getTime(),
        audioUrl: audioUrl,
      };

      const updatedConversation = [...updatedResponse, responseMessage];
      setResponse(updatedConversation);
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

  //PLAY AUDIO
  const handlePlay = async (audioUrl) => {
    if (playing && playbackMessage === audioUrl) {
      // If the audio is currently playing and the user presses the stop button
      if (sound) {
        console.log(sound, 'line 242')
        await sound.pauseAsync();
        setPlaying(false);
      }
    } else {
      // If the audio is not playing or a different audio is playing
      if (sound && playbackMessage === audioUrl) {
        // If it's the same audio clip, just resume playing
        await sound.playAsync();
        setPlaying(true);
      } else {
        // If it's a different audio clip, stop the current sound and create a new instance
        if (sound) {
          await sound.stopAsync();
          setSound(null);
        }

        const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
        setSound(newSound);
        await newSound.playAsync();
        setPlaying(true);
        setPlaybackMessage(audioUrl);

        // Add a listener to reset states when the audio finishes playing
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setPlaying(false);
            setSound(null);
          }
        });
      }
    }
  };





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

                  onPress={() => handlePlay(item.audioUrl)}
                >

                  {playing && item.audioUrl === playbackMessage ? (
                    console.log("Rendering stop icon"),
                    <Icon name="stop" size={25} color="#FFFFFF" />
                  ) : (
                    console.log("Rendering play icon"),
                    <Icon name="play-circle-outline" size={25} color="#FFFFFF" />
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
            name="stop"
            size={155}
            color="#FFFFFF"
            style={styles.sendButtonText}
          />
        </TouchableOpacity>
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
