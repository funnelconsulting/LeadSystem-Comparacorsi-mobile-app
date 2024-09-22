import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert } from 'react-native';

const Calendar = ({navigation}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [searchText, setSearchText] = useState('');

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = new Date(currentYear, currentMonth).getDay();
    const calendar = [];

    // Fill in previous month's days
    for (let i = 0; i < firstDay; i++) {
      calendar.push(null);
    }

    // Fill in current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      calendar.push(i);
    }

    return calendar;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDatePress = (day) => {
    if (day) {
      const date = new Date(currentYear, currentMonth, day);
      setSelectedDate(date);
      navigation.navigate('DateAnalyze', { selectedDate: date });
    }
  };
  
  
  const calendar = generateCalendar();
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

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topCalendar}>
          <TouchableOpacity style={styles.goback} onPress={() => navigation.navigate("People")}>
            <Image source={require('../../assets/indietro.png')} style={[styles.icon, styles.filterIcon]} />
            <Text style={styles.indietroText}>Indietro</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showLogoutAlert()}>
            <Image source={require('../../assets/Vector.png')} style={styles.icon} />
          </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.searchContainer}>
        <Image
            source={require('..//../assets/search.png')} // Update with your icon path
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
          />
        
        </View>
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.arrow}>
            <Text style={styles.arrowText}>&lt;</Text>
          </TouchableOpacity>
          <Text style={styles.monthYear}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.arrow}>
            <Text style={styles.arrowText}>&gt;</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.weekdays}>
          <Text style={styles.weekday}>D</Text>
          <Text style={styles.weekday}>L</Text>
          <Text style={styles.weekday}>M</Text>
          <Text style={styles.weekday}>M</Text>
          <Text style={styles.weekday}>G</Text>
          <Text style={styles.weekday}>V</Text>
          <Text style={styles.weekday}>S</Text>
        </View>
        <View style={styles.calendar}>
          {calendar.map((day, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDatePress(day)}
              style={[styles.day]}
            >
              {day ? <Text style={styles.dayText}>{day}</Text> : null}
            </TouchableOpacity>
          ))}
          </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
  },
  topCalendar: {
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
    paddingHorizontal: 16,
  },
  indietroText: {
    fontWeight: '600',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginRight: 20,
    marginTop: 20,
    borderRadius:20,
    borderWidth: 1,
    paddingHorizontal: 16,
    borderColor: '#ddd',
    padding: 5,
  },
  filterIcon: {
    marginRight: 20,
  },
  icon: {
    width: 23,
    height: 23,
    resizeMode: 'contain',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 8,
    color:"#000",
 
    borderRadius: 4,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'#3471cc'
  },
  arrow: {
    width: 25,
    height: 25,
    backgroundColor:'#3471cc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600'
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekday: {
    width: '14%',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  day: {
    width: 32,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  
  dayText: {
    fontSize: 16,
    color:'#000'
  },
});

export default Calendar;
