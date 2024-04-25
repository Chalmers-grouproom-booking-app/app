import { useState, useCallback } from 'react';
import { RoomInfo } from '../../constants/types'; // Importing types from your constants

function useReservations (){
    const [showModal, setShowModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<RoomInfo | null>(null);

    const openModal = useCallback((room: RoomInfo) => {
        setSelectedRoom(room);
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setSelectedRoom(null);
        setShowModal(false);
    }, []);

    return {
        showModal,
        selectedRoom,
        openModal,
        closeModal
    };
}

export default useReservations;
