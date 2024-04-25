import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView, PanResponder, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Slider } from '@miblanchard/react-native-slider';
import Checkbox from 'expo-checkbox';
import { styles } from './styles';
import { buildings } from '../../constants/buildings';
import { FilterData } from '../../constants/types';
import { screenWidth }from '../../constants/index';



const FilterPanel = ({ visible, onClose, handleFilterData, filterData }) => {
  const translateX = useRef(new Animated.Value(screenWidth)).current; // Initially positioned off-screen

  useEffect(() => {
    // Animate the panel into view or out of view based on 'visible'
    Animated.timing(translateX, {
      toValue: visible ? 0 : screenWidth,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, [visible, screenWidth]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Adjust sensitivity to distinguish more clearly between horizontal and vertical swipes
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2) && Math.abs(gestureState.dx) > 30; // Requires a more definite horizontal movement
      
        return isHorizontalSwipe;
      },
      
      onPanResponderMove: (evt, gestureState) => {
        // Only update translateX if the gesture is clearly horizontal
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2) && gestureState.dx > 0) {
          const newTranslateX = Math.min(gestureState.dx, screenWidth);
          translateX.setValue(newTranslateX);
        }
      },
      
      onPanResponderRelease: (evt, gestureState) => {
        // Check both direction and magnitude again on release to decide on action
        if (gestureState.dx > screenWidth * 0.2 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2)) {
          Animated.timing(translateX, {
            toValue: screenWidth,
            duration: 300,
            useNativeDriver: true
          }).start(onClose);
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true
          }).start();
        }
      }
      
    })
  ).current;

  useEffect(() => {
    console.log(filterData);  // This will log the updated state after changes
  }, [filterData]);  // Dependency array tells React to run the effect when filterData changes
  
  const handleFilterChange = (field, value) => {
    handleFilterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEquipmentChange = (item) => {
    handleFilterData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter(equip => equip !== item)
        : [...prev.equipment, item]
    }));
  };

  return (
    <View style={styles.container}>
    {visible && <View style={styles.backdrop} onTouchStart={onClose} />}
      <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers}
      >
        <ScrollView persistentScrollbar={true}>

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
