import React, { useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { Tab, TabView, Text } from '@rneui/themed';
import { getAccountInfo, checkIfLoggedIn  } from '../../utils/user';
import Reservations from './reservations';
import Reviews from './reviews';
import { styles } from './styles';

const AccountComponent = () => {
    const [index, setIndex] = useState(0);
    const [displayName, setDisplayName] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        async function fetchUserInfo() {
            const isLoggedIn = await checkIfLoggedIn();
            setLoggedIn(isLoggedIn);
            if (isLoggedIn) {
                try {
                    const info = await getAccountInfo(); // Fetches display name from account
                    setDisplayName(info.display_name); // Set the fetched display name
                } catch (error) {
                    console.error('Failed to fetch account info:', error);
                }
            }
        }
        fetchUserInfo();
    }, []);


    if (!loggedIn) {
        return (
            <View style={styles.container}>
                <Text h4>Please log in to view your account</Text>
            </View>
        );
    }

    return (
        <>
            <Tab
                value={index}
                onChange={setIndex}
                indicatorStyle={{
                    backgroundColor: 'white',
                    height: 2,
                }}
                variant="primary"
            >
                <Tab.Item
                    title="General"
                    titleStyle={{ fontSize: 12 }}
                    icon={{ name: 'settings', type: 'ionicon', color: 'white' }}
                />
                <Tab.Item
                    title="Reservations"
                    titleStyle={{ fontSize: 12 }}
                    icon={{ name: 'calendar', type: 'ionicon', color: 'white' }}
                />
                <Tab.Item
                    title="Reviews"
                    titleStyle={{ fontSize: 12 }}
                    icon={{ name: 'star', type: 'ionicon', color: 'white' }}
                />
            </Tab>

            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
                    <View style={styles.container}>
                        <Text h4>General Account Settings</Text>
                        <Text style={{ marginTop: 10 }}>Display Name:</Text>
                        <TextInput
                            value={displayName}
                            onChangeText={setDisplayName}
                            style={styles.headerText}
                        />
                    </View>
                </TabView.Item>
                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
                    <Reservations />
                </TabView.Item>
                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
                    <Reviews />
                </TabView.Item>
            </TabView>
        </>
    );
};

export default AccountComponent;
