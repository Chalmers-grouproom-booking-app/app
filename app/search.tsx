import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '@rneui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import { RoomInfo, RoomData, TimeSlot } from '../constants/types';
import Icon from 'react-native-vector-icons/Ionicons';
import MapViewComponent from '../components/MapViewComponent/mapView';

const Search: React.FC = () => {
  const { building } = useLocalSearchParams();

  const [searchText, setSearchText] = useState<string>('');
  const [searchResult, setSearchResult] = useState<RoomData | null>(null);
  const [reservationResult, setReservationResult] = useState<TimeSlot[] | null>(null);
  const [error, setError] = useState<string>(''); // Add this line
  const [expandedItem, setExpandedItem] = useState<RoomInfo | null>(null);

  useEffect(() => {
    
    if (building) {
        console.log(`Fetching data for building: ${building}`);
        if(Array.isArray(building)){
          handleSearch(building[0], 'building');
        } else {
          handleSearch(building, 'building')
        }
    }
  }, [building]); 


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
      const response = await fetch(`https://strawhats.info/api/v1/room/reservation?input=${room_name}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      if (!response.ok) {
        setReservationResult([]);
        return;
      }
      const json = await response.json() as TimeSlot[];
      setReservationResult(json);
    } catch (error) {
      console.error('An unexpected error occurred:', error.message || error.toString());
      setError("Failed to fetch data. Please try again."); // Update the UI to show a friendly error message
      setReservationResult(null);
    }
  };

  const handleSearch = async (search: string, filterType: 'roomName' | 'building' = 'roomName') => {
    setSearchText(search);
    setError(''); 
    try {
      const response = await fetch('https://strawhats.info/api/v1/search?input=' + encodeURIComponent(search), {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
  
      if (!response.ok) {
        console.log('Error response:', response.status, response.statusText);
        const errorResponse = await response.json();
        setError(errorResponse.detail);
        return;
      }
  
      const json = await response.json() as RoomData;
      let filteredRooms = [];
      Object.keys(json).forEach(key => {
        if (filterType === 'roomName' && key === 'room_name') {
          filteredRooms = filteredRooms.concat(json[key].filter(item => item.room_name.toLowerCase().includes(search.toLowerCase())));
        } else if (filterType === 'building' && key === 'building') {
          filteredRooms = filteredRooms.concat(json[key]);
        }
      });
  
      if (filteredRooms.length === 0) {
        setError('No search results found');
        setSearchResult(null);
        return;
      }
      setSearchResult({ room_name: filteredRooms });
    } catch (error) {
      console.error('An unexpected error occurred:', error.toString());
      setError("Failed to fetch data. Please try again.");
      setSearchResult(null);
    }
  };
  

  const firstComeRooms = searchResult && searchResult.room_name.filter(item => item.first_come_first_served);
  const otherRooms = searchResult && searchResult.room_name.filter(item => !item.first_come_first_served);

  const navigateToMap = (latitude, longitude) => {
    router.replace({
      pathname: "/mapView",
      params: {
        latitude,
        longitude
      }
    });
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
          onChangeText={(text) => handleSearch(text, 'roomName')}
          round={true}
          lightTheme={true}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchInputContainer}
        />
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

      {/* Bookable group rooms */}
      <ScrollView style={styles.resultContainer}>
        {searchResult && otherRooms.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleItemClick(item)}>
            <Text style={styles.resultText}>{item.room_name}</Text>
            {expandedItem && expandedItem.room_name === item.room_name && renderExpandedItemDetails(expandedItem, reservationResult, navigateToMap)}
          </TouchableOpacity>
        ))}
        
        <View style={styles.separatorFirstComeFirstServed}>
          <Text style={styles.separatorText}>{`First come first served`}</Text>
        </View>
        
        {/* First come first served rooms */}
        <ScrollView style={styles.resultContainer}>
          {searchResult && firstComeRooms.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleItemClick(item)}>
              <Text style={styles.resultTextFirstComeFirstServed}>{item.room_name}</Text>
              {expandedItem && expandedItem.room_name === item.room_name && renderExpandedItemDetails(expandedItem, reservationResult, navigateToMap)}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const renderExpandedItemDetails = (expandedItem, reservationResult, navigateToMap) => {
  return (
    <View style={styles.detailContainer}>
      <View style={styles.textContainer}>
        <Text>{`Size: ${expandedItem.room_size}`}</Text>
        <Text>{`Description: ${expandedItem.description}`}</Text>
        <Text>{`Building: ${expandedItem.building}`}</Text>
        <Text>{`Campus: ${expandedItem.campus}`}</Text>
        <Text>{`Equipment: ${expandedItem.equipment}`}</Text>
        <Text>{`Floor Level: ${expandedItem.floor_level}`}</Text>
        <Text>{`Stair: ${expandedItem.stair}`}</Text>
        {reservationResult && reservationResult.length > 0 ? (
          reservationResult.map((res, idx) => (
            <Text key={idx} style={styles.reservationText} numberOfLines={1}>
              {`Reservation from ${res.start_time} to ${res.end_time} on ${res.start_date}`}
            </Text>
          ))
        ) : (
          <Text>No reservations found</Text>
        )}
      </View>
      <Pressable
        onPress={() => navigateToMap(expandedItem.latitude, expandedItem.longitude)}
        style={({ pressed }) => [styles.iconContainer, pressed && styles.iconPressed]}
        android_ripple={{color: '#dddddd', borderless: true}}>
        <Icon name="location-sharp" size={25} color="#007AFF" />
      </Pressable>
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
  resultTextFirstComeFirstServed: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  separatorFirstComeFirstServed: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  separatorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailContainer: {
    position: 'relative', // Ensures that absolute positioning is relative to this container
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  textContainer: {
    // Full width taken by text container
  },
  reservationText: {
    flexShrink: 1, // Allows text to shrink to prevent wrapping
  },
  iconContainer: {
    position: 'absolute', // Position the icon absolutely
    right: 10, // Right align 10 pixels from the right edge
    top: 10, // Top align 10 pixels from the top edge
    padding: 10, // Padding to increase touch area
    borderRadius: 20, // Rounded corners for the touchable area
  },
  iconPressed: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)' // Light blue background on press
  }
});


export default Search;