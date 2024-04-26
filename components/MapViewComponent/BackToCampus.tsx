import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, Easing } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BackToCampus = ( { lindholmen, johanneberg } ) => {
    const [showOptions, setShowOptions] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;  // Control opacity of the main button
    const optionsAnim = useRef(new Animated.Value(0)).current;  // For sliding up the options

    useEffect(() => {
        let timer;
        if (showOptions) {
            timer = setTimeout(() => {
                // Auto-hide options after a delay
                closeOptions();
            }, 5000);
        }
        return () => timer && clearTimeout(timer);
    }, [showOptions]);

    const toggleOptions = () => {
        if (!showOptions) {
            // Fade out the main button and slide up the options
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setShowOptions(true);
                // Start slide-up animation once the main button is faded out
                Animated.timing(optionsAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            });
        } else {
            closeOptions();
        }
    };

    const closeOptions = () => {
        // Slide down the options and fade in the main button
        Animated.timing(optionsAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowOptions(false);
            // Fade the main button back in after options slide down
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
    };

    const optionStyle = {
        transform: [{
            translateX: optionsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0]  // Slide up from below
            })
        }],
        opacity: optionsAnim
    };

    return (
        <>
            {showOptions ? (
                <Animated.View style={[styles.optionsContainer, optionStyle]}>
                    <Options closeOptions={closeOptions} lindholmen={lindholmen} johanneberg={johanneberg} />
                </Animated.View>
            ) : (
                <Animated.View style={[styles.backToCampusButton, { opacity: fadeAnim }]}>
                    <TouchableOpacity onPress={toggleOptions} activeOpacity={1}>
                        <Icon name="school" size={32} color="#333" accessibilityLabel="Back to Campus Button" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </>
    );
}

const Options = ({ closeOptions , lindholmen, johanneberg }) => {
    return (
        <>
            <TouchableOpacity activeOpacity={1} style={[styles.optionButton, { justifyContent: 'flex-start' }]} onPress={
                () => {
                    closeOptions();
                    lindholmen();
                }}>
                <Icon name="arrow-back" size={32} color="#333" accessibilityLabel="Back to Lindholmen" />
                <Text style={styles.optionText}>Lindholmen</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={[styles.optionButton, { justifyContent: 'flex-end' }]} 
                onPress={()=>{
                    closeOptions();
                    johanneberg();
                }}>
                <Text style={styles.optionText}>Johanneberg</Text>
                <Icon name="arrow-forward" size={32} color="#333"
                 accessibilityLabel="Back to Johanneberg" />
            </TouchableOpacity>
        </>
    );
}

export default BackToCampus;