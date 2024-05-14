import React from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';

const ReviewComponent = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.coomingSoon}>Coming Soon!</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    coomingSoon: {
        fontSize: 20,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20
    },
});


export default ReviewComponent;