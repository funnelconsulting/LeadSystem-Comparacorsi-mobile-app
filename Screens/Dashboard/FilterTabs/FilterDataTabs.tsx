import React, { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Lead from './Lead';
import Chat from './ChatTab';
import MInfor from './MInfor';
import { useRoute } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();
const FilterDataTabs = () => {
  const CHATAPI = "https://chatbolt-comparacorsi-production.up.railway.app/api";
  const [chat, setChat] = useState();
  const [lead, setLead] = useState();
  const route = useRoute(); // Usa useRoute per ottenere i parametri della navigazione
  const { item, orientatoriOptions, onUpdateLead, setLeads, fetchLeads, setColumnData } = route.params;

  const getLeadChat = async () => {
    try {

      const response = await fetch(`${CHATAPI}/get-lead-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Decommentare se necessario
        },
        body: JSON.stringify({ numeroTelefono: item.numeroTelefono, leadId: item._id })
      });

      const data = await response.json();
      const { chat } = data;
      console.log(data);
      setChat(chat);
    } catch (error) {
      console.error('Errore nel recupero della chat:', error);
    }
  };

  useEffect(() => {
    getLeadChat();
  }, []);
  return (
      <Tab.Navigator screenOptions={{headerShown:false, tabBarLabelStyle: { textTransform: 'none', fontWeight: '600', fontSize: 14}}}>
        <Tab.Screen name='Scheda Lead' 
        component={Lead} 
        initialParams={{ 
          item, 
          orientatoriOptions, 
          onUpdateLead, 
          setLeads, 
          modificaLeadLocale: (idLead, nuoviDati) => {
            console.log("modificaLeadLocale chiamata in FilterDataTabs con:", idLead, nuoviDati);
            route.params.modificaLeadLocale(idLead, nuoviDati);
          },
          fetchLeads, 
          setColumnData 
        }} />
        <Tab.Screen name='Info' component={MInfor} initialParams={{ item, orientatoriOptions, onUpdateLead }} />
        {chat && chat.messages && chat.messages.length > 0 && <Tab.Screen name='Chat' component={Chat} initialParams={{ item, orientatoriOptions, lead, chat }} />}
      </Tab.Navigator>
  )
}

export default FilterDataTabs