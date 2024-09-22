import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const messages = [
  {
    name: 'Andrea Caruso',
    message: 'Mi dispiace per inconveniente, pot.',
    time: '12:34',
    date: '12/03/2004',
  },
  {
    name: 'Andrea Caruso',
    message: 'Mi dispiace per inconveniente, pot.',
    time: '10:34',
    date: '11/03/2004',
  },
  {
    name: 'Andrea Caruso',
    message: 'Mi dispiace per inconveniente, pot.',
    time: '12:34',
    date: '09/02/2023',
  },
];

const App = ({navigation}) => {
  const [searchTerm, setSearchTerm] = useState('');
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
        { text: "Sì", onPress: () => console.log("Logout eseguito") }
      ]
    );
  };

  const filteredMessages = messages.filter((message) =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
        <Image source={require('../assets/filter.png')} style={styles.filterIcon} />
      </View>
      <FlatList
        data={filteredMessages}
        keyExtractor={(item, index) => item.name + item.time + index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.messageContainer} onPress={() => navigation.navigate('Chat')}>
            <View style={styles.profileIcon}>
              <Image source={require('../assets/avatar2.png')} style={styles.icon} />
            </View>
            <View style={styles.messageDetails}>
              <View style={styles.nameTimeRow}>
                
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
  topWhats: {
    paddingTop: 38,
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

export default App;
