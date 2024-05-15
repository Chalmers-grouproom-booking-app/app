import { screenWidth } from '@/constants';
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    header: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    label: {
        marginBottom: 2,
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    buttonGroupContainer: {
        marginBottom: 30,
        marginLeft: 0,
        marginRight: 0,
    },
    buttonGroupText: {
        color: '#000',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    bookButton: {
        paddingVertical: 12,
    },
    bookButtonTitle: {
        fontWeight: 'bold',
        color: 'white',
    },
    selectedButton: {
        backgroundColor: '#007bff',
    },
    selectedText: {
        color: 'white',
        fontWeight: 'bold',
    },
});