import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { modal } from '../styles';
import LoginUser from './LoginUser';

interface AccountModalProps {
    children: React.ReactNode;
    closeCallback?: () => void;
}

export interface ModalHandles {
    openModal: () => void;
    closeModal: () => void;
}

const AccountModal = forwardRef<ModalHandles, AccountModalProps>(({ children, closeCallback }, ref) => {
    const [showModal, setShowModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useImperativeHandle(ref, () => ({
        openModal: () => setShowModal(true),
        closeModal: () => setShowModal(false)
    }));

    // call closeCallback when modal is closed
    useEffect(() => {
        if (!showModal && closeCallback) {
            closeCallback();
        }
    }, [showModal, closeCallback]);
    
    const handleModalPress = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.target === event.currentTarget) {
            setShowModal(false);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
        >
            <TouchableOpacity style={modal.centeredView} onPress={handleModalPress as any} activeOpacity={1}>
                <View style={modal.modalView} onStartShouldSetResponder={() => true}>
                    <TouchableOpacity style={modal.closeButton} onPress={() => setShowModal(false)}>
                        <Icon name="close" size={30} color="#333" />
                    </TouchableOpacity>
                    {isLoggedIn ? children : <LoginUser onLoginSuccess={() => setIsLoggedIn(true)} />}
                </View>
            </TouchableOpacity>
        </Modal>
    );
});

export default AccountModal;