import React, { useCallback, useEffect, useRef } from 'react';
import { RoomInfo } from '../../constants/types';
import MakeReservation from '../AccountComponent/modal/MakeReservation';
import { makeReservation } from '../../utils/user';
import AccountModal, { ModalHandles } from '../AccountComponent/modal/AccountModal';

const ReservationComponent = ({ room_info , openModal, closeCallback }: { room_info: RoomInfo | null, openModal: boolean,  closeCallback: () => void }) => {
    const modalRef = useRef<ModalHandles>();

    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.openModal();
        }
    }, []);

    useEffect(() => {
        if (openModal && modalRef.current) {
            modalRef.current.openModal();
        }
    }, [openModal]);

    return (
       <AccountModal ref={modalRef} closeCallback={closeCallback}>
            {
                room_info && (
                    <MakeReservation
                        room_info={room_info}
                        makeReservation={makeReservation}
                        reservationSuccessCallback={() => {
                            if (modalRef.current) {
                                modalRef.current.closeModal();
                            }
                        }}
                    />
                )
            }
        </AccountModal>
    );
};

export default ReservationComponent;
