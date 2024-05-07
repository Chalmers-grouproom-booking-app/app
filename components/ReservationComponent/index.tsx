import React, { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import { RoomInfo } from '../../constants/types';
import MakeReservation from '../AccountComponent/modal/MakeReservation';
import { checkIfLoggedIn, loginUser, makeReservation, getCredentials } from '../../utils/user';
import LoginUser from '../AccountComponent/modal/LoginUser';
import GeneralModal, { ModalHandles } from '../AccountComponent/modal/GeneralModal';

const ReservationComponent = ({ room_info }: { room_info: RoomInfo }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginCheckFailed, setLoginCheckFailed] = useState(false);
    const [ initUserName, setInitUserName ] = useState('');
    const [ initPassword, setInitPassword ] = useState('');
    const modalRef = useRef<ModalHandles>(null);

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

    const loginCallback = (success : boolean) => {
        setIsLoggedIn(success);
    }

    return (
        <GeneralModal ref={modalRef}>
            {
                loginCheckFailed ?
                <Text>Failed to check login status. Please try again later.</Text> :
                !isLoggedIn ?
                <LoginUser onLogin={ loginUser } loginCallback={ loginCallback }  initUserName={ initUserName } initPassword={ initPassword } /> :
                <>
                    {
                        room_info && (
                            <MakeReservation room_info={room_info} makeReservation={ makeReservation } reservationSuccessCallback={ modalRef.current.closeModal } />
                        )
                    }
                </>
            }
        </GeneralModal>
    );
};

export default ReservationComponent;
