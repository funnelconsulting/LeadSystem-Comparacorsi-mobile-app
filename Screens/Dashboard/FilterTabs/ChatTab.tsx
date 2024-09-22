import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, Switch,SafeAreaView, ImageBackground } from 'react-native';

const messages = [
  { id: '1', type: 'received', message: 'Ciao! sono Sara del team di Comparacorsi, Come posso aiutarti?', time: '11:35 AM' },
  { id: '2', type: 'sent', message: 'Ciao! Sono interessato al corso Online di giurisprudenza. Vorrei fissare una call.', time: '11:35 AM' },
  { id: '3', type: 'received', message: 'Perfetto, indicami un orario ed una data, organizzerò il tuo appuntamento.', time: '11:36 AM' },
  { id: '4', type: 'sent', message: 'Venerdì 12 luglio alle ore 14:00', time: '11:36 AM' },
  { id: '5', type: 'received', message: 'Grazie! La tua call è stata fissata il giorno Venerdì 12 Luglio alle ore 14:00', time: '11:36 AM', highlighted: true },
  { id: '6', type: 'sent', message: 'Grazie ci vediamo venerdì.', time: '11:36 AM' },
  { id: '7', type: 'received', message: 'Perfetto! Se hai altre domande non esitare a scrivermi!', time: '11:36 AM' },
];

const Chat = () => {
  const [showFullChat, setShowFullChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [toggle,settoggle]=useState(false)

  const toggleChatVisibility = () => {
    setShowFullChat(!showFullChat);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      messages.push({
        id: `${messages.length + 1}`,
        type: 'sent',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setNewMessage('');
    }
  };

  const visibleMessages = showFullChat ? messages : messages.slice(-4);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('..//..//../assets/Vector.png')} style={styles.avatar} />
        <Text style={styles.headerText}>Alessandro Grandoni</Text>
        <Switch
                value={toggle}
                onValueChange={settoggle}
                thumbColor={toggle ? '#34C759' : '#f4f3f4'}
                trackColor={{ false: '#767577', true: '#34C759' }}
              />
      </View>
      <ImageBackground
        source={require('../../../assets/backchat.png')} 
        style={styles.chatContainer}
      >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {visibleMessages.map((msg) => (
          <View key={msg.id} style={[styles.messageContainer, msg.type === 'sent' ? styles.sentMessage : styles.receivedMessage]}>
            <Text style={styles.messageText}>{msg.message}</Text>
            <Text style={styles.timeText}>{msg.time}</Text>
          </View>
        ))}
        {showFullChat ? (
          <TouchableOpacity onPress={toggleChatVisibility} style={styles.arrowContainer}>
            <Image source={require('..//..//../assets/arrow-up.png')} style={styles.arrow} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.footer} onPress={toggleChatVisibility}>
            <Text style={styles.footerText}>Visualizza chat completa</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      </ImageBackground>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Scrivi un messaggio..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Image source={require('..//..//../assets/send-message.png')} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 25,
    marginRight: 10,
    objectFit: 'contain',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginRight:60,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    marginBottom: 0,
  },
  messageContainer: {
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e2ffc7',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'right',
    marginTop: 5,
  },
  footer: {
    padding: 5,
    backgroundColor: '#3471CC',
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: 'auto',
    paddingHorizontal: 20,
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 20,
    height: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    marginRight: 10,
    color:'#000'
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3471CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});

export default Chat;
