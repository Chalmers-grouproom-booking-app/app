import { StatusBar } from 'expo-status-bar';
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

  const renderExpandedItem = (item) => {
    return (
      <View>
        <Text style={styles.resultText}>{item['Room Name']}</Text>
        {Object.keys(item).map((key, index) => (
          <Text key={index}>{`${key}: ${item[key]}`}</Text>
        ))}
        {Array.isArray(reservationResult) && reservationResult.map((res, index) => (
          <View>
            <Text>{`Reservation nr ${index+1}`}</Text>
            {Object.keys(res).map((key, innerIndex) => (
              <Text key={innerIndex}>{`${key}: ${res[key]}`}</Text>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const handleSearch = (search) => {
    console.log(search);
    fetch(`https://chalmers_grouproom.sacic.dev/api/v1/search/${encodeURIComponent(search)}`,{
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      setSearchResult(json); // Store the JSON object directly, not stringified
    })
    .catch((error) => {
      console.error(error);
      setSearchResult( error.toString() );
    });
  };

  const handleReservations = (room) => {
    fetch(`https://chalmers_grouproom.sacic.dev/api/v1/room/reservation/${encodeURIComponent(room)}`,{
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

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
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
