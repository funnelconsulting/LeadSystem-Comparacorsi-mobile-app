import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { useNavigation } from '@react-navigation/native';

const LeadsColumns = ({loadOtherLeads, loadindInside, setLoadOtherLeads, leads, isZoomedOut, orientatoriOptions, setLeads, onUpdateLead, modificaLead, fetchLeads, handleLoadOtherLeads}) => {
  const navigation = useNavigation();
  const scrollRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;
  // Stato per tenere traccia delle posizioni e dimensioni delle colonne
  const [columnsLayout, setColumnsLayout] = useState({
    positions: {},
    totalWidth: 0,
  });

  const [columnData, setColumnData] = useState({
    column1: [],
    column2: [],
    column3: [],
    column4: [],
    column5: [],
    column6: [],
    column7: [],
    column8: [],
    column9: [],
    column10: [],
  });

  useEffect(() => {
    const validLeads = Array.isArray(leads) ? leads : [];
    setColumnData({
      column1: validLeads.filter(lead => lead.esito === "Da contattare"),
      column2: validLeads.filter(lead => lead.esito === "In lavorazione"),
      column3: validLeads.filter(lead => lead.esito === "Non risponde"),
      column4: validLeads.filter(lead => lead.esito === "Irraggiungibile"),
      column5: validLeads.filter(lead => lead.esito === "Non valido"),
      column6: validLeads.filter(lead => lead.esito === "Non interessato"),
      column7: validLeads.filter(lead => lead.esito === "Opportunità"),
      column8: validLeads.filter(lead => lead.esito === "In valutazione"),
      column9: validLeads.filter(lead => lead.esito === "Venduto"),
      column10: validLeads.filter(lead => lead.esito === "Iscrizione posticipata"),
    });
  }, [leads.length > 0, leads, setLeads]);

  const aggiornaColumnData = (leadsList) => {
    const validLeads = Array.isArray(leadsList) ? leadsList : [];
    setColumnData({
      column1: validLeads.filter(lead => lead.esito === "Da contattare"),
      column2: validLeads.filter(lead => lead.esito === "In lavorazione"),
      column3: validLeads.filter(lead => lead.esito === "Non risponde"),
      column4: validLeads.filter(lead => lead.esito === "Irraggiungibile"),
      column5: validLeads.filter(lead => lead.esito === "Non valido"),
      column6: validLeads.filter(lead => lead.esito === "Non interessato"),
      column7: validLeads.filter(lead => lead.esito === "Opportunità"),
      column8: validLeads.filter(lead => lead.esito === "In valutazione"),
      column9: validLeads.filter(lead => lead.esito === "Venduto"),
      column10: validLeads.filter(lead => lead.esito === "Iscrizione posticipata"),
    });
  };

  // Funzione per rendere una colonna
  const renderColumn = (columnName, title, borderColor) => (
    <View
    style={[
      styles.column,
      { borderColor },
      isZoomedOut && styles.columnZoomedOut
    ]}
  >
    <View style={[styles.topColumn, isZoomedOut && styles.topColumnZoomedOut]}>
      <Text style={[styles.columnTitle, isZoomedOut && styles.columnTitleZoomedOut]}>{title}</Text>
      {(title === "Non valido" || title === "Lead persa") && !loadOtherLeads ?
        <TouchableOpacity onPress={handleLoadOtherLeads} style={[styles.circleTitle, isZoomedOut && styles.circleTitleZoomedOut]}>
          <Text style={[styles.refreshIcon, isZoomedOut && styles.refreshIconZoomedOut]}>↻</Text>
        </TouchableOpacity>
        :
        <View style={[styles.circleTitle, isZoomedOut && styles.circleTitleZoomedOut]}>
          <Text style={[styles.numberTitle, isZoomedOut && styles.numberTitleZoomedOut]}>{columnData[columnName].length}</Text>
        </View>
      }
    </View>
    {loadindInside ?
    <ScrollView contentContainerStyle={styles.listLoader}>
      <ActivityIndicator size="small" color="#000" />
    </ScrollView> :
    <ScrollView contentContainerStyle={styles.list}>
      {columnData[columnName]
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .map((item) => (
        <TouchableOpacity
        onPress={() => navigation.navigate('filterData', {
          item, 
          orientatoriOptions, 
          onUpdateLead, 
          setLeads, 
          modificaLeadLocale: (idLead, nuoviDati) => {
            console.log("modificaLeadLocale chiamata con:", idLead, nuoviDati);
            modificaLead(idLead, nuoviDati);
            const nuoveLeads = leads.map(lead =>
              lead._id === idLead ? {...lead, ...nuoviDati} : lead
            );
            aggiornaColumnData(nuoveLeads);
          },
          fetchLeads,
          setColumnData
        })} 
          key={item._id}
          style={[
            (item?.appDate && item?.appDate?.trim() !== "") ? styles.cardGreen : styles.card, 
            isZoomedOut && styles.cardZoomedOut]
        }
        >
          <View style={styles.contactInfo}>
            <View style={[styles.avatar, isZoomedOut && styles.avatarZoomedOut]}>
              <Text style={[styles.avatarText, isZoomedOut && styles.avatarTextZoomedOut]}>
                {item.orientatori ? `${item.orientatori.nome[0]}${item.orientatori.cognome[0]}` : 'N/A'}
              </Text>
            </View>
            <View style={styles.contactDetails}>
              <Text style={[styles.contactName, isZoomedOut && styles.contactNameZoomedOut]}>{item.nome + ' ' + item.cognome}</Text>
              <View style={styles.contactActions}>
                <View style={[styles.infoButton, isZoomedOut && styles.infoButtonZoomedOut]}>
                  <Text style={[styles.infoText, isZoomedOut && styles.infoTextZoomedOut]}>Info</Text>
                </View>
                {item.priorità === 3 ? 
                  (<View
                  style={[
                    styles.priorityContainer,
                    isZoomedOut && styles.priorityContainerZoomedOut
                  ]}
                >
                  <Image
                    source={require("..//..//../assets/star.png")}
                    style={[styles.icon, isZoomedOut && styles.iconZoomedOut]}
                  />
                  <Image
                    source={require("..//..//../assets/star.png")}
                    style={[styles.icon, isZoomedOut && styles.iconZoomedOut]}
                  />
                  <Image
                    source={require("..//..//../assets/star.png")}
                    style={[styles.icon, isZoomedOut && styles.iconZoomedOut]}
                  />
                </View>) : item.priorità === 2 ? (
                  <View
                  style={[
                    styles.priorityContainer,
                    isZoomedOut && styles.priorityContainerZoomedOut
                  ]}
                >
                  <Image
                    source={require("..//..//../assets/star.png")}
                    style={[styles.icon, isZoomedOut && styles.iconZoomedOut]}
                  />
                  <Image
                    source={require("..//..//../assets/star.png")}
                    style={[styles.icon, isZoomedOut && styles.iconZoomedOut]}
                  />
                </View>
                ) : (
                  <View
                  style={[
                    styles.priorityContainer,
                    isZoomedOut && styles.priorityContainerZoomedOut
                  ]}
                >
                  <Image
                    source={require("..//..//../assets/star.png")}
                    style={[styles.icon, isZoomedOut && styles.iconZoomedOut]}
                  />
                </View>
                )}
                {item.recallDate && item?.recallHours?.trim() !== "" && <Image
                  source={require("..//..//../assets/calendar.png")}
                  style={[styles.icon, isZoomedOut && styles.iconZoomedOut]}
                />}
              </View>
            </View>
            <Image
              source={require("..//..//../assets/dots.png")}
              style={[styles.icon, isZoomedOut && styles.iconZoomedOut]}
            />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>}
  </View>
  );

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        nestedScrollEnabled={true}
        ref={scrollRef}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.columnsContainer}>
          {renderColumn("column1", "Da contattare", "#94B7D3")}
          {renderColumn("column2", "In lavorazione", "#426385")}
          {renderColumn("column3", "Non risponde", "#F68506")}
          {renderColumn("column4", "Irraggiungibile", "#C21347")}
          {renderColumn("column5", "Non valido", "#273F45")}
          {renderColumn("column6", "Lead persa", "#833120")}
          {renderColumn("column7", "Opportunità", "#F7BB0A")}
          {renderColumn("column8", "In valutazione", "#3471CB")}
          {renderColumn("column9", "Venduto", "#309789")}
          {renderColumn("column10", "Iscrizione posticipata", "#0EEDB5")}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 6,
      },
      columnsContainer: {
        flexDirection: "row",
        paddingHorizontal: 10,
      },
      column: {
        flex: 1,
        borderTopWidth: 20,
        borderColor: "#94B7D3",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        paddingHorizontal: 10,
        margin: 5,
        paddingBottom: 20,
        minWidth: 250,
        height: "92%",
        backgroundColor: "#94B7D31A",
        transition: "all 0.3s ease-in-out",
      },
      columnZoomedOut: {
        minWidth: 155, // Ridotto a 0.7
        height: "62%",
      },
      card: {
        padding: 10,
        paddingVertical: 16,
        marginVertical: 4,
        borderRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#6A6A6A',
        minWidth: 270,
        backgroundColor: '#fff',
        zIndex: 1000,
        transition: "all 0.3s ease-in-out",
      },
      listLoader: {
        display: "flex",
        alignItems: 'center'
      },
      cardGreen: {
        padding: 10,
        paddingVertical: 16,
        marginVertical: 4,
        borderRadius: 10,
        elevation: 3,
        borderWidth: 2,
        borderColor: '#008000',
        minWidth: 270,
        backgroundColor: '#fff',
        zIndex: 1000,
        transition: "all 0.3s ease-in-out",
      },
      cardZoomedOut: {
        padding: 5, // Ridotto a 0.7
        paddingVertical: 11, // Ridotto a 0.7
        marginVertical: 2.8, // Ridotto a 0.7
        minWidth: 155, // Ridotto a 0.7
      },
      contactInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-around'
      },
      topColumn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#F5F7FA',
        transition: "all 0.3s ease-in-out",
      },
      topColumnZoomedOut: {
        padding: 5, // Ridotto a 0.7
      },
      columnTitle: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        fontWeight: '600',
        transition: "all 0.3s ease-in-out",
      },
      columnTitleZoomedOut: {
        fontSize: 12.2, // Ridotto a 0.7
        transition: "all 0.3s ease-in-out",
      },
      circleTitle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#E8ECEF',
        justifyContent: 'center',
        alignItems: 'center',
        transition: "all 0.3s ease-in-out",
      },
      circleTitleZoomedOut: {
        width: 16, // Ridotto a 0.7
        height: 16, // Ridotto a 0.7
        borderRadius: 10.5, // Ridotto a 0.7
      },
      numberTitle: {
        fontSize: 13,
        color: '#000',
        fontWeight: '600',
        transition: "all 0.3s ease-in-out",
      },
      numberTitleZoomedOut: {
        fontSize: 7.1, // Ridotto a 0.7
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#e5e7eb",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        transition: "all 0.3s ease-in-out",
      },
      avatarZoomedOut: {
        width: 20, // Ridotto a 0.7
        height: 20, // Ridotto a 0.7
        borderRadius: 10, // Ridotto a 0.7
        marginRight: 5, // Ridotto a 0.7
      },
      avatarText: {
        fontSize: 16,
        color: "#1f2937",
        fontWeight: "bold",
        transition: "all 0.3s ease-in-out",
      },
      avatarTextZoomedOut: {
        fontSize: 9.2, // Ridotto a 0.7
      },
      contactDetails: {
        flexDirection: "column",
        justifyContent: "center",
      },
      contactName: {
        fontSize: 14,
        color: "#1f2937",
        fontWeight: "500",
        transition: "all 0.3s ease-in-out",
      },
      contactNameZoomedOut: {
        fontSize: 7.8, // Ridotto a 0.7
      },
      contactActions: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
      },
      infoButton: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 5,
        backgroundColor: "#3471cc",
        marginRight: 10,
        transition: "all 0.3s ease-in-out",
      },
      infoButtonZoomedOut: {
        paddingHorizontal: 5, // Ridotto a 0.7
        paddingVertical: 1, // Ridotto a 0.7
        marginRight: 5, // Ridotto a 0.7
      },
      infoText: {
        fontSize: 12,
        color: "#fff",
        transition: "all 0.3s ease-in-out",
      },
      infoTextZoomedOut: {
        fontSize: 6.4, // Ridotto a 0.7
      },
      icon: {
        width: 14,
        height: 14,
        marginLeft: 5,
        transition: "all 0.3s ease-in-out",
      },
      refreshIcon: {
        fontSize: 20,
        color: '#000',
      },
      refreshIconZoomedOut: {
        fontSize: 14,
      },
      iconZoomedOut: {
        width: 7.8, // Ridotto a 0.7
        height: 7.8, // Ridotto a 0.7
        marginLeft: 2.5, // Ridotto a 0.7
      },
      priorityContainer: {
        padding: 3,
        flexDirection: "row",
        backgroundColor: "#94B7D31A",
        borderRadius: 5,
        justifyContent: "center",
        transition: "all 0.3s ease-in-out",
      },
      priorityContainerZoomedOut: {
        padding: 1.7, // Ridotto a 0.7
      },
});

export default LeadsColumns;