import network from '@/constants/Network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const MInfor = () => {
  const route = useRoute();
  const { item } = route.params;

  const [tipologiaDiCorso, setTipologiaDiCorso] = useState('');
  const [areaStudi, setAreaStudi] = useState('');
  const [corsoDiLaure, setCorsoDiLaure] = useState('');
  const [iscrizione, setIscrizione] = useState('');
  const [frequentaUniversita, setFrequentaUniversita] = useState('');
  const [lavori, setLavori] = useState('');
  const [tempoDisponibile, setTempoDisponibile] = useState('');
  const [categorie, setCategorie] = useState('');

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        const response = await axios.get(`${network.serverip}/leads/${item._id}`, {
          headers: {
            Authorization: `Bearer ${parsedUser.token}`,
          },
        });

        setTipologiaDiCorso(response.data.tipologiaCorso || '');
        setAreaStudi(response.data.corsoDiLaurea || '');
        setCorsoDiLaure(response.data.corsoDiLaurea || '');
        setIscrizione(response.data.enrollmentTime || '');
        setFrequentaUniversita(response.data.frequentiUni ? 'Si' : 'No');
        setLavori(response.data.lavoro ? 'Si' : 'No');
        setTempoDisponibile(response.data.oreStudio || '');
        setCategorie(response.data.categories || '');
      } catch (err) {
        console.error('Errore nel recupero del lead:', err);
      }
    };

    fetchLead();
  }, [item.id]);

  const handleSave = () => {
    // Implement your save logic here
    console.log('Form Data:', {
      tipologiaDiCorso,
      areaStudi,
      corsoDiLaure,
      iscrizione,
      frequentaUniversita,
      lavori,
      tempoDisponibile,
      categorie,
    });
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Tipologia di corso</Text>
      <TextInput
        style={styles.input}
        value={tipologiaDiCorso}
        onChangeText={setTipologiaDiCorso}
        placeholder="Inserisci la tipologia di corso"
        editable={false}
      />

      <Text style={styles.title}>Area studi</Text>
      <TextInput
        style={styles.input}
        value={areaStudi}
        onChangeText={setAreaStudi}
        placeholder="Inserisci l'area di studi"
        editable={false}
      />

      <Text style={styles.title}>Corso di laurea</Text>
      <TextInput
        style={styles.input}
        value={corsoDiLaure}
        onChangeText={setCorsoDiLaure}
        placeholder="Inserisci il corso di laurea"
        editable={false}
      />

      <Text style={styles.title}>Iscrizione</Text>
      <TextInput
        style={styles.input}
        value={iscrizione}
        onChangeText={setIscrizione}
        placeholder="Inserisci la data di iscrizione"
        editable={false}
      />

      <Text style={styles.title}>Frequenti l'università</Text>
      <TextInput
        style={styles.input}
        value={frequentaUniversita}
        onChangeText={setFrequentaUniversita}
        placeholder="Sì/No"
        editable={false}
      />

      <Text style={styles.title}>Lavori</Text>
      <TextInput
        style={styles.input}
        value={lavori}
        onChangeText={setLavori}
        placeholder="Inserisci i tuoi lavori"
        editable={false}
      />

      <Text style={styles.title}>Tempo disponibile</Text>
      <TextInput
        style={styles.input}
        value={tempoDisponibile}
        onChangeText={setTempoDisponibile}
        placeholder="Inserisci il tempo disponibile"
        editable={false}
      />

      <Text style={styles.title}>Categorie</Text>
      <TextInput
        style={styles.input}
        value={categorie}
        onChangeText={setCategorie}
        placeholder="Inserisci le categorie"
        editable={false}
      />

      {/*<TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salva scheda lead</Text>
      </TouchableOpacity>*/}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'#fff',
  },
  contentContainer: {
    paddingBottom: 80, // Adjust this value to create more space at the bottom
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    color:'#000'
  },
  input: {
    borderWidth: 1,
    borderColor: '#3471CC',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#3471cc',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MInfor;
