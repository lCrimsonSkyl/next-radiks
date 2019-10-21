
import React, { Component } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Login from './login';

class App extends Component {
    static propTypes = {
        classes: PropTypes.object,
        isUserSignedIn: PropTypes.bool,
        isSignInPending: PropTypes.func,
        handlePendingSignIn: PropTypes.func,
        handleSignIn: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.classes = props.classes;
    }

    componentDidMount = async () => {
        const { isUserSignedIn, isSignInPending, handlePendingSignIn } = this.props;
        if (!isUserSignedIn && isSignInPending()) {
            const userData = await handlePendingSignIn();
            if (!userData.username) {
                throw new Error('This app requires a username');
            }
            Router.push('/');
        }
    };

    redirectToMainPage = () => {
        Router.push('/main');
    }

    render() {
        const { isUserSignedIn, handleSignIn } = this.props;

        if (!isUserSignedIn) {
            return (
                <Login handleSignIn={handleSignIn} />
            );
        }

        this.redirectToMainPage();
        return null;
    }
}

const styles = () => ({
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
    },
});

export default withStyles(styles)(App);