import { useState, useCallback } from 'react';
import { FilterData, RoomInfo, BuildingGroup, Interval } from '../../constants/types'; // Importing types from your constants

function useRoomSearch() {
    const [searchResult, setSearchResult] = useState<RoomInfo[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    

    const createQueryString = (searchQuery: string, filterData: FilterData): string => {
     
        const formatters: { [key in keyof FilterData]: (value: any) => string} = {
            building: formatBuilding,
            equipment: formatEquipment,
            room_size: formatRoomSize,
            first_come_first_served: formatFirstComeFirstServed
        }
        
        interface Params {
            [key: string]: string;
          }
        
        const params: Params = {};

        // Always include 'input', empty if searchQuery is blank
        params.input = searchQuery.trim() !== '' ? encodeURIComponent(searchQuery) : '';

        for(const key in filterData){
            if (filterData[key] !== null && !(Array.isArray(filterData[key]) && filterData[key].length === 0)){
                params[key] = formatters[key](filterData[key]);
            }
        } 

      
        // Use URLSearchParams to build the query string
        return new URLSearchParams(params).toString();
      };
    
    const formatBuilding = (building: BuildingGroup): string => {
        let buildingQuery: string = ''
        buildingQuery += building.name 
        if (building.subBuildings){
            building.subBuildings.forEach(subBuilding => {
                buildingQuery += '|' + subBuilding.name
            })
        } 
        return buildingQuery
    }

    const formatRoomSize = (roomSize: Interval): string => {
            return `${roomSize.lower}_${roomSize.upper}`;
    }

    const formatEquipment = (equipment: string[]): string => {
        equipment.sort();
        return equipment.join(", ");
    }

    const formatFirstComeFirstServed = (firstComeFirstServed: number): string => {
        return firstComeFirstServed.toString();
    }
      
    const searchRooms = useCallback(async (searchQuery, filterQuery) => {
        setLoading(true);
        setError('');
        try {
            const queryString: string = createQueryString(searchQuery, filterQuery);
            const response = await fetch(`https://strawhats.info/api/v3/search?${queryString}`, {
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