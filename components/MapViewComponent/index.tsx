import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Text } from 'react-native';
import MapView, { Polygon, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { globalStyles } from '../../styles/styles';
import { mapStyle } from '../../styles/map';
import { InitRegion, Johanneberg, Lindholmen } from '../../constants';
import { requestForegroundPermissionsAsync } from 'expo-location';
import MapButton from './MapButton';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import {Allbuildings, getColor, fetchBookedPercentage} from '../../constants/buildings'
import type { buildingType } from '../../constants/buildings';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { SpeedDial } from '@rneui/themed';
import { Platform } from 'react-native';

export default function MapViewComponent() {
    const [locationPermission, setLocationPermission] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState<string>(null);
    const [markerCoordinates, setMarkerCoordinates] = useState(null);
    const [isMarkerSelected, setIsMarkerSelected] = useState(false);
    const [openSpeedDial, setOpenSpeedDial] = useState(false);
    const scaleAnimation = useRef(new Animated.Value(1)).current;
    const mapRef = useRef(null);
    const { latitude, longitude, room_name } = useLocalSearchParams();
    const [RoomName, setRoomName] = useState(null);
    const [buildings, setBuildings] = useState<buildingType>( Allbuildings );
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
    useEffect(() => {
        async function fetchColorsAndUpdateBuildings() {
        const percentages = await fetchBookedPercentage(30);

          /*
          colors = {

            "Fysik": "0.3",
            "Matematik": "0.5",
            "Kemi": "0.7",
            "Elektro": "0.9",

          }
          
          */


        const buildingPromises = Allbuildings.map(async building => {
            const color = await getColor(percentages[building.name]);
            return { ...building, buildingColor: color };
        });

        const updatedBuildings = await Promise.all(buildingPromises);
        setBuildings(updatedBuildings); // Update the state with the new colors
    }
    
        fetchColorsAndUpdateBuildings();
      }, []);
      


        // takes a function and runs it when the speed dial is closed
    const closeSpeedDial = ( func: () => void ) => {
        setOpenSpeedDial( false );
        func();
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
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            >
                {buildings.map((building, index) => (
                    <Polygon
                        key={building.name + index}
                        coordinates={building.coordinates}
                        strokeColor={building.buildingColor}  // Green similar to park areas
                        fillColor={building.buildingColor}  // Transparent green similar to park areas
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

            <SpeedDial
                isOpen={openSpeedDial}
                icon={{ name: 'menu', color: '#333' }} 
                openIcon={{ name: 'close', color: '#333' }}
                onOpen={() => setOpenSpeedDial(!openSpeedDial)}
                onClose={() => setOpenSpeedDial(!openSpeedDial)}
                color="#fff"  
                >
                <SpeedDial.Action
                    icon={{ name: 'account-circle', color: '#fff' }}
                    title="My Account"
                    onPress={() => closeSpeedDial(() => router.push('account'))}
                    color="#7986CB" 
                />
                <SpeedDial.Action
                    icon={{ name: 'arrow-back', color: '#fff' }}
                    title="Navigate to Lindholmen"
                    onPress={() => closeSpeedDial(navigateToLindholmen)}
                    color="#7986CB" 
                />
                <SpeedDial.Action
                    icon={{ name: 'arrow-forward', color: '#fff' }}
                    title="Navigate to Johanneberg"
                    onPress={() => closeSpeedDial(navigateToJohanneberg)}
                    color="#7986CB" 
                />
            </SpeedDial>

        </View>
    );
}
