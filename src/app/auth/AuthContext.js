import * as React from 'react';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import {showMessage} from 'app/store/fuse/messageSlice';
import {logoutUser, setLoginLoading, setUser} from 'app/store/userSlice';
import {setAuth, setLoading, setSuccess} from 'app/store/authSlice';
import jwtService from './services/jwtService';

const AuthContext = React.createContext();

function AuthProvider({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);
    const [waitAuthCheck, setWaitAuthCheck] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        jwtService.on('onAutoLogin', () => {
            dispatch(showMessage({message: 'Signing in with JWT'}));
            /**
             * Sign in and retrieve user data with stored token
             */
            jwtService
                .signInWithToken()
                .then((user) => {

                    success({
                        ...user.user,
                        displayName: 'Admin',
                        photoURL: 'assets/images/avatars/brian-hughes.jpg',
                    }, 'Signed in with JWT');
                    dispatch(setAuth(user));
                })
                .catch((error) => {
                    pass(error.message);
                })
                .finally(() => {
                    dispatch(setLoading(false));
                });
        });

        jwtService.on('onLogin', (user) => {
            success(user, 'Signed in');
        });

        jwtService.on('onLoginLoading', (bool) => {
            dispatch(setLoginLoading(bool));
        });

        jwtService.on('onSignUpLoading', (bool) => {
            dispatch(setLoading(bool));
        });

        jwtService.on('onSignUpResponse', (bool) => {
            dispatch(setSuccess(bool));
        });

        jwtService.on('onSignUp', (res, message, variant) => {
            dispatch(showMessage({message, variant}));
            dispatch(setAuth(res));
        });

        jwtService.on('onLogout', () => {
            pass('Signed out');

            dispatch(logoutUser());
        });

        jwtService.on('onAutoLogout', (message) => {
            pass(message);

            dispatch(logoutUser());
        });

        jwtService.on('onNoAccessToken', () => {
            pass();
        });

        jwtService.init();

        function success(user, message, variant) {
            if (message) {
                dispatch(showMessage({message, variant}));
            }
            Promise.all([
                dispatch(setUser(user)),
                // You can receive data in here before app initialization
            ]).then((values) => {
                setWaitAuthCheck(false);
                setIsAuthenticated(true);
            });
        }

        function pass(message) {
            if (message) {
                dispatch(showMessage({message}));
            }

            setWaitAuthCheck(false);
            setIsAuthenticated(false);
        }
    }, [dispatch]);

    return waitAuthCheck ? (
        <FuseSplashScreen/>
    ) : (
        <AuthContext.Provider value={{isAuthenticated}}>{children}</AuthContext.Provider>
    );
}

function useAuth() {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}

export {AuthProvider, useAuth};