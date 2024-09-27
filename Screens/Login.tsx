import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Image, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import network from '@/constants/Network';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); // Stato di caricamento

  const handleLogin = async () => {
    setLoading(true); // Inizia il caricamento
    const lowerCaseEmail = email.toLowerCase(); // Converti l'email in minuscolo
    try {
      const response = await axios.post(network.serverip+'/login', { email: lowerCaseEmail, password });
      console.log(response.data)

      if (response.data && response.data.token && response.data.user) {
        const { token, user } = response.data;
  
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
  
        navigation.navigate('Dashboard');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Errore di login', 'Email o password non corretti');
    } finally {
      setLoading(false); // Termina il caricamento
    }
  };


  return (
    <View style={styles.container}>
      <Image
        source={require('..//assets/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Accedi al tuo account</Text>
      <Text style={styles.subtitle}>Effettua il Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#AAB0B7"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#AAB0B7"
      />
      <View style={styles.rememberMeContainer}>
        <Switch
          value={rememberMe}
          onValueChange={setRememberMe}
          thumbColor={rememberMe ? '#34C759' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#34C759' }}
        />
        <Text style={styles.rememberMeText}>Memorizza i dati di accesso</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Accedi</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Hai dimenticato la password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#AAB0B7',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#000',
    backgroundColor:'#E8F0FE',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 10,
  },
  button: {
    width: '80%',
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#000',
    textDecorationLine: 'underline',
  },
});

export default Login;
