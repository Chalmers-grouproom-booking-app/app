import React, { useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { Tab, TabView, Text } from '@rneui/themed';
import { getAccountInfo, checkIfLoggedIn  } from '../../utils/user';
import Reservations from './Reservations';
import Reviews from './Reviews';
import { accountPageStyles, styles } from './styles';
import LoginOnce from './modal/LoginOnce';
import Loading from './Loading';
import Info from './Info';
import { AccountInfo } from '../../constants/types';
const AccountComponent = () => {
    const [index, setIndex] = useState(0);
    const [displayName, setDisplayName] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [accountInfo, setAccountInfo] = useState({} as AccountInfo);
    const [closeLoading, setCloseLoading] = useState(false);

    const handleLoginSuccess = async () => {
        try {
            setAccountInfo(await getAccountInfo());
        } catch (error) {
            console.error('Failed to fetch account info:', error);
        }
    }

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const isLoggedIn = await checkIfLoggedIn();
                setLoggedIn(isLoggedIn);
                if (isLoggedIn) {
                    await handleLoginSuccess();
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                setLoggedIn(false);
            }
            finally {
                setLoading(false);
            }
        }
        fetchUserInfo();
    }, []);

    if( loading || !closeLoading) {
        return <Loading done={!loading}  closeLoading={() => setCloseLoading(true)} />;
    }

    if (!loggedIn) {
        return <LoginOnce onLoginSuccess={ () => handleLoginSuccess() } />;
    }

    return (
        <>
            <Tab
                value={index}
                onChange={setIndex}
                indicatorStyle={{
                    backgroundColor: 'white',
                }}
                variant="primary"
                containerStyle={accountPageStyles.tabContainer}
                buttonStyle={accountPageStyles.tabButton}
            >
                <Tab.Item
                    title="General"
                    titleStyle={{ fontSize: 11 }}
                    icon={{ name: 'settings', type: 'ionicon', color: 'white' }}
                />
                <Tab.Item
                    title="Reservations"
                    titleStyle={{ fontSize: 11 }}
                    icon={{ name: 'calendar', type: 'ionicon', color: 'white' }}
                />
                <Tab.Item
                    title="Reviews"
                    titleStyle={{ fontSize: 11 }}
                    icon={{ name: 'star', type: 'ionicon', color: 'white' }}
                />
            </Tab>

            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
                    <Info accountInfo={accountInfo} />
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
