import React from 'react';

import { Provider as ReduxProvider } from 'react-redux';
import withRedux from 'next-redux-wrapper';

import _JSXStyle from 'styled-jsx/style';

import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';

import { UserSession } from 'blockstack';
import { configure } from 'radiks';

import nextStore from '../../redux/store/nextStore';

import 'typeface-roboto';

import NavBar from '../layouts/NavBar';

import LoadingAnimation from '../components/Loading';


const isServer = typeof window === 'undefined';

/* eslint-disable */
/**
* @param {object} initialState
* @param {boolean} options.isServer indicates whether it is a server side or client side
* @param {Request} options.req NodeJS Request object (not set when client applies initialState from server)
* @param {Request} options.res NodeJS Request object (not set when client applies initialState from server)
* @param {boolean} options.debug User-defined debug mode param
* @param {string} options.storeKey This key will be used to preserve store in global namespace for safe HMR
*/
/* eslint-enable */


// Init BlocktStack Session
let userSession;

if (!isServer) {
    const { appConfig } = require('../blockstack/constants');

    userSession = new UserSession({ appConfig });

    configure({
        apiServer: 'http://localhost:3004',
        userSession,
    });
}

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        const pageProps = Component.getInitialProps
            ? await Component.getInitialProps(ctx)
            : {};

        return { pageProps };
    }

    isUserSignedIn = () => userSession.isUserSignedIn();

    isSignInPending = () => userSession.isSignInPending();

    handlePendingSignIn = () => userSession.handlePendingSignIn();

    loadUserData = () => userSession.loadUserData();

    handleSignIn = () => {
        userSession.redirectToSignIn();
    };

    handleSignOut = () => {
        userSession.signUserOut();
        // Mueve al usuario al login
        Router.push('/');
    };

    render() {
        console.log('_app render');

        if (isServer) {
            return (
                <div style={{ height: '100vh' }}>
                    <table style={{
                        height: '100%',
                        width: '100%',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                    }}>
                        <tbody>
                            <tr>
                                <td>
                                    <LoadingAnimation />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }

        const { Component, pageProps, store } = this.props;

        const isUserSignedIn = this.isUserSignedIn();

        const blockstackUserManagment = {
            isUserSignedIn,
            handleSignIn: this.handleSignIn,
            handleSignOut: this.handleSignOut,
            handlePendingSignIn: this.handlePendingSignIn,
            isSignInPending: this.isSignInPending,
            loadUserData: this.loadUserData,
        };

        return (
            <>
                <Head>
                    <title>MyDPage</title>
                    <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
                </Head>
                <ReduxProvider store={store}>
                    <style jsx global>
                        {`
                            * {
                                font-family: roboto;
                            }
                            body {
                                margin: 0px;
                                overflow: hidden;
                                background-color: #F5F5F5;
                            }
                        `}
                    </style>
                    {isUserSignedIn && <NavBar handleSignOut={this.handleSignOut} loadUserData={this.loadUserData} />}
                    <Component {...pageProps} {...blockstackUserManagment} />
                </ReduxProvider>
            </>
        );
    }
}

export default withRedux(nextStore)(MyApp);