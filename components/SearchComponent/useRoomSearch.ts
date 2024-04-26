import { useState, useCallback } from 'react';
import { FilterData, RoomInfo } from '../../constants/types'; // Importing types from your constants

function useRoomSearch() {
    const [searchResult, setSearchResult] = useState<RoomInfo[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const createQueryString = (searchQuery: string, filterData: FilterData): string => {
        interface Params {
          [key: string]: string;
        }
      
        const params: Params = {};
      
        // Always include 'input', empty if searchQuery is blank
        params.input = searchQuery.trim() !== '' ? encodeURIComponent(searchQuery) : '';
      
        // Iterate over filterData keys
        Object.keys(filterData).forEach(key => {
          const value = filterData[key];
          if (value !== undefined && value !== null) {
            if (Array.isArray(value) && value.length > 0) {
              params[key] = value.join(',');
            } else if (typeof value === 'string' && value !== '') {
              params[key] = encodeURIComponent(value);
            }
          }
        });
      
        // Use URLSearchParams to build the query string
        return new URLSearchParams(params).toString();
      };
      
      
      
      

    const searchRooms = useCallback(async (searchQuery, filterQuery) => {
        setLoading(true);
        setError('');
        try {
            const queryString: string = createQueryString(searchQuery, filterQuery);
            console.log(queryString);
            const response = await fetch(`https://strawhats.info/api/v1/search?${queryString}`, {
                method: 'GET',
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
