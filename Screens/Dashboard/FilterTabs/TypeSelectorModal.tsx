import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';

const TypeSelectorModal = ({ isVisible, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [importValue, setImportValue] = useState('');
  const [levaValue, setLevaValue] = useState('');
  const [nonValidoValue, setNonValidoValue] = useState('');
  const [leadPersaValue, setLeadPersaValue] = useState('');

  const handleOptionPress = (option: string) => {
    setSelectedOption(option);
  };

  const handleImportChange = (text: string) => {
    setImportValue(text);
  };

  const handleLeadPersaChange = (text: string) => {
    setLeadPersaValue(text);
  };

  const handleNonValidoChange = (text: string) => {
    setNonValidoValue(text);
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
            {['Da contattare', 'In lavorazione', 'Irraggiungibile', 'Non valido', 'Lead persa', 'Opportunità', 'In valutazione', 'Venduto', 'Iscrizione posticipata'].map((option) => (
              <View key={option} style={styles.bigContainer}>
                <TouchableOpacity onPress={() => handleOptionPress(option)} style={styles.optionContainer}>
                  <View style={styles.circleContainer}>
                    <View style={[styles.circle, selectedOption === option && styles.selectedCircle]} />
                  </View>
                  <Text style={styles.optionText}>{option}</Text>
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

          <TouchableOpacity style={styles.buttonContainer} onPress={onClose}>
            <Text style={styles.buttonText}>Salva Modifiche</Text>
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
});

export default TypeSelectorModal;
