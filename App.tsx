import * as React from 'react';
import { View, Text, Button, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { NavigationContainer ,useNavigation} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './NotificationHandler';
import 'react-native-url-polyfill/auto';
import Login from './Screens/Login';
import Dashboard from './Screens/Dashboard/Dashboard';
import Splash from './Screens/Splash';
import FilterDataTabs from './Screens/Dashboard/FilterTabs/FilterDataTabs';
import Chat from './Screens/Dashboard/FilterTabs/Chat';
import DateAnalyze from './Screens/Dashboard/FilterTabs/DateAnalyze';
import VectorImage from './/assets//Vector.png';
import BackImage from './/assets//back.png';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import network from './constants/Network';
import * as Font from 'expo-font';
import { LeadProvider } from './context/LeadContext';
import * as Application from 'expo-application';

const Stack = createStackNavigator();

export default function App({navigation}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [fontLoaded, setFontLoaded] = React.useState(false);
  const navigationRef = React.useRef();

  React.useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Italic': require('./assets/fonts/Poppins-Italic.ttf'),
        'Poppins-ExtraBold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
        'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
        'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Thin': require('./assets/fonts/Poppins-Thin.ttf'),
        'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
      });
      setFontLoaded(true);
    }

    loadFont();
  }, []);

  React.useEffect(() => {
    const setupNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
        await AsyncStorage.setItem('pushToken', token);
        //await AsyncStorage.setItem('pushTokenServer', tokenServer);
        try {
          await axios.post(network.serverip + '/save-push-token-expo', { token });
          console.log('Token salvato inizialmente con successo');
        } catch (error) {
          console.error('Errore nell\'invio del token al server:', error);
        }
      } else {
        console.log('Non è stato possibile ottenere il token per le notifiche push');
      }
    };

    setupNotifications();

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('Dati ricevuti dalla notifica:', data);

      //Indirizzamento alla scheda lead dalla notifica, ma ho bisogno di passare tutti gli altri parametri quindi per ora no
      /*if (data && data.leadId) {
        navigationRef.current?.navigate('filterData', {
          item: {
            _id: data.leadId,
            nome: data.nome,
            cognome: data.cognome,
          },
        });
      }*/
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { fontFamily: 'Poppins-Regular' };

  return (
    <LeadProvider>
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
                    source={VectorImage} 
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
                    source={VectorImage} 
                    style={{ width: 24, height: 24, marginRight: 15, objectFit: 'contain' }} 
                  />
                </TouchableOpacity>
              ),
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image 
                    source={BackImage}
                    style={{ width: 24, height: 24, marginLeft: 15 }} 
                  />
                </TouchableOpacity>
              )
            })}/>
        </Stack.Navigator>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
    </LeadProvider>
  );
}
