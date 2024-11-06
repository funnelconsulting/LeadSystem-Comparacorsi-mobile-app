import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Switch, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';

const ContactInfoModal = ({ isVisible, onClose, orientatoriOptions, applyFilters, resetFilters, recall, setRecall, orientatore, setOrientatore, selectedPriority, setSelectedPriority, startDate, setStartDate, endDate, setEndDate}) => {
  const navigation = useNavigation();
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handlePrioritySelect = (priority) => {
    setSelectedPriority(prevPriorities => {
      if (prevPriorities.includes(priority)) {
        return prevPriorities.filter(p => p !== priority);
      } else {
        return [...prevPriorities, priority];
      }
    });
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      const currentDate = new Date(selectedDate);
      currentDate.setHours(0, 0, 0, 0);
      setStartDate(currentDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      const currentDate = new Date(selectedDate);
      currentDate.setHours(23, 59, 59, 999);
      setEndDate(currentDate);
    }
  };

  const handleSaveFilters = () => {
    const filters = {
      startDate,
      endDate,
      orientatore,
      priorities: selectedPriority, // Usa l'array di priorità selezionate
      recall: recall
    };
    applyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setOrientatore(null);
    setSelectedPriority([]);
    setRecall(false);
    resetFilters();
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Image source={require('../../assets/x.png')} style={styles.closeImage} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filtri</Text>
          <View style={styles.modalContent}>
            {/* Data Picker */}
            <Text style={styles.label}>Data</Text>
              <View style={styles.dateContainer}>
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
                  <Text style={styles.dateButtonText}>
                    {startDate ? startDate.toLocaleDateString() : 'Data inizio'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
                  <Text style={styles.dateButtonText}>
                    {endDate ? endDate.toLocaleDateString() : 'Data fine'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={onStartDateChange}
                />
              )}
              
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={onEndDateChange}
                />
              )}

            {/* Orientatore Dropdown */}
            <Text style={styles.label}>Orientatore</Text>
            <View>
            <RNPickerSelect
                onValueChange={(value) => setOrientatore(value)}
                items={orientatoriOptions.map((orientatore) => ({
                  label: orientatore.nome + ' ' + orientatore.cognome,
                  value: orientatore._id,
                }))}
                style={pickerSelectStyles}
                value={orientatore}
                placeholder={{ label: "Seleziona un orientatore", value: null }}
              />
            </View>

            {/* Priority Section */}
            <Text style={[styles.label, { alignSelf: 'center' }]}>Priorità</Text>
            <View style={styles.priorityContainer}>
              {[3, 2, 1].map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    selectedPriority.includes(priority) && styles.selectedPriorityButton,
                  ]}
                  onPress={() => handlePrioritySelect(priority)}
                >
                  {[...Array(priority)].map((_, index) => (
                    <Image key={index} source={require('../../assets/star1.png')} style={styles.priorityImage} />
                  ))}
                </TouchableOpacity>
              ))}
            </View>

            {/* Recall Switch */}
            <Text style={[styles.label, { alignSelf: 'center' }]}>Recall</Text>
            <View style={styles.recallContainer}>
              <Switch
                value={recall}
                onValueChange={setRecall}
                thumbColor={recall ? '#34C759' : '#f4f3f4'}
                trackColor={{ false: '#767577', true: '#34C759' }}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveFilters}>
              <Text style={styles.saveButtonText}>Salva Filtri</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleResetFilters}>
              <Text style={styles.cancelButtonText}>Rimuovi Filtri</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
});

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 25,
    right: 20,
  },
  closeImage: {
    width: 15,
    height: 15,
  },
  modalTitle: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
  },
  modalContent: {
    width: '100%',
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
    fontFamily: 'Poppins-Regular',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    marginBottom: 20,
    paddingLeft: 15,
    backgroundColor: '#f9f9f9',
    fontFamily: 'Poppins-Regular',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  dateIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    backgroundColor: '#3471CC1A',
  },
  selectedPriorityButton: {
    borderColor: '#007BFF',
    borderWidth: 1,
  },
  priorityImage: {
    width: 20,
    height: 20,
    marginHorizontal: 2,
  },
  recallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  cancelButton: {
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },

  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateButton: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
});

export default ContactInfoModal;
