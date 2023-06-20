import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { FIREBASE_AUTH } from '../services/firebase.config'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

const SignInScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = FIREBASE_AUTH

  const navigation = useNavigation()

  const handleSignUp = async () => {
    setLoading(true)
    try{ 
      const response = await createUserWithEmailAndPassword(auth, email, password)
      console.log(response)
      alert('User account created & signed in!')
    } catch (error) {
      console.log(error)
      alert(error.message + ' Please try again.')
    } finally {
      setLoading(false)
    }
  }

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


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
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
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2647',
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
  },
  buttonOutline: {
    backgroundColor: '#574B7F',
    marginTop: 5,
    borderColor: '#8C77AA',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#8C77AA',
    fontWeight: '700',
    fontSize: 16,
  },
})

export default SignInScreen;
