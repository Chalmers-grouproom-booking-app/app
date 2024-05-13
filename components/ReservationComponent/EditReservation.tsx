import React, { useEffect, useRef, useState } from 'react';
import { EditReservationModalProps, RoomInfo } from '../../constants/types';
import AccountModal, { ModalHandles } from '../AccountComponent/modal/AccountModal';
import EditReservationModal from '../AccountComponent/modal/EditReservationModal';

const EditReservation = ({ reservationInfo,  openModal, closeCallback }: {reservationInfo: EditReservationModalProps, openModal: boolean,  closeCallback: () => void }) => {
    const modalRef = useRef<ModalHandles>();

    useEffect(() => {
        if (openModal && modalRef.current) {
            modalRef.current.openModal();
        }
    }, [openModal]);

    return (
       <AccountModal ref={modalRef} closeCallback={closeCallback}> 
            {
                reservationInfo && (
                    <EditReservationModal
                        reservationInfo={reservationInfo}
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

export default EditReservation;
