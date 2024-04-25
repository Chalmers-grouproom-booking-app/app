import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import {Slider} from '@miblanchard/react-native-slider';
import { styles } from './styles';
import {buildings} from '../../constants/buildings'
import Checkbox from 'expo-checkbox';
import { FilterData } from '../../constants/types';


const FilterPanel = ({ visible, onClose }) => {
  const panelWidth = styles.panel.width; // Panel width is based on screen width defined in styles
  const translateX = useRef(new Animated.Value(panelWidth)).current;

  const [filterData, setFilterData] = useState<FilterData>({
    room_size: 20,
    building: '',
    campus: '',
    equipment: [],
    first_come_first_served: null
  });

  useEffect(() => {
    // Set the translation for the visible state
    const visibleWidth = panelWidth * 0.8;
    Animated.timing(translateX, {
      toValue: visible ? panelWidth - visibleWidth : panelWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, panelWidth]);

  const handleFilterChange = (field, value) => {
    setFilterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEquipmentChange = (item) => {
    setFilterData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter(equip => equip !== item)
        : [...prev.equipment, item]
    }));
  };

  return (
    <View style={styles.container}>
      {visible && <View style={styles.backdrop} onTouchStart={onClose} />}
      <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
        <ScrollView>

        <View style={styles.pickerContainer}>
          <Text style={styles.filterTitle}>Building:</Text>
          <Picker
            selectedValue={filterData.building}
            style={styles.picker}
            onValueChange={itemValue => handleFilterChange('building', itemValue)}
            mode='dropdown'
          >
            <Picker.Item style={styles.placeholder} label="Select a building" value="" enabled={false} />
            
          {[...buildings].sort((a, b) => a.name.localeCompare(b.name)).map((building, index) => (
            <Picker.Item style={styles.pickerItemStyling} key={index} label={building.name} value={building.name} />
          ))}

          </Picker>
            
          <Text style={styles.filterTitle}>Campus:</Text>
          <Picker
            selectedValue={filterData.campus}
            style={styles.picker}
            onValueChange={itemValue => handleFilterChange('campus', itemValue)}
            mode='dropdown'
          >
            <Picker.Item style={styles.placeholder} label="Select a campus" value="" enabled={false}/>
            <Picker.Item label="Johanneberg" value="Johanneberg" />
            <Picker.Item label="Lindholmen" value="Lindholmen" />
          </Picker>
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
          {['Projector', 'Whiteboard', 'Computer', 'digital skärm', 'Krittavlor', 'Linux', 'Data-projektor', 'Windows', 'Overhead', 'Kortläsare', 'Avdelad med draperi'].map(item => (
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
            { label: 'First Come, First Served', value: true },
            { label: 'Reservation Room', value: false }
        ].map((option) => (
            <View key={option.label} style={styles.checkBoxOptionRow}>
              <Checkbox
                  value={filterData.first_come_first_served === option.value}
                  onValueChange={(newValue) => {
                      // Toggle between option value and null
                      handleFilterChange(
                          'first_come_first_served',
                          filterData.first_come_first_served === option.value ? null : option.value
                      );
                  }}
                  color={filterData.first_come_first_served === option.value ? '#81b0ff' : undefined}
              />
              <TouchableOpacity
                  onPress={() => {
                      handleFilterChange(
                          'first_come_first_served',
                          filterData.first_come_first_served === option.value ? null : option.value
                      );
                  }}
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
      </Animated.View>
    </View>
  );
};

export default FilterPanel;
