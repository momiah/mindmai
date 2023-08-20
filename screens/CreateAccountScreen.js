import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateAccountScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigation = useNavigation();

    const handleSignUp = async () => {
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, {
                displayName: name,
            });
            Alert.alert('Account Created!')
            // Navigate to the next screen or show a success message
        } catch (error) {
            console.error("Error creating user:", error);
            Alert.alert(error)
            // Handle the error, e.g., show an error message to the user
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView  style={styles.headingContainer} >
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>Create Account</Text>
            </SafeAreaView>
            

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
            </View>

            <TouchableOpacity onPress={handleSignUp} style={styles.signUpButton}>
                <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2C2647',
       
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        flexDirection: 'row',
        color: '#FFFFFF',
    },
    headingContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: '#442C60',
        padding: 10,
        paddingTop: 30,
        paddingHorizontal: 15,
        justifyContent: 'space-between'
    },
    input: {
        backgroundColor: '#574B7F',
        color: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    inputContainer: {
        paddingHorizontal: 15
    },
    signUpButton: {
        backgroundColor: '#8C77AA',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        marginTop: 15,
        marginHorizontal: 15
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    label: {
        color: '#FFFFFF',
        fontSize: 14,
        marginBottom: 5,
    },
    backButton: {
        backgroundColor: '#8C77AA',
        borderRadius: 20,
        padding: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default CreateAccountScreen;
