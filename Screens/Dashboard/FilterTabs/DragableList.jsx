import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  PanResponder,
  Animated,
  FlatList,
  Dimensions
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { DraxProvider, DraxView } from 'react-native-drax';

const DraggableCardList = ({showModalEdit, hideModalEdit}) => {
  const navigation = useNavigation();
  const scrollRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;

  // Stato per tenere traccia delle posizioni e dimensioni delle colonne
  const [columnsLayout, setColumnsLayout] = useState({
    positions: {},
    totalWidth: 0,
  });

  const [columnData, setColumnData] = useState({
    column1: [{ key: "1", label: "Card 1" }, { key: "2", label: "Card 2" }, { key: "22", label: "Card 2" }, { key: "28", label: "Card 2" }, { key: "29", label: "Card 2" }],
    column2: [{ key: "3", label: "Card 3" }, { key: "4", label: "Card 4" }],
    column3: [{ key: "5", label: "Card 5" }],
    column4: [{ key: "6", label: "Card 6" }],
    column5: [{ key: "7", label: "Card 7" }],
    column6: [{ key: "8", label: "Card 8" }],
    column7: [{ key: "9", label: "Card 9" }],
    column8: [{ key: "10", label: "Card 10" }],
    column9: [{ key: "11", label: "Card 11" }],
    column10: [{ key: "12", label: "Card 12" }],
  });

  // Riferimenti per misurare le colonne
  const columnsRefs = useRef({});

  // Misuriamo le dimensioni delle colonne dopo il layout
  useEffect(() => {
    setTimeout(() => {
      const positions = {};
      let measuredCount = 0;
      const totalColumns = Object.keys(columnsRefs.current).length;
      Object.entries(columnsRefs.current).forEach(([colName, ref]) => {
        ref.measure((x, y, width, height, pageX, pageY) => {
          positions[colName] = { x, y, width, height, pageX, pageY };
          measuredCount++;
          if (measuredCount === totalColumns) {
            const totalWidth = Object.values(positions).reduce((sum, col) => sum + col.width, 0);
            setColumnsLayout({
              positions,
              totalWidth,
            });
          }
        });
      });
    }, 500);
  }, []);

  // Funzione per gestire il drop dell'item
  const handleDrop = (item, toColumn) => {
    setColumnData((prevData) => {
      const newData = { ...prevData };
      // Rimuoviamo l'item da tutte le colonne
      Object.keys(newData).forEach((col) => {
        newData[col] = newData[col].filter((i) => i.key !== item.key);
      });
      // Aggiungiamo l'item alla nuova colonna
      newData[toColumn] = [...newData[toColumn], item];
      return newData;
    });
  };

  // Funzione per rendere una colonna
  const renderColumn = (columnName, title, borderColor) => (
    <DraxView
      ref={(ref) => { columnsRefs.current[columnName] = ref; }}
      style={[styles.column, { borderColor }]}
      receivingStyle={styles.receiving} // Stile quando riceve un drag
      // Gestiamo l'evento di drop sulla colonna
      onReceiveDragDrop={(event) => {
        const item = event.dragged.payload;
        handleDrop(item, columnName);
      }}
    >
      {/* Header della colonna */}
      <View style={styles.topColumn}>
        <Text style={styles.columnTitle}>{title}</Text>
        <View style={styles.circleTitle}>
          <Text style={styles.numberTitle}>{columnData[columnName].length}</Text>
        </View>
      </View>
      {/* Usiamo ScrollView per la lista di card */}
      <ScrollView contentContainerStyle={styles.list}>
        {columnData[columnName].map((item) => (
          <DraxView
            key={item.key}
            style={styles.card}
            draggingStyle={styles.dragging} // Stile durante il drag
            dragPayload={item} // Payload da trasferire durante il drag
            longPressDelay={150} // Ritardo prima di iniziare il drag
          >
            {/* Contenuto della card */}
            <View style={styles.contactInfo}>
              <TouchableOpacity onPress={() => showModalEdit()} style={styles.avatar}>
                <Image
                  source={require("..//..//../assets/Edit.png")}
                  style={styles.editIcon}
                />
              </TouchableOpacity>
              <View style={styles.contactDetails}>
                <Text style={styles.contactName}>Alessandro Lombardo</Text>
                <View style={styles.contactActions}>
                  <TouchableOpacity onPress={() => navigation.navigate('filterData')} style={styles.infoButton}>
                    <Text style={styles.infoText}>Info</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      padding: 3,
                      flexDirection: "row",
                      backgroundColor: "#94B7D31A",
                      borderRadius: 5,
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      source={require("..//..//../assets/star.png")}
                      style={styles.icon}
                    />
                    <Image
                      source={require("..//..//../assets/star.png")}
                      style={styles.icon}
                    />
                    <Image
                      source={require("..//..//../assets/star.png")}
                      style={styles.icon}
                    />
                  </View>
                  <Image
                    source={require("..//..//../assets/calendar.png")}
                    style={styles.icon}
                  />
                </View>
              </View>
              <Image
                source={require("..//..//../assets/dots.png")}
                style={styles.icon}
              />
            </View>
          </DraxView>
        ))}
      </ScrollView>
    </DraxView>
  );

  return (
    <DraxProvider
      // Gestiamo l'auto-scroll durante il drag
      onDragUpdate={(event) => {
        const { dragAbsolutePosition } = event;
        const screenWidth = Dimensions.get('window').width;
        const threshold = 50; // Distanza dal bordo per iniziare lo scroll
        const maxScrollX = columnsLayout.totalWidth - screenWidth;

        const draggedX = dragAbsolutePosition.x;

        // Scroll a destra
        if (draggedX > screenWidth - threshold && scrollX._value < maxScrollX) {
          const newScrollX = Math.min(scrollX._value + 10, maxScrollX);
          scrollRef.current.scrollTo({ x: newScrollX, animated: false });
          scrollX.setValue(newScrollX);
        }

        // Scroll a sinistra
        if (draggedX < threshold && scrollX._value > 0) {
          const newScrollX = Math.max(scrollX._value - 10, 0);
          scrollRef.current.scrollTo({ x: newScrollX, animated: false });
          scrollX.setValue(newScrollX);
        }
      }}
    >
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
    </DraxProvider>
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
    borderBottomLeftRadius: 25, // Arrotonda l'angolo in basso a sinistra
    borderBottomRightRadius: 25, // Arrotonda l'angolo in basso a destra
    paddingHorizontal: 10,
    margin: 5,
    paddingBottom: 20,
    minWidth: 250,
    //height: Dimensions.get('window').height - 100,
    height: "92%",
    backgroundColor: "#94B7D31A",
  },
  column2: {
    flex: 1,
    borderTopWidth: 20,
    borderColor: "#426385",
    borderBottomLeftRadius: 25, // Arrotonda l'angolo in basso a sinistra
    borderBottomRightRadius: 25, // Arrotonda l'angolo in basso a destra
    paddingHorizontal: 10,
    margin: 5,
    paddingBottom: 20,
    minWidth: 200,
    height: "92%",
    backgroundColor: "#94B7D31A",
  },
  column3:{
    borderColor: "#F68506",
    flex: 1,
    borderTopWidth: 20,
    borderBottomLeftRadius: 25, // Arrotonda l'angolo in basso a sinistra
    borderBottomRightRadius: 25, // Arrotonda l'angolo in basso a destra
    paddingHorizontal: 10,
    margin: 5,
    paddingBottom: 20,
    minWidth: 200,
    height: "92%",
    backgroundColor: "#94B7D31A",
  },
  column4:{
    borderColor: "#C21347",
    flex: 1,
    borderTopWidth: 20,
    borderBottomLeftRadius: 25, // Arrotonda l'angolo in basso a sinistra
    borderBottomRightRadius: 25, // Arrotonda l'angolo in basso a destra
    paddingHorizontal: 10,
    margin: 5,
    paddingBottom: 20,
    minWidth: 200,
    height: "92%",
    backgroundColor: "#94B7D31A",
  },
  column5:{
    borderColor: "#273F45",
    flex: 1,
    borderTopWidth: 20,
    borderBottomLeftRadius: 25, // Arrotonda l'angolo in basso a sinistra
    borderBottomRightRadius: 25, // Arrotonda l'angolo in basso a destra
    paddingHorizontal: 10,
    margin: 5,
    paddingBottom: 20,
    minWidth: 200,
    height: "92%",
    backgroundColor: "#94B7D31A",
  },
  column6:{
    borderColor: "#833120",
    flex: 1,
    borderTopWidth: 20,
    borderBottomLeftRadius: 25, // Arrotonda l'angolo in basso a sinistra
    borderBottomRightRadius: 25, // Arrotonda l'angolo in basso a destra
    paddingHorizontal: 10,
    margin: 5,
    paddingBottom: 20,
    minWidth: 200,
    height: "92%",
    backgroundColor: "#94B7D31A",
  },
  column7:{
    borderColor: "#F7BB0A",
    flex: 1,
    borderTopWidth: 20,
    borderBottomLeftRadius: 25, // Arrotonda l'angolo in basso a sinistra
    borderBottomRightRadius: 25, // Arrotonda l'angolo in basso a destra
    paddingHorizontal: 10,
    margin: 5,
    paddingBottom: 20,
    minWidth: 200,
    height: "92%",
    backgroundColor: "#94B7D31A",
  },
  column8:{
    borderColor: "#3471CB",
    flex: 1,
    borderTopWidth: 20,
    borderBottomLeftRadius: 25, // Arrotonda l'angolo in basso a sinistra
    borderBottomRightRadius: 25, // Arrotonda l'angolo in basso a destra
    paddingHorizontal: 10,
    margin: 5,
    paddingBottom: 20,
    minWidth: 200,
    height: "92%",
    backgroundColor: "#94B7D31A",
  },
  column9:{
    borderColor: "#309789",
    flex: 1,
    borderTopWidth: 20,
    borderBottomLeftRadius: 25, // Arrotonda l'angolo in basso a sinistra
    borderBottomRightRadius: 25, // Arrotonda l'angolo in basso a destra
    paddingHorizontal: 10,
    margin: 5,
    paddingBottom: 20,
    minWidth: 200,
    height: "92%",
    backgroundColor: "#94B7D31A",
  },
  column10:{
    borderColor: "#0EEDB5",
    flex: 1,
    borderTopWidth: 20,
    borderBottomLeftRadius: 25, // Arrotonda l'angolo in basso a sinistra
    borderBottomRightRadius: 25, // Arrotonda l'angolo in basso a destra
    paddingHorizontal: 10,
    margin: 5,
    paddingBottom: 20,
    minWidth: 200,
    height: "92%",
    backgroundColor: "#94B7D31A",
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
    backgroundColor: '#F5F7FA', // Colore di sfondo chiaro
  },
  columnTitle: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  circleTitle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E8ECEF', // Colore di sfondo del cerchio
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberTitle: {
    fontSize: 13,
    color: '#000', // Colore del numero
    fontWeight: '600',
  },
  editIcon: {
    width: 17,
    height: 17,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "bold",
  },
  contactDetails: {
    flexDirection: "column",
    justifyContent: "center",
  },
  contactName: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "500",
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
  },
  infoText: {
    fontSize: 12,
    color: "#fff",
  },
  icon: {
    width: 14,
    height: 14,
    marginLeft: 5,
  },
  contactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 7,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  contactCount: {
    backgroundColor: "#ccc",
    borderRadius: 50,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 16,
    color: "#1f2937",
  },
    // Stile durante il drag
    dragging: {
      opacity: 0.2,
    },
    // Stile quando riceve un drag
    receiving: {
      borderColor: 'green',
      borderWidth: 2,
    },
});

export default DraggableCardList;
