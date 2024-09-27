// SplashScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';

const Splash = ({ navigation }) => {

  useEffect(() => {
    const checkAuth = async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        navigation.navigate('Dashboard');
      } else {
        navigation.navigate('Login');
      }
    };

    setTimeout(() => {
      checkAuth();
    }, 2000);
  }, [navigation]);

  return (
     <ImageBackground
     source={require('..//assets/Splash.png')}
     style={styles.container}>

      {/*<Image source={require('..//assets/logo.png')} style={styles.logo} />
      <Text style={styles.text1}>Lead<Text style={styles.text2}>System</Text></Text>*/}
   
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  text1: {
    fontSize: 30,
    fontWeight:'300',
    color: '#fff',
  },
  text2: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Splash;
