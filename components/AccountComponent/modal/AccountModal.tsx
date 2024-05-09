import React, { useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { modal } from '../styles';
import LoginUser from './LoginUser';

interface AccountModalProps {
    children: React.ReactNode;
    closeCallback?: () => void;
    notLoggedIn?: boolean;
    onLoginSuccess?: (success: boolean) => void;
}

export interface ModalHandles {
    openModal: () => void;
    closeModal: () => void;
}

const AccountModal = forwardRef<ModalHandles, AccountModalProps>(( { children, closeCallback, notLoggedIn = false , onLoginSuccess }, ref) => {
    const [showModal, setShowModal] = useState(false);

    useImperativeHandle(ref, () => ({
        openModal: () => setShowModal(true),
        closeModal: () => handleCloseModal(),
    }));

    const handleCloseModal = useCallback(() => {
        if (closeCallback) {
            closeCallback();
        }
        setShowModal(false);
    }, [closeCallback]);

    const handleModalPress = () => {
        handleCloseModal();
    };

    const handleCloseButton = () => {
        handleCloseModal();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showModal}
            onRequestClose={handleCloseModal}
        >
            <TouchableOpacity style={modal.centeredView} onPress={handleModalPress} activeOpacity={1}>
                <View style={modal.modalView} onStartShouldSetResponder={() => true}>
                    <TouchableOpacity style={modal.closeButton} onPress={handleCloseButton}>
                        <Icon name="close" size={30} color="#333" />
                    </TouchableOpacity>
                    <LoginUser  
                        notLoggedIn={notLoggedIn} 
                        onLoginSuccess={(success) => {
                            if (onLoginSuccess) {
                                onLoginSuccess(success);
                            }
                        }} 
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
});

export default AccountModal;