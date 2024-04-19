import React, { useRef, useState } from 'react';
import { View, Animated, Text } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import { globalStyles } from '../../styles/styles';
import { mapStyle } from '../../styles/map';
import { InitRegion } from '../../constants';
import MapButton from './MapButton';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import {buildings} from '../../constants/buildings'

export default function MapViewComponent() {

    const [selectedBuilding, setSelectedBuilding] = useState<string>(null);
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

    const handleBuildingSelect = (buildingName) => {
        console.log(`Building pressed: ${buildingName}`); // Log the building name
        if (selectedBuilding === buildingName) {
          setSelectedBuilding(null); // Unselect the building if it's already selected
        } else {
          setSelectedBuilding(buildingName);
        }
      };

    const navigateToSearch = () => {
        router.push('/search');
    }

    const navigateToSearchBuilding = (building) => {
        router.push({
            pathname: "search",
            params: {
                building: building
            }
        })
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
            >
            {buildings.map((building, index) => (
                <Polygon
                    key={index}
                    coordinates={building.coordinates}
                    strokeColor="#000"
                    fillColor={selectedBuilding === building.name ? "rgba(0, 255, 0, 0.5)" : "rgba(255, 0, 0, 0.5)"}
                    strokeWidth={0.75}
                    onPress={() => navigateToSearchBuilding(building.name)}
                    tappable={true}
                />
            ))} 
            </MapView>
            <MapButton scaleAnimation={scaleAnimation} onPress={navigateToSearch} onPressIn={animatePressIn} onPressOut={animatePressOut}  custom_style={ styles.SearchBarButton }>
                <Icon name="search" size={25} color="#fff" />
            </MapButton>

            <MapButton scaleAnimation={scaleAnimation} onPress={resetRegion} onPressIn={animatePressIn} onPressOut={animatePressOut}  custom_style={ styles.backToCampusButton }>
                <Icon name="school" size={25} color="#fff" />
                <Text style={styles.buttonText}>Chalmers Campus</Text>
            </MapButton>

            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Selected Building: {selectedBuilding}</Text>
            </View>
        </View>
    );
}
