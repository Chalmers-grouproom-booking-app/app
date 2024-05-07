import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { modal } from '../styles';

interface GeneralModalProps {
    children: React.ReactNode;
  }

export interface ModalHandles {
    openModal: () => void;
    closeModal: () => void;
}

const GeneralModal = forwardRef<ModalHandles, GeneralModalProps>(({ children }, ref) => {
  const [showModal, setShowModal] = useState(false);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    openModal: () => setShowModal(true),
    closeModal: () => setShowModal(false)
  }));

  const handleModalPress = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Additional checks to ensure the click is on the overlay
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
              {children}
          </View>
      </TouchableOpacity>
    </Modal>
  );
});

export default GeneralModal;