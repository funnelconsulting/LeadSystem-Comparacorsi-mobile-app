// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';

const Splash = ({ navigation }) => {

   useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login'); 
    }, 3000);
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
