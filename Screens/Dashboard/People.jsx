import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Image, PanResponder, Animated, SafeAreaView } from 'react-native';
import ContactInfoModal from './ContactInfoModal';
import DragableList from '../Dashboard/FilterTabs/DragableList';
import TypeSelectorModal from './FilterTabs/TypeSelectorModal'
import { Alert } from 'react-native';

const People = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleEdit, setModalVisibleEdit] = useState(false)
  const showModalEdit = () => setModalVisibleEdit(true);
  const hideModalEdit = () => setModalVisibleEdit(false);
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

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);


  return (
    <View style={styles.container}>
      {/* Top Search Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchBar}>
          <View style={styles.inputCont}>
            <Image source={require('../../assets/search.png')} style={styles.icon, styles.iconSearch} />
            <TextInput placeholder="Cerca..." style={styles.searchInput} />
          </View>
          <TouchableOpacity onPress={showModal}>
            <Image source={require('../../assets/filter.png')} style={[styles.icon, styles.filterIcon]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showLogoutAlert()}>
            <Image source={require('../../assets/Vector.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <DragableList
        showModalEdit={showModalEdit}
        hideModalEdit={hideModalEdit}
       />

      <TouchableOpacity onPress={showModal} 
     style={{backgroundColor:'#F4F8FB',position:'absolute',
        width:40,height:40,bottom:80,right:20,borderRadius:50,
        borderWidth:0.5,borderColor:'#000',alignItems:'center',justifyContent:'center'}}>
            <Image source={require('..//..//assets/search2.png')} 
      style={{width:19,height:19,}} /></TouchableOpacity>
      { isModalVisible ?
       <ContactInfoModal 
        isVisible={isModalVisible} 
        onClose={hideModal} 
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
    paddingTop: 38,
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
