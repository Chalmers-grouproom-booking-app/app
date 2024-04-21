import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Text } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import { globalStyles } from '../../styles/styles';
import { mapStyle } from '../../styles/map';
import { InitRegion } from '../../constants';
import { requestForegroundPermissionsAsync } from 'expo-location';
import MapButton from './MapButton';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import {buildings} from '../../constants/buildings'

export default function MapViewComponent() {
    const [locationPermission, setLocationPermission] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState<string>(null);
    const scaleAnimation = useRef(new Animated.Value(1)).current; 
    const mapRef = useRef(null);

    useEffect(() => {
        (async () => {
            let { status } = await requestForegroundPermissionsAsync();
            setLocationPermission(status === 'granted');
        })();
    }, []);
    
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

    const navigateToSearchBuilding = (buildingName: string) => {
        router.push({ pathname: 'search', params: { building: buildingName } });
    };
    
    return (
        <View style={globalStyles.container}>
            <MapView
                ref={mapRef}
                style={globalStyles.map}
                customMapStyle={mapStyle}
                initialRegion={InitRegion}
                showsUserLocation
                followsUserLocation
                showsCompass={false}
            >
                {buildings.map((building, index) => (
                    <Polygon
                        key={index}
                        coordinates={building.coordinates}
                        strokeColor="rgba(165, 176, 118, 1)"  // Green similar to park areas
                        fillColor="rgba(165, 176, 118, 0.5)"  // Transparent green similar to park areas
                        strokeWidth={3}
                        lineCap="round"
                        lineJoin="round"
                        miterLimit={10}
                        geodesic={true}
                        tappable={true}
                        onPress={() => {
                            setSelectedBuilding(building.name);
                            navigateToSearchBuilding(building.name);
                        }}
                        zIndex={index}
                    />
          
                ))}
            </MapView>
            <MapButton
                scaleAnimation={scaleAnimation}
                onPress={() => router.push('/search')}
                onPressIn={animatePressIn}
                onPressOut={animatePressOut}
                custom_style={styles.SearchBarButton}
            >
               <Icon name="search" size={25} color="#333" accessibilityLabel="Search Button" />
            </MapButton>

            <MapButton
                scaleAnimation={scaleAnimation}
                onPress={resetRegion}
                onPressIn={animatePressIn}
                onPressOut={animatePressOut}
                custom_style={styles.backToCampusButton}
            >
                <Icon name="school" size={25} color="#333" accessibilityLabel="Back to Campus Button" />
                <Text style={styles.buttonText}>Chalmers Campus</Text>
            </MapButton>
        </View>
    );
}
