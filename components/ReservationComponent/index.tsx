import React, { useEffect, useState } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RoomInfo } from '../../constants/types';
import styles from './style';
import MakeReservation from './MakeReservation';
import { checkIfLoggedIn, loginUser, makeReservation, getCredentials } from '../../utils/user';
import LoginUser from './LoginUser';

const ReservationComponent = ({ room_info, showModal, closeModal }: { room_info: RoomInfo, showModal: boolean, closeModal: () => void }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginCheckFailed, setLoginCheckFailed] = useState(false);
    const [ initUserName, setInitUserName ] = useState('');
    const [ initPassword, setInitPassword ] = useState('');

    useEffect(() => {
        const fetchLoginStatus = async () => {
            try {
                const loggedIn = await checkIfLoggedIn();
                setIsLoggedIn(loggedIn);
                if (loggedIn) {
                    const userData = await getCredentials();
                    if (userData) {
                        setInitUserName(userData.username);
                        setInitPassword(userData.password);
                    }
                }
            // setIsLoggedIn(false);

            } catch (error) {
                console.error('Failed to check login status:', error);
                setLoginCheckFailed(true);
            }
        };

        fetchLoginStatus();
    }, []);

    const handleModalPress = (event) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    const loginCallback = (success : boolean) => {
        setIsLoggedIn(success);
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showModal}
            onRequestClose={closeModal}
        >
            <TouchableOpacity style={styles.centeredView} onPress={handleModalPress} activeOpacity={1}>
                <View style={styles.modalView} onStartShouldSetResponder={() => true}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <Icon name="close" size={30} color="#333" />
                    </TouchableOpacity>
                    {
                        loginCheckFailed ?
                        <Text>Failed to check login status. Please try again later.</Text> :
                        !isLoggedIn ?
                        <LoginUser onLogin={ loginUser } loginCallback={ loginCallback }  initUserName={ initUserName } initPassword={ initPassword } /> :
                        <>
                            {
                                room_info && (
                                    <MakeReservation room_info={room_info} makeReservation={ makeReservation } reservationSuccessCallback={ closeModal } />
                                )
                            }
                        </>
                    }
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

export default ReservationComponent;
