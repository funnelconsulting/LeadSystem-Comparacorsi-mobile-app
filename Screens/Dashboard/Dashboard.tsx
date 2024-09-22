import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import People from './People';
import Calendar from './Calendar';
import WhatsApp from '../../Screens/Whatsapp';
import FastImage from 'react-native-fast-image'

const Tab = createBottomTabNavigator();

const Dashboard = () => {
  return (

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconSource;

            switch (route.name) {
              case 'People':
                iconSource = require('..//..//assets/people.png');
                break;
              case 'Calendar':
                iconSource = require('..//..//assets/calendar2.png');
                break;
              case 'WhatsApp':
                iconSource = require('..//..//assets/whatsapp.png');
                break;
              default:
                iconSource = null;
            }

            return iconSource ? (
              <Image
                source={iconSource}
                style={[styles.icon, { tintColor: focused ? '#3471cc' : '#000' }]}
              />
            ) : null;
          },
          tabBarShowLabel: false, // Hide labels
          tabBarStyle: { backgroundColor: '#F4F8FB', borderTopColor: '#e5e7eb' }, // Customize the tab bar
          tabBarActiveTintColor: '#3471cc', // Set active tab color
          tabBarInactiveTintColor: '#8e8e8e', // Set inactive tab color
          headerShown: false, // Hide the header
        })}
      >
        <Tab.Screen
          name="People"
          component={People}
          options={{ headerShown: false, headerTitle: 'People' }}
        />
        <Tab.Screen
          name="Calendar"
          component={Calendar}
          options={{
            headerShown: false,
            headerTitle: "Calendar",
            headerRight: () => (
              <TouchableOpacity onPress={() => alert('Right button pressed!')}>
                <FastImage
                  source={{
                    uri: require('..//..//assets/Vector.png'),
                    priority: FastImage.priority.high,
                  }}
                  style={{ width: 24, height: 24, marginRight: 15, objectFit: 'contain' }}
                />
              </TouchableOpacity>
            ),
            
          }}
        />
        <Tab.Screen
          name="WhatsApp"
          component={WhatsApp}
          options={{
            headerShown: false,
            headerTitle: "Torna a Dashboard",
            headerRight: () => (
              <TouchableOpacity onPress={() => alert('Right button pressed!')}> 
                <FastImage
                  source={{
                    uri: require('../../assets/Vector.png'),
                    priority: FastImage.priority.high,
                  }}
                  style={{ width: 24, height: 24, marginRight: 15, objectFit: 'contain' }}
                />
              </TouchableOpacity>
            ),
           
          }}
        />
      </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default Dashboard;
