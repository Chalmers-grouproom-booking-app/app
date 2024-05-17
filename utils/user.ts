import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { AccountInfo, ApiResponse, FullUser, LoginResponse, ValidationError, ReservationData, ReservationResponse, ReservationsResponse, User, ValidationErrorResponse, LoginSuccessResponse, getRoomIdResponse, EditReservationModalProps  } from '../constants/types';
import { formatDate, formatTime } from './utils';

// Global constants
const BASE_URL = 'https://strawhats.info/';

class ApiError extends Error {
    constructor(public status_code: number, public detail: string) {
        super(detail); // Call the parent Error constructor
        this.name = 'ApiError'; // Set the error name as ApiError
    }
}

async function saveCredentials(user: FullUser) {
    try {
        await AsyncStorage.setItem('user', JSON.stringify({ username: user.username, token: user.token }));
        await SecureStore.setItemAsync('password', user.password);
    } catch (error) {
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
        return null;
    }
};

async function performApiRequest<T>(endpoint: string, method: string = 'GET',body: any = null, headers = {}, includeAuth: boolean = true,  content_type: string = 'application/json'): Promise<ApiResponse<T>> {
    let authHeaders: Record<string, string> = {};
    if (includeAuth) {
        const user = await getUser();  // Ensure getUser is defined and returns the expected user object
        if (!user || !user.token) {
            throw new ApiError(401, 'Authentication error: User not logged in or token missing.');
        }
        authHeaders = { 'Authorization': `Bearer ${user.token}` };
    }
    const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': content_type,
        ...headers,
        ...authHeaders
    };
    const config: RequestInit = {
        method,
        headers: defaultHeaders,
        body: body ? JSON.stringify(body) : null
    };
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (response.ok) {
            return { data: data as T }; // Successful response with data
        } else if (response.status === 422) {
            const response_data = data as ValidationErrorResponse;
            const errors = response_data.detail.map((error: ValidationError) => error.msg).join(', ');
            throw new ApiError(response.status, errors);
        }
        else {
            throw new ApiError(response.status, data.detail ?? 'An error occurred');
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new ApiError(500, error.message ?? 'An error occurred with the request');
        } else {
            throw error;
        }
    }
}

const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const body = `grant_type=&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&scope=&client_id=&client_secret=`
        const data = await performApiRequest<LoginSuccessResponse>('account/token', 'POST', body, {}, false, 'application/x-www-form-urlencoded');
        const user: FullUser = {
            username: username,
            password: password,
            token: data.data.access_token
        };
        await saveCredentials(user);
        return { success: true };
    }
    catch (error) {
        if (error instanceof ApiError) {
            return { success: false, error: error.detail };
        }
        return { success: false, error: 'Failed to login' };
    }
};


export const makeReservation = async (data: ReservationData): Promise<ReservationResponse> => {
    try {
        // Step 1: Get the room ID using the room name
        const roomResponse = await performApiRequest<getRoomIdResponse>(`api/v1/room/id?input=${encodeURIComponent(data.room_name)}`, 'GET');
        const room_id = roomResponse.data.room_id;

        // Step 2: Make the reservation
        const url = `timedit/api/add_reservation?grouproom_id=${room_id}&date=${formatDate(data.date)}&starttime=${formatTime(data.start_time)}&endtime=${formatTime(data.end_time)}`;
        await performApiRequest<any>(url, 'POST');
        return { success: true };
    } catch (error) {
        if (error instanceof ApiError) {
            return { success: false, error: error.detail };
        }
        return { success: false, error: 'Failed to make reservation' };
    }
};

export const editReservation = async (data: EditReservationModalProps): Promise<ReservationResponse> => {
    try {
        const url = `timedit/api/edit_reservation/${data.reservationId}?date=${formatDate(data.date)}&starttime=${formatTime(data.start_time)}&endtime=${formatTime(data.end_time)}`;
        console.log(url);
        await performApiRequest<any>(url, 'PUT');
        return { success: true };
    } catch (error) {
        if (error instanceof ApiError) {
            return { success: false, error: error.detail };
        }
        return { success: false, error: 'Failed to edit reservation' };
    }
}

export const deleteReservation = async (reservationId: string): Promise<ReservationResponse> => {
    try {
        await performApiRequest<any>(`timedit/api/delete_reservation/${reservationId}`, 'DELETE');
        return { success: true };
    } catch (error) {
        if (error instanceof ApiError) {
            return { success: false, error: error.detail };
        }
        return { success: false, error: 'Failed to delete reservation' };
    }
}


export const changeDisplayName = async (newName: string): Promise<LoginResponse> => {
    try {
        const body = { display_name: newName };
        await performApiRequest<any>('account/display_name',  'PUT', body);
        return { success: true };
    } catch (error) {
        console.log(error)
        if (error instanceof ApiError) {
            return { success: false, error: error.detail };
        }
        return { success: false, error: 'Failed to update display name' };
    }
};    

export const getReservations = async (): Promise<ReservationsResponse> => {
    const reservationsData = await performApiRequest<ReservationsResponse>('timedit/api/all_reservations');
    return reservationsData.data;
};

export const getAccountInfo = async (): Promise<AccountInfo> => {
    const data = await performApiRequest<AccountInfo>('account/me');
    return data.data;
}


const checkIfLoggedIn = async (): Promise<boolean> => {
    await performApiRequest<AccountInfo>('account/me');
    return true; // If performApiRequest doesn't throw an error, the user is logged in
};


const logoutUser = async (): Promise<boolean> => {
    try {
        await AsyncStorage.removeItem('user');
        await SecureStore.deleteItemAsync('password');
        return true;
    } catch (error) {
        return false;
    }
};

export { loginUser, getUser, checkIfLoggedIn, logoutUser, saveCredentials, getCredentials, LoginResponse };
