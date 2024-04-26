import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Slider } from '@miblanchard/react-native-slider';
import { styles } from './styles';
import { buildings } from '../../constants/buildings';

const FilterPanel = ({ handleFilterData, filterData }) => {
  const handleFilterChange = (field, value) => {
    handleFilterData(prev => ({ ...prev, [field]: value }));
  };

  const handleEquipmentChange = (item) => {
    handleFilterData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item) ?
        prev.equipment.filter(equip => equip !== item) :
        [...prev.equipment, item]
    }));
  };
  
  const sortedBuildings = buildings.slice().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View style={styles.container}>
      <ScrollView persistentScrollbar={true}>
        <View style={styles.pickerContainer}>
          <Text style={styles.filterTitle}>Building:</Text>
          {/* <Select
            placeholder="Select a building"
            selectedValue={filterData.building}
            onValueChange={value => handleFilterChange('building', value)}
          >
            {sortedBuildings.map((building) => (
              <Select.Item key={building.name} label={building.name} value={building.name} />
            ))}
          </Select> */}
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.filterTitle}>Campus:</Text>
          {/* <Select
            placeholder="Select a campus"
            selectedValue={filterData.campus}
            onValueChange={value => handleFilterChange('campus', value)}
          >
            <Select.Item label="Johanneberg" value="Johanneberg" />
            <Select.Item label="Lindholmen" value="Lindholmen" />
          </Select> */}
        </View> 

        <View style={styles.sliderContainer}>
          <Text style={styles.filterTitle}>Room Size:</Text>
          <Slider
            value={filterData.room_size}
            minimumValue={0}
            maximumValue={20}
            step={1}
            onValueChange={value => handleFilterChange('room_size', value)}
          />
          <Text>Seats: {filterData.room_size}</Text>
        </View>

        <View style={styles.checkBoxContainer}>
          <Text style={styles.filterTitle}>Equipment:</Text>
          {['Projector', 'Whiteboard', 'Computer', 'Digital Screen', 'Chalkboards', 'Linux', 'Data Projector', 'Windows', 'Overhead', 'Card Reader', 'Curtained Section'].map(item => (
            <View key={item} style={styles.checkBoxOptionRow}>
              <Checkbox
                value={filterData.equipment.includes(item)}
                onValueChange={newValue => handleEquipmentChange(item)}
                color={filterData.equipment.includes(item) ? '#81b0ff' : undefined}
              />
              <TouchableOpacity
                onPress={() => handleEquipmentChange(item)}
                style={styles.checkBoxOption}
              >
                <Text style={{ marginLeft: 10, color: filterData.equipment.includes(item) ? '#81b0ff' : '#000000' }}>
                  {item}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.checkBoxContainer}>
          <Text style={styles.filterTitle}>Room Type:</Text>
          {[
            { label: 'First Come, First Served', value: 1 },
            { label: 'Reservation Room', value: 0 }
          ].map(option => (
            <View key={option.label} style={styles.checkBoxOptionRow}>
              <Checkbox
                value={filterData.first_come_first_served === option.value}
                onValueChange={newValue => handleFilterChange('first_come_first_served', newValue === true ? option.value : null)}
                color={filterData.first_come_first_served === option.value ? '#81b0ff' : undefined}
              />
              <TouchableOpacity
                onPress={() => handleFilterChange('first_come_first_served', filterData.first_come_first_served === option.value ? null : option.value)}
                style={styles.checkBoxOption}
              >
                <Text style={{ marginLeft: 10, color: filterData.first_come_first_served === option.value ? '#81b0ff' : '#000000' }}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default FilterPanel;
