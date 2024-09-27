import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import ContactInfoModal from './ContactInfoModal';
import { useFocusEffect } from '@react-navigation/native';
import LeadsColumn from '../Dashboard/FilterTabs/LeadsColumn';
import TypeSelectorModal from './FilterTabs/TypeSelectorModal'
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import network from '@/constants/Network';
import axios from 'axios';
import moment from 'moment';

const People = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleEdit, setModalVisibleEdit] = useState(false)
  const showModalEdit = () => setModalVisibleEdit(true);
  const hideModalEdit = () => setModalVisibleEdit(false);
  const [loading, setLoading] = useState(true); // Aggiungi questo stato
  const [leads, setLeads] = useState([]);
  const [originalLeads, setOriginalLeads] = useState([])
  const [isZoomedOut, setIsZoomedOut] = useState(false);
  const [orientatoriOptions, setOrientatoriOptions] = useState([]); // Nuovo stato per gli orientatori
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [recall, setRecall] = useState(false);
  const [orientatore, setOrientatore] = useState(null)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [searchTerm, setSearchTerm] = useState('');

  const handleScaleToggle = () => {
    setIsZoomedOut(prevState => !prevState);
  };

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
        { 
          text: "Sì", 
          onPress: async () => {
            console.log("Logout eseguito");
            await AsyncStorage.clear(); // Pulisce lo storage
            navigation.replace('Login'); // Reindirizza alla schermata di login
          } 
        }
      ]
    );
  };

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const getOrientatori = async () => {
    const userData = await AsyncStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userFixId = user.role && user.role === "orientatore" ? user.utente : user._id;
    try {
      const response = await axios.get(`${network.serverip}/utenti/${userFixId}/orientatori`);
      const data = response.data.orientatori;
      setOrientatoriOptions(data);
      fetchLeads(data);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const userData = await AsyncStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;
        setLoading(true);
        if (!user.role || user.role !== "orientatore"){
          await getOrientatori();
        }
        if (user.role && user.role === "orientatore") {
          await fetchLeadsOrientatori();
        }
      };

      fetchData();
    }, [])
  );

  const fetchLeads = async (orientatori) => {
    console.log("Prendo le lead")
    const userData = await AsyncStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userFixId = user.role && user.role === "orientatore" ? user.utente : user._id;
    try {
      const response = await axios.post(network.serverip+'/get-leads-manual-base', {
        _id: userFixId
      });
      setLeads(response.data);
      setOriginalLeads(response.data);
    } catch (error) {
      console.error("Errore nel recupero delle lead:", error.message);
    } finally {
      setLoading(false); // Imposta loading a false quando il fetch è completato
    }
  };

  const fetchLeadsOrientatori = async () => {
    console.log("Prendo le lead")
    const userData = await AsyncStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userFixId = user.role && user.role === "orientatore" ? user.utente : user._id;
    try {
      const response = await axios.post(network.serverip+'/get-orientatore-lead-base', {
        _id: user._id
      });
      setLeads(response.data);
      setOriginalLeads(response.data);
    } catch (error) {
      console.error("Errore nel recupero delle lead:", error.message);
    } finally {
      setLoading(false); // Imposta loading a false quando il fetch è completato
    }
  };

  const handleUpdateLead = (updatedLead) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => (lead._id === updatedLead._id ? updatedLead : lead))
    );
  };

  const modificaLead = (idLead, nuoviDati) => {
    console.log('Nuovi dati ricevuti',nuoviDati)
    setLeads(leadsPrecedenti => leadsPrecedenti.map(lead => {
      if (lead._id === idLead) {
        return {
          ...lead,
          esito: nuoviDati.esito || lead.esito,
          motivo: nuoviDati.motivo || lead.motivo,
          fatturato: nuoviDati.fatturato || lead.fatturato
        };
      }
      return lead;
    }));
  };

  const applyFilters = (filters) => {
    console.log(filters);
    const now = moment();
    const filteredLeads = originalLeads.filter(lead => {
      const leadDate = new Date(lead.data);
      const isDateInRange = (!filters.startDate || leadDate >= new Date(filters.startDate)) &&
                            (!filters.endDate || leadDate <= new Date(filters.endDate));
  
      const isPriorityMatch = filters.priority === null || lead.priorità === filters.priority;
  
      const isOrientatoreMatch = !filters.orientatore || lead?.orientatori?._id === filters.orientatore;
  
      let isRecallMatch = true;
      if (filters.recall) {
        if (lead.recallDate && lead.recallHours) {
          const recallDateTime = moment(`${lead.recallDate} ${lead.recallHours}`, 'YYYY-MM-DD HH:mm');
          isRecallMatch = now.isBefore(recallDateTime);
        } else {
          isRecallMatch = false;
        }
      }
  
      return isDateInRange && isPriorityMatch && isOrientatoreMatch && isRecallMatch;
    });
  
    setLeads(filteredLeads);
  };

  const resetFilters = () => {
    setLeads(originalLeads);
  };

  const filterLeads = (term) => {
    if (!term) {
      setLeads(originalLeads);
      return;
    }

    const filteredLeads = originalLeads.filter(lead => {
      const fullName = `${lead.nome} ${lead.cognome}`.toLowerCase();
      const searchLower = term.toLowerCase();
      return fullName.includes(searchLower) || lead.numeroTelefono.includes(searchLower);
    });

    setLeads(filteredLeads);
  };

  return (
    <View style={styles.container}>
      {/* Top Search Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchBar}>
          <View style={styles.inputCont}>
            <Image source={require('../../assets/search.png')} style={styles.icon, styles.iconSearch} />
            <TextInput 
              placeholder="Cerca per nome o telefono..." 
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={(text) => {
                setSearchTerm(text);
                filterLeads(text);
              }}
            />
          </View>
          <TouchableOpacity onPress={showModal}>
            <Image source={require('../../assets/filter.png')} style={[styles.icon, styles.filterIcon]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showLogoutAlert()}>
            <Image source={require('../../assets/Vector.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          /*<DragableList
            showModalEdit={showModalEdit}
            hideModalEdit={hideModalEdit}
            leads={leads.length > 0 && leads}
          />*/
            <LeadsColumn
            showModalEdit={showModalEdit}
            hideModalEdit={hideModalEdit}
            leads={leads.length > 0 && leads}
            isZoomedOut={isZoomedOut}
            orientatoriOptions={orientatoriOptions}
            onUpdateLead={handleUpdateLead}
            setLeads={setLeads}
            modificaLead={modificaLead}
            fetchLeads={fetchLeads}
            />
        )}

      <TouchableOpacity onPress={handleScaleToggle} 
        style={{backgroundColor:'#F4F8FB',position:'absolute',
        width:40,height:40,bottom:80,right:20,borderRadius:50,
        borderWidth:0.5,borderColor:'#000',alignItems:'center',justifyContent:'center'}}>
          <Image source={require('..//..//assets/search2.png')} style={{width:19,height:19,}} />
       </TouchableOpacity>
      { isModalVisible ?
       <ContactInfoModal 
        isVisible={isModalVisible} 
        onClose={hideModal} 
        orientatoriOptions={orientatoriOptions}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        recall={recall}
        setRecall={setRecall}
        orientatore={orientatore}
        setOrientatore={setOrientatore}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />:null}
     
     <TypeSelectorModal
        isVisible={isModalVisibleEdit}
        onClose={hideModalEdit} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:0,
    marginTop: 0,
  },
  swapInfo: {
    padding: 10,
    backgroundColor: '#e5e7eb',
    textAlign: 'center',
    marginTop: 10,
    borderRadius: 5,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  topBar: {
    width: '100%',
    backgroundColor: '#F4F8FB',
    paddingTop: Platform.OS === 'ios' ? 38 : 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F4F8FB',
    marginTop: 10,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputCont: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 0,
    borderRadius: 50,
    backgroundColor: '#fff',
    marginTop: 0,
    width: '70%',
    marginRight: 25,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#1f2937',
  },
  filterIcon: {
    marginRight: 20,
  },
  icon: {
    width: 23,
    height: 23,
    resizeMode: 'contain',
  },
  iconSearch: {
    width: 18,
    height: 18,
  },
  contactSection: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
  },
  contactListWrapper: {
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'flex-start',
  },
  contactList: {
    padding: 5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    justifyContent: 'space-between',
    gap: 10,
  },
  firstContactList: {
    borderRadius: 10,
    width: '70%',
    height: '92%',
    backgroundColor: '#e5e7eb',
  },
  secondContactList: {
    borderRadius: 10,
    width: '30%',
    height: '76%',
    backgroundColor: '#e5e7eb',
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  contactCount: {
    backgroundColor: '#e5e7eb',
    borderRadius: 50,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 16,
    color: '#1f2937',
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 1, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 18,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  contactDetails: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  infoButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#e5e7eb',
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#1f2937',
  },
});

export default People;
