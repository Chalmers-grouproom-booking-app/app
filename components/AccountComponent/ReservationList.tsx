import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { EditReservationModalProps, Reservation } from '../../constants/types';
import { Ionicons } from '@expo/vector-icons'; // Ensure @expo/vector-icons is installed
import Toast from 'react-native-toast-message';
import { deleteReservation } from '../../utils/user';

interface ReservationListProps {
    reservation: Reservation;
    editReservationCallBack : (data: EditReservationModalProps) => Promise<void>;
    updateAllReservation : () => Promise<void>;
  }

const ReservationList = ({ reservation , editReservationCallBack, updateAllReservation }: ReservationListProps ) => {
    const handleEdit = async () => {
      const body: EditReservationModalProps = {
        reservationId: reservation.id,
        room_name: reservation.columns.join(', '),
        date: new Date(reservation.startdate),
        start_time:  getDateFromTime(reservation.starttime),
        end_time: getDateFromTime(reservation.endtime),
      };
      try {
        await editReservationCallBack(body);
      } catch (error) {
        console.error('Error editing reservation', error);
      }
    };

    const handleDelete = async ( id : string ) => {
       // ask for confirmation
        Alert.alert(
          'Delete Reservation',
          'Are you sure you want to delete this reservation?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            { text: 'OK', onPress: () =>  deleteSingleReservation(id) },
          ],
          { cancelable: true }
        );
    };

    const deleteSingleReservation = async ( id: string ) => { 
          const response = await deleteReservation(id);
          if (response.success) {
            Toast.show({
                type: 'success',
                text1: 'Reservation Deleted Successfull 🧹',
                position: 'bottom',
            });
            await updateAllReservation();
          }
          else {
            Toast.show({
                type: 'error',
                text1: response.error,
                position: 'bottom',
            });
          }
    }

    const formatDateMonth = (date: string) => {
        const [year, month, day] = date.split('-');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
        return `${monthNames[parseInt(month) - 1]}`;  // Change format as per locale preference
      };

    const formatDateDay = (date: string) => {
        const [year, month, day] = date.split('-');
        return `${day}`;  // Change format as per locale preference
    }

    const getDateFromTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours));
      date.setMinutes(parseInt(minutes));
      return date;
    }

    const getTimeUntil = (date: string, time: string) => {
      const dateTime = new Date(`${date}T${time}`).getTime();
      const now = new Date().getTime();
      const millisecondsLeft = dateTime - now;
  
      if (millisecondsLeft < 0) {
        return "Passed";
      }
  
      const daysLeft = Math.floor(millisecondsLeft / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((millisecondsLeft / (1000 * 60 * 60)) % 24);
  
      if (daysLeft > 0) {
        return `${daysLeft} days left`;
      } else {
        return `${hoursLeft} hours left`;
      }
    };
  
    const badgeText = getTimeUntil(reservation.startdate, reservation.endtime);
  
    return (
        <View style={styles.container}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateTextDay}>{formatDateDay(reservation.startdate)}</Text>
            <Text style={styles.dateTextMonth}>{formatDateMonth(reservation.startdate)}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.columnsText}>{reservation.columns.join(', ')}</Text>
            <Text style={styles.dateTimeText}>
              {`${reservation.starttime} - ${reservation.endtime}`}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleEdit}>
                <Text style={styles.buttonText}>Edit</Text>
                <Ionicons name="create" size={16} color="#fff"  style={{marginLeft: 6}}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonDelete}  onPress={() => handleDelete(reservation.id)}>
                <Text style={styles.buttonText}>Delete</Text>
                <Ionicons name="trash" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.badge}>{badgeText}</Text>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flexDirection: 'row',
        padding: 12,
        margin: 3,
        marginBottom: 14,
        backgroundColor: '#fff',
        borderRadius: 6,
        elevation: 3,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        position: 'relative',
      },
      dateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: '#ccc',
        paddingRight: 5,
      },
      badge: {
        position: 'absolute',
        top: 12,
        right: 12,
        fontSize: 14,
        color: '#333',
      },
    dateTextDay: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'gray',
    },
        dateTextMonth: {
            fontSize: 14,
            color: '#333',
        },
      detailContainer: {
        flex: 3,
        paddingLeft: 20,
      },
      reservationId: {
        fontSize: 14,
        color: '#aaa',
      },
      columnsText: {
        fontSize: 14,
        color: '#333',
      },
      dateTimeText: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 14,
      },
      button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 10,
      },
      buttonDelete: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F44336',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
      },
      buttonText: {
        color: '#fff',
        fontSize: 14,
      },
    });
    

export default ReservationList;
