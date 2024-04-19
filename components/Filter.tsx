import React, { useState } from 'react';
import { View, Animated, Text } from 'react-native';
import { globalStyles } from '../styles/styles';

export default function Filter() {
    type filters = {
        room_size: number
        building: string
        campus: string
        equipment: string
        room_name: string
        first_come_first_served: boolean
        floor_level: number
    }

    const [filterInputs, setFilterInputs] = useState<filters>()

    return (
        <View style={globalStyles.container}>
            {/* TODO Create a Modal */}
            <Text>ICON</Text>
        </View>
    );
}