import { useState, useCallback } from 'react';
import { FilterData } from '../../constants/types';

function useFilter() {
    const [filterData, setFilterData] = useState<FilterData>({
        room_size: null,
        building: null,
        campus: '',
        equipment: [],
        first_come_first_served: null
      });


    function filterDataHasActiveFilters(filterData) {
    // Check for non-default filter settings (assuming default values are either empty strings, null, or an empty array)
    return Object.keys(filterData).some(key => {
        const value = filterData[key];
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== '' && value !== undefined;
    });
    }

    return { filterData, setFilterData, filterDataHasActiveFilters };
}

export default useFilter;
