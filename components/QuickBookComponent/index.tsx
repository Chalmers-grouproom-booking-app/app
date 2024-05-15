import React, { useEffect, useRef, useState } from 'react';
import AccountModal, { ModalHandles } from '../AccountComponent/modal/AccountModal';
import FilterPanel  from './FilterPanel';
import { PanelFilter, Location, RoomSize } from './types';
import ResultPanel from './ResultPanel';

const QuickBookComponent = ({  openModal, closeCallback }: { openModal: boolean,  closeCallback: () => void }) => {
    const modalRef = useRef<ModalHandles>();
    const [ showResult, setShowResult ] = useState(false);
    const [filter, setFilter] = useState<PanelFilter>(
        {
            selectedLocation: Location.Johanneberg,
            selectedRoomSize: RoomSize.Small,
            selectedEquipment: [],
        }
    );
    useEffect(() => {
        if (openModal && modalRef.current) {
            modalRef.current.openModal();
        }
    }, [openModal]);

    const handleClose = () => {
        setShowResult(false);
        closeCallback();
    }
    const handleGoBack = () => {
        setShowResult(false);
    }

    const handleFilter = (filter: PanelFilter) => {
        setFilter(filter);
        setShowResult(true);
    }

    return (
       <AccountModal ref={modalRef} closeCallback={handleClose}> 
            {
                showResult ? <ResultPanel filter={filter} goBack={handleGoBack}/> : <FilterPanel filter={filter} setFilterCallback={handleFilter} />
            }
        </AccountModal>
    );
};

export default QuickBookComponent;
