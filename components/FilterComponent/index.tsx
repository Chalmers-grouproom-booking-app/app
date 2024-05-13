import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import Checkbox from 'expo-checkbox';
import { styles } from './styles';
import { JohannebergData, LindholmenData } from '../../constants/buildings';
import { RoomSizes } from '../../constants/index';

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

  const handleResetFilters = () => {
    handleFilterData({
        building: null,
        room_size: null,
        equipment: [],
        first_come_first_served: null
    });
  };

  const sortedJohanebergData = [...JohannebergData].sort((a, b) => a.name.localeCompare(b.name));
  const sortedLindholmenData = [...LindholmenData].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View style={styles.container}>
      <ScrollView persistentScrollbar={true}>
      <View style={styles.checkBoxContainer}>
        <Text style={styles.filterTitle}>Johanneberg:</Text>
        {sortedJohanebergData.map((buildingGroup) => {
        const isSelected = filterData.building?.name === buildingGroup.name;
        return (
          <View key={buildingGroup.name} style={styles.checkBoxOptionRow}>
            <Checkbox
              value={isSelected}
              onValueChange={(newValue) => {
                handleFilterChange('building', newValue ? buildingGroup : null);
              }}
              color={isSelected ? '#007bff' : undefined}
            />
            <TouchableOpacity
              onPress={() => {
                handleFilterChange('building', isSelected ? null : buildingGroup);
              }}
              style={styles.checkBoxOption}
            >
              <Text style={{ marginLeft: 10, color: isSelected ? '#007bff' : '#000000' }}>
                {buildingGroup.name}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
      </View>

        <View style={styles.checkBoxContainer}>
          <Text style={styles.filterTitle}>Lindholmen:</Text>
          {sortedLindholmenData.map((buildingGroup) => {
          const isSelected = filterData.building?.name === buildingGroup.name;
          return (
            <View key={buildingGroup.name} style={styles.checkBoxOptionRow}>
              <Checkbox
                value={isSelected}
                onValueChange={(newValue) => {
                  handleFilterChange('building', newValue ? buildingGroup : null);
                }}
                color={isSelected ? '#007bff' : undefined}
              />
              <TouchableOpacity
                onPress={() => {
                  handleFilterChange('building', isSelected ? null : buildingGroup);
                }}
                style={styles.checkBoxOption}
              >
                <Text style={{ marginLeft: 10, color: isSelected ? '#007bff' : '#000000' }}>
                  {buildingGroup.name}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
        </View>

        <View style={styles.checkBoxContainer}>
            <Text style={styles.filterTitle}>Room Size:</Text>
            {Object.entries(RoomSizes).map(([key, {lower, upper}]) => {
                const sizeLabel = `${key} (${lower}-${upper})`;
                const isSelected = filterData.room_size && filterData.room_size.lower === lower && filterData.room_size.upper === upper;

                return (
                    <View key={key} style={styles.checkBoxOptionRow}>
                        <Checkbox
                            value={isSelected}
                            onValueChange={(newValue) => handleFilterChange('room_size', newValue ? { lower, upper } : null)}
                            color={isSelected ? '#007bff' : undefined}
                        />
                        <TouchableOpacity
                            onPress={() => handleFilterChange('room_size', isSelected ? null : { lower, upper })}
                            style={styles.checkBoxOption}
                        >
                            <Text style={{ marginLeft: 10, color: isSelected ? '#007bff' : '#000000' }}>
                                {sizeLabel}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>

        <View style={styles.checkBoxContainer}>
          <Text style={styles.filterTitle}>Equipment:</Text>
          {['Whiteboard', 'Digital skärm', 'Data-projektor'].map(item => (
            <View key={item} style={styles.checkBoxOptionRow}>
              <Checkbox
                value={filterData.equipment.includes(item)}
                onValueChange={newValue => handleEquipmentChange(item)}
                color={filterData.equipment.includes(item) ? '#007bff' : undefined}
              />
              <TouchableOpacity
                onPress={() => handleEquipmentChange(item)}
                style={styles.checkBoxOption}
              >
                <Text style={{ marginLeft: 10, color: filterData.equipment.includes(item) ? '#007bff' : '#000000' }}>
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
                color={filterData.first_come_first_served === option.value ? '#007bff' : undefined}
              />
              <TouchableOpacity
                onPress={() => handleFilterChange('first_come_first_served', filterData.first_come_first_served === option.value ? null : option.value)}
                style={styles.checkBoxOption}
              >
                <Text style={{ marginLeft: 10, color: filterData.first_come_first_served === option.value ? '#007bff' : '#000000' }}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.resetButtonContainer}>
          <Pressable
            onPress={handleResetFilters}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: pressed ? '#0056b3' : '#007bff'
              }
            ]}
          >
            {({ pressed }) => (
              <Text style={styles.buttonText}>
                {pressed ? 'Reset Filters' : 'Reset Filters'}
              </Text>
            )}
          </Pressable>
      </View>

      </ScrollView>
    </View>
  );
};

export default FilterPanel;
