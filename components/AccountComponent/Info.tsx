import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { AccountInfo } from '../../constants/types';
import { accountInfoPageStyles } from './styles';
import { changeDisplayName } from '../../utils/user';
import Toast from 'react-native-toast-message';
const Info = ({ accountInfo }: { accountInfo: AccountInfo }) => {

    const [displayName, setDisplayName] = useState(accountInfo.display_name);
    const [error, setError] = useState(''); 
    const handleSave = async () => {
        const response = await changeDisplayName(displayName);
        if (response.success) {
            setError('');
        } else {
            setError(response.error ? response.error : 'An error occurred');
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
                <Text style={accountInfoPageStyles.value}>{accountInfo.display_name}</Text>
            </View>
            <Text style={[accountInfoPageStyles.sectionTitle, { marginTop: 20 }]}>Change Display Name</Text>
            <TextInput
                value={accountInfo.display_name}
                style={accountInfoPageStyles.input}
            />
            <Text style={accountInfoPageStyles.error}>{error}</Text>
            <Button radius="sm" type="solid" style={accountInfoPageStyles.saveButton}>
                Save
                <Icon name="save" color="white" style={accountInfoPageStyles.buttonIcon} />
            </Button>
            <Toast />
        </View>
    );
};


export default Info;
