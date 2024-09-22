import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const daysOfWeek = ['D', 'L', 'M', 'M', 'G', 'V', 'S'];

const monthNames = [
  'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 
  'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic',
];

const CalendarComponent = ({ visible, onClose, onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    onSelectDate(date);
    onClose();
  };

  const renderCalendar = (month, year) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    let calendarData = [];
    let dayCount = 1;
    for (let i = 0; i < 6; i++) {
      let row = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          row.push(null);
        } else if (dayCount > daysInMonth) {
          row.push(null);
        } else {
          const date = new Date(year, month, dayCount);
          row.push(date);
          dayCount++;
        }
      }
      calendarData.push(row);
    }
    return calendarData;
  };

  const renderCalendarView = () => {
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const calendarData = renderCalendar(currentMonth, currentYear);

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => {
              const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
              const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
              setSelectedDate(new Date(prevYear, prevMonth, 1));
            }}
          >
            <Text style={styles.arrowText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => {
              const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
              const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
              setSelectedDate(new Date(nextYear, nextMonth, 1));
            }}
          >
            <Text style={styles.arrowText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.weekDays}>
          {daysOfWeek.map((day, index) => (
            <View key={index} style={styles.weekDay}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>
        <FlatList
          data={calendarData}
          renderItem={({ item }) => (
            <View style={styles.calendarRow}>
              {item.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.calendarCell, date ? styles.cellActive : {}]}
                  onPress={() => date && handleDateSelection(date)}
                >
                  {date ? <Text style={styles.cellText}>{date.getDate()}</Text> : null}
                </TouchableOpacity>
              ))}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={7}
        />
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {renderCalendarView()}
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>Seleziona un orario</Text>
            <View style={styles.timePicker}>
              <Text style={styles.timePickerText}>09 : 30</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={onClose}>
              <Text style={styles.buttonText}>Salva Recall</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Annulla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      padding: 10,
      backgroundColor: 'blue',
      color: 'white',
      borderRadius: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: width * 0.9,
    },
    calendarContainer: {
      // width: '100%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    arrowButton: {
      padding: 5,
    },
    arrowText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    monthText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    weekDays: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 10,
    },
    weekDay: {
      alignItems: 'center',
    },
    weekDayText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    calendarRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    calendarCell: {
      width: width * 0.12,
      height: width * 0.12,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'lightgray',
      marginBottom: 5,
    },
    cellActive: {
      backgroundColor: 'lightblue',
    },
    cellText: {
      fontSize: 16,
    },
    timeContainer: {
      marginTop: 20,
    },
    timeText: {
      fontSize: 16,
      marginBottom: 10,
    },
    timePicker: {
      padding: 10,
      backgroundColor: 'lightgray',
      borderRadius: 5,
      marginBottom: 20,
    },
    timePickerText: {
      fontSize: 18,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    saveButton: {
      padding: 10,
      backgroundColor: 'green',
      borderRadius: 5,
      flex: 1,
      marginRight: 10,
    },
    cancelButton: {
      padding: 10,
      backgroundColor: 'red',
      borderRadius: 5,
      flex: 1,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 16,
    },
  });

export default CalendarComponent;
