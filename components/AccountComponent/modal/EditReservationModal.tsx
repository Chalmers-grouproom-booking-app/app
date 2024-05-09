import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {reservationStyles} from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { EditReservationModalProps, ReservationData } from '../../../constants/types';
import GreenCheckmark from '../icons/GreenCheckmark';
import {  editReservation } from '../../../utils/user';
import { Button } from '@rneui/themed';

const EditReservationModal = ({ reservationInfo, reservationSuccessCallback}: { reservationInfo: EditReservationModalProps, reservationSuccessCallback: () => void}) => {
    const [date, setDate] = useState( reservationInfo.date );
    const [startTime, setStartTime] = useState( reservationInfo.start_time );
    const [endTime, setEndTime] = useState( reservationInfo.end_time );

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const handleReservation = async (data: ReservationData)  => {
        setLoading(true);
        try {
            const data = { reservationId: reservationInfo.reservationId, room_name: reservationInfo.room_name, date: date, start_time: startTime, end_time: endTime };
            const response = await editReservation( data);
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
                <Text style={reservationStyles.headerRoomName}>{reservationInfo.room_name}</Text>
            </View>
            { 
                success ? 
                    <View style={reservationStyles.successContainer}>
                        <Text style={reservationStyles.successText}>Reservation successful</Text>
                        <GreenCheckmark width={60} height={60} /> 
                    </View>: 
                <> 
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
                        <Button radius={"sm"} type="solid" onPress={ () => handleReservation({ room_name: reservationInfo.room_name, date: date, start_time: startTime, end_time: endTime }) } color="primary" >
                            Edit Reservation
                        </Button>
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
export default  EditReservationModal;