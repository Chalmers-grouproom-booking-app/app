import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { AccountInfo, FullUser, LoginResponse, ReservationData, ReservationResponse, ReservationsResponse, User  } from '../constants/types';
import { formatDate, formatTime } from './utils';

// Global constants
const BASE_URL = 'https://strawhats.info/';

async function saveCredentials(user: FullUser) {
    try {
        await AsyncStorage.setItem('user', JSON.stringify({ username: user.username, token: user.token }));
        await SecureStore.setItemAsync('password', user.password);
    } catch (error) {
        console.error('Error saving credentials:', error);
    }
}

async function getCredentials(): Promise<FullUser | null> {
    try {
        const userData = await AsyncStorage.getItem('user');
        const password = await SecureStore.getItemAsync('password');
        if (userData && password) {
            const { username, token } = JSON.parse(userData);
            return { username, password, token };
        }
        return null;
    } catch (error) {
        console.error('Error retrieving credentials:', error);
        return null;
    }
}

const getUser = async (): Promise<User | null> => {
    try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
            const { username, token } = JSON.parse(userData);
            return { username, token };
        }
        return null;
    } catch (error) {
        console.error("Error retrieving user data:", error);
        return null;
    }
};

// Improved utility function for API requests
async function performApiRequest(endpoint: string, method: string = 'GET', body: any = null, headers = {}, includeAuth: boolean = true): Promise<any> {
    let authHeaders = {};
    if (includeAuth) {
        const user = await getUser();
        if (!user || !user.token) {
            throw new Error('Authentication error: User not logged in or token missing.');
        }
        authHeaders = { 'Authorization': `Bearer ${user.token}` };
    }

    const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': body ? 'application/json' : 'application/x-www-form-urlencoded',
        ...headers,
        ...authHeaders
    };

    const config: RequestInit = {
        method,
        headers: defaultHeaders,
        body: body ? JSON.stringify(body) : body
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`${data.detail || 'Unknown error'} with status ${response.status}`);
    }
    return data;
}


const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const body = `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&scope=&client_id=&client_secret=`;
        const data = await performApiRequest('account/token', 'POST', body, {}, false);
        if (data.access_token) {
            const user: FullUser = {
                username: username,
                password: password,
                token: data.access_token
            };
            await saveCredentials(user);
            return { success: true };
        }
        return { success: false, error: 'Login successful but no token received' };
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, error: error.message || 'Failed to login' };
    }
};


export const makeReservation = async (data: ReservationData): Promise<ReservationResponse> => {
    try {
        // Step 1: Get the room ID using the room name
        const roomResponse = await performApiRequest(`api/v1/room/id?input=${encodeURIComponent(data.room_name)}`, 'GET');
        if (!roomResponse.room_id) {
            throw new Error('Failed to get room id');
        }
        const room_id = roomResponse.room_id;

        // Step 2: Make the reservation
        const reservationDetails = {
            grouproom_id: room_id,
            date: formatDate(data.date),
            starttime: formatTime(data.start_time),
            endtime: formatTime(data.end_time)
        };
        const reservationResponse = await performApiRequest('timedit/api/add_reservation', 'POST', reservationDetails);

        // Assuming the API responds with details on success or error in the same way
        if (!reservationResponse.success) {
            throw new Error(reservationResponse.detail ? reservationResponse.detail : 'Unknown error in reservation');
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message || 'Failed to make reservation' };
    }
};


export const getReservations = async (): Promise<ReservationsResponse> => {
    try {
        const reservationsData = await performApiRequest('timedit/api/all_reservations');
        return reservationsData; 
    } catch (error) {
        throw new Error(`Failed to fetch reservations: ${error.message}`);
    }
};

export const getAccountInfo = async (): Promise<AccountInfo> => {
    try {
        const data = await performApiRequest('account/me');
        return data as AccountInfo;
    } catch (error) {
        throw new Error(`Failed to fetch account info: ${error.message}`);
    }
}


const checkIfLoggedIn = async (): Promise<boolean> => {
    try {
        const data = await performApiRequest('account/me');
        return true; // If performApiRequest doesn't throw an error, the user is logged in
    } catch (error) {
        // Handling the specific case where the session might have expired or is unauthorized
        if (error.message.includes('401')) {
            console.log("Session expired or not authenticated.");
        } else {
            console.error('Error checking login status:', error.message);
        }
        return false; // In case of any error, return false
    }
};


const logoutUser = async (): Promise<boolean> => {
    try {
        await AsyncStorage.removeItem('user');
        await SecureStore.deleteItemAsync('password');
        return true;
    } catch (error) {
        console.error("Error removing user data:", error);
        return false;
    }
};

export { loginUser, getUser, checkIfLoggedIn, logoutUser, saveCredentials, getCredentials, LoginResponse };
