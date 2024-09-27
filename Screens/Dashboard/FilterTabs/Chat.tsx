import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, Switch,SafeAreaView, ActivityIndicator } from 'react-native';
import { ImageBackground } from 'react-native';

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
  const [toggle,setToggle]=useState(false)
  const navigation = useNavigation()
  const route = useRoute()
  const { chat, chatId} = route.params;
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = React.useRef();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (chat && chat.messages) {
      const formattedMessages = chat.messages.map((msg, index) => {
        const messageDate = new Date(msg.timestamp);
        const today = new Date();
        let timeString;
  
        if (
          messageDate.getDate() === today.getDate() &&
          messageDate.getMonth() === today.getMonth() &&
          messageDate.getFullYear() === today.getFullYear()
        ) {
          // Se il messaggio è di oggi, mostra solo l'ora
          timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
          // Altrimenti, mostra la data completa
          timeString = messageDate.toLocaleString([], {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
  
        return {
          id: index.toString(),
          type: msg.sender === 'user' ? 'user' : 'bot',
          message: msg.content,
          time: timeString,
        };
      });
      setMessages(formattedMessages);
      setIsLoading(false);
    }

      setTimeout(() => {
        scrollViewRef?.current?.scrollToEnd({ animated: false });
      }, 100);
  }, [chat]);

  const sendWhatsappMessage = async () => {
    if (newMessage.trim() === '') return;

    setIsSending(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_CHATBOT}/sendWhatsappMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numeroTelefono: chat.phone_number, textMessage: newMessage, leadId: chat?._id }),
      });

      const data = await response.json();

      if (data.success) {
        const newMsg = {
          sender: 'bot',
          content: newMessage,
          timestamp: new Date().toISOString(),
          manual: true
        };

        setMessages(prevMessages => [...prevMessages, newMsg]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Errore durante l\'invio del messaggio:', error);
    }
    setIsSending(false);
  };

  const handleSwitchChange = async (checked) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`https://chatbolt-comparacorsi-production.up.railway.app/api/updateChatStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numeroTelefono: chat.numeroTelefono, newStatus: !chat.active, leadId: chat?._id }),
      });

      const data = await response.json();
      console.log(data);

      // Aggiorna lo stato locale
      chat.active = !chat.active;
    } catch (error) {
      console.log(error);
    }
    setIsUpdating(false);
  };

  const isInputDisabled = useMemo(() => {
    if (!chat || !chat.messages || chat.messages.length === 0) {
      return false;
    }

    const userMessages = chat.messages.filter(message => message.sender === 'user');

    if (userMessages.length === 0) {
      return false;
    }

    const lastUserMessage = userMessages[userMessages.length - 1];
    const timestamp = moment(lastUserMessage.timestamp);
    const now = moment();
    const diffInHours = now.diff(timestamp, 'hours');
    
    return diffInHours < 24;
  }, [chat]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.goback} onPress={() => navigation.goBack()}>
          <Image source={require('../../../assets/indietro.png')} style={styles.topIcon} />
        </TouchableOpacity>
        <Image source={require('..//..//../assets/Vector.png')} style={styles.avatar} />
        <Text style={styles.headerText}>{chat.first_name} {chat.last_name}</Text>
        <Switch
          value={chat.active}
          onValueChange={handleSwitchChange}
          disabled={isUpdating}
          thumbColor={toggle ? '#34C759' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#34C759' }}
        />
      </View>
      <ImageBackground 
        source={require('../../../assets/backchat.png')} 
        style={styles.chatContainer}
      >
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <ScrollView ref={scrollViewRef} contentContainerStyle={styles.contentContainer}>
            {messages.map((msg) => (
              <View key={msg.id} style={[styles.messageContainer, msg.type === 'bot' ? styles.sentMessage : styles.receivedMessage]}>
                <Text style={styles.messageText}>{msg.message}</Text>
                <Text style={styles.timeText}>{msg.time}</Text>
              </View>
            ))}
        </ScrollView>
        )}
      </ImageBackground>
      <View style={styles.inputContainer}>
        {isInputDisabled ? (
          <TextInput
            style={styles.input}
            placeholder="Digita un messaggio..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
        ) : (
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            placeholder="Non puoi inviare un messaggio"
            value="Non puoi inviare un messaggio"
            editable={false}
          />
        )}
        <TouchableOpacity onPress={sendWhatsappMessage} style={styles.sendButton} disabled={isSending || !isInputDisabled}>
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Image source={require('..//..//../assets/send-message.png')} style={styles.sendIcon} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:34,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 20,
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  goback: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  topIcon: {
    width: 23,
    height: 23,
    marginRight: 10,
    resizeMode: 'contain',
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
    marginRight:50,
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
    backgroundColor: '#007bff',
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: 150,
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
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#3471CC',
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
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  disabledSendButton: {
    backgroundColor: '#ccc',
  },
  disabledSendIcon: {
    tintColor: '#999',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
