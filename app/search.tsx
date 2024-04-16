import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Button, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons
import { router } from 'expo-router';
import { SearchBar } from '@rneui/themed';

interface Room {
  "Room Name": string;
  "Room Size": number;
  "Building": string;
  "Campus": string;
  "Equipment": string;
  "Longitude": number;
  "Latitude": number;
  "Entrance Latitude": number;
  "Entrance Longitude": number;
  "Description": string;
  "First Come First Served": boolean;
  "Floor Level": number;
  "Stairs": string;
}

interface TimeSlot {
  "start-time": string;
  "end-time": string;
}


const search: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResult, setSearchResult] = useState<Room[]>([]);
  const [reservation, setReservation] = useState('');
  const [reservationResult, setReservationResult] = useState<TimeSlot[] | string>('');
  const [expandedItem, setExpandedItem] = useState<Room | string>(null);


  const renderRoomName = (item: Room) => {
    return (
      <TouchableOpacity onPress={() => handleItemClick(item)}>
        <Text style={styles.resultText}>{item['Room Name']}</Text>
      </TouchableOpacity>
    );
  };

  const renderNoReservation = () => {
    return <Text>No reservation found</Text>;
  };

const renderReservation = (reservations: TimeSlot[]) => {
    return reservations.map((res, index) => (
        <View key={index}>
        <Text>{`Reservation nr ${index + 1}`}</Text>
        {Object.keys(res).map((key, innerIndex) => (
            <Text key={innerIndex}>{`${key}: ${res[key]}`}</Text>
        ))}
        </View>
    ));
};

const renderExpandedItem = (item: Room) => {
    return (
        <View>
        <TouchableOpacity onPress={() => handleItemClick(item)}>
            <Text style={styles.resultText}>{item['Room Name']}</Text>
        </TouchableOpacity>        
        {Object.keys(item).map((key, index) => (
            <Text key={index}>{`${key}: ${item[key]}`}</Text>
        ))}
        <Text>Reservations:</Text>
        {Array.isArray(reservationResult) && reservationResult.length === 0 ? renderNoReservation() : renderReservation(reservationResult as TimeSlot[])}
        </View>
    );
};

    const handleItemClick = (item : Room) => {
        // Toggle expanded state for the clicked item
        if (expandedItem === item && reservation === item["Room Name"]) {
            setExpandedItem(null); // Collapse if already expanded
            setReservation(null);
        } else {
            // handleReservations(item["Room Name"]);
            setExpandedItem(item), // Expand if not expanded
            setReservation(item["Room Name"]);
        }
    };
  
  const handleReservations = async (room_name: string) => {
    try {
      const response = await fetch(`https://strawhats.info/api/v1/room/reservation/${encodeURIComponent(room_name)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      if (!response.ok) {
        setReservationResult([]);
        return;
      }
      const json: TimeSlot[] = await response.json();
      setReservationResult(json);
    } catch (error) {
      console.error(error);
      setReservationResult('An error occurred');
    }
  };

  const handleSearch = async (search: string) => {
    setSearchText(search);
    try {
      const response = await fetch(`https://strawhats.info/api/v1/search/${encodeURIComponent(search)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      if (!response.ok) {
        setSearchResult([]);
        return;
      }
      const json: Room[] = await response.json();
      console.log(json)
      setSearchResult(json);
    } catch (error) {
      console.error(error); 
      setSearchResult([]);
    }
  };

  return (
    <View style={styles.container}>
        <SearchBar
            placeholder="Search..."
            value={searchText}
            onChangeText={searchText => handleSearch(searchText)}
            lightTheme={true}
        />
       <ScrollView style={styles.resultContainer}>
       {Array.isArray(searchResult) && searchResult.map((room, index) => (
          <View key={index}>
            {/* {innerList.map((item, innerIndex) => (
              <View key={innerIndex}>
                {expandedItem === item ? renderExpandedItem(item) : renderRoomName(item)}
              </View>
            ))} */}
          </View>
        ))}
        </ScrollView>
        <View style={{ position: 'absolute', bottom: 0, alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#007AFF', padding: 10, borderRadius: 8 }}>
            <Ionicons name="arrow-back" size={20} color="white" style={{ marginRight: 5 }} />
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Back</Text>
        </TouchableOpacity>
        </View>
    </View>
  );
};

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
        color: 'black',
        fontSize: 16,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
})
export default search;