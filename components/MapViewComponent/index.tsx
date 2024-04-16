import React, { useRef } from 'react';
import { View, Animated, Text } from 'react-native';
import MapView from 'react-native-maps';
import { globalStyles } from '../../styles/styles';
import { mapStyle } from '../../styles/map';
import { InitRegion } from '../../constants';
import MapButton from './MapButton';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

export default function MapViewComponent() {
    const mapRef = useRef(null);
    const scaleAnimation = useRef(new Animated.Value(1)).current;  // Initial scale is 1

    const resetRegion = () => {
        mapRef.current.animateToRegion( InitRegion, 1000)
    };

    const animatePressIn = () => {
        Animated.spring(scaleAnimation, {
            toValue: 0.95,  // Slightly scale down to 0.95
            useNativeDriver: true
        }).start();
    };

    const animatePressOut = () => {
        Animated.spring(scaleAnimation, {
            toValue: 1,  // Scale back to original size
            friction: 3,  // Controls "bounciness"/overshoot
            tension: 60,  // Controls speed
            useNativeDriver: true
        }).start();
    };

    const navigateToSearch = () => {
        router.push('/search');
    }
    return (
        <View style={globalStyles.container}>
            <MapView
                ref={mapRef}
                style={globalStyles.map}
                customMapStyle={mapStyle}
                initialRegion={InitRegion}
                showsUserLocation={true}
                followsUserLocation={true}
                showsCompass={true}
            />
            <MapButton scaleAnimation={scaleAnimation} onPress={navigateToSearch} onPressIn={animatePressIn} onPressOut={animatePressOut}  custom_style={ styles.SearchBarButton }>
                <Icon name="search" size={25} color="#fff" />
            </MapButton>

            <MapButton scaleAnimation={scaleAnimation} onPress={resetRegion} onPressIn={animatePressIn} onPressOut={animatePressOut}  custom_style={ styles.backToCampusButton }>
                <Icon name="school" size={25} color="#fff" />
                <Text style={styles.buttonText}>Chalmers Campus</Text>
            </MapButton>
        </View>
    );
}
