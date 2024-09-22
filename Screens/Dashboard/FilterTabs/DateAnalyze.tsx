import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const DateAnalyze = () => {
  const route = useRoute();
  const { selectedDate } = route.params;
  const navigation = useNavigation()

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Alessandro Grandoni',
      time: '10:20',
      date: '26',
      day: 'M',
      selected: false,
    },
    {
      id: 2,
      title: 'Andrea Caruso',
      time: '14:50',
      date: '26',
      day: 'M',
      selected: false,
    },
  ]);

  // Format selected date
  const selectedDay = selectedDate.getDate();
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December',
  ];
  const selectedMonthName = monthNames[selectedMonth];
  const selectedDayOfWeek = selectedDate.toLocaleDateString('en-GB', { weekday: 'short' });

  // Filtering events based on the selected date
  const filteredEvents = events.filter(event => event.date === selectedDay.toString());

  const handleEventPress = (id: number) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id
          ? { ...event, selected: !event.selected }
          : event
      )
    );
  };

  const renderTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 8; hour <= 20; hour++) {
      const formattedHour = hour.toString().padStart(2, '0');
      const eventsInHour = filteredEvents.filter(event => {
        const eventHour = parseInt(event.time.split(':')[0]);
        return eventHour === hour;
      });

      timeSlots.push(
        <View style={styles.containerEvent} key={hour}>
          <Text style={styles.timeLabel}>{`${formattedHour}:00`}</Text>
          {eventsInHour.map(event => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventContainer}
              onPress={() => handleEventPress(event.id)}
            >
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>{event.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return timeSlots;
  };

  const renderEvents = () => {
    return filteredEvents.map((event) => (
      <TouchableOpacity
        key={event.id}
        style={styles.eventContainer}
        onPress={() => handleEventPress(event.id)}
      >
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventTime}>{event.time}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={() => navigation.navigate("Calendar")} style={styles.backArrow}>
          <Text style={styles.arrowText}>{selectedMonthName} {selectedYear}</Text>
        </TouchableOpacity>
        <View style={styles.inputCont}>
            <Image source={require('../../../assets/search.png')} style={styles.icon, styles.iconSearch} />
            <TextInput placeholder="Cerca..." style={styles.searchInput} />            
        </View>
      </View>

      <View style={styles.calendarWeek}>
        <Text style={styles.dayLabel}>L</Text>
        <Text style={styles.dayLabel}>M</Text>
        <Text style={styles.dayLabel}>M</Text>
        <Text style={styles.dayLabel}>G</Text>
        <Text style={styles.dayLabel}>V</Text>
        <Text style={styles.dayLabel}>S</Text>
        <Text style={styles.dayLabel}>D</Text>
      </View>

      <View style={styles.calendarDays}>
        <Text style={styles.dayNumber}>{selectedDay - 2}</Text>
        <Text style={styles.dayNumber}>{selectedDay - 1}</Text>
        <Text style={[styles.dayNumber, styles.activeDay]}>{selectedDay}</Text>
        <Text style={styles.dayNumber}>{selectedDay + 1}</Text>
        <Text style={styles.dayNumber}>{selectedDay + 2}</Text>
        <Text style={styles.dayNumber}>{selectedDay + 3}</Text>
        <Text style={styles.dayNumber}>{selectedDay + 4}</Text>
      </View>

      <ScrollView style={styles.calendarTime}>
        {renderTimeSlots()}
      </ScrollView>

      <View style={styles.calendarEvents}>
        {renderEvents()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 16,
    fontWeight: 'bold',
    color:'#3471cc'
  },
  search: {
    flexDirection: 'row',
    width:'60%',
    alignItems: 'center',
    borderRadius:10,
    borderWidth:1,
  },
  searchIcon: {
    fontSize: 18,
  },
  calendarWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap:10,
    marginTop: 10,
  },
  inputCont: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 0,
    borderRadius: 50,
    borderColor: '#6F6F6F',
    borderWidth: 1,
    backgroundColor: '#fff',
    marginTop: 0,
    width: '60%',
    marginRight: 25,
  },
  containerEvent: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  iconSearch: {
    width: 18,
    height: 18,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#1f2937',
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  calendarDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    marginTop: 10,
    paddingHorizontal:12,
    gap:10,
  },
  dayNumber: {
    fontSize: 16,
  },
  activeDay: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  calendarTime: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    zIndex: 1000,
    width: '100%',
  },
  timeLabel: {
    fontSize: 14,
    marginTop: 38,
    fontWeight: '600',
    borderBottomWidth: 2, // Aumenta lo spessore
    borderBottomColor: '#333', // Usa un colore più chiaro
    paddingBottom: 5, // Aggiungi spazio sotto il testo
    zIndex: 1000,
  },
  calendarEvents: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  eventContainer: {
    backgroundColor: '#3471CC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
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
  selectedEvent: {
    backgroundColor: '#3471CC',
  },
});

export default DateAnalyze;