import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { Badge } from '@rneui/themed';
import { router } from 'expo-router';
import { itemStyle } from './styles';
import { getDistanceFromLatLonInKm } from '../../utils/utils';
import Icon from 'react-native-vector-icons/Ionicons';

const navigateToMap = (latitude, longitude, room_name) => {
    router.replace({
      pathname: "map",
      params: {
        room_name,
        latitude,
        longitude
      }
    });
  };

const ResultItem = ({ item, userLat, userLon , onBook }) => {
    const [distance, setDistance] = useState('Unknown');

    useEffect(() => {
        if (userLat && userLon && item.latitude && item.longitude) {
            setDistance(getDistanceFromLatLonInKm(userLat, userLon, item.latitude, item.longitude));
        }
    }, [item, userLat, userLon]);

    return (
        <View style={itemStyle.container}>
            <View style={itemStyle.leftContainer}>
                <View style={itemStyle.roomNameContainer}>
                    <Text style={itemStyle.roomName}>{item.room_name}</Text>
                    <Badge status="success" value="Available" />
                </View>
                {
                    distance !== 'Unknown' ? <Text style={itemStyle.distance}>{`Distance: ${distance} km`}</Text> : <Text style={itemStyle.distance}>{`Distance: ${distance}`}</Text>
                }
                <Text style={itemStyle.details}>{`Size: ${item.room_size} seats`}</Text>
                <Text style={itemStyle.details}>{`Equipment: ${item.equipment}`}</Text>
                <Text style={itemStyle.details}>{`Building: ${item.building} Floor: ${item.floor_level}`}</Text>
            </View>
            <View style={itemStyle.rightContainer}>
                <View style={itemStyle.buttonContainer}>
                    <TouchableOpacity style={itemStyle.iconButton} onPress={() => onBook(item)}>
                        <Icon name="calendar-sharp" size={26} color="#007AFF" accessibilityLabel="Make Reservation Button" />

                    </TouchableOpacity>
                    <TouchableOpacity style={itemStyle.iconButton} onPress={() => navigateToMap(item.latitude, item.longitude, item.room_name)}>
                        <Icon name="location-sharp" size={26} color="#007bff" accessibilityLabel="Marker Button" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


export default ResultItem;