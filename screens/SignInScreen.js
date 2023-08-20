import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FIREBASE_AUTH } from '../services/firebase.config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/AntDesign';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const navigation = useNavigation();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user, 'user logged in');
      setLoading(false);

      // Navigate to the Home screen
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
      setLoading(false);

      // Display error alert
      alert('Invalid email or password. Please try again.');
    }
  };

  const handleRegister = () => {
    navigation.navigate('CreateAccount');
  };

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior="padding"
    >
      <Icon margin={50} name="aliwangwang-o1" size={55} color="#FFFFFF" />

      <View style={styles.container}>


        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleSignIn}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRegister}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2647',
  },
  container: {
width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: '#574B7F',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    height: 50,
    color: '#FFFFFF',
  },
  buttonContainer: {
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#8C77AA',
    width: '45%',
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#574B7F',
    borderWidth: 2,

  },
  buttonOutline: {
    backgroundColor: '#574B7F',

    borderColor: '#8C77AA',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default SignInScreen;
