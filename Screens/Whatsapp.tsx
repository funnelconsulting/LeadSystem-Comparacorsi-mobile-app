import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, Alert, Platform, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Whatsapp = ({navigation}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [leadsChat, setLeadsChat] = useState([]);
  const [filteredChat, setFilteredChat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const showLogoutAlert = () => {
    Alert.alert(
      "Conferma Logout",
      "Sei sicuro di voler effettuare il logout?",
      [
        {
          text: "No",
          onPress: () => console.log("Annullato"),
          style: "cancel"
        },
        {
          text: "Sì", 
          onPress: async () => {
            console.log("Logout eseguito");
            await AsyncStorage.clear(); // Pulisce lo storage
            navigation.replace('Login'); // Reindirizza alla schermata di login
          } 
        }
      ]
    );
  };

  useEffect(() => {
    if (leadsChat.length > 0) {
      const filtered = leadsChat.filter(chat => {
        const fullName = `${chat.first_name} ${chat.last_name}`.toLowerCase();
        const phoneNumber = chat.numeroTelefono || '';
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || phoneNumber.includes(search);
      });
      setFilteredChat(filtered);
    }
  }, [searchTerm, leadsChat]);

  const fetchChats = async () => {
    const userData = await AsyncStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userFixId = user.role && user.role === "orientatore" ? user.utente : user._id;
    try {
      const response = await fetch(`https://chatbolt-comparacorsi-production.up.railway.app/api/get-all-chats?ecpId=${userFixId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      const { chats } = data;
      console.log(data);
      setLeadsChat(chats);
      setFilteredChat(chats);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchChats();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loaderText}>Caricamento chat...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topWhats}>
          <TouchableOpacity style={styles.goback} onPress={() => navigation.navigate("People")}>
            <Image source={require('../assets/indietro.png')} style={styles.topIcon} />
            <Text style={styles.indietroText}>Indietro</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showLogoutAlert()}>
            <Image source={require('../assets/Vector.png')} style={styles.topIcon} />
          </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}> 
      <View style={styles.searchContainer}>
        <Image source={require('../assets/search.png')} style={styles.searchIcon} />
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#999"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
        {/*<Image source={require('../assets/filter.png')} style={styles.filterIcon} />*/}
      </View>
      {leadsChat.length > 0 || filteredChat.length > 0 ? (
          <FlatList
            data={filteredChat}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => {
              if (!item || !item.messages || item.messages.length === 0) {
                return null; // o un componente di fallback
              }
              const lastMessage = item.messages[item.messages.length - 1];
              const messageDate = new Date(lastMessage.timestamp);
              const now = new Date();

              let timeString;
              if (messageDate.toDateString() === now.toDateString()) {
                timeString = messageDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
              } else {
                timeString = messageDate.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
              }

              const truncatedMessage = lastMessage.content.length > 30 
                ? lastMessage.content.substring(0, 30) + '...' 
                : lastMessage.content;
            
              return (
                <TouchableOpacity style={styles.messageContainer} onPress={() => navigation.navigate('Chat', { chatId: item._id, chat: item })}>
                  <View style={styles.profileIcon}>
                    <Image source={require('../assets/avatar2.png')} style={styles.icon} />
                  </View>
                  <View style={styles.messageDetails}>
                    <View style={styles.nameTimeRow}>
                      <Text style={styles.name}>{item.first_name + ' ' + item.last_name}</Text>
                      <Text style={styles.time}>{timeString}</Text>
                    </View>
                    <Text style={styles.message}>{truncatedMessage}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View style={styles.noChatsContainer}>
            <Text style={styles.noChatsText}>Nessuna chat disponibile</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#3471CC',
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatsText: {
    fontSize: 16,
    color: '#6F6F6F',
  },
  topWhats: {
    paddingTop: Platform.OS === 'ios' ? 38 : 10,
    height: 95,
    paddingBottom: 15,
    backgroundColor: '#F4F8FB',
    paddingHorizontal: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  goback: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bodyContainer: {
    paddingHorizontal: 6,
  },
  topIcon: {
    width: 23,
    height: 23,
    marginRight: 10,
    resizeMode: 'contain',
  },
  indietroText: {
    fontWeight: '600',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 5,
    borderColor: '#ADADAD',
    borderWidth: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#888',
  },
  filterIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    tintColor: '#888',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 20,
    color: '#000',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 15,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'contain',
  },
  messageDetails: {
    flex: 1,
  },
  nameTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  message: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600'
  },
  time: {
    fontSize: 12,
    color: '#3471CC',
    marginRight: 10,
    fontWeight: '600'
  },
});

export default Whatsapp;
