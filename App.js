import { SearchBar, Button } from '@rneui/base';
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';


export default function App() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [reservation, setReservation] = useState('');
  const [reservationResult, setReservationResult] = useState('');
  const [expandedItem, setExpandedItem] = useState(null);

  // Function to handle item click
  const handleItemClick = (item) => {
    // Toggle expanded state for the clicked item
    if (expandedItem === item && reservation === item["Room Name"]) {
      setExpandedItem(null); // Collapse if already expanded
      setReservation(null);
    } else {
      setReservationResult(handleReservations(item["Room Name"])),
      setExpandedItem(item), // Expand if not expanded
      setReservation(item["Room Name"]);
    }
  };

  const renderRoomName = (item) => {
    return (
      <TouchableOpacity onPress={() => handleItemClick(item)}>
        <Text style={styles.resultText}>{item['Room Name']}</Text>
      </TouchableOpacity>
    );
  };

  const renderNoReservation = (reservationResult) => {
    return (
      <Text>{reservationResult}</Text>
    );
  };

  const renderReservation = (reservationResult) => {
    return (
      Array.isArray(reservationResult) && reservationResult.map((res, index) => (
        <View key={index}>
          <Text>{`Reservation nr ${index + 1}`}</Text>
          {Object.keys(res).map((key, innerIndex) => (
            <Text key={innerIndex}>{`${key}: ${res[key]}`}</Text>
          ))}
        </View>
      ))
    );
  }

  const renderExpandedItem = (item) => {
    return (
      <View>
        <Text style={styles.resultText}>{item['Room Name']}</Text>
        {Object.keys(item).map((key, index) => (
          <Text key={index}>{`${key}: ${item[key]}`}</Text>
        ))}
        <Text>Reservations:</Text>
        {/* if reservationResult.map[0] == 'No reservations found' show only that. Else do the following*/}
        {/* {reservationResult === 'No reservations found' && <Text>{reservationResult}</Text>} */}
        {console.log(reservationResult)}
        {Array.isArray(reservationResult) && reservationResult[0].includes("No reservations found") ? renderNoReservation(reservationResult[0][0]) : renderReservation(reservationResult)}
      </View>
    );
  };

  const handleReservations = (room) => {
    fetch(`https://strawhats.info/api/v1/room/reservation/${encodeURIComponent(search)}`,{
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      setReservationResult(json); // Store the JSON object directly, not stringified
    })
    .catch((error) => {
      console.error(error);
      setReservationResult( error.toString() );
    });
  }
  const handleSearch = async (search) => {
    console.log( ` Search for ${search} `)
    setSearchResult( `Search for ${search}`)
    try {
      const response = await fetch(`https://strawhats.info/api/v1/search/${encodeURIComponent(search)}`,{
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      //console.log( ` Response ${response} `)
      if (!response.ok) {
        setSearchResult('No results found');
        return;
      }
      const json = await response.json();
      setSearchResult(json); // Convert and save the response in state
    } catch (error) {
      console.error(error);
      setSearchResult('An error occurred');      
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text>Search for a room</Text>
        <SearchBar
          placeholder="Type here"
          onChangeText={text => setSearch(text)}
          value={search}
        />
        <Button
          title="Search"
          onPress={() => handleSearch(search)}
        />
      </View>
      <ScrollView style={styles.resultContainer}>
        {Array.isArray(searchResult) && searchResult.map((innerList, index) => (
          <View key={index}>
            {innerList.map((item, innerIndex) => (
              <View key={innerIndex}>
                {expandedItem === item ? renderExpandedItem(item) : renderRoomName(item)}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  resultContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultText: {
    fontFamily: 'Courier New',
    fontSize: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
});
