import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, Text, Image, Easing } from 'react-native';
import { loginStyles } from './styles';
import { LinearProgress } from '@rneui/themed';

interface LoadingProps {
    done: boolean;
    closeLoading(): void;
}

const Loading: React.FC<LoadingProps> = ({ done, closeLoading }) => {
    const [exitAnimation] = useState(new Animated.Value(0));
    const [progress, setProgress] = useState(0.1);

    useEffect(() => {
        // add 0.1 to progress every 500ms
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 0.9) {
                    return prev + 0.1;
                } else {
                    return prev;
                }
            });
        }, 50);

    }, []);


    useEffect(() => {
        const startExitAnimation = () => {
            Animated.timing(exitAnimation, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
                // more natural easing
                easing: Easing.bezier( 0.6, 0.05, 0.01, 0.9 ),
            }).start(
                () => {
                    setTimeout(() => {
                        closeLoading();
                    }, 200);
                }
            );
        };

        if (done) {
            setProgress(1)
            setTimeout(() => {
                startExitAnimation();
            }, 500);
        }
    },  [done]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    {
                        opacity: exitAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0],
                        }),
                        transform: [
                            {
                                translateY: exitAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 50],
                                }),
                            },
                            {
                                scale: exitAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 0.8],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <View style={styles.conent} >
                    <Image source={require('../../assets/timeedit_logo.png')} style={loginStyles.titleImage} />
                    <Text style={loginStyles.title}>Checking credentials...</Text>
                    <LinearProgress style={{  height:10 }} value={progress} variant="determinate" color='#007644' trackColor='#9dffdd' animation={{ duration: 300 }} />
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    conent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 30,
        backgroundColor: 'white',
        borderRadius: 10,
    },
});

export default Loading;
