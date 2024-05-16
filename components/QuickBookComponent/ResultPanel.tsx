import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button, ButtonGroup } from '@rneui/themed';
import {  PanelFilter } from './types';
import { ActivityIndicator } from 'react-native';
import { RoomData , RoomInfo} from '@/constants/types';
import ResultItem from './ResultItem';
import styles from './styles';

const FilterPanel = ( {filter, goBack}:  { filter: PanelFilter, goBack: () => void }) => {
    const [allRooms, setAllRooms]  = useState<RoomInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        async function searchResults(){
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
                const tmp_rooms: RoomInfo[] = [];
                for (const key in data) {
                    for (const room of data[key]) {
                        if (!tmp_rooms.some((r) => r.room_name === room.room_name)) {
                            tmp_rooms.push(room);
                        }
                    }
                }
                const filteredRooms = tmp_rooms.filter(room => !room.first_come_first_served);
                setAllRooms(filteredRooms);
            }
            catch (error) {
                console.error('Error:', error);
                setAllRooms([]);
            } finally {
                setLoading(false);
            }
        }
        searchResults();
    }, []);

    return (
        <View style={styles.container}>
        {
            loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                allRooms.length === 0 ? (
                    <Text style={styles.noRoomsText}>No rooms found</Text>
                ) : (
                    <View style={styles.resultContainer}>
                        <ScrollView style={styles.resultScrollView}>
                            {allRooms.map((room) => (
                                <ResultItem key={room.room_name} item={room} />
                            ))}
                        </ScrollView>
                    </View>
                )
            )
        }
        <Button onPress={goBack} buttonStyle={styles.backButton}>Back</Button>
    </View>
    );
};

export default FilterPanel;
