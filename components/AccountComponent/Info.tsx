import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { AccountInfo } from '../../constants/types';
import { accountInfoPageStyles } from './styles';
import { changeDisplayName } from '../../utils/user';
import Toast from 'react-native-toast-message';

const Info = ({ accountInfo }: { accountInfo: AccountInfo }) => {
    const [originalDisplayName, setOriginalDisplayName] = useState(accountInfo.display_name);
    const [displayName, setDisplayName] = useState(accountInfo.display_name);
    const handleSave = async () => {
        const response = await changeDisplayName(displayName);
        if (response.success) {
            Toast.show({
                type: 'success',
                text1: 'Display Name Updated 🎉',
                position: 'bottom',
              });
            setOriginalDisplayName(displayName);
        } else {
            Toast.show({
                type: 'error',
                text1: response.error ?? 'Failed to update display name',
                position: 'bottom',
              });
        }
    };

    return (
        <View style={accountInfoPageStyles.container}>
            <Text style={accountInfoPageStyles.sectionTitle}>General Account Settings</Text>
            <View style={accountInfoPageStyles.infoContainer}>
                <Text style={accountInfoPageStyles.label}>ID:</Text>
                <Text style={accountInfoPageStyles.value}>{accountInfo.id}</Text>
            </View>
            <View style={accountInfoPageStyles.infoContainer}>
                <Text style={accountInfoPageStyles.label}>CID:</Text>
                <Text style={accountInfoPageStyles.value}>{accountInfo.email}</Text>
            </View>
            <View style={accountInfoPageStyles.infoContainer}>
                <Text style={accountInfoPageStyles.label}>Display Name:</Text>
                <Text style={accountInfoPageStyles.value}>{ originalDisplayName }</Text>
            </View>
            <Text style={[accountInfoPageStyles.sectionTitle, { marginTop: 20 }]}>Change Display Name</Text>
            <TextInput
                value={displayName}
                style={accountInfoPageStyles.input}
                onChangeText={setDisplayName}
            />
            <Button radius="sm" type="solid" style={accountInfoPageStyles.saveButton} onPress={handleSave}>
                Save
                <Icon name="save" color="white" style={accountInfoPageStyles.buttonIcon} />
            </Button>
        </View>
    );
};


export default Info;
