import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Text } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { globalStyles } from '../../styles/styles';
import { mapStyle } from '../../styles/map';
import { InitRegion, Johanneberg, Lindholmen } from '../../constants';
import { requestForegroundPermissionsAsync } from 'expo-location';
import MapButton from './MapButton';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import 'react-native-gesture-handler';
import {buildings} from '../../constants/buildings'
import BackToCampus from './BackToCampus';


export default function MapViewComponent() {
    const [locationPermission, setLocationPermission] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState<string>(null);
    const [markerCoordinates, setMarkerCoordinates] = useState(null);
    const [isMarkerSelected, setIsMarkerSelected] = useState(false);
    const scaleAnimation = useRef(new Animated.Value(1)).current;
    const scaleAnimation1 = useRef(new Animated.Value(1)).current;
    const mapRef = useRef(null);
    const { latitude, longitude, room_name } = useLocalSearchParams();
    const [RoomName, setRoomName] = useState(null);
    useEffect(() => {
        (async () => {
            let { status } = await requestForegroundPermissionsAsync();
            setLocationPermission(status === 'granted');
        })();

        // Ensure latitude and longitude are treated as strings if they might be arrays
        const currentLatitude = Array.isArray(latitude) ? latitude[0] : latitude;
        const currentLongitude = Array.isArray(longitude) ? longitude[0] : longitude;
        const roomNameString = Array.isArray(room_name) ? room_name.join(', ') : room_name; // Ensure room_name is always treated as a string
        //console.log(`I AM HEREEEEEEEEEEE`);
        if (currentLatitude && currentLongitude && room_name) {
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
        setIsMarkerSelected(true)
        setRoomName(roomNameString);
    }, [latitude, longitude, room_name]);

    const resetRegion = () => {
        mapRef.current.animateToRegion(InitRegion, 1000)
    };

    const navigateToJohanneberg = () => {
        mapRef.current.animateToRegion(Johanneberg, 1000)
    }

    const navigateToLindholmen = () => {
        mapRef.current.animateToRegion(Lindholmen, 1000)
    }

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

    const handleMapPress = () => {
        if (isMarkerSelected) {
            // Unselect the marker when the map is pressed
            setIsMarkerSelected(false);
        }
    };

    return (
        <View style={globalStyles.container}>
            <MapView
                ref={mapRef}
                style={globalStyles.map}
                customMapStyle={mapStyle}
                initialRegion={InitRegion}
                showsUserLocation={true}
                followsUserLocation={false}
                showsCompass={false}
                onPress={handleMapPress}
            >
                {buildings.map((building, index) => (
                    <Polygon
                        key={building.name + index}
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

                {markerCoordinates && isMarkerSelected && (
                    <Marker
                        coordinate={markerCoordinates}
                        title={RoomName}
                        description="Go to building Fysik. Entrance from Kemigården 1."
                    />
                        
                   // </Marker>
                )}
            </MapView>
            <MapButton
                scaleAnimation={scaleAnimation}
                onPress={() => router.push('/search')}
                onPressIn={animatePressIn}
                onPressOut={animatePressOut}
                custom_style={styles.SearchBarButton}
            >

               <Icon name="search" size={32} color="#333" accessibilityLabel="Search Button" />
            </MapButton>
            <BackToCampus lindholmen={navigateToLindholmen} johanneberg={navigateToJohanneberg} />

        </View>
    );
}
