import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import network from '@/constants/Network';

const LeadContext = createContext(null);

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [originalLeads, setOriginalLeads] = useState([])

  const fetchLeads = async () => {
    setIsLoading(true);
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token){
        return
      }
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      const userFixId = user.role === "orientatore" ? user.utente : user._id;

      let response;
      if (user.role === "orientatore") {
        response = await axios.post(network.serverip + '/get-orientatore-lead-base', {
          _id: user._id
        });
      } else {
        response = await axios.post(network.serverip + '/get-leads-manual-base', {
          _id: userFixId
        });
      }

      setLeads(response.data);
      setOriginalLeads(response.data);
    } catch (error) {
      console.error("Errore nel recupero delle lead:", error.message);
    } finally {
      setIsLoading(false);
      setLoading(false)
    }
  };

  const updateLead = (updatedLead) => {
    setLeads(prevLeads => prevLeads.map(lead => 
      lead._id === updatedLead._id ? updatedLead : lead
    ));
    setOriginalLeads(prevLeads => prevLeads.map(lead => 
        lead._id === updatedLead._id ? updatedLead : lead
    ))
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <LeadContext.Provider value={{ leads, isLoading, fetchLeads, updateLead, setLeads, loading, setLoading, originalLeads, setOriginalLeads }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => useContext(LeadContext);