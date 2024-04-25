import { useState, useCallback } from 'react';
import { RoomInfo } from '../../constants/types'; // Importing types from your constants

function useRoomSearch() {
    const [searchResult, setSearchResult] = useState<RoomInfo[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const searchRooms = useCallback(async (searchQuery) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`https://strawhats.info/api/v1/search?input=${encodeURIComponent(searchQuery)}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                setSearchResult(null);
                return;
            }

            const json = await response.json();
            const roomsMap = new Map();
            ['building', 'room_name', 'room_size', 'floor_level', 'first_come_first_served'].forEach(key => {
                if (json[key]) {
                    json[key].forEach(room => {
                        const uniqueKey = `${room.room_name}-${room.building}`;
                        if (!roomsMap.has(uniqueKey)) {
                            roomsMap.set(uniqueKey, room);
                        }
                    });
                }
            });

            const uniqueRooms = Array.from(roomsMap.values());
            setSearchResult(uniqueRooms.length > 0 ? uniqueRooms : null);
        } catch (error) {
            setError('Failed to fetch rooms: ' + error.message);
            setSearchResult(null);
        } finally {
            setLoading(false);
        }
    }, []);

    return { searchResult, loading, setLoading, error, searchRooms };
}

export default useRoomSearch;
