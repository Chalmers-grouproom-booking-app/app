import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@rneui/themed';
import { PanelFilter } from './types';
import { RoomData, RoomInfoV2 } from '@/constants/types';
import ResultItem from './ResultItem';
import MakeReservation from '../AccountComponent/modal/MakeReservation';
import * as Location from 'expo-location';
const FilterPanel = ({ filter, goBack }: { filter: PanelFilter, goBack: () => void }) => {
    const [allRooms, setAllRooms] = useState<RoomInfoV2[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [location, setLocation] = useState(null);
    const [reservationRoom, setReservationRoom] = useState<RoomInfoV2 | null>(null);
    useEffect(() => {
        async function getUserLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
      
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }
        setReservationRoom(null);
        getUserLocation();
    }, []);

    useEffect(() => {
        async function searchResults() {
            try {
                const url = new URL('https://strawhats.info/api/v3/search');
                const params = new URLSearchParams();
                params.append('campus', filter.selectedLocation);
                params.append('room_size', filter.selectedRoomSize);
                params.append('input', ' ');
                params.append('equipment', filter.selectedEquipment.join(','));
                params.append('status', 'available');

                url.search = params.toString();
                const response = await fetch(url.toString());
                const data = await response.json() as RoomData;
                const tmp_rooms: RoomInfoV2[] = [];
                for (const key in data) {
                    for (const room of data[key]) {
                        // remove duplicates and first come first served rooms
                        if (!tmp_rooms.some(r => r.room_name === room.room_name)) {
                            tmp_rooms.push(room);
                        }
                    }
                }
                const filteredRooms = tmp_rooms.filter(room => !room.first_come_first_served) as RoomInfoV2[];
                // magic code
                // @ts-ignore
                if(filteredRooms[0] === "N"){
                    setAllRooms([]);
                    return;
                }
                setAllRooms(filteredRooms);
                
            } catch (error) {
                console.error('Error:', error);
                setAllRooms([]);
            } finally {
                setLoading(false);
            }
        }
        searchResults();
    }, [filter]);

    const handleBook = (room: RoomInfoV2) => {
        setReservationRoom(room);
    }

    if (reservationRoom) {
        return <MakeReservation room_info={reservationRoom} reservationSuccessCallback={() => {
            setReservationRoom(null);
        }} />
    }
    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : allRooms.length === 0 ? (
                <Text style={styles.noRoomsText}>No rooms found</Text>
            ) : (
                <View style={styles.topThreeRooms}>
                    {allRooms.slice(0, 3).map(room => (
                        <ResultItem key={room.room_name} item={room} userLat={location?.coords.latitude} userLon={location?.coords.longitude} onBook={handleBook}/>
                    ))}
                </View>
            )}
            <Button onPress={goBack} buttonStyle={styles.backButton} title="Back" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
    },
    topThreeRooms: {
        height: 450,
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'column',
    },
    noRoomsText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#333',
        opacity: 0.8,
        marginTop: 20,
    },
    backButton: {
        marginTop: 20,
        width: 100,
        backgroundColor: '#ff0000',
        alignSelf: 'flex-start',
    },
});

export default FilterPanel;
