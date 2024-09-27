import network from '@/constants/Network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert, Platform, ActivityIndicator, ScrollView } from 'react-native';
import moment from 'moment';
import axios from 'axios';

const Calendar = ({navigation}) => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.month());
  const [currentYear, setCurrentYear] = useState(selectedDate.year());
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [weekStart, setWeekStart] = useState(moment().startOf('week'));
  const [orientatoriOptions, setOrientatoriOptions] = useState([]);

  const getOrientatori = async () => {
    const userData = await AsyncStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userFixId = user.role && user.role === "orientatore" ? user.utente : user._id;
    try {
      const response = await axios.get(`${network.serverip}/utenti/${userFixId}/orientatori`);
      const data = response.data.orientatori;
      setOrientatoriOptions(data);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchLeads();
      getOrientatori();
    }, [])
  );

  const moveWeek = (direction) => {
    setWeekStart(prev => prev.clone().add(direction * 7, 'days'));
  };

  const fetchLeads = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      const userFixId = user.role && user.role === "orientatore" ? user.utente : user._id;

      const response = await fetch(network.serverip+'/get-lead-calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: user._id,
          role: user.role && user.role === "orientatore" ? "orientatore" : "utente",
        }),
      });

      const data = await response.json();
      const processedData = data.filter(lead => lead.recallDate && lead.recallHours).map(lead => ({
        ...lead,
        dateTime: moment(`${lead.recallDate} ${lead.recallHours}`, 'YYYY-MM-DD HH:mm:ss').toDate()
      }));

      setFilteredData(processedData);
      setOriginalData(processedData);
    } catch (error) {
      console.error('Errore nel recupero dei dati:', error);
      Alert.alert('Errore', 'Si è verificato un errore nel caricamento dei dati.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTimeSlots = () => {
    const timeSlots = [];
    const today = selectedDate.format('YYYY-MM-DD');
    const eventsToday = filteredData.filter(event => moment(event.dateTime).format('YYYY-MM-DD') === today);

    for (let hour = 7; hour <= 21; hour++) {
      const formattedHour = hour.toString().padStart(2, '0');
      const eventsInHour = eventsToday.filter(event => moment(event.dateTime).hour() === hour);

      timeSlots.push(
        <View style={styles.containerEvent} key={hour}>
          <Text style={styles.timeLabel}>{`${formattedHour}:00`}</Text>
          {eventsInHour.map(event => (
            <TouchableOpacity
              key={event._id}
              style={styles.eventContainer}
              onPress={() => navigation.navigate('filterData', {
                item: event, 
                orientatoriOptions, 
                onUpdateLead: null,
                setLeads: null, 
                /*modificaLeadLocale: (idLead, nuoviDati) => {
                  console.log("modificaLeadLocale chiamata con:", idLead, nuoviDati);
                  modificaLead(idLead, nuoviDati);
                  const nuoveLeads = leads.map(lead =>
                    lead._id === idLead ? {...lead, ...nuoviDati} : lead
                  );
                  aggiornaColumnData(nuoveLeads);
                },*/
                fetchLeads,
                //setColumnData
              })}
            >
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{`${event.nome} ${event.cognome}`}</Text>
                <Text style={styles.eventTime}>{moment(event.dateTime).format('HH:mm')}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return timeSlots;
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December',
  ];

  const renderWeekDays = () => {
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = moment(weekStart).add(i, 'days');
      const isSelected = day.isSame(selectedDate, 'day');
      weekDays.push(
        <TouchableOpacity 
          key={i} 
          onPress={() => setSelectedDate(day)}
          style={[styles.dayContainer, isSelected && styles.selectedDayContainer]}
        >
          <Text style={[styles.dayName, isSelected && styles.selectedDayText]}>{day.format('ddd').charAt(0)}</Text>
          <Text style={[styles.dayNumber, isSelected && styles.selectedDayText]}>{day.format('D')}</Text>
        </TouchableOpacity>
      );
    }
    return weekDays;
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
          <Text style={styles.headerText}>{moment(selectedDate).format('MMMM YYYY')}</Text>
        </TouchableOpacity>
        <View style={styles.inputCont}>
          <Image source={require('../../assets/search.png')} style={[styles.icon, styles.iconSearch]} />
          <TextInput 
            placeholder="Cerca..." 
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <View style={styles.weekContainer}>
        <TouchableOpacity onPress={() => moveWeek(-1)} style={styles.arrowContainer}>
          <Text style={styles.arrowText}>{'<'}</Text>
        </TouchableOpacity>
        {renderWeekDays()}
        <TouchableOpacity onPress={() => moveWeek(1)} style={styles.arrowContainer}>
          <Text style={styles.arrowText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.calendarTime}>
        {renderTimeSlots()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 38 : 18,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backArrow: {
    padding: 8,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3471cc'
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3471cc'
  },
  inputCont: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 10,
    borderRadius: 50,
    borderColor: '#6F6F6F',
    borderWidth: 1,
    backgroundColor: '#fff',
    flex: 1,
  },
  icon: {
    width: 18,
    height: 18,
  },
  iconSearch: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#1f2937',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    gap: 10,
    paddingHorizontal: 20,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayName: {
    fontSize: 12,
    color: '#6F6F6F',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  todayContainer: {
    backgroundColor: '#3471cc',
    borderRadius: 20,
    padding: 5,
  },
  todayText: {
    color: '#fff',
  },
  calendarTime: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  containerEvent: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  timeLabel: {
    fontSize: 14,
    marginTop: 38,
    fontWeight: '600',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    paddingBottom: 5,
  },
  eventContainer: {
    backgroundColor: '#3471CC',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    color: '#fff'
  },
  eventTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  dayContainer: {
    alignItems: 'center',
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  selectedDayContainer: {
    backgroundColor: '#3471cc',
    borderRadius: 20,
  },
  dayName: {
    fontSize: 12,
    color: '#6F6F6F',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  selectedDayText: {
    color: '#fff',
  },
});

export default Calendar;