import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image ,TextInput,Button, Platform, Linking, ActivityIndicator, Alert} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import TypeSelectorModal from "./TypeSelectorModal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import network from "@/constants/Network";
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import Toast from 'react-native-toast-message'; // Importa Toast

const LeadDetails = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [organize,setOrganize] =useState(false)
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const showModal1 = () => setModalVisible1(true);
  const hideModal1 = () => setModalVisible1(false);
  const [isRecallVisible, setIsRecallVisible] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const route = useRoute();
  const { item, orientatoriOptions, onUpdateLead, setLeads, modificaLeadLocale, fetchLeads, setColumnData } = route.params;
  const [leadF, setLeadF] = useState({});
  const [email, setEmail] = useState('');
  const [campagna, setCampagna] = useState('');
  const [telefono, setTelefono] = useState('');
  const [orientatore, setOrientatore] = useState('');
  const [universita, setUniversita] = useState('');
  const [provincia, setProvincia] = useState('');
  const [note, setNote] = useState('');
  const [esito, setEsito] = useState('');
  const [tipologiaCorso, setTipologiaCorso] = useState('');
  const [corsoDiLaurea, setCorsoDiLaurea] = useState('');
  const [frequentiUni, setFrequentiUni] = useState('');
  const [lavoro, setLavoro] = useState('');
  const [categories, setCategories] = useState('');
  const [facolta, setFacolta] = useState('');
  const [budget, setBudget] = useState('');
  const [enrollmentTime, setEnrollmentTime] = useState('');
  const [fatturato, setFatturato] = useState('');
  const [oraChiamataRichiesto, setOraChiamataRichiesto] = useState('');
  const [oreStudio, setOreStudio] = useState('');
  const [motivo, setMotivo] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function mapCampagnaPerLeadsystem(nomeCampagna) {
    if (nomeCampagna.includes('Comparatore') || item.provenienza?.trim() == 'comparatore') {
      return 'Comparatore';
    } else if (nomeCampagna.includes("30 cfu")) {
        return "30 CFU"
    } else if (nomeCampagna.includes('Donne lavoratrici')) {
      return 'Donna lavoratrice';
    } else if (nomeCampagna.includes('Lavoratori')) {
      return 'Lavoratori';
    } else if (nomeCampagna.includes('INSEGNANTI')) {
      return 'Insegnanti';
    } else if (nomeCampagna.includes('FORZE DELL\'ORDINE')) {
      return 'Forze dell\'ordine';
    } else if (nomeCampagna.includes('Lavoratori settore pubblico')) {
      return 'Lavoratori settore pubblico';
    } else if (nomeCampagna.includes('Comparatore Landing')) {
      return 'Comparatore';
    } else if (nomeCampagna.includes('AI chatbot')) {
        return 'Conversazionale';
    } else if (nomeCampagna.includes('chatbot')) {
      return 'chatbot';
    } else if (nomeCampagna.includes('mamme_donne')) {
      return 'Mamme';
    } else if (nomeCampagna.includes('All Inclusive')) {
      return 'All Inclusive';
    } else if (item.provenienza?.trim() === "wordrpess") {
      return 'Alto intento Google'
    } else if (nomeCampagna.includes('Over 45')) {
      return 'Over 45';
    } else if (nomeCampagna.includes('LEAD ADS')) {
      return 'Alto Intento Meta';
    } else {
      return "Comparatore";
    }
  }

  const formattedRecallDate = leadF.recallDate && leadF.recallHours
  ? moment(leadF.recallDate).format('DD/MM/YYYY') + ' ' + leadF.recallHours
  : '';

  const formattedCreationdate = leadF.data ? moment(leadF.data).format('DD/MM/YYYY HH:mm') : ''

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
        setLeadF(response.data);
        setEmail(response.data.email || '');
        setCampagna(response.data.utmCampaign || '');
        setTelefono(response.data.numeroTelefono || '');
        setOrientatore(response.data.orientatori ? response.data.orientatori._id : '');
        setUniversita(response.data.università || '');
        setProvincia(response.data.provincia || '');
        setNote(response.data.note || '');
        setEsito(response.data.esito || '');
        setTipologiaCorso(response.data.tipologiaCorso || '');
        setCorsoDiLaurea(response.data.corsoDiLaurea || '');
        setFrequentiUni(response.data.frequentiUni ? 'Si' : 'No');
        setLavoro(response.data.lavoro ? 'Si' : 'No');
        setCategories(response.data.categories || '');
        setFacolta(response.data.facolta || '');
        setBudget(response.data.budget || '');
        setEnrollmentTime(response.data.enrollmentTime || '');
        setFatturato(response.data.fatturato || '0');
        setOraChiamataRichiesto(response.data.oraChiamataRichiesto || '');
        setOreStudio(response.data.oreStudio || '');
        setMotivo(response.data.motivo || '');
        setSelectedDate(response.data.recallDate ? new Date(response.data.recallDate) : new Date());
        setIsLoading(false)
      } catch (err) {
        console.error('Errore nel recupero del lead:', err);
      }
    };

    fetchLead();
  }, [item.id]);

  // Usa l'oggetto item come necessario
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const fetchLeadTotal = () => {
    fetchLeads()
  }

  const handleConfirm = async (date) => {
    console.warn("A date has been picked: ", date);
    const formattedDate = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const recallDate = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const recallHours = moment(date).format('HH:mm');
    try {
      const response = await axios.post(network.serverip+'/update-lead-recall', {
        leadId: item._id,
        recallDate,
        recallHours,
      });

      console.log('Lead aggiornata:', response.data);
      setLeadF((prevLead) => ({
        ...prevLead,
        recallDate,
        recallHours,
      }));
      Toast.show({
        type: 'success',
        text1: 'Successo',
        text2: 'Recall aggiunta!',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 40,
        style: styles.toast, // Applica lo stile personalizzato
        text1Style: styles.toastText1, // Stile per il testo principale
        text2Style: styles.toastText2, // Stile per il testo secondario
      });
    } catch (error) {
      console.error('Errore durante l\'aggiornamento della lead:', error.message);
    }
    hideDatePicker();
  };

  const [statoLead, setStatoLead] = useState('');
  const [sommario, setSommario] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const userData = await AsyncStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userFixId = user.role && user.role === "orientatore" ? user.utente : user._id;
    if (esito === "Non valido" || esito === "Venduto" || esito === "Non interessato") {
      if (!motivo || motivo === "") {
        Alert.alert("Inserisci il motivo");
        setIsSubmitting(false);
        return;
      } else {
        try {
          const modifyLead = {
            email,
            numeroTelefono: telefono,
            orientatori: orientatore,
            universita,
            provincia,
            note,
            esito,
            motivo,
            corsoDiLaurea,
            lavoro: lavoro === "Si" ? true : lavoro === "No" ? false : false,
            facolta,
            fatturato,
            frequentiUni: frequentiUni === "Si" ? true : frequentiUni === "No" ? false : false,
            oraChiamataRichiesto,
            budget,
            categories,
            oreStudio,
            enrollmentTime,
            tipologiaCorso,
          };
          const response = await axios.put(network.serverip+`/lead/${userFixId}/update/${item._id}`, modifyLead);
          //await modificaLeadLocale(item._id, modifyLead); Non serve
          await fetchLeads()
          Toast.show({
            type: 'success',
            text1: 'Successo',
            text2: 'Scheda lead modificata!',
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 40,
            style: styles.toast, // Applica lo stile personalizzato
            text1Style: styles.toastText1, // Stile per il testo principale
            text2Style: styles.toastText2, // Stile per il testo secondario
          });
        } catch (error) {
          console.error(error);
        } finally {
          setIsSubmitting(false);
        }
      }
    } else {
      try {
        const modifyLead = {
          email,
          numeroTelefono: telefono,
          orientatori: orientatore,
          universita,
          provincia,
          note,
          esito,
          corsoDiLaurea,
          facolta,
          fatturato,
          oraChiamataRichiesto,
          motivo: "",
          budget,
          categories,
          oreStudio,
          frequentiUni: frequentiUni === "Si" ? true : frequentiUni === "No" ? false : false,
          lavoro: lavoro === "Si" ? true : lavoro === "No" ? false : false,
          enrollmentTime,
          tipologiaCorso,
        };
        const response = await axios.put(network.serverip+`/lead/${userFixId}/update/${item._id}`, modifyLead);
        //await modificaLeadLocale(item._id, modifyLead); Non serve
        await fetchLeads()
        Toast.show({
          type: 'success',
          text1: 'Successo',
          text2: 'Scheda lead modificata!',
          position: 'top',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 40,
          style: styles.toast, // Applica lo stile personalizzato
          text1Style: styles.toastText1, // Stile per il testo principale
          text2Style: styles.toastText2, // Stile per il testo secondario
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const deleteRecall = async () => {
    const recallDate = null;
    const recallHours = null;
    try {
      const response = await axios.post(`${network.serverip}/delete-recall`, {
        leadId: item._id,
      });

      if (response.status === 200) {
        console.log('Recall eliminata con successo');
        // toast.success('Recall eliminata'); // Assicurati di avere una libreria di toast installata
        Toast.show({
          type: 'success',
          text1: 'Successo',
          text2: 'Recall eliminata con successo',
          position: 'top',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 40,
          style: styles.toast, // Applica lo stile personalizzato
          text1Style: styles.toastText1, // Stile per il testo principale
          text2Style: styles.toastText2, // Stile per il testo secondario
        });
        setLeadF((prevLead) => ({
          ...prevLead,
          recallDate,
          recallHours,
        }));
      } else {
        console.error('Errore durante l\'eliminazione della recall');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Errore',
        text2: 'Errore durante l\'eliminazione della recall',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 60,
        style: styles.toast, // Applica lo stile personalizzato
        text1Style: styles.toastText1, // Stile per il testo principale
        text2Style: styles.toastText2, // Stile per il testo secondario
      });
      console.error('Errore durante la richiesta:', error.message);
    }
  };

  const openWhatsApp = (phone) => {
    const url = `whatsapp://send?phone=${phone}`;
    Linking.openURL(url).catch(() => {
      alert('Assicurati di avere WhatsApp installato');
    });
  };

  const onSave = (newEsito) => {
    setLeadF((prevLead) => ({
      ...prevLead,
      esito: newEsito,
    }));
    setEsito(newEsito);
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}  contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        {item.priorità === 3 ? 
          (<View style={styles.rating}>
            <Image source={require("..//..//../assets/star.png")} style={styles.starIcon} />
            <Image source={require("..//..//../assets/star.png")} style={styles.starIcon} />
            <Image source={require("..//..//../assets/star.png")} style={styles.starIcon} />
          </View>) : item.priorità === 2 ? (
          <View style={styles.rating}>
            <Image source={require("..//..//../assets/star.png")} style={styles.starIcon} />
            <Image source={require("..//..//../assets/star.png")} style={styles.starIcon} />
          </View>
                ) : (
          <View style={styles.rating}>
            <Image source={require("..//..//../assets/star.png")} style={styles.starIcon} />
          </View>
                )}
        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={() => openWhatsApp(item.numeroTelefono)}
        >
          <Text style={styles.buttonText}>Contatta su Whatsapp</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{item.nome + ' ' + item.cognome}</Text>
        <View style={styles.details}>
          <View style={styles.detail}>
            <Image source={require("..//..//../assets/clock1.png")} style={styles.clockIcon} />
            <Text style={styles.detailText}>
              Data di creazione  <Text style={[styles.detailText,{color:'#3471CC'}]}>
              {formattedCreationdate && formattedCreationdate}
            </Text> 
            </Text>
          </View>
          <View style={styles.detail}>
            <Image source={require("..//..//../assets/clock2.png")} style={styles.clockIcon} />
            <Text style={styles.detailText}>
              Data appuntamento: 
              {leadF && leadF?.appDate && leadF?.appDate?.trim() !== "" ?
              <Text style={[styles.detailText,{color:'green'}]}>
                18/09/2024 14:25
              </Text> : 
              <Text style={[styles.detailText,{color:'green'}]}>
                Nessun appuntamento
              </Text>} 
            </Text>
          </View>
        </View>
      </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
      {isRecallVisible && (
        <View style={styles.recall}>
          {leadF && leadF.recallDate && leadF.recallHours ? (
          <TouchableOpacity style={styles.recallButton} onPress={showDatePicker}>
            <Image source={require("..//..//../assets/phone.png")} style={styles.phoneIcon} />
            <Text style={styles.recallText}>
              Recall fissata {formattedRecallDate && formattedRecallDate}
            </Text>
            <TouchableOpacity onPress={deleteRecall}>
                <Image source={require("..//..//../assets/x.png")} style={styles.closeIcon} />
            </TouchableOpacity>
          </TouchableOpacity>
          ):
          (
          <TouchableOpacity style={[styles.recallButton,{backgroundColor:'#3471cc',justifyContent:'center',borderRadius:10,}]} onPress={showDatePicker}>
            <Image source={require("..//..//../assets/caller.png")} style={styles.phoneIcon} />
            <Text style={[styles.recallText,{color:'#fff'}]}>
              Organizza una recall
            </Text>
          </TouchableOpacity>
          )}
        </View>
      )}
      <View style={styles.header2}>
        <Text style={styles.headerText}>Stato Lead</Text>
        <TouchableOpacity style={styles.opportunityContainer} onPress={showModal}>
          <Text style={styles.opportunityText}>{leadF?.esito ? leadF.esito : item.esito}</Text>
        </TouchableOpacity>
      </View>
      {leadF && leadF?.motivo?.trim() !== "" && <View style={styles.row}>
        <Text style={styles.label2}>Motivo</Text>
        <Text style={styles.text}>{leadF?.motivo}</Text>
      </View>}
      {leadF && leadF.summary && leadF?.summary?.trim() !== "" && <View style={styles.row}>
        <Text style={[styles.label, { color: '#007AFF' }]}>Sommario</Text>
        <Text style={styles.text}>
          {leadF.summary}
        </Text>
      </View>}
      <View style={styles.separator} />
       <View style={styles.inputGroup}>
        <Text style={styles.label}>Telefono</Text>
        <TextInput
          style={styles.input}
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Orientatore</Text>
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
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Campagna</Text>
        <TextInput
          style={styles.input}
          value={(item.campagna || item.provenienza) && leadF?.campagna ? mapCampagnaPerLeadsystem(leadF?.campagna) : ""}
          onChangeText={setCampagna}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Inserisci<Text style={[styles.label,{color:'#3471CC'}]}> Note</Text></Text>
        <TextInput
          style={[styles.input, { height: 120 }]}  // Imposta un'altezza maggiore
          value={note}
          onChangeText={setNote}
          multiline  // Abilita l'inserimento multilinea
          numberOfLines={4}  // Puoi specificare quante linee visualizzare inizialmente
          textAlignVertical="top"  // Allinea il testo in alto
        />
      </View>
      <TouchableOpacity 
        style={[styles.buttonSave, isSubmitting && styles.buttonSaveDisabled]} 
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonTextSave}>Salva scheda lead</Text>
        )}
      </TouchableOpacity>
      <TypeSelectorModal
        isVisible={isModalVisible}
        onClose={hideModal} 
        lead={leadF && leadF}
        item={item}
        esito={esito}
        onSave={onSave}
        modificaLeadLocale={(idLead, nuoviDati) => {
          console.log("modificaLeadLocale chiamata in Lead con:", idLead, nuoviDati);
          modificaLeadLocale(idLead, nuoviDati);
        }}
        setColumnData={setColumnData}
      />
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#3471CC',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#3471CC',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  contentContainer :{
    paddingBottom:80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:'#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  starIcon: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  whatsappButton: {
    backgroundColor: "#3471CC",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  info: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color:'#3471CC'
  },
  details: {
    marginBottom: 10,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  clockIcon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  detailText: {
    marginLeft: 10,
    color:'#000'
  },
  recall: {
    marginVertical:10,
    color:'#000',
    backgroundColor: '#F9FBFC'
  },
  recallButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  phoneIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  recallText: {
    marginLeft: 10,
    marginRight: 10,
    color:'#3471CC',
  },
  closeIcon: {
    width: 15,
    height: 15,
  },
  title2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#000'
  },
  inputGroup: {
    marginBottom: 15,
  },
  label2: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'#000'
  },
  label: {
    fontSize: 16,
    color:'#000'
  },
  input: {
    borderWidth: 1,
    borderColor: '#3471CC',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  header2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'#000'
  },
  opportunityContainer: {
    backgroundColor: '#FFF5E1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 16,
  },
  opportunityText: {
    color: '#FFA500',
    fontSize: 14,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  
  text: {
    marginLeft: 14,
    flex: 1,
    color:'#919191'
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  buttonSave: {
    backgroundColor: '#3471cc',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonTextSave: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toast: {
    backgroundColor: '#333', // Colore di sfondo del toast
    borderRadius: 10, // Bordo arrotondato
    padding: 10, // Padding interno
  },
  toastText1: {
    fontSize: 16, // Dimensione del testo principale
    fontWeight: 'bold', // Grassetto
    color: '#000', // Colore del testo principale
  },
  toastText2: {
    fontSize: 14, // Dimensione del testo secondario
    color: '#000', // Colore del testo secondario
  },
});

export default LeadDetails;