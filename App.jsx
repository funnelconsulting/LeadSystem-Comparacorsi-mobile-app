import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './Screens/Splash';
import Login from './Screens/Login';
import Dashboard from './Screens/Dashboard/Dashboard';
import People from './Screens/Dashboard/People';
import Chat from './Screens/Dashboard/FilterTabs/Chat';
import FilterDataTabs from './Screens/Dashboard/FilterTabs/FilterDataTabs';
import DateAnalyze from './Screens/Dashboard/FilterTabs/DateAnalyze';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading time (3 seconds)
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false}}>
          {isLoading ? (
            // Show Splash Screen while loading
            <Stack.Screen name="Splash" component={Splash} />
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen name="Chat" component={Chat} screenOptions={{ headerShown: false}} />
              <Stack.Screen name="People" component={People} screenOptions={{ headerShown: false}}/>
              <Stack.Screen name="filterData" component={FilterDataTabs}
              options={{headerShown:true, headerTitle:'Back'}}
              />
              <Stack.Screen name='DateAnalyze' component={DateAnalyze} 
                 options={{headerShown:true, headerTitle:'Back'}}/>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
