import network from '@/constants/Network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native'; // Importa ActivityIndicator

const TypeSelectorModal = ({ isVisible, onClose, lead, item, esito, onSave, modificaLeadLocale, setColumnData }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [importValue, setImportValue] = useState('0');
  const [levaValue, setLevaValue] = useState('');
  const [nonValidoValue, setNonValidoValue] = useState('');
  const [leadPersaValue, setLeadPersaValue] = useState('');
  const [loading, setLoading] = useState(false); // Stato per il caricamento

  const handleOptionPress = (option: string) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    setSelectedOption(esito)
  }, [esito])

  const handleImportChange = (text: string) => {
    setImportValue(text);
  };

  const handleLeadPersaChange = (text: string) => {
    setLeadPersaValue(text);
  };

  const handleNonValidoChange = (text: string) => {
    setNonValidoValue(text);
  };

  const handleSubmit = async () => {
    setLoading(true); // Imposta lo stato di caricamento a true
    const userData = await AsyncStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userFixId = user.role && user.role === "orientatore" ? user.utente : user._id;
    if (selectedOption === "Non valido" || selectedOption === "Venduto" || selectedOption === "Non interessato") {
      if (!nonValidoValue || nonValidoValue === "") {
        return;
      } else {
        try {
          const modifyLead = {
            esito: selectedOption,
            motivo: selectedOption === "Non valido" ? nonValidoValue : selectedOption === "Venduto" ? levaValue : leadPersaValue,
            fatturato: importValue,
          };
          const response = await axios.put(network.serverip+`/lead/${userFixId}/update/${item._id}`, modifyLead);
          onSave(selectedOption);
          await modificaLeadLocale(item._id, modifyLead);
          await onClose();
          Toast.show({
            type: 'success',
            text1: 'Successo',
            text2: 'Lead spostata con successo!',
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 40,
            style: styles.toast, // Applica lo stile personalizzato
            text1Style: styles.toastText1, // Stile per il testo principale
            text2Style: styles.toastText2, // Stile per il testo secondario
          });
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false); // Imposta lo stato di caricamento a false
        }
      }
    } else {
      try {
        const modifyLead = {
          esito: selectedOption,
          motivo: "",
        };
        const response = await axios.put(network.serverip+`/lead/${userFixId}/update/${item._id}`, modifyLead);
        Toast.show({
          type: 'success',
          text1: 'Successo',
          text2: 'Lead spostata con successo!',
          position: 'top',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 40,
          style: styles.toast, // Applica lo stile personalizzato
          text1Style: styles.toastText1, // Stile per il testo principale
          text2Style: styles.toastText2, // Stile per il testo secondario
        });
        onSave(selectedOption);
        await modificaLeadLocale(item._id, modifyLead);
        onClose();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Imposta lo stato di caricamento a false
      }
    }
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Image source={require('..//..//../assets/x.png')} style={styles.closeIcon} />
          </TouchableOpacity>

          <ScrollView style={styles.optionsContainer}>
            {['Da contattare', 'In lavorazione', "Non risponde", 'Irraggiungibile', 'Non valido', 'Non interessato', 'Opportunità', 'In valutazione', 'Venduto', 'Iscrizione posticipata'].map((option) => (
              <View key={option} style={styles.bigContainer}>
                <TouchableOpacity onPress={() => handleOptionPress(option)} style={styles.optionContainer}>
                  <View style={styles.circleContainer}>
                    <View style={[styles.circle, (selectedOption !== null && selectedOption?.trim() === option) && styles.selectedCircle]} />
                  </View>
                  <Text style={styles.optionText}>{option == "Non interessato" ? "Lead persa" : option}</Text>
                </TouchableOpacity>
                {selectedOption === option && (
                  <>
                    {option === 'Venduto' && (
                      <>
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>INSERISCI IMPORTO</Text>
                          <TextInput
                            style={styles.input}
                            value={importValue}
                            onChangeText={handleImportChange}
                          />
                        </View>
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>INSERISCI LEVA</Text>
                          <RNPickerSelect
                            onValueChange={(value) => setLevaValue(value)}
                            items={[
                              { label: 'Promozione / sconto', value: 'Promozione / sconto' },
                              { label: 'Convenzione', value: 'Convenzione' },
                              { label: 'Prevalutazione corretta', value: 'Prevalutazione corretta' },
                              { label: 'Scatto di carriera', value: 'Scatto di carriera' },
                              { label: 'Titolo necessario per concorso pubblico / candidatura', value: 'Titolo necessario per concorso pubblico / candidatura' },
                              { label: 'Tempi brevi', value: 'Tempi brevi' },
                              { label: 'Sede d\'esame vicino casa', value: 'Sede d\'esame vicino casa' },
                              { label: 'Consulenza orientatore', value: 'Consulenza orientatore' },
                            ]}
                            style={pickerSelectStyles}
                            value={levaValue}
                            placeholder={{ label: 'Seleziona una leva', value: null }}
                          />
                        </View>
                      </>
                    )}
                    {option === 'Lead persa' && (
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>MOTIVO LEAD PERSA</Text>
                        <RNPickerSelect
                          onValueChange={(value) => setLeadPersaValue(value)}
                          items={[
                            { label: 'Disconoscimento richiesta', value: 'Disconoscimento richiesta' },
                            { label: 'Richiesta vecchia', value: 'Richiesta vecchia' },
                            { label: 'Nessuna risposta', value: 'Nessuna risposta' },
                            { label: 'Non più interessato', value: 'Non più interessato' },
                            { label: 'Solo curiosità', value: 'Solo curiosità' },
                            { label: 'Non vuole intermediari', value: 'Non vuole intermediari' },
                            { label: 'Fuori budget', value: 'Fuori budget' },
                            { label: 'Prodotto non disponibile', value: 'Prodotto non disponibile' },
                            { label: 'Altro ateneo', value: 'Altro ateneo' },
                            { label: 'Difficoltà nel reperire documentazione', value: 'Difficoltà nel reperire documentazione' },
                            { label: 'Titolo straniero senza equipollenza', value: 'Titolo straniero senza equipollenza' },
                            { label: 'Prevalutazione rifiutata', value: 'Prevalutazione rifiutata' },
                            { label: 'Motivi familiari/lavorativi', value: 'Motivi familiari/lavorativi' }
                          ]}
                          style={pickerSelectStyles}
                          value={leadPersaValue}
                          placeholder={{ label: 'Seleziona un motivo', value: null }}
                        />
                      </View>
                    )}
                    {option === 'Non valido' && (
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>MOTIVO NON VALIDO</Text>
                        <RNPickerSelect
                          onValueChange={(value) => setNonValidoValue(value)}
                          items={[
                            { label: 'Linea disattivata', value: 'Linea disattivata' },
                            { label: 'Numero errato', value: 'Numero errato' },
                            { label: 'Lead doppione', value: 'Lead doppione' },
                            { label: 'Lead in carico ad ateneo', value: 'Lead in carico ad ateneo' },
                          ]}
                          style={pickerSelectStyles}
                          value={nonValidoValue}
                          placeholder={{ label: 'Seleziona un motivo', value: null }}
                        />
                      </View>
                    )}
                  </>
                )}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salva Modifiche</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical:20,
    height: '80%',
  },
  container: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    position: 'relative',
  },
  bigContainer: {
    
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeIcon: {
    width: 17,
    height: 17,
  },
  optionsContainer: {
    marginTop: 20,
    marginBottom: 20,
    maxHeight: '80%'
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
  },
  circleContainer: {
    marginRight: 10,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedCircle: {
    backgroundColor: '#3471cc',
  },
  optionText: {
    fontSize: 16,
    color:'#000'
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color:'#000'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  buttonContainer: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  toast: {
    backgroundColor: '#333', // Colore di sfondo del toast
    borderRadius: 10, // Bordo arrotondato
    padding: 10, // Padding interno
  },
  toastText1: {
    fontSize: 16, // Dimensione del testo principale
    fontWeight: 'bold', // Grassetto
    color: '#000', // Colore del testo principale
  },
  toastText2: {
    fontSize: 14, // Dimensione del testo secondario
    color: '#000', // Colore del testo secondario
  },
});

export default TypeSelectorModal;
