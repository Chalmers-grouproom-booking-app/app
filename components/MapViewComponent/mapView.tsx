import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, Text } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { globalStyles } from '../../styles/styles';
import { mapStyle } from '../../styles/map';
import { InitRegion } from '../../constants';
import MapButton from './MapButton';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router} from 'expo-router';
import {buildings} from '../../constants/buildings'
import { useLocalSearchParams } from 'expo-router';

export default function MapViewComponent() {

    const [selectedBuilding, setSelectedBuilding] = useState<string>(null);
    const [markerCoordinates, setMarkerCoordinates] = useState(null);
    const mapRef = useRef(null);
    const scaleAnimation = useRef(new Animated.Value(1)).current;  // Initial scale is 1
    const { latitude, longitude } = useLocalSearchParams();

    useEffect(() => {
        // Ensure latitude and longitude are treated as strings if they might be arrays
        const currentLatitude = Array.isArray(latitude) ? latitude[0] : latitude;
        const currentLongitude = Array.isArray(longitude) ? longitude[0] : longitude;
        console.log(`I AM HEREEEEEEEEEEE`);
        if (currentLatitude && currentLongitude) {
          const lat = parseFloat(currentLatitude);
          const lng = parseFloat(currentLongitude);
      
          setMarkerCoordinates({
            latitude: lat,
            longitude: lng
          });
      
          // Animate to the region if the mapRef is defined
          mapRef.current?.animateToRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }, 1000);
        }
      }, [latitude, longitude]);
      

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

            {markerCoordinates && (
                <Marker
                    coordinate={markerCoordinates}
                    title="Selected Location"
                    description="You navigated to this location."
                />
            )}

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
