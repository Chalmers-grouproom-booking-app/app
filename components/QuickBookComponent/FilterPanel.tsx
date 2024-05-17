import React, { useEffect, useState } from 'react';
import { View,  Text } from 'react-native';
import { Button, ButtonGroup } from '@rneui/themed';
import { Location, RoomSize, Equipment, PanelFilter } from './types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import { roomSizeMapping,roomSizeValues } from './types';

const Panel = ( {filter, setFilterCallback}:  {  filter: PanelFilter,setFilterCallback: (filter: PanelFilter) => void }) => {
    const locations = [Location.Johanneberg, Location.Lindholmen];
    const roomSizes = ['Small', 'Medium', 'Large']; // '0_5', '6_10', '12_20
    const equipmentOptions = [ Equipment.Whiteboard, Equipment.Display];

    const [locationIndex, setLocationIndex] = useState( locations.indexOf(filter.selectedLocation));
    const [roomSizeIndex, setRoomSizeIndex] = useState( roomSizeValues.indexOf(filter.selectedRoomSize));
    const [equipmentIndexes, setEquipmentIndexes] = useState<number[]>( filter.selectedEquipment.map(eq => equipmentOptions.indexOf(eq)));

    const handleBook = () => {
        const selectedLocation = locations[locationIndex];
        const selectedRoomSizeText = roomSizes[roomSizeIndex]; // Get the display text
        const selectedRoomSize = roomSizeMapping[selectedRoomSizeText]; // Map to enum value
        const selectedEquipment = equipmentIndexes.map(index => equipmentOptions[index]);
        setFilterCallback({ selectedLocation, selectedRoomSize, selectedEquipment });
    };

    return (
        <View
        style={{
            width: "100%",
                }}
        >
            <Text style={styles.header}>Quick Book Panel</Text>

            <Text style={styles.label}>Select Location</Text>
            <ButtonGroup
                buttons={locations.map(loc => loc )}
                selectedIndex={locationIndex}
                onPress={value => setLocationIndex(value)}
                containerStyle={styles.buttonGroupContainer}
                selectedTextStyle={styles.selectedText}
                textStyle={styles.buttonGroupText}
                selectedButtonStyle={styles.selectedButton}
            />

            <Text style={styles.label}>Select Room Size</Text>
            <ButtonGroup
               buttons={roomSizes}
               selectedIndex={roomSizeIndex}
               onPress={value => setRoomSizeIndex(value)}
               containerStyle={styles.buttonGroupContainer}
               selectedButtonStyle={styles.selectedButton}
               textStyle={styles.buttonGroupText}
               selectedTextStyle={styles.selectedText}    
            />

            <View style={ styles.equimentContainer} >
                <Text style={styles.label}>Select Equipment</Text>
                <ButtonGroup
                    buttons={equipmentOptions.map((eq, index) => ({
                        element: () => (
                            <View style={styles.iconContainer}>
                                <Icon
                                    name={
                                        eq === Equipment.Display
                                            ? 'desktop-windows'
                                            : eq === Equipment.Whiteboard
                                            ? 'edit'
                                            : 'clear'
                                    }
                                    color={equipmentIndexes.includes(index) ? 'white' : '#000'}
                                    size={16}
                                />
                                
                                <Text style={{ color: equipmentIndexes.includes(index) ? 'white' : '#000' }}>{ eq === Equipment.Display ? 'Display' : eq }</Text>
                            </View>
                        )
                    }))}
                    selectMultiple
                    selectedIndexes={equipmentIndexes}
                    onPress={value => setEquipmentIndexes(value)}
                    containerStyle={styles.buttonGroupContainer2}
                    selectedTextStyle={styles.selectedText}      
                    selectedButtonStyle={styles.selectedButton}
                    />
                    {
                        equipmentIndexes.length === 0 && <Text style={styles.selectedEq}>Selected Equipment: None</Text>
                    }
                    {
                        equipmentIndexes.length === equipmentOptions.length && <Text style={styles.selectedEq}>Selected Equipment: All</Text>
                    }
                    {
                        equipmentIndexes.length > 0 && equipmentIndexes.length < equipmentOptions.length && <Text style={styles.selectedEq}>{'Selected Equipment: ' + equipmentIndexes.map(
                            index => equipmentOptions[index] === Equipment.Display ? 'Display' : equipmentOptions[index] ).join(', ')
                        }</Text>
                    }
            </View>
            <Button
                title="Quick Book"
                buttonStyle={styles.bookButton}
                onPress={handleBook}
                linearGradientProps={{
                    colors: ['#6a11cb', '#2575fc'],
                    start: { x: 0, y: 0 },
                    end: { x: 1, y: 1 },
                }}
                titleStyle={styles.bookButtonTitle}
                raised
            />
        </View>
    );
};

export default Panel;
