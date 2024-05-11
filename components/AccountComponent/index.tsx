import React, { useState, useEffect } from 'react';
import { Tab, TabView, Text } from '@rneui/themed';
import { getAccountInfo, checkIfLoggedIn  } from '../../utils/user';
import Reservations from './Reservations';
import Reviews from './Reviews';
import { accountPageStyles } from './styles';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoginOnce from './modal/LoginOnce';
import Loading from './Loading';
import Info from './Info';
import { AccountInfo } from '../../constants/types';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from 'expo-router';

const AccountComponent = () => {
    const [index, setIndex] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [accountInfo, setAccountInfo] = useState({} as AccountInfo);
    const [displayName, setDisplayName] = useState(accountInfo.display_name);
    const [closeLoading, setCloseLoading] = useState(false);
    const navigation = useNavigation();

    const handleLoginSuccess = async () => {
        try {
            const accountInfo = await getAccountInfo();
            setAccountInfo( accountInfo );
            setDisplayName(accountInfo.display_name);
            setLoggedIn(true);
        }
        catch (error) {
            console.error('Error fetching account info:', error);
            setLoggedIn(false);
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
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
                <View style={styles.userInfo}>
                    <Text style={styles.infoText}><Text style={styles.infoLabel}>CID:</Text> { accountInfo.email }</Text>
                    <Text style={styles.infoText}><Text style={styles.infoLabel}>Display name:</Text> {accountInfo.display_name}</Text>
                </View>
            </View>
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
                    icon={{ name: 'settings', type: 'ionicon', color: 'white' , size: 20}}
                />
                <Tab.Item
                    title="Reservations"
                    titleStyle={{ fontSize: 11 }}
                    icon={{ name: 'calendar', type: 'ionicon', color: 'white' , size: 20}}
                />
                <Tab.Item
                    title="Reviews"
                    titleStyle={{ fontSize: 11 }}
                    icon={{ name: 'star', type: 'ionicon', color: 'white', size: 20}}
                />
            </Tab>

            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
                    <Info accountInfo={accountInfo} setNewDisplayName={setDisplayName} />
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

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#34495E', // Dark shade of blue-gray
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderBottomColor: '#9dffdd', // Slightly darker shade of blue-gray
        borderBottomWidth: 2
    },
    iconContainer: {
        paddingRight: 20
    },
    userInfo: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 3,
        flex: 1
    },
    infoText: {
        color: '#ECF0F1', 
        fontSize: 14,
    },
    infoLabel: {
        fontWeight: 'bold',
        paddingRight: 5,
        color: '#9dffdd'
    }
});

export default AccountComponent;
