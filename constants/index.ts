import { Dimensions } from 'react-native';
import { Interval } from './types';


export const InitRegion = {
    latitude: 57.689131,
    longitude: 11.974257,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
};

export const screenWidth = Dimensions.get('window').width;

export const Johanneberg = {
    latitude: 57.689131,
    longitude: 11.974257,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
}

export const Lindholmen = {
    latitude: 57.7064748,
    longitude: 11.9368681,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
}

export const RoomSizes: { Small: Interval, Medium: Interval, Large: Interval} = {
    Small: {
        lower: 1,
        upper: 5
    },
    Medium: {
        lower: 6,
        upper: 10
    },
    Large: {
        lower: 12,
        upper: 20
    }
}