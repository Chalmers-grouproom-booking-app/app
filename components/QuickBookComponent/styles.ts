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
    buttonGroupContainer2: {
        marginBottom: 0,
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
    equimentContainer: {
        marginBottom: 20,
    },
    noRoomsText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#333',
        opacity: 0.8,
    },
    selectedEq: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    resultContainer : {
        height: 'auto',
        maxHeight: height - 300,
        padding: 20,
    },
    resultScrollView: {
        height: 'auto',
        maxHeight: height - 350,
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 20,
    },
    backButton: {
        marginTop: 20,
        width: screenWidth - 90,
        backgroundColor: '#ff0000',
    },
});