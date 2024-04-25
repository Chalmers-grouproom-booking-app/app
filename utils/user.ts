import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User  } from '../constants/types';

export type LoginResponse = {
    success: boolean;
    error?: string;
};
const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await fetch('https://strawhats.info/timedit/api/login', {
            method: 'POST',
            credentials: "omit",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&scope=&client_id=&client_secret=`
        });
        const data = await response.json();

        if (response.status !== 200) {
            await AsyncStorage.removeItem('user');
            return { success: false, error: data.detail ? data.detail : 'Unknown error' };
        }

        if (response.status === 200 && data.login === "success") {
            const user: User = {
                username: username,
                password: password,
                cookie: data.cookies
            };
            await AsyncStorage.setItem('user', JSON.stringify(user));
            return { success: true };
        }

        return { success: false, error: data.detail ? data.detail : 'Unknown error' };
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, error: `Failed to login: ${error.message}` };
    }
};


// Retrieve user data from AsyncStorage
const getUser = async () => {
    try {
        const userData = await AsyncStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("Error retrieving user data:", error);
        return null;
    }
};

export type ReservationData = {
    room_name: string;
    date: Date;
    start_time: Date;
    end_time: Date;
};
export type ReservationResponse = {
    success: boolean;
    error?: string;
};

export const makeReservation = async (data: ReservationData): Promise<ReservationResponse> => {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error('User not logged in');
        }
        const resp = await fetch( encodeURI(`https://strawhats.info/api/v1/room/id?input=${data.room_name}` ), {method: 'GET',headers: {'accept': 'application/json'}});
        const resp_json = await resp.json();
        if (!resp_json.room_id || resp.status !== 200) {
            throw new Error('Failed to get room id');
        }
        const room_id = resp_json.room_id;
        const cookies = user.cookie;
        const url = `https://strawhats.info/timedit/api/add_reservation?grouproom_id=${room_id}&date=${formatDate(data.date)}&starttime=${formatTime(data.start_time)}&endtime=${formatTime(data.end_time)}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "x-cookies": cookies,
            }
        });
        const json = await response.json();
        console.log(json);
        if (response.status !== 200) {
            throw new Error(json.detail ? json.detail : 'Unknown error');
        }
        return {success: true};
    } catch (error) {
        return {success: false, error: error.message};
    }
};
const formatTime = (date: Date) => {
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

const formatDate = (date: Date) => {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}${month}${day}`;
}

// Check if user is logged in
const checkIfLoggedIn = async () => {
    try {
        const userData = await AsyncStorage.getItem('user');
        return userData ? true : false;
    } catch (error) {
        console.error("Error checking login status:", error);
        return false;
    }
};

// Logout user by removing data from AsyncStorage
const logoutUser = async () => {
    try {
        await AsyncStorage.removeItem('user');
        return true;
    } catch (error) {
        console.error("Error removing user data:", error);
        return false;
    }
};

export { loginUser, getUser, checkIfLoggedIn, logoutUser };
