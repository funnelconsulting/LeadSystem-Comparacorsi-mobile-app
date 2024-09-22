import * as React from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer ,useNavigation} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './Screens/Login';
import Dashboard from './Screens/Dashboard/Dashboard';
import Splash from './Screens/Splash';
import FilterDataTabs from './Screens/Dashboard/FilterTabs/FilterDataTabs';
import Chat from './Screens/Dashboard/FilterTabs/Chat';
import DateAnalyze from './Screens/Dashboard/FilterTabs/DateAnalyze';

const Stack = createStackNavigator();

export default function App({navigation}) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen 
          name="filterData"
          component={FilterDataTabs} 
          options={{
            headerShown: true, 
            headerTitle: "",
            
            headerRight: () => (
              <TouchableOpacity onPress={() => alert('Right button pressed!')}>
                <Image 
                  source={require('./assets/Vector.png')} 
                  style={{ width: 24, height: 24, marginRight: 15,objectFit:'contain' }} 
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="DateAnalyze" component={DateAnalyze} options={({ navigation }) => ({
            headerShown: true,
            headerTitle: "",
            
            headerRight: () => (
              <TouchableOpacity onPress={() => alert('Right button pressed!')}>
                <Image 
                  source={require('./assets/Vector.png')} 
                  style={{ width: 24, height: 24, marginRight: 15, objectFit: 'contain' }} 
                />
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image 
                  source={require('./assets/back.png')} 
                  style={{ width: 24, height: 24, marginLeft: 15 }} 
                />
              </TouchableOpacity>
            )
          })}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
