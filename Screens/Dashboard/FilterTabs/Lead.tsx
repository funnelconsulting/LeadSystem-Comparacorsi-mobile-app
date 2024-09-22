import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image ,TextInput,Button, Platform} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import TypeSelectorModal from "./TypeSelectorModal";
import DateTimePickerModal from "react-native-modal-datetime-picker";

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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };
  const handleRecall = () => {
    setIsRecallVisible(!isRecallVisible);
  };
  const [statoLead, setStatoLead] = useState('');
  const [motivo, setMotivo] = useState('');
  const [sommario, setSommario] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [orientatore, setOrientatore] = useState('');
  const [campagna, setCampagna] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    // Implement logic to submit the form data
    console.log('Form submitted with data:', {
      statoLead,
      motivo,
      sommario,
      telefono,
      email,
      orientatore,
      campagna,
      note,
    });
  };

  return (
    <ScrollView style={styles.container}  contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.rating}>
          <Image source={require("..//..//../assets/star.png")} style={styles.starIcon} />
          <Image source={require("..//..//../assets/star.png")} style={styles.starIcon} />
          <Image source={require("..//..//../assets/star.png")} style={styles.starIcon} />
        </View>
        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={() => console.log("Whatsapp pressed")}
        >
          <Text style={styles.buttonText}>Contatta su Whatsapp</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>Alessandro Grandoni</Text>
        <View style={styles.details}>
          <View style={styles.detail}>
            <Image source={require("..//..//../assets/clock1.png")} style={styles.clockIcon} />
            <Text style={styles.detailText}>
              Data di creazione  <Text style={[styles.detailText,{color:'#3471CC'}]}>
              18/09/2024 14:25
            </Text> 
            </Text>
          </View>
          <View style={styles.detail}>
            <Image source={require("..//..//../assets/clock2.png")} style={styles.clockIcon} />
            <Text style={styles.detailText}>
              Data di creazione  <Text style={[styles.detailText,{color:'green'}]}>
              18/09/2024 14:25
            </Text> 
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={[styles.recallButton,{backgroundColor:'#3471cc',justifyContent:'center',borderRadius:10,}]} onPress={showDatePicker}>
            <Image source={require("..//..//../assets/caller.png")} style={styles.phoneIcon} />
            <Text style={[styles.recallText,{color:'#fff'}]}>
          Organizza una recall
            </Text>
            
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
      {isRecallVisible && (
        <View style={styles.recall}>
          {organize ? (
            <TouchableOpacity style={[styles.recallButton,{backgroundColor:'#3471cc',justifyContent:'center',borderRadius:10,}]} onPress={showDatePicker}>
            <Image source={require("..//..//../assets/caller.png")} style={styles.phoneIcon} />
            <Text style={[styles.recallText,{color:'#fff'}]}>
          Organizza una recall
            </Text>
            
          </TouchableOpacity>
          ):
          (
<TouchableOpacity style={styles.recallButton} onPress={handleRecall}>
            <Image source={require("..//..//../assets/phone.png")} style={styles.phoneIcon} />
            <Text style={styles.recallText}>
              Recall fissata 23/09/2023 16:30
            </Text>
            <Image source={require("..//..//../assets/x.png")} style={styles.closeIcon} />
          </TouchableOpacity>
          )}
        </View>
      )}
      <View style={styles.header2}>
        <Text style={styles.headerText}>Stato Lead</Text>
        <TouchableOpacity style={styles.opportunityContainer} onPress={showModal}>
          <Text style={styles.opportunityText}>Opportunità</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.label2}>Motivo</Text>
        <Text style={styles.text}>Lorem ipsum dolor sit amet,</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: '#007AFF' }]}>Sommario</Text>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
      </View>
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
        <TextInput
          style={styles.input}
          value={orientatore}
          onChangeText={setOrientatore}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Campagna</Text>
        <TextInput
          style={styles.input}
          value={campagna}
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
      <TouchableOpacity style={styles.buttonSave} onPress={handleSubmit}>
        <Text style={styles.buttonTextSave}>Salva scheda lead</Text>
      </TouchableOpacity>
      <TypeSelectorModal
        isVisible={isModalVisible}
        onClose={hideModal} 
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
});

export default LeadDetails;