import { screenWidth } from '@/constants';
import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

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
    selectedEq: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Example for modal background, adjust as needed
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: 'white', // Ensures the container has a visible background
    },
    noRoomsText: {
        textAlign: 'center',
        marginTop: 20,
    },
    resultScrollView: {
        flex: 1,
        width: '100%',
    },
    resultScrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 20, // Add some padding to avoid cutting off the last item
    },
    backButton: {
        marginTop: 10,
    },
});



export const itemStyle = StyleSheet.create({
    container: {
        position: 'relative',
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 5,
    },
    roomNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,

    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
        width: '80%',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    roomName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    status: {
        fontSize: 14,
        color: '#4CAF50',
    },
    details: {
        fontSize: 14,
        color: '#666',
    },
    distance: {
        fontSize: 14,
        color: '#333',
        marginBottom: 2,
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '40%',
        marginTop: 10,
        gap : 10,
    },
    iconButton: {
        padding: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
});