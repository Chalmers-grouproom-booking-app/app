import { TouchableOpacity, Text, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import React from 'react';

const MarkerButton = ({ scaleAnimation, onPress, onPressIn, onPressOut, custom_style, children}) => {
  return (
    <Animated.View style={[styles.button, { transform: [{ scale: scaleAnimation }], ...custom_style }]}>
      <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} style={styles.touchableArea}>
        {children}
      </TouchableOpacity>
    </Animated.View>
 );
}

export default MarkerButton;