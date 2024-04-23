import React, { useState, useRef, useEffect } from 'react';
import { Modal, Text, View, Button, Dimensions, Animated, TouchableOpacity, TouchableWithoutFeedback, TextInput, Switch } from 'react-native';
import { styles } from './styles';


const FilterPanel = ({ visible, onClose }) => {
  const screenWidth = Dimensions.get('window').width;
  const panelWidth = screenWidth * 0.7; // Panel is 80% of the screen width
  const translateX = useRef(new Animated.Value(screenWidth)).current; // Start completely offscreen to the right

  // State for filter options
  const [searchQuery, setSearchQuery] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? screenWidth - panelWidth : screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, screenWidth, panelWidth]);

  return (
    <View style={styles.container} pointerEvents={visible ? 'auto' : 'none'}>
      {visible && (
        <View style={styles.backdrop} onTouchStart={onClose} />
      )}

      <Animated.View
        style={[styles.panel, { width: panelWidth, transform: [{ translateX }] }]}
      >
        <Text style={styles.filterTitle}>Filter Options</Text>
        <TextInput
          style={styles.input}
          onChangeText={setSearchQuery}
          value={searchQuery}
          placeholder="Search keywords..."
        />
        <View style={styles.switchContainer}>
          <Text>Enable Option:</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </Animated.View>
    </View>
  );
};


export default FilterPanel;