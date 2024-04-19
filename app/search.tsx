import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '@rneui/themed';
import { router } from 'expo-router';
import Filter from '../components/Filter'

type RoomInfo = {
  room_name: string;
  room_size: number;
  building: string;
  campus: string;
  equipment: string;
  longitude: number;
  latitude: number;
  entrance_latitude: number;
  entrance_longitude: number;
  description: string;
  first_come_first_served: boolean;
  floor_level: number;
  stair: string;
};

type RoomData = {
  building?: RoomInfo[];
  room_name?: RoomInfo[];
  room_size?: RoomInfo[];
  floor_level?: RoomInfo[];
  first_come_first_served?: RoomInfo[];
};

type TimeSlot = {
  start_date: string;
  start_time: string;
  end_time: string;
  end_date: string;
};

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResult, setSearchResult] = useState<RoomData | null>(null);
  const [reservationResult, setReservationResult] = useState<TimeSlot[] | null>(null);
  const [error, setError] = useState<string>(''); // Add this line
  const [expandedItem, setExpandedItem] = useState<RoomInfo | null>(null);

  const handleItemClick = (item: RoomInfo) => {
    if (expandedItem && expandedItem.room_name === item.room_name) {
      setExpandedItem(null); // Collapse if already expanded
    } else {
      setExpandedItem(item); // Expand if not expanded
      handleReservations(item.room_name);
    }
  };

  const handleReservations = async (room_name: string) => {
    try {
      const response = await fetch(`https://strawhats.info/api/v1/room/reservation?room_name=${room_name}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      if (!response.ok) {
        setReservationResult([]);
        return;
      }
      console.log(response);
      const json = await response.json() as TimeSlot[];
      setReservationResult(json);
    } catch (error) {
      console.error('An unexpected error occurred:', error.message || error.toString());
      setError("Failed to fetch data. Please try again."); // Update the UI to show a friendly error message
      setReservationResult(null);
    }
  };

  const handleSearch = async (search: string) => {
    setSearchText(search);
    setError(''); 
    try {
      const response = await fetch('https://strawhats.info/api/v1/search?room_name=' + encodeURIComponent(search), {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        console.log('Error response:', response.status, response.statusText);
        const errorResponse = await response.json(); // Attempt to parse error response
        setError(errorResponse.detail); // Set the error state to display the message to the user
        return;
      }

      const json = await response.json() as RoomData;
      let isEmpty = true;
      Object.keys(json).forEach((key) => {
        if (json[key].length > 0) {
          isEmpty = false;
        }
      });
      if (isEmpty) {
        setError('No search results found');
        setSearchResult(null);
        return;
      }
      setSearchResult(json);
    } catch (error) {
      console.error('An unexpected error occurred:', error.message || error.toString());
      setError("Failed to fetch data. Please try again."); // Update the UI to show a friendly error message
      setSearchResult(null);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={() => { router.back() }} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="gray" />
        </TouchableOpacity>
        <SearchBar
          placeholder="Search..."
          value={searchText}
          onChangeText={handleSearch}
          round={true}
          lightTheme={true}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchInputContainer}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={26} color="gray" />
          {/* <Filter></Filter> */}
        </TouchableOpacity>
      </View>
      {error && <Text
        style={{
          color: 'red',
          textAlign: 'center',
          fontSize: 16,
          padding: 10,
          paddingTop: 20,
        }}
        >{error}</Text>}
      <ScrollView style={styles.resultContainer}>
        {searchResult && searchResult.room_name.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleItemClick(item)}>
            <Text style={styles.resultText}>{item.room_name}</Text>
            {expandedItem && expandedItem.room_name === item.room_name &&
              <View>
                <Text>{`Size: ${expandedItem.room_size}`}</Text>
                <Text>{`Description: ${expandedItem.description}`}</Text>
                <Text>{`Building: ${expandedItem.building}`}</Text>
                <Text>{`Campus: ${expandedItem.campus}`}</Text>
                <Text>{`Equipment: ${expandedItem.equipment}`}</Text>
                <Text>{`Floor Level: ${expandedItem.floor_level}`}</Text>
                <Text>{`Stair: ${expandedItem.stair}`}</Text>
                {reservationResult && reservationResult.length > 0 ? (
                  reservationResult.map((res, idx) => (
                    <Text key={idx}>{`Reservation from ${res.start_time} to ${res.end_time}`} on { new Date(res.start_date).toDateString() }</Text>
                  ))
                ) : (
                  <Text>No reservations found</Text>
                )}
              </View>
            }
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
  searchBarContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchInputContainer: {
    backgroundColor: '#f2f2f2',
  },
  resultContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultText: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  }
});

export default Search;