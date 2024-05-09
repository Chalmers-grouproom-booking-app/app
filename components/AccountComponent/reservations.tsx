import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { getReservations } from '../../utils/user';
import { EditReservationModalProps, Reservation } from '../../constants/types';
import ReservationList from './ReservationList';  // Assume this component is created in the next step
import { useNavigation } from 'expo-router';
import EditReservation from '../ReservationComponent/EditReservation';
import Toast from 'react-native-toast-message';
const Reservations = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [editReservation, setEditReservation] = useState<EditReservationModalProps | null>(null);
    const [isEditing , setIsEditing] = useState(false);
    const navigation = useNavigation();
    async function fetchReservations() {
        try {
            const fetchedReservations = await getReservations();
            setReservations(fetchedReservations.reservations);
        } catch (error) {
            navigation.goBack();
            setReservations([]);
        }
    }
    useEffect(() => {
        fetchReservations();
    }, []);


    const handleEditReservation = async (data: EditReservationModalProps) => {
        setEditReservation(data);
        setIsEditing(true);
    }

    const successfulEdit = async () => {
        fetchNewReservation();
        Toast.show({
            type: 'success',
            text1: 'Reservation Updated Successfully',
            position: 'bottom',
        });
        setIsEditing(false);
        setEditReservation(null);
    }

    const fetchNewReservation = async () => {
        await fetchReservations();
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {
                    reservations.length === 0 && <Text style={styles.notFound}>No reservations found</Text>
                }
                {reservations.map(reservation => (
                    <ReservationList key={reservation.id} reservation={reservation}  editReservationCallBack={handleEditReservation} updateAllReservation={fetchNewReservation} />
                ))}
                {
                    isEditing && editReservation && <EditReservation openModal={isEditing}  reservationInfo={editReservation}  closeCallback={successfulEdit} />
                }
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    notFound: {
        fontSize: 20,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20
    }
});

export default Reservations;
