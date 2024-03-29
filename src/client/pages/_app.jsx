import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import App from 'next/app';
import Head from 'next/head';
import withRedux from 'next-redux-wrapper';
import { UserSession } from 'blockstack';
import Router from 'next/router';

import nextStore from '../../redux/store/nextStore';
import { appConfig } from '../blockstack/constants';

import Loading from '../components/Loading';

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

const userSession = new UserSession({ appConfig });
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
        Router.push('/');
    };

    render() {
        const { Component, pageProps, store } = this.props;

        const blockstackUserManagment = {
            handleSignIn: this.handleSignIn,
            handleSignOut: this.handleSignOut,
            handlePendingSignIn: this.handlePendingSignIn,
            isUserSignedIn: this.isUserSignedIn,
            isSignInPending: this.isSignInPending,
            loadUserData: this.loadUserData,
        };

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
                                    <Loading />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <>
                <Head>
                    <title>MyDPage</title>
                    <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
                </Head>
                <ReduxProvider store={store}>
                    <Component {...pageProps} {...blockstackUserManagment} />
                </ReduxProvider>
            </>
        );
    }
}

export default withRedux(nextStore)(MyApp);