import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import LiveChat from './screens/LiveChat';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SignIn' >
        <Stack.Screen options={{ headerShown: false }} name="SignIn" component={SignInScreen} />
        <Stack.Screen options={{ headerShown: false }} name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen options={{ headerShown: false, gestureEnabled: false  }} name="Home" component={HomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Chat" component={ChatScreen} />
        <Stack.Screen options={{ headerShown: false }} name="LiveChat" component={LiveChat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
