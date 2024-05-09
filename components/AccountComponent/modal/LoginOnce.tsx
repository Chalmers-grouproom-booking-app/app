import React, { useRef, useEffect, useState } from 'react';
import AccountModal, { ModalHandles } from './AccountModal';
import { useNavigation } from 'expo-router';

const LoginOnce = ( {onLoginSuccess}: {onLoginSuccess: (success: boolean) => void} ) => {
    const [disableClose, setDisableClose] = useState(false);
    const modalRef = useRef<ModalHandles>(null);
    const navigation = useNavigation();

    useEffect(() => {
        console.log('Opening login modal');
        if (modalRef.current) {
            modalRef.current.openModal();
        }
    }, []);

    const handleLoginSuccess = () => {
        if (modalRef.current) {
            setDisableClose(true);
            onLoginSuccess(true);
            // modalRef.current.closeModal();
        }
    };

    const navigateBack = () => {
        if (!disableClose) {
            navigation.goBack();
        }
    };

    return (
        <AccountModal ref={modalRef}  closeCallback={navigateBack} notLoggedIn={true} onLoginSuccess={handleLoginSuccess}>
            {/* No children */}
            <></>
        </AccountModal>
    );
};

export default LoginOnce;
