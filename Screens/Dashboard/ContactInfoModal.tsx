import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Switch, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';

const ContactInfoModal = ({ isVisible, onClose, orientatoriOptions, applyFilters, resetFilters, recall, setRecall, orientatore, setOrientatore, selectedPriority, setSelectedPriority, startDate, setStartDate, endDate, setEndDate}) => {
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);

  const handlePrioritySelect = (priority) => {
    setSelectedPriority(priority);
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      let currentDate = new Date(selectedDate);
      
      if (isSelectingStartDate) {
        currentDate.setHours(0, 1, 0, 0); // Imposta l'orario a 00:01
        setIsSelectingStartDate(false);
        setStartDate(currentDate);
        setShowDatePicker(true);
      } else {
        currentDate.setHours(23, 59, 0, 0); // Imposta l'orario a 23:59
        setEndDate(currentDate);
        setShowDatePicker(false);
      }
    }
  };

  const openDatePicker = () => {
    setIsSelectingStartDate(true); // Start with selecting the start date
    setShowDatePicker(true); // Open date picker initially
  };

  const handleSaveFilters = () => {
    const filters = {
      startDate,
      endDate,
      orientatore,
      priority: selectedPriority,
      recall: recall
    };
    applyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setOrientatore(null);
    setSelectedPriority(null);
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
            <TouchableOpacity onPress={openDatePicker}>
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateInput}>
                  {startDate ? startDate.toLocaleDateString() : 'Select start date'} - {endDate ? endDate.toLocaleDateString() : 'Select end date'}
                </Text>
                <Image source={require('../../assets/calendar.png')} style={styles.dateIcon} />
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={isSelectingStartDate ? startDate : endDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              </View>
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
              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  selectedPriority === 3 && styles.selectedPriorityButton,
                ]}
                onPress={() => handlePrioritySelect(3)}
              >
                <Image source={require('../../assets/star.png')} style={styles.priorityImage} />
                <Image source={require('../../assets/star.png')} style={styles.priorityImage} />
                <Image source={require('../../assets/star.png')} style={styles.priorityImage} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  selectedPriority === 2 && styles.selectedPriorityButton,
                ]}
                onPress={() => handlePrioritySelect(2)}
              >
                <Image source={require('../../assets/star.png')} style={styles.priorityImage} />
                <Image source={require('../../assets/star.png')} style={styles.priorityImage} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  selectedPriority === 1 && styles.selectedPriorityButton,
                ]}
                onPress={() => handlePrioritySelect(1)}
              >
                <Image source={require('../../assets/star.png')} style={styles.priorityImage} />
              </TouchableOpacity>
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
              <Text style={styles.cancelButtonText}>Ripristina</Text>
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
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    color: '#000',
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
    fontWeight: 'bold',
    color: '#000',
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
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
  },
});

export default ContactInfoModal;
