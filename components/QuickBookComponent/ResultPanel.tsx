import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, ButtonGroup } from '@rneui/themed';
import {  PanelFilter } from './types';


const FilterPanel = ( {filter, goBack}:  { filter: PanelFilter, goBack: () => void }) => {
    useEffect(() => {
        console.log('Filter Panel', filter);
    }, []);

    return (
        <View>
            <Text>Filter Panel</Text>
            <Text>Selected Location: {filter.selectedLocation}</Text>
            <Text>Selected Room Size: {filter.selectedRoomSize}</Text>
            <Text>Selected Equipment: {filter.selectedEquipment.join(', ')}</Text>
            <Button 
                onPress={goBack}
                title="Go back"
            >
            </Button>


        </View>
    );
};

export default FilterPanel;
