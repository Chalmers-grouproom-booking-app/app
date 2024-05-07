import React, { useEffect, useState } from 'react';
import { Text, Modal, View, Button, TouchableOpacity, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RoomInfo } from '../../../constants/types';
import {reservationStyles} from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { ReservationData, ReservationResponse } from '../../../constants/types';
import GreenCheckmark from '../icons/GreenCheckmark';

const getCurrentHourRounded = () => {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const currentHourRounded = currentMinute > 30 ? currentHour + 1 : currentHour;
    return currentHourRounded;
}

const addOneHour = (date: Date) => {
    return new Date(date.getTime() + 60 * 60 * 1000);
}

const MakeReservation = ({ room_info, makeReservation, reservationSuccessCallback}: { room_info: RoomInfo ,  makeReservation: (data: ReservationData)  =>  Promise<ReservationResponse> , reservationSuccessCallback: () => void}) => {
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState( new Date(new Date().setHours(getCurrentHourRounded(), 0, 0, 0)) );
    const [endTime, setEndTime] = useState( addOneHour(startTime) );

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const handleReservation = async (data: ReservationData)  => {
        setLoading(true);
        try {
            const response = await makeReservation(data);
            if (response.success) {
                setError('');
                setSuccess(true);
                setTimeout(() => reservationSuccessCallback(), 2000);
            }
            else {
                // remove message after 3 seconds
                setError(response.error ? response.error : 'Unknown error');
                setTimeout(() => setError(''), 3000);
            }
        }
        catch (error) {
            setError('Failed to make reservation');
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <View style={reservationStyles.container}>
            <View style={reservationStyles.header}>
                <Text style={reservationStyles.headerRoomName}>{room_info.room_name}</Text>
            </View>
            { 
                success ? 
                    <View style={reservationStyles.successContainer}>
                        <Text style={reservationStyles.successText}>Reservation successful</Text>
                        <GreenCheckmark width={60} height={60} /> 
                    </View>: 
                <> 
                    <View style={reservationStyles.roomDetails}>
                        <RoomDetial icon_name="people" icon_accessibility_label="People icon" text={ `Capacity: ${room_info.room_size}` } />
                        { room_info.description && (<RoomDetial icon_name="description" icon_accessibility_label="Description icon" text={ `${room_info.description} ` } /> ) }
                        {
                            room_info.equipment && room_info.equipment !== '-' && (
                                <RoomDetial icon_name="computer" icon_accessibility_label="Computer icon" text={`Equipment: ${room_info.equipment}`} />
                            )
                        }
                        <RoomDetial icon_name="location-on" icon_accessibility_label="Location icon" text={ `${room_info.building}, ${room_info.campus}` } />
                        <RoomDetial icon_name="stairs" icon_accessibility_label="Stairs icon" text={ `Floor ${room_info.floor_level} ` } />
                    </View>
                    <Pressable style={reservationStyles.datePicker} onPress={() => setShowDatePicker(true)}>
                        <Text> Date: {date.toDateString()} </Text>
                    </Pressable>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setDate(selectedDate || date); // Fallback to current date if cancel is pressed
                                setShowDatePicker(false);
                            }}
                        />
                    )}
        
                    <View style={reservationStyles.timePickerContainer}>
                        <Pressable style={reservationStyles.datePicker} onPress={() => setShowStartTimePicker(true)}>
                            <Text> Start Time: {startTime.toLocaleTimeString('sv-SE' , { hour: '2-digit', minute: '2-digit' })}</Text>
                        </Pressable>
                        {showStartTimePicker && (
                            <DateTimePicker
                                value={startTime}
                                mode="time"
                                display="default"
                                is24Hour={true}
                                onChange={(event, selectedDate) => {
                                    setStartTime(selectedDate || startTime); // Fallback to current time if cancel is pressed
                                    setShowStartTimePicker(false);
                                }}
                            />
                        )}
        
                        <Pressable style={reservationStyles.datePicker} onPress={() => setShowEndTimePicker(true)}>
                            <Text> End Time: {endTime.toLocaleTimeString('sv-SE' , { hour: '2-digit', minute: '2-digit' })}</Text>
                        </Pressable>
                        {showEndTimePicker && (
                            <DateTimePicker
                                value={endTime}
                                mode="time"
                                display="default"
                                is24Hour={true}
                                onChange={(event, selectedDate) => {
                                    setEndTime(selectedDate || endTime); // Fallback to current time if cancel is pressed
                                    setShowEndTimePicker(false);
                                }}
                            />
                        )} 
                    </View>
        
                    {error !== '' && <Text style={reservationStyles.errorText}>{error}</Text>}
                    {
                        loading ? <Text style={reservationStyles.loadingText}>Loading...</Text> :
                        <Button
                            title="Make Reservation"
                            onPress={ () => handleReservation({ room_name: room_info.room_name, date: date, start_time: startTime, end_time: endTime }) }
                        />
                    }
                
                </>
            }
            
        </View>
   
    );
};


const RoomDetial = ( { icon_name, icon_accessibility_label, text }: { icon_name: string, icon_accessibility_label: string, text: string }) => {
    return (
        <View style={reservationStyles.roomDetail}>
            <Icon name={icon_name} size={20} accessibilityLabel={icon_accessibility_label} style={{marginRight: 5}} color="gray" />
            <Text>{text}</Text>
        </View>
    );
}
export default  MakeReservation;