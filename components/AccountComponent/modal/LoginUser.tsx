import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, TextInput ,Animated} from 'react-native';
import { Input } from '@rneui/themed';
import { loginStyles } from '../styles';
import GreenCheckmark from '../icons/GreenCheckmark';
import { checkIfLoggedIn, getCredentials, loginUser } from '../../../utils/user';

interface LoginUserProps {
    onLoginSuccess?: (success: boolean) => void;
    notLoggedIn?: boolean;
    initUserName?: string;
    initPassword?: string;
  }
  
const LoginUser = ( { onLoginSuccess,  notLoggedIn = false, initUserName = '', initPassword = '' }: LoginUserProps ) => {
    const scaleAnim = useRef(new Animated.Value(1)).current; 

    const [loginSuccess, setLoginSuccess] = useState(false);
    const [username, setUsername] = useState( initUserName );
    const [password, setPassword] = useState( initPassword );
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(true);
    // Use the correct ref type
    const usernameInputRef = useRef<CustomInputRef>(null);
    const passwordInputRef = useRef<CustomInputRef>(null);
    interface CustomInputRef extends TextInput {
        shake: () => void;
    }
        
    const pressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            friction: 5,
            useNativeDriver: true
        }).start();
    };

    const pressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true
        }).start(() => handleLogin());
    };

    useEffect(() => {
        async function checkLoginStatus() {
            try {
                const loggedIn = await checkIfLoggedIn();
                if (!notLoggedIn) {
                    if (loggedIn) {
                        if (onLoginSuccess) {
                            onLoginSuccess(true);
                        }
                    }
                }
                else {
                    const userCred = await getCredentials();
                    if (userCred) {
                        setUsername(userCred.username);
                        setPassword(userCred.password);
                    }
                }
            } catch (error) {
                console.error('Error checking login status:', error);
            }
            finally {
                setLoading(false);
            }
        }
        checkLoginStatus();
    }, []);
    
    const validateInput = () => {
        let isValid = true;
        setUsernameError('');
        setPasswordError('');
        if (!username) {
            setUsernameError('CID is required');
            isValid = false;
            usernameInputRef.current?.shake();
        }
        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
            passwordInputRef.current?.shake();
        }
        if (isValid && !/^(|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(username)) {
            setUsernameError('Invalid CID');
            isValid = false;
            usernameInputRef.current?.shake();
        }
        if (isValid && password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            isValid = false;
            passwordInputRef.current?.shake();
        }
        return isValid;
    };

    const handleLogin = async () => {
        if (!validateInput()) {
            return;
        }

        try {
            const response = await loginUser(username, password);
            if (!response.success) {
                setPasswordError( response.error || 'Login failed');
                passwordInputRef.current?.shake();
            }
            else {
                await successLogin();
            }
        } catch (e) {
            console.error('Error logging in:', e);
            setPasswordError('Login failed');
            passwordInputRef.current?.shake();
        }
    };
    const successLogin = () => {
        setLoginSuccess(true);
        setTimeout(() => {
            setLoginSuccess(false);
            if (onLoginSuccess) {
                onLoginSuccess(true);
            }
        }, 2000);
    }

    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

    return (
        <View style={loginStyles.container}>
            <View style={loginStyles.titleContainer}>
                <Image source={require('../../../assets/timeedit_logo.png')}  style={loginStyles.titleImage} />
                <Text style={loginStyles.title}>Login to TimeEdit</Text>
            </View>
            {
                loading ? <ActivityIndicator size="large" color="#0000ff" /> :
                loginSuccess ? <GreenCheckmark width={60} height={60} style={{'flex': 1, 'alignSelf': 'center', 'marginTop': 20}} /> :
            <>
                <Text style={loginStyles.subtitle}>Please enter your CID and password</Text>
                <Input
                    ref={usernameInputRef}
                    placeholder="CID"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    errorMessage={usernameError}
                    containerStyle={loginStyles.inputContainer}
                    inputContainerStyle={loginStyles.inputBox}
                    errorStyle={loginStyles.errorText}
                    leftIcon={{ type: 'font-awesome', name: 'user', size: 24, color: 'gray' }}
                    leftIconContainerStyle={loginStyles.iconContainer}
                />
                <Input
                    ref={passwordInputRef}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    errorMessage={passwordError}
                    containerStyle={loginStyles.inputContainer}
                    inputContainerStyle={loginStyles.inputBox}
                    errorStyle={loginStyles.errorText}
                    leftIcon={ { type: 'font-awesome', name: 'lock', size: 24, color: 'gray' } }
                    leftIconContainerStyle={loginStyles.iconContainer}
                />
                <AnimatedPressable
                        onPressIn={pressIn}
                        onPressOut={pressOut}
                        style={[
                            loginStyles.submitButton, 
                            { transform: [{ scale: scaleAnim }] } // Correct use of animated value
                        ]}
                        accessibilityLabel='Login'
                        disabled={loading}
                >
                    <Text style={loginStyles.submitButtonText}>Login</Text>
                </AnimatedPressable>
            </>
            }
        </View>
    );
};

export default LoginUser;
