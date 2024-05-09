import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        marginBottom: 10,
    },
    headerSubtitle: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export const modal = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 10,
        padding:20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.20,
        shadowRadius: 3,
        elevation: 3,
        width: '90%', 
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        padding: 20,
        elevation: 5,        
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
    }
});

export const reservationStyles = StyleSheet.create({
    successContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    successText: {
        fontSize: 18,
        marginBottom: 10,
        color: 'green',
    },
    container: {
        width: '100%',
    },
    header: { 
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerRoomName: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    headerText: {
        fontSize: 14,
        textAlign: 'center'
    },
    roomDetails: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderTopColor: '#ccc',
        borderTopWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,        
    },
    roomDetail: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    datePicker:{
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 6,
        borderRadius: 5,
    },
    timePickerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    makeReservationButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    loadingText: {
        color: 'gray',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
    },
    makeReservationText: {
        color: 'white',
        fontSize: 16,
    }
});

export const loginStyles = StyleSheet.create({ 
    container: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
        padding: 0,
        gap: 0,
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
        padding: 0,
        gap: 0,
    },
    titleImage: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 10
    },
    title:{
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center'
    },
    inputContainer: {
        padding: 0,
        marginHorizontal: 0,
        marginBottom: 0,
    },
    iconContainer: {
        padding: 0,
        marginHorizontal: 0,
        marginRight: 6
    },
    inputBox: {
        padding: 0,
        borderWidth: 1,
        paddingHorizontal: 10,
        marginHorizontal: 0,
        borderBottomColor: '#ccc',
        width: '100%'
    },
    submitButton: {
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        marginLeft: 10,
        height: 35,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center'
    }
});


export const accountPageStyles = StyleSheet.create({
    tabContainer: {
        backgroundColor: '#007bff',
        padding: 0,
        margin: 0,
    },
    tabButton: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        margin: 0,
    }
});



export const accountInfoPageStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 10,
    },
    infoContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    value: {
        flex: 1,
    },
    input: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    saveButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#007bff',
        paddingHorizontal: 15,
        paddingVertical: 0,
        borderRadius: 5,
    },
    buttonIcon: {
        marginLeft: 5,
    },
});
